import { useEffect, useState } from 'react';
import { useNavigate } from 'react-router-dom';
import { apiRequest, removeAccessToken } from '../services/api';
type QuestionRow = {
  id: number;
  question_text: string;
  choice_a: string;
  choice_b: string;
  choice_c: string;
  correct_choice: 'A' | 'B' | 'C';
  is_active: boolean;
  created_at: string;
};

// mapping English -> Russian letters
const letterMap: Record<'A' | 'B' | 'C', 'А' | 'Б' | 'В'> = {
  A: 'А',
  B: 'Б',
  C: 'В',
};

export default function AdminQuestionsPage() {
  const navigate = useNavigate();

  const [loading, setLoading] = useState(true);
  const [questions, setQuestions] = useState<QuestionRow[]>([]);
useEffect(() => {
  const loadQuestions = async () => {
    try {
      await apiRequest('/api/auth/user');

      const response = await apiRequest<{ data: QuestionRow[] } | QuestionRow[]>(
        '/api/questions'
      );

      const questionsData = Array.isArray(response) ? response : response.data;

      setQuestions(questionsData ?? []);
    } catch (err) {
      removeAccessToken();
      navigate('/admin/login', { replace: true });
    } finally {
      setLoading(false);
    }
  };

  loadQuestions();
}, [navigate]);

  if (loading) {
    return (
      <div className="mx-auto max-w-6xl px-4 py-10">
        <p>Загрузка вопросов...</p>
      </div>
    );
  }
const chunkSize = 20;

// split questions into tickets
const tickets: QuestionRow[][] = [];
for (let i = 0; i < questions.length; i += chunkSize) {
  tickets.push(questions.slice(i, i + chunkSize));
}
  return (
    <div className="mx-auto max-w-6xl px-4 py-10">
      <div className="mb-6 flex items-center justify-between gap-4">
        <h1 className="text-3xl font-bold">Все вопросы</h1>

        <button
          onClick={() => navigate('/admin/dashboard')}
          className="rounded border px-4 py-2"
        >
          Назад к панели
        </button>
      </div>


      {questions.length === 0 ? (
        <p>Вопросы не найдены.</p>
      ) : (
<div className="space-y-8">
  {tickets.map((ticket, ticketIndex) => (
    <div key={ticketIndex}>
      <h2 className="mb-4 text-2xl font-bold">
        Билет №{ticketIndex + 1}
      </h2>

      <div className="space-y-4">
        {ticket.map((question) => (
          <div key={question.id} className="rounded border p-5">
            <p className="font-semibold mb-3">
              {question.id}. {question.question_text}
            </p>

            <div className="space-y-2 text-sm">
              <p>
                <strong>А:</strong> {question.choice_a}
              </p>
              <p>
                <strong>Б:</strong> {question.choice_b}
              </p>
              <p>
                <strong>В:</strong> {question.choice_c}
              </p>
            </div>

            <div className="mt-4 text-sm">
              <p>
                <strong>Правильный ответ:</strong>{' '}
                {letterMap[question.correct_choice]}
              </p>
            </div>
          </div>
        ))}
      </div>
    </div>
  ))}
</div>
      )}
    </div>
  );
}