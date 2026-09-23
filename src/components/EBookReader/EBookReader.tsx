import { ArrowLeft, BookOpen, Headphones, Sparkles, X } from 'lucide-react';
import { useCallback, useEffect, useRef, useState, type ReactNode } from 'react';
import { Link } from 'react-router-dom';
import { BookPages } from './BookPages';
import { AudioPlayer } from './AudioPlayer';
import { Quiz } from './Quiz';
import type { ChapterData } from './types';
import './ebook-reader.css';

export default function EBookReader({ chapter }: { chapter: ChapterData }) {
  const [quizOpen, setQuizOpen] = useState(false);
  const [readToEnd, setReadToEnd] = useState(false);
  const [enlargedPage, setEnlargedPage] = useState<number | null>(null);
  const openQuiz = useCallback(() => {
    setEnlargedPage(null);
    setQuizOpen(true);
  }, []);
  const closeQuiz = useCallback(() => { setQuizOpen(false); }, []);
  const onLastPage = useCallback(() => { setReadToEnd(true); }, []);
  const closeEnlarged = useCallback(() => { setEnlargedPage(null); }, []);

  useEffect(() => {
    const previousTitle = document.title;
    document.title = `${chapter.title} — Детская книга | МЭК`;
    return () => { document.title = previousTitle; };
  }, [chapter.title]);

  return (
    <div className="ebook-experience" lang="ru">
      <header className="ebook-header">
        <Link to="/" className="ebook-brand" aria-label="МЭК — на главную">
          <img src="/images/mek.png" width="62" height="48" alt="МЭК" />
          <span>МЭК <span>детям</span></span>
        </Link>
        <span className="ebook-header-note"><BookOpen size={17} aria-hidden="true" /> Маленькие читатели. Большие открытия.</span>
        <Link to="/" className="ebook-back"><ArrowLeft size={16} aria-hidden="true" /><span>На сайт</span></Link>
      </header>

      <main className="ebook-main">
        <div className="ebook-intro">
          <span className="ebook-chapter-label"><span /> ГЛАВА 01 <span className="ebook-label-separator">/</span> ПЕРВОЕ ОТКРЫТИЕ</span>
          <h1>Большой мир <span>маленьких открытий</span><Sparkles aria-hidden="true" /></h1>
          <p>Открывай книгу. Знакомься с Ники и Пашей. Удивляйся вместе с ними!</p>
        </div>

        <div className="ebook-reading-desk">
          <div className="ebook-desk-note"><BookOpen size={15} aria-hidden="true" /><span>Читай в своём ритме</span><span className="ebook-desk-count">{chapter.pages.length} страниц · Глава 1</span></div>
          <BookPages chapter={chapter} onEnlarge={setEnlargedPage} onLastPage={onLastPage} disabled={quizOpen || enlargedPage !== null} />
        </div>

        <div className="ebook-audio-area">
          <AudioPlayer tracks={chapter.audioSequence} onComplete={openQuiz} paused={quizOpen} />
          <p className="ebook-listening-hint"><Headphones size={14} aria-hidden="true" /> В конце истории тебя ждут пять маленьких открытий — проверь себя!</p>
        </div>

        {readToEnd && (
          <div className="ebook-quiz-invitation">
            <span><Sparkles size={20} aria-hidden="true" /> Книга прочитана? Время поиграть!</span>
            <button type="button" onClick={openQuiz}>Проверить себя <span aria-hidden="true">→</span></button>
          </div>
        )}
        <footer className="ebook-footer"><span>МЭК · Открываем науку вместе</span><span>Читай. Слушай. Исследуй.</span></footer>
      </main>

      {quizOpen && (
        <ReaderDialog label="Викторина по главе 1" onClose={closeQuiz}>
          <Quiz questions={chapter.quizQuestions} onReturnToBook={closeQuiz} />
        </ReaderDialog>
      )}

      {enlargedPage !== null && (
        <ReaderDialog label="Рассмотреть страницу" onClose={closeEnlarged} className="ebook-image-dialog">
          <div className="ebook-image-navigation">
            <button type="button" disabled={enlargedPage === 0} onClick={() => setEnlargedPage(enlargedPage - 1)}>← Назад</button>
            <span>Страница {enlargedPage + 1} / {chapter.pages.length}</span>
            <button type="button" disabled={enlargedPage === chapter.pages.length - 1} onClick={() => setEnlargedPage(enlargedPage + 1)}>Дальше →</button>
          </div>
          <p className="ebook-zoom-hint">На телефоне увеличивай страницу двумя пальцами.</p>
          <a href={chapter.pages[enlargedPage].image} target="_blank" rel="noreferrer" className="ebook-original-link">Открыть изображение в полном размере ↗</a>
          <img className="ebook-enlarged-image" src={chapter.pages[enlargedPage].image} alt={chapter.pages[enlargedPage].alt} />
        </ReaderDialog>
      )}
    </div>
  );
}

function ReaderDialog({ label, onClose, className = '', children }: { label: string; onClose: () => void; className?: string; children: ReactNode }) {
  const ref = useRef<HTMLDialogElement>(null);
  useEffect(() => {
    const dialog = ref.current;
    const previousFocus = document.activeElement;
    const previousOverflow = document.body.style.overflow;
    dialog?.showModal();
    document.body.style.overflow = 'hidden';
    return () => {
      dialog?.close();
      document.body.style.overflow = previousOverflow;
      if (previousFocus instanceof HTMLElement) previousFocus.focus({ preventScroll: true });
    };
  }, []);
  return (
    <dialog ref={ref} className={`ebook-dialog ${className}`} aria-label={label} onCancel={event => { event.preventDefault(); onClose(); }}>
      <button type="button" className="ebook-dialog-close" aria-label="Вернуться к книге" onClick={onClose}><X size={20} aria-hidden="true" /></button>
      {children}
    </dialog>
  );
}
