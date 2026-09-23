import { useEffect, useRef } from 'react';
import { motion, useReducedMotion } from 'framer-motion';
import { Atom, BookOpen, RotateCcw, Sparkles, Star } from 'lucide-react';
import './quiz.css';

type QuizResultProps = {
  total: number;
  onRestart: () => void;
  onReturnToBook: () => void;
};

export function QuizResult({ total, onRestart, onReturnToBook }: QuizResultProps) {
  const reducedMotion = useReducedMotion();
  const headingRef = useRef<HTMLHeadingElement>(null);

  useEffect(() => {
    headingRef.current?.focus({ preventScroll: true });
  }, []);

  return (
    <motion.section
      className="ebook-quiz ebook-quiz-result"
      aria-labelledby="ebook-quiz-result-title"
      initial={reducedMotion ? false : { opacity: 0, scale: 0.96 }}
      animate={{ opacity: 1, scale: 1 }}
      transition={{ duration: 0.4, ease: 'easeOut' }}
    >
      <div className="ebook-quiz-confetti" aria-hidden="true">
        {Array.from({ length: 24 }, (_, index) => (
          <span
            key={index}
            style={{
              left: `${4 + ((index * 37) % 92)}%`,
              backgroundColor: ['#ff8a32', '#39aeaa', '#f5c754', '#a2b4ed'][index % 4],
              animationDelay: `${(index % 8) * 0.11}s`,
              animationDuration: `${2.8 + (index % 4) * 0.25}s`,
              borderRadius: index % 3 === 0 ? '50%' : '2px',
            }}
          />
        ))}
      </div>

      <div className="ebook-quiz-result-emblem" aria-hidden="true">
        <Atom size={66} strokeWidth={1.5} />
        <Star className="ebook-quiz-result-star ebook-quiz-result-star-one" size={23} fill="currentColor" />
        <Sparkles className="ebook-quiz-result-star ebook-quiz-result-star-two" size={26} />
      </div>
      <p className="ebook-quiz-eyebrow">Маленький исследователь · большие открытия</p>
      <h2 ref={headingRef} id="ebook-quiz-result-title" tabIndex={-1}>Отлично!</h2>
      <p className="ebook-quiz-result-message">
        Теперь ты знаешь, что огромный мир построен из крошечных атомов.
      </p>

      <div className="ebook-quiz-score">
        <div className="ebook-quiz-score-stars" aria-hidden="true">
          {Array.from({ length: total }, (_, index) => (
            <Star key={index} size={25} fill="currentColor" style={{ animationDelay: `${0.25 + index * 0.12}s` }} />
          ))}
        </div>
        <strong>{total} / {total}</strong>
        <span>Все открытия сделаны!</span>
      </div>

      <div className="ebook-quiz-result-actions">
        <button type="button" className="ebook-quiz-button ebook-quiz-button-primary" onClick={onReturnToBook}>
          <BookOpen size={19} aria-hidden="true" />
          Вернуться к книге
        </button>
        <button type="button" className="ebook-quiz-button ebook-quiz-button-secondary" onClick={onRestart}>
          <RotateCcw size={18} aria-hidden="true" />
          Пройти ещё раз
        </button>
      </div>
    </motion.section>
  );
}
