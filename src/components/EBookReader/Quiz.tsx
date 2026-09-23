import { useEffect, useId, useRef, useState } from 'react';
import { motion, useReducedMotion } from 'framer-motion';
import { Atom, Check, Lightbulb, Sparkles } from 'lucide-react';
import { QuizResult } from './QuizResult';
import type { QuizQuestion } from './types';
import './quiz.css';

type QuizProps = {
  questions: QuizQuestion[];
  onReturnToBook: () => void;
};

const positiveMessages = ['Правильно!', 'Отлично!', 'Супер!', 'Так держать!', 'Ты молодец!'];

export function Quiz({ questions, onReturnToBook }: QuizProps) {
  const [questionIndex, setQuestionIndex] = useState(0);
  const [selectedAnswer, setSelectedAnswer] = useState<string | null>(null);
  const [feedback, setFeedback] = useState<'correct' | 'retry' | null>(null);
  const [attempt, setAttempt] = useState(0);
  const timerRef = useRef<ReturnType<typeof setTimeout> | null>(null);
  const advancingRef = useRef(false);
  const headingRef = useRef<HTMLHeadingElement>(null);
  const questionTitleId = useId();
  const reducedMotion = useReducedMotion();
  const question = questions[questionIndex];
  const finished = questions.length > 0 && questionIndex >= questions.length;

  useEffect(() => () => {
    if (timerRef.current !== null) clearTimeout(timerRef.current);
  }, []);

  useEffect(() => {
    headingRef.current?.focus({ preventScroll: true });
  }, [questionIndex]);

  function answer(optionId: string) {
    if (advancingRef.current || !question) return;
    setSelectedAnswer(optionId);
    setAttempt((current) => current + 1);

    if (optionId !== question.correctAnswer) {
      setFeedback('retry');
      return;
    }

    advancingRef.current = true;
    setFeedback('correct');
    timerRef.current = setTimeout(() => {
      setQuestionIndex((current) => current + 1);
      setSelectedAnswer(null);
      setFeedback(null);
      advancingRef.current = false;
      timerRef.current = null;
    }, 1400);
  }

  function restart() {
    if (timerRef.current !== null) clearTimeout(timerRef.current);
    timerRef.current = null;
    advancingRef.current = false;
    setSelectedAnswer(null);
    setFeedback(null);
    setAttempt(0);
    setQuestionIndex(0);
  }

  if (finished) {
    return <QuizResult total={questions.length} onRestart={restart} onReturnToBook={onReturnToBook} />;
  }

  if (!question) {
    return (
      <section className="ebook-quiz">
        <h2>Вопросы скоро появятся</h2>
        <button type="button" className="ebook-quiz-button ebook-quiz-button-primary" onClick={onReturnToBook}>
          Вернуться к книге
        </button>
      </section>
    );
  }

  const correctCount = questionIndex + (feedback === 'correct' ? 1 : 0);

  return (
    <section className="ebook-quiz" aria-labelledby={questionTitleId}>
      <div className="ebook-quiz-header">
        <span className="ebook-quiz-header-icon" aria-hidden="true"><Atom size={27} /></span>
        <div>
          <p className="ebook-quiz-eyebrow">Твоя маленькая лаборатория</p>
          <p className="ebook-quiz-intro">Давай проверим, что запомнилось!</p>
        </div>
      </div>

      <div className="ebook-quiz-progress-heading">
        <span>Вопрос {questionIndex + 1} из {questions.length}</span>
        <span><Sparkles size={15} aria-hidden="true" />{correctCount} / {questions.length}</span>
      </div>
      <div
        className="ebook-quiz-progress"
        role="progressbar"
        aria-label="Правильные ответы"
        aria-valuemin={0}
        aria-valuemax={questions.length}
        aria-valuenow={correctCount}
      >
        {questions.map((item, index) => (
          <span key={item.id} className={index < correctCount ? 'ebook-quiz-progress-done' : index === questionIndex ? 'ebook-quiz-progress-current' : ''} />
        ))}
      </div>

      <motion.div
        key={question.id}
        initial={reducedMotion ? false : { opacity: 0, y: 12 }}
        animate={{ opacity: 1, y: 0 }}
        transition={{ duration: 0.3, ease: 'easeOut' }}
      >
        <h2 ref={headingRef} id={questionTitleId} tabIndex={-1} className="ebook-quiz-question">{question.question}</h2>
        <div className="ebook-quiz-options">
          {question.options.map((option, index) => {
            const chosen = selectedAnswer === option.id;
            const isCorrect = chosen && feedback === 'correct';
            const isRetry = chosen && feedback === 'retry';
            return (
              <button
                key={option.id}
                type="button"
                className={`ebook-quiz-option${isCorrect ? ' ebook-quiz-option-correct' : ''}${isRetry ? ' ebook-quiz-option-retry' : ''}`}
                onClick={() => answer(option.id)}
                disabled={feedback === 'correct'}
              >
                <motion.span
                  key={chosen ? attempt : 'idle'}
                  className="ebook-quiz-option-content"
                  initial={reducedMotion ? false : { x: 0, scale: 1 }}
                  animate={reducedMotion ? {} : isCorrect ? { scale: [1, 1.035, 1] } : isRetry ? { x: [0, -4, 4, -3, 3, 0] } : { x: 0, scale: 1 }}
                  transition={{ duration: 0.4 }}
                >
                  <span className="ebook-quiz-option-letter" aria-hidden="true">
                    {isCorrect ? <Check size={20} strokeWidth={3} /> : String.fromCharCode(65 + index)}
                  </span>
                  <span>{option.text}</span>
                  {isCorrect && <Sparkles size={21} className="ebook-quiz-option-sparkle" aria-hidden="true" />}
                </motion.span>
              </button>
            );
          })}
        </div>
      </motion.div>

      <div className="ebook-quiz-feedback" role="status" aria-live="polite" aria-atomic="true">
        {feedback ? (
          <motion.div
            key={`${question.id}-${attempt}`}
            className={feedback === 'correct' ? 'ebook-quiz-feedback-success' : 'ebook-quiz-feedback-retry'}
            initial={reducedMotion ? false : { opacity: 0, scale: 0.92 }}
            animate={{ opacity: 1, scale: 1 }}
          >
            {feedback === 'correct' ? <Sparkles size={21} aria-hidden="true" /> : <Lightbulb size={21} aria-hidden="true" />}
            <span>{feedback === 'correct' ? positiveMessages[questionIndex % positiveMessages.length] : 'Попробуй ещё раз'}</span>
          </motion.div>
        ) : <p className="ebook-quiz-hint">Выбери один ответ. У тебя всё получится!</p>}
      </div>
      <p className="ebook-quiz-footer">Каждый вопрос — ещё одно маленькое открытие</p>
    </section>
  );
}
