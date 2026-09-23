import { useCallback, useEffect, useRef, useState } from 'react';
import { PageFlip } from 'page-flip';
import { useReducedMotion } from 'framer-motion';
import { BookControls } from './BookControls';
import type { ChapterData } from './types';

type BookPagesProps = {
  chapter: ChapterData;
  onEnlarge: (index: number) => void;
  onLastPage: () => void;
  disabled?: boolean;
};

export function BookPages({ chapter, onEnlarge, onLastPage, disabled = false }: BookPagesProps) {
  const host = useRef<HTMLDivElement>(null);
  const engine = useRef<PageFlip | null>(null);
  const currentPage = useRef(0);
  const onLastPageRef = useRef(onLastPage);
  const [page, setPage] = useState(0);
  const [spread, setSpread] = useState(false);
  const [busy, setBusy] = useState(false);
  const reduceMotion = useReducedMotion();

  useEffect(() => { onLastPageRef.current = onLastPage; }, [onLastPage]);

  useEffect(() => {
    const container = host.current;
    if (!container) return;
    let disposed = false;
    const book = document.createElement('div');
    book.className = 'ebook-flipbook';
    container.appendChild(book);
    const pages = chapter.pages.map((item, index) => {
      const element = document.createElement('div');
      element.className = 'ebook-paper';
      element.dataset.page = String(index);
      const image = document.createElement('img');
      image.src = item.image;
      image.alt = item.alt;
      image.draggable = false;
      image.decoding = 'async';
      image.loading = index < 3 ? 'eager' : 'lazy';
      image.fetchPriority = index === 0 ? 'high' : 'auto';
      element.appendChild(image);
      return element;
    });
    const flip = new PageFlip(book, {
      width: chapter.pageWidth / 4,
      height: chapter.pageHeight / 4,
      size: 'stretch',
      minWidth: 360,
      maxWidth: 640,
      minHeight: 200,
      maxHeight: 1000,
      autoSize: false,
      showCover: true,
      usePortrait: true,
      drawShadow: true,
      maxShadowOpacity: 0.3,
      flippingTime: reduceMotion ? 1 : 850,
      mobileScrollSupport: false,
      swipeDistance: 35,
      useMouseEvents: true,
      showPageCorners: !reduceMotion,
      disableFlipByClick: true,
      startPage: currentPage.current,
    });
    engine.current = flip;

    const synchronize = () => {
      if (disposed) return;
      const index = flip.getCurrentPageIndex();
      const isSpread = flip.getOrientation() === 'landscape';
      const halfPage = flip.getBoundsRect().pageWidth / 2;
      const coverOffset = !isSpread ? 0 : index === 0 ? -halfPage : index === chapter.pages.length - 1 ? halfPage : 0;
      book.style.transform = `translateX(${coverOffset}px)`;
      currentPage.current = index;
      setPage(index);
      setSpread(isSpread);
      if (index >= chapter.pages.length - 1) onLastPageRef.current();
      // Make the next fold's pages available before the child turns them.
      pages.forEach((element, pageIndex) => {
        const visible = pageIndex === index || (isSpread && index > 0 && pageIndex === index + 1);
        element.setAttribute('aria-hidden', String(!visible));
        if (Math.abs(pageIndex - index) <= 3) {
          const image = element.querySelector('img');
          if (image) image.loading = 'eager';
        }
      });
    };
    flip.on('init', synchronize);
    flip.on('flip', synchronize);
    flip.on('changeOrientation', () => {
      if (!disposed) setSpread(flip.getOrientation() === 'landscape');
    });
    flip.on('changeState', event => {
      if (!disposed) setBusy(event.data === 'flipping' || event.data === 'user_fold');
    });
    flip.loadFromHTML(pages);
    const observer = new ResizeObserver(() => {
      if (!disposed) { flip.update(); synchronize(); }
    });
    observer.observe(container);

    return () => {
      disposed = true;
      observer.disconnect();
      flip.off('init');
      flip.off('flip');
      flip.off('changeOrientation');
      flip.off('changeState');
      flip.destroy();
      engine.current = null;
    };
  }, [chapter, reduceMotion]);

  const turn = useCallback((direction: 'previous' | 'next') => {
    const flip = engine.current;
    if (!flip || disabled || (flip.getState() !== 'read' && flip.getState() !== 'fold_corner')) return;
    const index = flip.getCurrentPageIndex();
    if (direction === 'previous' && index === 0) return;
    if (direction === 'next' && index >= chapter.pages.length - 1) return;
    if (reduceMotion) {
      if (direction === 'previous') flip.turnToPrevPage();
      else flip.turnToNextPage();
    } else if (direction === 'previous') flip.flipPrev('bottom');
    else flip.flipNext('bottom');
  }, [chapter.pages.length, disabled, reduceMotion]);

  useEffect(() => {
    const keyDown = (event: KeyboardEvent) => {
      const target = event.target;
      if (event.altKey || event.ctrlKey || event.metaKey || event.shiftKey ||
        (target instanceof HTMLElement && target.closest('input, textarea, select, a, [contenteditable="true"], dialog'))) return;
      if (event.key === 'ArrowLeft' || event.key === 'ArrowRight') {
        event.preventDefault();
        turn(event.key === 'ArrowLeft' ? 'previous' : 'next');
      }
    };
    window.addEventListener('keydown', keyDown);
    return () => window.removeEventListener('keydown', keyDown);
  }, [turn]);

  return (
    <section className="ebook-book" aria-label="Страницы книги" tabIndex={0}>
      <div className="ebook-book-stage" ref={host} />
      <BookControls page={page} total={chapter.pages.length} spread={spread} busy={busy} onPrevious={() => turn('previous')} onNext={() => turn('next')} onEnlarge={() => onEnlarge(page)} />
      <p className="ebook-book-hint"><span className="ebook-desktop-hint">Потяни за уголок страницы или нажми ← →</span><span className="ebook-mobile-hint">Листай свайпом или кнопками</span></p>
    </section>
  );
}
