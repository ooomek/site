import { ArrowLeft, ArrowRight, Maximize2 } from 'lucide-react';

type BookControlsProps = {
  page: number;
  total: number;
  spread: boolean;
  busy: boolean;
  onPrevious: () => void;
  onNext: () => void;
  onEnlarge: () => void;
};

export function BookControls({ page, total, spread, busy, onPrevious, onNext, onEnlarge }: BookControlsProps) {
  const first = page + 1;
  const last = spread && page > 0 ? Math.min(total, page + 2) : first;
  return (
    <div className="ebook-book-controls">
      <button type="button" onClick={onPrevious} disabled={page === 0 || busy} aria-label="Предыдущая страница" className="ebook-turn-button">
        <ArrowLeft size={20} aria-hidden="true" /><span>Назад</span>
      </button>
      <div className="ebook-page-status" aria-live="polite" aria-atomic="true">
        <strong>{first === last ? first : `${first}–${last}`} <span>/ {total}</span></strong>
        <span>{first === last ? 'страница' : 'страницы'}</span>
      </div>
      <button type="button" onClick={onNext} disabled={last >= total || busy} aria-label="Следующая страница" className="ebook-turn-button ebook-turn-next">
        <span>Дальше</span><ArrowRight size={20} aria-hidden="true" />
      </button>
      <button type="button" onClick={onEnlarge} title="Рассмотреть страницу" aria-label="Рассмотреть страницу крупнее" className="ebook-enlarge-button">
        <Maximize2 size={18} aria-hidden="true" />
      </button>
    </div>
  );
}
