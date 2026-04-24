import { useMemo, useRef, useState, type FormEvent } from 'react';
import { supabase } from '../services/supabase';
import { apiRequest } from '../services/api';
type ExamQuestion = {
  question_id: number;
  question_order: number;
  question_text: string;
  choice_a: string;
  choice_b: string;
  choice_c: string;
};

type StartExamResponse = {
  attempt_id: string;
  full_name: string;
  work_position: string;
  questions: ExamQuestion[];
};

type SubmitExamResponse = {
  attempt_id: string;
  score: number;
  total_questions: number;
  status: string;
};

type Choice = 'A' | 'B' | 'C';

export default function ExamPage() {
  const [fullName, setFullName] = useState('');
  const [workPosition, setWorkPosition] = useState('');
  const [loading, setLoading] = useState(false);
  const [attemptId, setAttemptId] = useState<string | null>(null);
  const [questions, setQuestions] = useState<ExamQuestion[]>([]);
  const [answers, setAnswers] = useState<Record<number, Choice>>({});
  const [result, setResult] = useState<SubmitExamResponse | null>(null);
  const [error, setError] = useState('');
  const [started, setStarted] = useState(false);
  const [showMissing, setShowMissing] = useState(false);

  const questionRefs = useRef<Record<number, HTMLDivElement | null>>({});

  const answeredCount = useMemo(() => Object.keys(answers).length, [answers]);

  const progress = useMemo(() => {
    if (!questions.length) return 0;
    return Math.round((answeredCount / questions.length) * 100);
  }, [answeredCount, questions.length]);

  const missingQuestionIds = useMemo(() => {
    return questions
      .filter((question) => !answers[question.question_id])
      .map((question) => question.question_id);
  }, [questions, answers]);

  const handleStartExam = async (e: FormEvent) => {
    e.preventDefault();
    setError('');
    setResult(null);
    setShowMissing(false);

    if (!fullName.trim() || !workPosition.trim()) {
      setError('Пожалуйста, введите ФИО и должность.');
      return;
    }

    try {
      setLoading(true);

const response = await apiRequest<{ data: StartExamResponse } | StartExamResponse>(
  '/api/exam/start',
  {
    method: 'POST',
    body: JSON.stringify({
      fullName: fullName.trim(),
      workPosition: workPosition.trim(),
    }),
  }
);

const examData = 'data' in response ? response.data : response;

      setAttemptId(examData.attempt_id);
      setQuestions(examData.questions || []);
      setAnswers({});
      setStarted(true);
    } catch (err) {
      const message =
        err instanceof Error ? err.message : 'Failed to start exam.';
      setError(message);
    } finally {
      setLoading(false);
    }
  };

  const handleAnswerChange = (questionId: number, choice: Choice) => {
    setAnswers((prev) => ({
      ...prev,
      [questionId]: choice,
    }));

    setError('');
  };

  const scrollToFirstMissing = () => {
    const firstMissingId = missingQuestionIds[0];
    if (!firstMissingId) return;

    const element = questionRefs.current[firstMissingId];
    if (element) {
      element.scrollIntoView({
        behavior: 'smooth',
        block: 'center',
      });
    }
  };

  const handleSubmitExam = async () => {
    setError('');

    if (!attemptId) {
      setError('Missing exam attempt.');
      return;
    }

    if (missingQuestionIds.length > 0) {
      setShowMissing(true);
      setError(
        `Please answer all questions before submission. Missing: ${missingQuestionIds.length}.`
      );
      scrollToFirstMissing();
      return;
    }

    try {
      setLoading(true);

      const payload: Record<string, string> = {};
      for (const [questionId, choice] of Object.entries(answers)) {
        payload[questionId] = choice;
      }

const response = await apiRequest<{ data: SubmitExamResponse } | SubmitExamResponse>(
  '/api/exam/submit',
  {
    method: 'POST',
    body: JSON.stringify({
      attemptId,
      answers: payload,
    }),
  }
);

const submitData = 'data' in response ? response.data : response;

setResult(submitData);
    } catch (err) {
      const message =
        err instanceof Error ? err.message : 'Failed to submit exam.';
      setError(message);
    } finally {
      setLoading(false);
    }
  };

  if (result) {
    // const passed = result.score >= Math.ceil(result.total_questions * 0.7);

    return (
      <div className="min-h-screen bg-slate-50">
        <div className="bg-[#123d73]">
          <div className="mx-auto max-w-5xl px-4 py-12">
            <p className="mb-3 text-sm uppercase tracking-[0.2em] text-blue-100">
              Examination completed
            </p>
            <h1 className="text-4xl font-extrabold text-white md:text-5xl">
              Результат экзамена
            </h1>
            <p className="mt-4 max-w-2xl text-base text-blue-100">
              Итоговая информация по прохождению проверки знаний.
            </p>
          </div>
        </div>

        <div className="mx-auto max-w-5xl px-4 py-10">
          <div className="overflow-hidden rounded-3xl border border-slate-200 bg-white shadow-[0_20px_60px_rgba(15,23,42,0.08)]">
            <div className="border-b border-slate-200 bg-gradient-to-r from-[#123d73] to-[#1c5aa6] px-6 py-6 md:px-8">
              <div className="flex flex-col gap-4 md:flex-row md:items-end md:justify-between">
                <div>
                  <p className="text-sm font-medium text-blue-100">Кандидат</p>
                  <h2 className="text-2xl font-bold text-white">{fullName}</h2>
                  <p className="mt-1 text-blue-100">{workPosition}</p>
                </div>

                {/* <div
                  className={`inline-flex w-fit rounded-full px-4 py-2 text-sm font-semibold ${
                    passed
                      ? 'bg-emerald-100 text-emerald-700'
                      : 'bg-red-100 text-red-700'
                  }`}
                >
                  {passed ? 'Экзамен пройден' : 'Экзамен не пройден'}
                </div> */}
              </div>
            </div>

            <div className="grid gap-4 p-6 md:grid-cols-3 md:p-8">
              <div className="rounded-2xl border border-slate-200 bg-slate-50 p-5">
                <p className="text-sm text-slate-500">Результат</p>
                <p className="mt-2 text-3xl font-extrabold text-slate-900">
                  {result.score} / {result.total_questions}
                </p>
              </div>

              <div className="rounded-2xl border border-slate-200 bg-slate-50 p-5">
                <p className="text-sm text-slate-500">Процент</p>
                <p className="mt-2 text-3xl font-extrabold text-slate-900">
                  {Math.round((result.score / result.total_questions) * 100)}%
                </p>
              </div>
{/* 
              <div className="rounded-2xl border border-slate-200 bg-slate-50 p-5">
                <p className="text-sm text-slate-500">Статус</p>
                <p className="mt-2 text-3xl font-extrabold text-slate-900">
                  {result.status}
                </p>
              </div> */}
            </div>

            <div className="border-t border-slate-200 px-6 py-5 md:px-8">
              <button
                onClick={() => window.location.reload()}
                className="rounded-2xl bg-[#123d73] px-5 py-3 text-sm font-semibold text-white transition hover:bg-[#0f325f]"
              >
                Пройти заново
              </button>
            </div>
          </div>
        </div>
      </div>
    );
  }

  if (!started) {
    return (
      <div className="min-h-screen bg-slate-50">
        <div className="relative overflow-hidden bg-[#123d73]">
          <div className="absolute inset-0 bg-[radial-gradient(circle_at_top_right,rgba(255,255,255,0.16),transparent_28%),radial-gradient(circle_at_left,rgba(255,255,255,0.08),transparent_24%)]" />
          <div className="relative mx-auto max-w-6xl px-4 py-2 md:py-2">
            <div className="max-w-3xl">
              <p className="mb-3 text-sm uppercase tracking-[0.22em] text-blue-100">
                МЭК · Онлайн тестирование
              </p>
              <h1 className="text-4xl font-extrabold leading-tight text-white md:text-6xl">
                Проверка знаний норм и правил в ОИАЭ
              </h1>
              {/* <p className="mt-5 max-w-2xl text-base leading-7 text-blue-100 md:text-lg">
                Перед началом экзамена заполните данные. После запуска будет
                сформирован индивидуальный набор вопросов.
              </p> */}
            </div>
          </div>
        </div>

        <div className="mx-auto -mt-8 max-w-6xl px-4 py-15">
          <div className="grid gap-6 lg:grid-cols-[1.2fr_0.8fr]">
            <div className="rounded-[28px] border border-slate-200 bg-white p-6 shadow-[0_20px_60px_rgba(15,23,42,0.08)] md:p-8">
              <div className="mb-6">
                <h2 className="text-2xl font-bold text-slate-900">
                  Начать экзамен
                </h2>
                <p className="mt-2 text-sm leading-6 text-slate-600">
                  Введите ФИО и должность, затем нажмите кнопку запуска.
                </p>
              </div>

              <form onSubmit={handleStartExam} className="space-y-5">
                <div>
                  <label className="mb-2 block text-sm font-semibold text-slate-800">
                    ФИО
                  </label>
                  <input
                    type="text"
                    value={fullName}
                    onChange={(e) => setFullName(e.target.value)}
                    className="w-full rounded-2xl border border-slate-300 bg-white px-4 py-3 text-slate-900 outline-none transition focus:border-[#123d73] focus:ring-4 focus:ring-blue-100"
                    placeholder="Введите полное имя"
                  />
                </div>

                <div>
                  <label className="mb-2 block text-sm font-semibold text-slate-800">
                    Должность
                  </label>
                  <input
                    type="text"
                    value={workPosition}
                    onChange={(e) => setWorkPosition(e.target.value)}
                    className="w-full rounded-2xl border border-slate-300 bg-white px-4 py-3 text-slate-900 outline-none transition focus:border-[#123d73] focus:ring-4 focus:ring-blue-100"
                    placeholder="Введите должность"
                  />
                </div>

                {error ? (
                  <div className="rounded-2xl border border-red-200 bg-red-50 px-4 py-3 text-sm text-red-700">
                    {error}
                  </div>
                ) : null}

                <button
                  type="submit"
                  disabled={loading}
                  className="inline-flex items-center rounded-2xl bg-[#123d73] px-6 py-3 text-sm font-semibold text-white transition hover:bg-[#0f325f] disabled:cursor-not-allowed disabled:opacity-60"
                >
                  {loading ? 'Запуск...' : 'Начать экзамен'}
                </button>
              </form>
            </div>

            <div className="rounded-[28px] border border-slate-200 bg-white p-6 shadow-[0_20px_60px_rgba(15,23,42,0.08)] md:p-8">
              <h3 className="text-xl font-bold text-slate-900">Информация</h3>

              <div className="mt-5 space-y-4">
                <div className="rounded-2xl bg-slate-50 p-4">
                  <p className="text-sm font-semibold text-slate-900">
                    Формат экзамена
                  </p>
                  <p className="mt-1 text-sm leading-6 text-slate-600">
                    После запуска вы получите 20 случайных вопросов.
                  </p>
                </div>

                <div className="rounded-2xl bg-slate-50 p-4">
                  <p className="text-sm font-semibold text-slate-900">
                    Заполнение
                  </p>
                  <p className="mt-1 text-sm leading-6 text-slate-600">
                    Все вопросы обязательны. 
                    {/* Система покажет, какие ответы
                    пропущены. */}
                  </p>
                </div>

                {/* <div className="rounded-2xl bg-slate-50 p-4">
                  <p className="text-sm font-semibold text-slate-900">
                    Интерфейс
                  </p>
                  <p className="mt-1 text-sm leading-6 text-slate-600">
                    Вы увидите прогресс прохождения и подсветку заполненных
                    вопросов.
                  </p>
                </div> */}
              </div>
            </div>
          </div>
        </div>
      </div>
    );
  }

  return (
    <div className="min-h-screen bg-slate-50">
      <div className="bg-[#123d73]">
        <div className="mx-auto max-w-6xl px-4 py-8 md:py-10">
          <div className="flex flex-col gap-6 md:flex-row md:items-end md:justify-between">
            <div>
              <p className="mb-2 text-sm uppercase tracking-[0.22em] text-blue-100">
                Экзаменационная сессия
              </p>
              <h1 className="text-3xl font-extrabold text-white md:text-5xl">
                Вопросы
              </h1>
              <p className="mt-3 text-blue-100">
                {fullName} · {workPosition}
              </p>
            </div>

            <div className="w-full max-w-md rounded-3xl bg-white/10 p-4 backdrop-blur-sm">
              <div className="mb-2 flex items-center justify-between text-sm text-white">
                <span>Прогресс</span>
                <span>
                  {answeredCount} / {questions.length}
                </span>
              </div>
              <div className="h-3 overflow-hidden rounded-full bg-white/20">
                <div
                  className="h-full rounded-full bg-white transition-all duration-300"
                  style={{ width: `${progress}%` }}
                />
              </div>
              <p className="mt-2 text-xs text-blue-100">{progress}% завершено</p>
            </div>
          </div>
        </div>
      </div>

      <div className="mx-auto max-w-6xl px-4 py-8">
        {error ? (
          <div className="mb-6 rounded-2xl border border-red-200 bg-red-50 px-4 py-4 text-sm text-red-700">
            {error}
          </div>
        ) : null}

        <div className="space-y-6">
          {questions.map((question) => {
            const selectedAnswer = answers[question.question_id];
            const isMissing = showMissing && !selectedAnswer;
            const isAnswered = !!selectedAnswer;

            return (
              <div
                key={question.question_id}
                ref={(el) => {
                  questionRefs.current[question.question_id] = el;
                }}
                className={`overflow-hidden rounded-[28px] border bg-white shadow-[0_10px_30px_rgba(15,23,42,0.06)] transition ${
                  isMissing
                    ? 'border-red-300 ring-2 ring-red-100'
                    : isAnswered
                    ? 'border-emerald-200'
                    : 'border-slate-200'
                }`}
              >
                <div className="border-b border-slate-100 px-5 py-4 md:px-6">
                  <div className="flex flex-col gap-3 md:flex-row md:items-start md:justify-between">
                    <div className="flex items-start gap-3">
                      <div
                        className={`flex h-10 w-10 shrink-0 items-center justify-center rounded-2xl text-sm font-bold ${
                          isMissing
                            ? 'bg-red-100 text-red-700'
                            : isAnswered
                            ? 'bg-emerald-100 text-emerald-700'
                            : 'bg-blue-100 text-[#123d73]'
                        }`}
                      >
                        {question.question_order}
                      </div>

                      <p className="pt-1 text-lg font-semibold leading-8 text-slate-900">
                        {question.question_text}
                      </p>
                    </div>

                    <div
                      className={`inline-flex w-fit rounded-full px-3 py-1 text-xs font-semibold ${
                        isMissing
                          ? 'bg-red-100 text-red-700'
                          : isAnswered
                          ? 'bg-emerald-100 text-emerald-700'
                          : 'bg-slate-100 text-slate-600'
                      }`}
                    >
                      {isMissing
                        ? 'Нет ответа'
                        : isAnswered
                        ? 'Отвечено'
                        : 'Ожидает ответа'}
                    </div>
                  </div>
                </div>

                <div className="space-y-3 p-5 md:p-6">
                  {(['A', 'B', 'C'] as const).map((choice) => {
                    const text =
                      choice === 'A'
                        ? question.choice_a
                        : choice === 'B'
                        ? question.choice_b
                        : question.choice_c;

                    const checked = answers[question.question_id] === choice;

                    return (
                      <label
                        key={choice}
                        className={`flex cursor-pointer items-start gap-4 rounded-2xl border p-4 transition ${
                          checked
                            ? 'border-[#123d73] bg-blue-50 shadow-sm'
                            : 'border-slate-200 bg-white hover:border-blue-200 hover:bg-slate-50'
                        }`}
                      >
                        <input
                          type="radio"
                          name={`question-${question.question_id}`}
                          value={choice}
                          checked={checked}
                          onChange={() =>
                            handleAnswerChange(question.question_id, choice)
                          }
                          className="mt-1 h-4 w-4 accent-[#123d73]"
                        />

                        <div>
                          <p
                            className={`font-semibold ${
                              checked ? 'text-[#123d73]' : 'text-slate-900'
                            }`}
                          >
                            {choice}.
                          </p>
                          <p className="mt-1 leading-7 text-slate-700">{text}</p>
                        </div>
                      </label>
                    );
                  })}

                  {isMissing ? (
                    <div className="rounded-2xl border border-red-200 bg-red-50 px-4 py-3 text-sm text-red-700">
                      Этот вопрос пропущен. Выберите один вариант ответа.
                    </div>
                  ) : null}
                </div>
              </div>
            );
          })}
        </div>
      </div>

      <div className="sticky bottom-0 border-t border-slate-200 bg-white/95 backdrop-blur">
        <div className="mx-auto flex max-w-6xl flex-col gap-4 px-4 py-4 md:flex-row md:items-center md:justify-between">
          <div>
            <p className="text-sm font-semibold text-slate-900">
              Отвечено: {answeredCount} / {questions.length}
            </p>
            <p className="mt-1 text-sm text-slate-600">
              {missingQuestionIds.length > 0
                ? `Осталось без ответа: ${missingQuestionIds.length}`
                : 'Все вопросы заполнены. Можно отправлять экзамен.'}
            </p>
          </div>

          <div className="flex flex-wrap gap-3">
            {missingQuestionIds.length > 0 ? (
              <button
                type="button"
                onClick={scrollToFirstMissing}
                className="rounded-2xl border border-slate-300 px-5 py-3 text-sm font-semibold text-slate-700 transition hover:bg-slate-50"
              >
                Перейти к пропущенному
              </button>
            ) : null}

            <button
              onClick={handleSubmitExam}
              disabled={loading}
              className="rounded-2xl bg-[#123d73] px-6 py-3 text-sm font-semibold text-white transition hover:bg-[#0f325f] disabled:cursor-not-allowed disabled:opacity-60"
            >
              {loading ? 'Отправка...' : 'Отправить экзамен'}
            </button>
          </div>
        </div>
      </div>
    </div>
  );
}