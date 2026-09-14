import { BookOpenCheck, CheckCircle2, FileQuestion } from 'lucide-react';
import { useEffect, useState } from 'react';
import { useNavigate } from 'react-router-dom';
import { AdminLayout, AdminLoadingState } from '../components/admin/admin-layout';
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
  const [error, setError] = useState('');
useEffect(() => {
  const loadQuestions = async () => {
    try {
      await apiRequest('/api/auth/user');
    } catch {
      removeAccessToken();
      navigate('/admin/login', { replace: true });
      return;
    }

    try {
      const response = await apiRequest<{ data: QuestionRow[] } | QuestionRow[]>(
        '/api/questions'
      );

      const questionsData = Array.isArray(response) ? response : response.data;

      setQuestions(questionsData ?? []);
    } catch (err) {
      setError(err instanceof Error ? err.message : 'Не удалось загрузить банк вопросов.');
    } finally {
      setLoading(false);
    }
  };

  loadQuestions();
}, [navigate]);

  if (loading) return <AdminLoadingState label="Загрузка банка вопросов…" />;
const chunkSize = 20;

// split questions into tickets
const tickets: QuestionRow[][] = [];
for (let i = 0; i < questions.length; i += chunkSize) {
  tickets.push(questions.slice(i, i + chunkSize));
}
  return (
    <AdminLayout title="Банк вопросов" description="Просматривайте активные экзаменационные вопросы, сгруппированные по билетам из 20 вопросов.">
      {error && <div className="mb-6 border-l-4 border-red-500 bg-red-50 px-5 py-4 text-sm text-red-800" role="alert">{error}</div>}
      <div className="mb-7 grid gap-4 sm:grid-cols-2">
        <div className="border border-[#dfe4ec] bg-white p-5 shadow-[0_8px_30px_rgba(16,30,61,0.04)]">
          <div className="flex items-center justify-between gap-4">
            <div><p className="text-sm font-medium text-[#667085]">Всего вопросов</p><p className="mt-2 text-3xl font-extrabold text-brand-navy">{questions.length}</p></div>
            <div className="flex size-11 items-center justify-center bg-[#fff3e8] text-brand-orange"><FileQuestion className="size-5" /></div>
          </div>
        </div>
        <div className="border border-[#dfe4ec] bg-white p-5 shadow-[0_8px_30px_rgba(16,30,61,0.04)]">
          <div className="flex items-center justify-between gap-4">
            <div><p className="text-sm font-medium text-[#667085]">Экзаменационные билеты</p><p className="mt-2 text-3xl font-extrabold text-brand-navy">{tickets.length}</p></div>
            <div className="flex size-11 items-center justify-center bg-[#fff3e8] text-brand-orange"><BookOpenCheck className="size-5" /></div>
          </div>
        </div>
      </div>

      {questions.length === 0 ? (
        <div className="flex min-h-64 items-center justify-center border border-[#dfe4ec] bg-white text-sm text-[#667085]">Вопросы не найдены.</div>
      ) : (
        <div className="space-y-7">
          {tickets.map((ticket, ticketIndex) => (
            <section key={ticketIndex} className="border border-[#dfe4ec] bg-white shadow-[0_12px_40px_rgba(16,30,61,0.05)]" aria-labelledby={`ticket-${ticketIndex}`}>
              <div className="flex items-center justify-between gap-4 border-b border-[#e5e9f0] px-5 py-5 sm:px-6">
                <div>
                  <p className="text-xs font-semibold tracking-[0.15em] text-brand-orange uppercase">Экзаменационный билет</p>
                  <h2 id={`ticket-${ticketIndex}`} className="mt-1 text-xl font-bold text-brand-navy">Билет {ticketIndex + 1}</h2>
                </div>
                <span className="bg-[#f0f3f7] px-3 py-1.5 text-xs font-semibold text-[#667085]">Вопросов: {ticket.length}</span>
              </div>

              <div className="divide-y divide-[#e8ebf0]">
                {ticket.map((question, questionIndex) => (
                  <article key={question.id} className="p-5 sm:p-6">
                    <div className="flex items-start gap-4">
                      <span className="flex size-8 shrink-0 items-center justify-center bg-brand-navy text-xs font-bold text-white">{questionIndex + 1}</span>
                      <div className="min-w-0 flex-1">
                        <p className="font-semibold leading-6 text-brand-navy">{question.question_text}</p>
                        <div className="mt-4 grid gap-3 text-sm leading-6 text-[#526077] lg:grid-cols-3">
                          {[
                            ['А', question.choice_a],
                            ['Б', question.choice_b],
                            ['В', question.choice_c],
                          ].map(([letter, choice]) => (
                            <p key={letter} className={`border px-4 py-3 ${letter === letterMap[question.correct_choice] ? 'border-emerald-200 bg-emerald-50 text-emerald-900' : 'border-[#e1e5ec] bg-[#fafbfc]'}`}>
                              <strong className="mr-2 text-brand-navy">{letter}</strong>{choice}
                              {letter === letterMap[question.correct_choice] && <CheckCircle2 className="ml-2 inline size-4 text-emerald-600" aria-label="Правильный ответ" />}
                            </p>
                          ))}
                        </div>
                      </div>
                    </div>
                  </article>
                ))}
              </div>
            </section>
          ))}
        </div>
      )}
    </AdminLayout>
  );
}
