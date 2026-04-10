import { useEffect, useState } from 'react';
import { useNavigate } from 'react-router-dom';
import { supabase } from '../services/supabase';

type ExamResultRow = {
  attempt_id: string;
  full_name: string;
  work_position: string;
  started_at: string;
  submitted_at: string | null;
  score: number | null;
  total_questions: number;
  status: string;
};

type ExamDetailsAnswer = {
  question_id: number;
  question_order: number;
  question_text: string;
  choice_a: string;
  choice_b: string;
  choice_c: string;
  selected_choice: string | null;
  correct_choice: string;
  is_correct: boolean | null;
};

type ExamDetails = {
  attempt: {
    attempt_id: string;
    full_name: string;
    work_position: string;
    started_at: string;
    submitted_at: string | null;
    score: number | null;
    total_questions: number;
    status: string;
  };
  answers: ExamDetailsAnswer[];
};

function formatDate(value: string | null) {
  if (!value) return '-';

  const date = new Date(value);
  if (Number.isNaN(date.getTime())) return value;

  return date.toLocaleString();
}

export default function AdminDashboardPage() {
  const navigate = useNavigate();

  const [loading, setLoading] = useState(true);
  const [signOutLoading, setSignOutLoading] = useState(false);
  const [error, setError] = useState('');
  const [rows, setRows] = useState<ExamResultRow[]>([]);
  const [selectedDetails, setSelectedDetails] = useState<ExamDetails | null>(null);
  const [detailsLoading, setDetailsLoading] = useState(false);

  useEffect(() => {
    const checkAndLoad = async () => {
      try {
        const {
          data: { user },
          error: userError,
        } = await supabase.auth.getUser();

        if (userError || !user) {
          navigate('/admin/login', { replace: true });
          return;
        }

        const { data, error } = await supabase.rpc('get_exam_results');

        if (error) {
          throw new Error(error.message);
        }

        setRows((data ?? []) as ExamResultRow[]);
      } catch (err) {
        const message =
          err instanceof Error ? err.message : 'Failed to load dashboard.';
        setError(message);
      } finally {
        setLoading(false);
      }
    };

    checkAndLoad();
  }, [navigate]);

  const handleViewDetails = async (attemptId: string) => {
    try {
      setDetailsLoading(true);
      setError('');

      const { data, error } = await supabase.rpc('get_exam_result_details', {
        p_attempt_id: attemptId,
      });

      if (error) {
        throw new Error(error.message);
      }

      setSelectedDetails(data as ExamDetails);
    } catch (err) {
      const message =
        err instanceof Error ? err.message : 'Failed to load exam details.';
      setError(message);
    } finally {
      setDetailsLoading(false);
    }
  };

  const handleLogout = async () => {
    try {
      setSignOutLoading(true);
      await supabase.auth.signOut();
      navigate('/admin/login', { replace: true });
    } finally {
      setSignOutLoading(false);
    }
  };

  if (loading) {
    return (
      <div className="mx-auto max-w-6xl px-4 py-10">
        <p>Загрузка панели управления...</p>
      </div>
    );
  }

  return (
    <div className="mx-auto max-w-6xl px-4 py-10">
      <div className="mb-6 flex items-center justify-between gap-4">
        <h1 className="text-3xl font-bold">Панель администратора</h1>

        <button
          onClick={handleLogout}
          disabled={signOutLoading}
          className="rounded border px-4 py-2"
        >
          {signOutLoading ? 'Выход...' : 'Выйти'}
        </button>
      </div>

      {error ? <p className="mb-4 text-sm text-red-600">{error}</p> : null}

      <div className="overflow-x-auto rounded border">
        <table className="min-w-full border-collapse">
          <thead>
            <tr className="border-b bg-gray-50 text-left">
            <th className="px-4 py-3">ФИО</th>
            <th className="px-4 py-3">Должность</th>
            <th className="px-4 py-3">Начато</th>
            <th className="px-4 py-3">Отправлено</th>
            <th className="px-4 py-3">Результат</th>
            <th className="px-4 py-3">Статус</th>
            <th className="px-4 py-3">Действие</th>
            </tr>
          </thead>
          <tbody>
            {rows.length === 0 ? (
              <tr>
                <td colSpan={7} className="px-4 py-6 text-center">
                  Результаты экзамена не найдены.
                </td>
              </tr>
            ) : (
              rows.map((row) => (
                <tr key={row.attempt_id} className="border-b">
                  <td className="px-4 py-3">{row.full_name}</td>
                  <td className="px-4 py-3">{row.work_position}</td>
                  <td className="px-4 py-3">{formatDate(row.started_at)}</td>
                  <td className="px-4 py-3">{formatDate(row.submitted_at)}</td>
                  <td className="px-4 py-3">
                    {row.score ?? '-'} / {row.total_questions}
                  </td>
                  <td className="px-4 py-3">{row.status}</td>
                  <td className="px-4 py-3">
                    <button
                      onClick={() => handleViewDetails(row.attempt_id)}
                      className="rounded border px-3 py-1"
                    >
                      Открыть
                    </button>
                  </td>
                </tr>
              ))
            )}
          </tbody>
        </table>
      </div>

      <div className="mt-8">
        <h2 className="mb-4 text-2xl font-semibold">Подробности опроса</h2>

        {detailsLoading ? <p>Загрузка деталей...</p> : null}

        {!detailsLoading && !selectedDetails ? (
          <p>Выберите один результат для просмотра полных ответов.</p>
        ) : null}

        {!detailsLoading && selectedDetails ? (
          <div className="space-y-6">
            <div className="rounded border p-5">
              <p className="mb-2">
                <strong>ФИО:</strong> {selectedDetails.attempt.full_name}
              </p>
              <p className="mb-2">
                <strong>Должность:</strong> {selectedDetails.attempt.work_position}
              </p>
              <p className="mb-2">
                <strong>Начато:</strong> {formatDate(selectedDetails.attempt.started_at)}
              </p>
              <p className="mb-2">
                <strong>Отправлено:</strong> {formatDate(selectedDetails.attempt.submitted_at)}
              </p>
              <p className="mb-2">
                <strong>Результат:</strong> {selectedDetails.attempt.score} /{' '}
                {selectedDetails.attempt.total_questions}
              </p>
              <p>
                <strong>Статус:</strong> {selectedDetails.attempt.status}
              </p>
            </div>

            <div className="space-y-4">
              {selectedDetails.answers?.map((answer) => (
                <div key={answer.question_id} className="rounded border p-5">
                  <p className="mb-3 font-semibold">
                    {answer.question_order}. {answer.question_text}
                  </p>

                  <div className="space-y-1 text-sm">
                    <p><strong>А:</strong> {answer.choice_a}</p>
                    <p><strong>Б:</strong> {answer.choice_b}</p>
                    <p><strong>В:</strong> {answer.choice_c}</p>
                  </div>

                  <div className="mt-3 text-sm">
                    <p>
                      <strong>Выбрано:</strong> {answer.selected_choice ?? '-'}
                    </p>
                    <p>
                      <strong>Правильный ответ:</strong> {answer.correct_choice}
                    </p>
                    <p>
                      <strong>Результат:</strong>{' '}
                      {answer.is_correct ? 'Правильно' : 'Неправильно'}
                    </p>
                  </div>
                </div>
              ))}
            </div>
          </div>
        ) : null}
      </div>
    </div>
  );
}