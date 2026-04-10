import { useMemo, useState, type FormEvent } from 'react';
import { supabase } from '../services/supabase';

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

export default function ExamPage() {
  const [fullName, setFullName] = useState('');
  const [workPosition, setWorkPosition] = useState('');
  const [loading, setLoading] = useState(false);
  const [attemptId, setAttemptId] = useState<string | null>(null);
  const [questions, setQuestions] = useState<ExamQuestion[]>([]);
  const [answers, setAnswers] = useState<Record<number, 'A' | 'B' | 'C'>>({});
  const [result, setResult] = useState<SubmitExamResponse | null>(null);
  const [error, setError] = useState<string>('');
  const [started, setStarted] = useState(false);

  const answeredCount = useMemo(
    () => Object.keys(answers).length,
    [answers]
  );

  const handleStartExam = async (e: FormEvent) => {
    e.preventDefault();
    setError('');
    setResult(null);

    if (!fullName.trim() || !workPosition.trim()) {
      setError('Please enter full name and work position.');
      return;
    }

    try {
      setLoading(true);

      const { data, error } = await supabase.rpc('start_exam', {
        p_full_name: fullName.trim(),
        p_work_position: workPosition.trim(),
      });

      if (error) {
        throw new Error(error.message);
      }

      const examData = data as StartExamResponse;

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

  const handleAnswerChange = (questionId: number, choice: 'A' | 'B' | 'C') => {
    setAnswers((prev) => ({
      ...prev,
      [questionId]: choice,
    }));
  };

  const handleSubmitExam = async () => {
    setError('');

    if (!attemptId) {
      setError('Missing exam attempt.');
      return;
    }

    if (questions.length !== Object.keys(answers).length) {
      setError('Please answer all questions before submitting.');
      return;
    }

    try {
      setLoading(true);

      const payload: Record<string, string> = {};
      for (const [questionId, choice] of Object.entries(answers)) {
        payload[questionId] = choice;
      }

      const { data, error } = await supabase.rpc('submit_exam', {
        p_attempt_id: attemptId,
        p_answers: payload,
      });

      if (error) {
        throw new Error(error.message);
      }

      setResult(data as SubmitExamResponse);
    } catch (err) {
      const message =
        err instanceof Error ? err.message : 'Failed to submit exam.';
      setError(message);
    } finally {
      setLoading(false);
    }
  };

  if (result) {
    return (
      <div className="mx-auto max-w-3xl px-4 py-10">
        <h1 className="mb-6 text-3xl font-bold">Exam Result</h1>

        <div className="rounded border p-6">
          <p className="mb-2">
            <strong>ФИО:</strong> {fullName}
          </p>
          <p className="mb-2">
            <strong>Должность:</strong> {workPosition}
          </p>
          <p className="mb-2">
            <strong>Результат:</strong> {result.score} / {result.total_questions}
          </p>
          <p>
            <strong>Статус:</strong> {result.status}
          </p>
        </div>
      </div>
    );
  }

  if (!started) {
    return (
      <div className="mx-auto max-w-2xl px-4 py-10">
        <h1 className="mb-6 text-3xl font-bold">Проверка знаний норм и правил в ОИАЭ</h1>

        <form onSubmit={handleStartExam} className="space-y-4 rounded border p-6">
          <div>
            <label className="mb-1 block text-sm font-medium">ФИО</label>
            <input
              type="text"
              value={fullName}
              onChange={(e) => setFullName(e.target.value)}
              className="w-full rounded border px-3 py-2"
              placeholder="Enter full name"
            />
          </div>

          <div>
            <label className="mb-1 block text-sm font-medium">Должность</label>
            <input
              type="text"
              value={workPosition}
              onChange={(e) => setWorkPosition(e.target.value)}
              className="w-full rounded border px-3 py-2"
              placeholder="Enter work position"
            />
          </div>

          {error ? <p className="text-sm text-red-600">{error}</p> : null}

          <button
            type="submit"
            disabled={loading}
            className="rounded bg-black px-4 py-2 text-white disabled:opacity-60"
          >
            {loading ? 'Запуск...' : 'Начать экзамен'}
          </button>
        </form>
      </div>
    );
  }

  return (
    <div className="mx-auto max-w-4xl px-4 py-10">
      <div className="mb-6">
        <h1 className="text-3xl font-bold">Вопросы</h1>
        <p className="mt-2 text-sm text-gray-600">
          Отвечено: {answeredCount} / {questions.length}
        </p>
      </div>

      <div className="space-y-6">
        {questions.map((question) => (
          <div key={question.question_id} className="rounded border p-5">
            <p className="mb-4 font-semibold">
              {question.question_order}. {question.question_text}
            </p>

            <div className="space-y-2">
              {(['A', 'B', 'C'] as const).map((choice) => {
                const text =
                  choice === 'A'
                    ? question.choice_a
                    : choice === 'B'
                    ? question.choice_b
                    : question.choice_c;

                return (
                  <label key={choice} className="flex cursor-pointer items-start gap-2">
                    <input
                      type="radio"
                      name={`question-${question.question_id}`}
                      value={choice}
                      checked={answers[question.question_id] === choice}
                      onChange={() => handleAnswerChange(question.question_id, choice)}
                    />
                    <span>
                      <strong>{choice}.</strong> {text}
                    </span>
                  </label>
                );
              })}
            </div>
          </div>
        ))}
      </div>

      {error ? <p className="mt-4 text-sm text-red-600">{error}</p> : null}

      <div className="mt-8">
        <button
          onClick={handleSubmitExam}
          disabled={loading}
          className="rounded bg-black px-4 py-2 text-white disabled:opacity-60"
        >
          {loading ? 'Отправка...' : 'Отправить экзамен'}
        </button>
      </div>
    </div>
  );
}