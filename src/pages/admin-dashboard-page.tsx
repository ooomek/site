import { useEffect, useState } from 'react';
import { useNavigate } from 'react-router-dom';
import { jsPDF } from 'jspdf';
import { CheckCircle2, Clock3, Download, Eye, FileQuestion, Users } from 'lucide-react';

import { apiRequest, removeAccessToken } from '../services/api';
import { AdminLayout, AdminLoadingState } from '../components/admin/admin-layout';
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

async function loadFontAsBase64(url: string): Promise<string> {
  const response = await fetch(url);

  if (!response.ok) {
    throw new Error(`Failed to load font: ${url}`);
  }

  const buffer = await response.arrayBuffer();

  let binary = '';
  const bytes = new Uint8Array(buffer);
  const chunkSize = 0x8000;

  for (let i = 0; i < bytes.length; i += chunkSize) {
    const chunk = bytes.subarray(i, i + chunkSize);
    binary += String.fromCharCode(...chunk);
  }

  return btoa(binary);
}
function formatStatus(status: string) {
  switch (status) {
    case 'submitted':
      return 'Отправлено';
    case 'in_progress':
      return 'В процессе';
    case 'completed':
      return 'Завершено';
    default:
      return status;
  }
}
function formatChoiceLetter(choice: string | null) {
  if (!choice) return '-';

  switch (choice) {
    case 'A':
      return 'А';
    case 'B':
      return 'Б';
    case 'C':
      return 'В';
    default:
      return choice;
  }
}

// function getChoiceLabel(answer: ExamDetailsAnswer, choice: string | null) {
//   const letter = formatChoiceLetter(choice);
//   const text = getChoiceText(answer, choice);

//   if (!choice) return '-';
//   return `${letter} — ${text}`;
// }
function formatDate(value: string | null) {
  if (!value) return '-';

  const date = new Date(value);
  if (Number.isNaN(date.getTime())) return value;

  return new Intl.DateTimeFormat('ru-RU', {
    day: '2-digit', month: 'short', year: 'numeric', hour: '2-digit', minute: '2-digit',
  }).format(date);
}

// function getChoiceText(answer: ExamDetailsAnswer, choice: string | null) {
//   if (!choice) return '-';
//   if (choice === 'A') return answer.choice_a;
//   if (choice === 'B') return answer.choice_b;
//   if (choice === 'C') return answer.choice_c;
//   return '-';
// }

export default function AdminDashboardPage() {
  const navigate = useNavigate();

  const [loading, setLoading] = useState(true);
  const [error, setError] = useState('');
  const [rows, setRows] = useState<ExamResultRow[]>([]);
  const [selectedDetails, setSelectedDetails] = useState<ExamDetails | null>(null);
  const [detailsLoading, setDetailsLoading] = useState(false);
  const [pdfLoadingId, setPdfLoadingId] = useState<string | null>(null);

useEffect(() => {
const checkAndLoad = async () => {
  try {
    await apiRequest('/api/auth/user');
  } catch {
    removeAccessToken();
    navigate('/admin/login', { replace: true });
    return;
  }

  try {
    const response = await apiRequest<{ data: ExamResultRow[] } | ExamResultRow[]>(
  '/api/dashboard/results'
);

const rowsData = Array.isArray(response) ? response : response.data;


    setRows(rowsData ?? []);
  } catch (err) {
    setError(err instanceof Error ? err.message : 'Не удалось загрузить результаты экзаменов.');
  } finally {
    setLoading(false);
  }
};

    checkAndLoad();
  }, [navigate]);

const fetchExamDetails = async (attemptId: string) => {
  const response = await apiRequest<{ data: ExamDetails } | ExamDetails>(
    `/api/dashboard/results/${attemptId}`
  );

  return 'data' in response ? response.data : response;
};
  const handleViewDetails = async (attemptId: string) => {
    try {
      setDetailsLoading(true);
      setError('');

      const details = await fetchExamDetails(attemptId);
      setSelectedDetails(details);
    } catch (err) {
      const message =
        err instanceof Error ? err.message : 'Не удалось загрузить детали экзамена.';
      setError(message);
    } finally {
      setDetailsLoading(false);
    }
  };
const handleDownloadPdf = async (attemptId: string) => {
  try {
    setPdfLoadingId(attemptId);
    setError('');

    const details = await fetchExamDetails(attemptId);

    const safeName = details.attempt.full_name
      .replace(/[^\p{L}\p{N}\s_-]/gu, '')
      .replace(/\s+/g, '_');

    const doc = new jsPDF('p', 'pt', 'a4');

    const [robotoRegular, robotoBold] = await Promise.all([
      loadFontAsBase64('/fonts/roboto/Roboto-Regular.ttf'),
      loadFontAsBase64('/fonts/roboto/Roboto-Bold.ttf'),
    ]);

    doc.addFileToVFS('Roboto-Regular.ttf', robotoRegular);
    doc.addFont('Roboto-Regular.ttf', 'Roboto', 'normal');

    doc.addFileToVFS('Roboto-Bold.ttf', robotoBold);
    doc.addFont('Roboto-Bold.ttf', 'Roboto', 'bold');

    const pageWidth = doc.internal.pageSize.getWidth();
    const pageHeight = doc.internal.pageSize.getHeight();

    const marginX = 40;
    const marginTop = 40;
    const marginBottom = 40;
    const contentWidth = pageWidth - marginX * 2;

let y = marginTop;

const addNewPage = () => {
  doc.addPage();
  y = marginTop;
};

const ensureSpace = (neededHeight: number) => {
  if (y + neededHeight > pageHeight - marginBottom) {
    addNewPage();
  }
};

const getLines = (
  text: string,
  options?: {
    fontStyle?: 'normal' | 'bold';
    fontSize?: number;
    indent?: number;
  }
) => {
  const {
    fontStyle = 'normal',
    fontSize = 12,
    indent = 0,
  } = options || {};

  doc.setFont('Roboto', fontStyle);
  doc.setFontSize(fontSize);

  return doc.splitTextToSize(text || '-', contentWidth - indent);
};

const getTextBlockHeight = (
  text: string,
  options?: {
    fontStyle?: 'normal' | 'bold';
    fontSize?: number;
    indent?: number;
    lineHeight?: number;
    spaceAfter?: number;
  }
) => {
  const {
    fontStyle = 'normal',
    fontSize = 12,
    indent = 0,
    lineHeight = fontSize * 1.35,
    spaceAfter = 0,
  } = options || {};

  const lines = getLines(text, { fontStyle, fontSize, indent });
  return lines.length * lineHeight + spaceAfter;
};

const drawText = (
  text: string,
  options?: {
    fontStyle?: 'normal' | 'bold';
    fontSize?: number;
    indent?: number;
    lineHeight?: number;
    spaceAfter?: number;
  }
) => {
  const {
    fontStyle = 'normal',
    fontSize = 12,
    indent = 0,
    lineHeight = fontSize * 1.35,
    spaceAfter = 0,
  } = options || {};

  doc.setFont('Roboto', fontStyle);
  doc.setFontSize(fontSize);

  const lines = getLines(text, { fontStyle, fontSize, indent });
  doc.text(lines, marginX + indent, y);
  y += lines.length * lineHeight + spaceAfter;
};

const drawLabelValue = (label: string, value: string) => {
  doc.setFont('Roboto', 'bold');
  doc.setFontSize(12);

  const labelWidth = doc.getTextWidth(label);
  const valueMaxWidth = contentWidth - labelWidth - 8;

  doc.setFont('Roboto', 'normal');
  const valueLines = doc.splitTextToSize(value || '-', valueMaxWidth);

  const blockHeight = valueLines.length * 16 + 6;
  ensureSpace(blockHeight);

  doc.setFont('Roboto', 'bold');
  doc.text(label, marginX, y);

  doc.setFont('Roboto', 'normal');
  doc.text(valueLines, marginX + labelWidth + 8, y);

  y += blockHeight;
};

const drawDivider = () => {
  ensureSpace(16);
  doc.setDrawColor(210, 213, 219);
  doc.line(marginX, y, pageWidth - marginX, y);
  y += 16;
};

const drawQuestionBlock = (answer: ExamDetailsAnswer) => {
  const boxPadding = 12;
  const boxWidth = contentWidth;

  const resultText =
    answer.is_correct === true
      ? 'Правильно'
      : answer.is_correct === false
      ? 'Неправильно'
      : '-';

  const questionText = `${answer.question_order}. ${answer.question_text}`;
  const aText = `A: ${answer.choice_a}`;
  const bText = `Б: ${answer.choice_b}`;
  const cText = `В: ${answer.choice_c}`;
const selectedText = `Выбрано: ${formatChoiceLetter(answer.selected_choice)}`;
const correctText = `Правильный ответ: ${formatChoiceLetter(answer.correct_choice)}`;
  const finalText = `Результат: ${resultText}`;

  const contentHeight =
    getTextBlockHeight(questionText, {
      fontStyle: 'bold',
      fontSize: 13,
      lineHeight: 18,
      spaceAfter: 10,
    }) +
    getTextBlockHeight(aText, {
      fontSize: 12,
      lineHeight: 17,
      spaceAfter: 6,
    }) +
    getTextBlockHeight(bText, {
      fontSize: 12,
      lineHeight: 17,
      spaceAfter: 6,
    }) +
    getTextBlockHeight(cText, {
      fontSize: 12,
      lineHeight: 17,
      spaceAfter: 10,
    }) +
    getTextBlockHeight(selectedText, {
      fontSize: 12,
      lineHeight: 17,
      spaceAfter: 6,
    }) +
    getTextBlockHeight(correctText, {
      fontSize: 12,
      lineHeight: 17,
      spaceAfter: 6,
    }) +
    getTextBlockHeight(finalText, {
      fontStyle: 'bold',
      fontSize: 12,
      lineHeight: 17,
      spaceAfter: 0,
    });

  const boxHeight = boxPadding * 2 + contentHeight + 8;

  ensureSpace(boxHeight + 8);

  doc.setDrawColor(209, 213, 219);
  doc.roundedRect(marginX, y, boxWidth, boxHeight, 8, 8);

  y += boxPadding;

  drawText(questionText, {
    fontStyle: 'bold',
    fontSize: 13,
    lineHeight: 18,
    spaceAfter: 10,
  });

  drawText(aText, {
    fontSize: 12,
    lineHeight: 17,
    spaceAfter: 6,
  });

  drawText(bText, {
    fontSize: 12,
    lineHeight: 17,
    spaceAfter: 6,
  });

  drawText(cText, {
    fontSize: 12,
    lineHeight: 17,
    spaceAfter: 10,
  });

  drawText(selectedText, {
    fontSize: 12,
    lineHeight: 17,
    spaceAfter: 6,
  });

  drawText(correctText, {
    fontSize: 12,
    lineHeight: 17,
    spaceAfter: 6,
  });

  drawText(finalText, {
    fontStyle: 'bold',
    fontSize: 12,
    lineHeight: 17,
    spaceAfter: 0,
  });

  y += boxPadding + 8;
};

    drawText('Подробности опроса', {
      fontStyle: 'bold',
      fontSize: 24,
      lineHeight: 30,
      spaceAfter: 18,
    });

    drawLabelValue('ФИО:', details.attempt.full_name);
    drawLabelValue('Должность:', details.attempt.work_position);
    drawLabelValue('Начато:', formatDate(details.attempt.started_at));
    drawLabelValue('Отправлено:', formatDate(details.attempt.submitted_at));
    drawLabelValue(
      'Результат:',
      `${details.attempt.score ?? '-'} / ${details.attempt.total_questions}`
    );
    // drawLabelValue('Статус:', formatStatus(details.attempt.status));

    y += 8;
    drawDivider();

    for (const answer of details.answers ?? []) {
      drawQuestionBlock(answer);
    }

    doc.save(`exam_${safeName}_${details.attempt.attempt_id}.pdf`);
  } catch (err) {
    const message =
      err instanceof Error ? err.message : 'Не удалось сформировать PDF.';
    setError(message);
  } finally {
    setPdfLoadingId(null);
  }
};

  if (loading) {
    return <AdminLoadingState label="Загрузка результатов экзаменов…" />;
  }

  const completedRows = rows.filter(row => row.status === 'submitted' || row.status === 'completed');
  const averageScore = completedRows.length
    ? Math.round(completedRows.reduce((sum, row) => sum + ((row.score ?? 0) / Math.max(row.total_questions, 1)) * 100, 0) / completedRows.length)
    : 0;

  return (
    <AdminLayout
      title="Результаты экзаменов"
      description="Просматривайте все попытки, проверяйте ответы и выгружайте подробные отчёты в PDF."
      actions={(
        <button type="button" onClick={() => navigate('/admin/questions')} className="inline-flex min-h-11 items-center gap-2 border border-[#cfd6e2] bg-white px-5 text-sm font-semibold text-brand-navy hover:border-brand-orange hover:text-brand-orange">
          <FileQuestion className="size-5" /> Банк вопросов
        </button>
      )}
    >
      {error && <div className="mb-6 border-l-4 border-red-500 bg-red-50 px-5 py-4 text-sm text-red-800" role="alert">{error}</div>}

      <div className="grid gap-4 sm:grid-cols-3">
        {[
          { label: 'Всего попыток', value: rows.length, icon: Users },
          { label: 'Завершено', value: completedRows.length, icon: CheckCircle2 },
          { label: 'Средний результат', value: `${averageScore}%`, icon: Clock3 },
        ].map(({ label, value, icon: Icon }) => (
          <div key={label} className="border border-[#dfe4ec] bg-white p-5 shadow-[0_8px_30px_rgba(16,30,61,0.04)]">
            <div className="flex items-center justify-between gap-4">
              <div>
                <p className="text-sm font-medium text-[#667085]">{label}</p>
                <p className="mt-2 text-3xl font-extrabold text-brand-navy">{value}</p>
              </div>
              <div className="flex size-11 items-center justify-center bg-[#fff3e8] text-brand-orange"><Icon className="size-5" /></div>
            </div>
          </div>
        ))}
      </div>

      <section className="mt-7 overflow-hidden border border-[#dfe4ec] bg-white shadow-[0_12px_40px_rgba(16,30,61,0.05)]" aria-labelledby="results-title">
        <div className="border-b border-[#e5e9f0] p-5 sm:p-6">
          <h2 id="results-title" className="text-xl font-bold text-brand-navy">Последние попытки</h2>
          <p className="mt-1 text-sm text-[#667085]">Все завершённые и активные экзамены.</p>
        </div>
        <div className="overflow-x-auto">
          <table className="min-w-[1050px] w-full border-collapse text-left">
            <thead className="bg-[#f8f9fb] text-[11px] font-bold tracking-[0.08em] text-[#667085] uppercase">
              <tr>
                <th className="px-6 py-4">Участник</th>
                <th className="px-5 py-4">Должность</th>
                <th className="px-5 py-4">Начало</th>
                <th className="px-5 py-4">Отправлено</th>
                <th className="px-5 py-4">Результат</th>
                <th className="px-5 py-4">Статус</th>
                <th className="px-6 py-4 text-right">Действия</th>
              </tr>
            </thead>
            <tbody className="divide-y divide-[#e8ebf0]">
              {rows.length === 0 ? (
                <tr><td colSpan={7} className="px-6 py-16 text-center text-sm text-[#667085]">Результаты экзаменов не найдены.</td></tr>
              ) : rows.map(row => {
                const scorePercent = row.score === null ? null : Math.round((row.score / Math.max(row.total_questions, 1)) * 100);
                return (
                  <tr key={row.attempt_id} className="transition hover:bg-[#fafbfc]">
                    <td className="px-6 py-5"><span className="block max-w-52 font-semibold text-brand-navy">{row.full_name}</span></td>
                    <td className="px-5 py-5 text-sm text-[#526077]">{row.work_position}</td>
                    <td className="px-5 py-5 text-sm whitespace-nowrap text-[#526077]">{formatDate(row.started_at)}</td>
                    <td className="px-5 py-5 text-sm whitespace-nowrap text-[#526077]">{formatDate(row.submitted_at)}</td>
                    <td className="px-5 py-5">
                      <div className="flex items-center gap-3">
                        <span className="min-w-12 text-sm font-bold text-brand-navy">{row.score ?? '-'} / {row.total_questions}</span>
                        {scorePercent !== null && <span className="h-1.5 w-14 overflow-hidden bg-[#e8ebf0]"><span className="block h-full bg-brand-orange" style={{ width: `${scorePercent}%` }} /></span>}
                      </div>
                    </td>
                    <td className="px-5 py-5"><span className={`inline-flex px-2.5 py-1 text-[11px] font-bold tracking-wide uppercase ${row.status === 'in_progress' ? 'bg-amber-50 text-amber-700' : 'bg-emerald-50 text-emerald-700'}`}>{formatStatus(row.status)}</span></td>
                    <td className="px-6 py-5">
                      <div className="flex justify-end gap-2">
                        <button type="button" onClick={() => handleViewDetails(row.attempt_id)} className="inline-flex min-h-9 items-center gap-2 border border-[#d7dde8] px-3 text-xs font-semibold text-brand-navy hover:border-brand-orange hover:text-brand-orange"><Eye className="size-4" /> Открыть</button>
                        <button type="button" onClick={() => handleDownloadPdf(row.attempt_id)} disabled={pdfLoadingId === row.attempt_id} className="inline-flex min-h-9 items-center gap-2 bg-brand-navy px-3 text-xs font-semibold text-white hover:bg-[#1b315f] disabled:opacity-50"><Download className="size-4" /> {pdfLoadingId === row.attempt_id ? 'Создание…' : 'PDF'}</button>
                      </div>
                    </td>
                  </tr>
                );
              })}
            </tbody>
          </table>
        </div>
      </section>

      <section className="mt-7 border border-[#dfe4ec] bg-white shadow-[0_12px_40px_rgba(16,30,61,0.05)]" aria-labelledby="details-title">
        <div className="border-b border-[#e5e9f0] p-5 sm:p-6">
          <h2 id="details-title" className="text-xl font-bold text-brand-navy">Детали экзамена</h2>
          <p className="mt-1 text-sm text-[#667085]">Выберите попытку выше, чтобы просмотреть все ответы.</p>
        </div>

        {detailsLoading && <div className="flex min-h-48 items-center justify-center gap-3 text-sm font-semibold text-brand-navy"><span className="size-5 animate-spin rounded-full border-2 border-brand-orange border-t-transparent" /> Загрузка ответов…</div>}
        {!detailsLoading && !selectedDetails && <div className="flex min-h-48 items-center justify-center px-6 text-center text-sm text-[#667085]">Экзамен не выбран.</div>}

        {!detailsLoading && selectedDetails && (
          <div className="p-5 sm:p-6">
            <div className="grid gap-4 bg-[#f8f9fb] p-5 sm:grid-cols-2 lg:grid-cols-5">
              {[
                ['Участник', selectedDetails.attempt.full_name],
                ['Должность', selectedDetails.attempt.work_position],
                ['Начало', formatDate(selectedDetails.attempt.started_at)],
                ['Отправлено', formatDate(selectedDetails.attempt.submitted_at)],
                ['Результат', `${selectedDetails.attempt.score ?? '-'} / ${selectedDetails.attempt.total_questions}`],
              ].map(([label, value]) => <div key={label}><p className="text-[11px] font-bold tracking-wide text-[#98a2b3] uppercase">{label}</p><p className="mt-2 text-sm font-semibold text-brand-navy">{value}</p></div>)}
            </div>

            <div className="mt-6 space-y-4">
              {selectedDetails.answers?.map(answer => (
                <article key={answer.question_id} className="border border-[#dfe4ec] p-5">
                  <div className="flex items-start gap-3">
                    <span className="flex size-8 shrink-0 items-center justify-center bg-brand-navy text-xs font-bold text-white">{answer.question_order}</span>
                    <p className="pt-1 font-semibold leading-6 text-brand-navy">{answer.question_text}</p>
                  </div>
                  <div className="mt-4 grid gap-2 text-sm text-[#526077] sm:grid-cols-3">
                    <p><strong className="text-brand-navy">А:</strong> {answer.choice_a}</p>
                    <p><strong className="text-brand-navy">Б:</strong> {answer.choice_b}</p>
                    <p><strong className="text-brand-navy">В:</strong> {answer.choice_c}</p>
                  </div>
                  <div className="mt-4 flex flex-wrap gap-x-6 gap-y-2 border-t border-[#e8ebf0] pt-4 text-sm">
                    <p><strong>Выбрано:</strong> {formatChoiceLetter(answer.selected_choice)}</p>
                    <p><strong>Правильный ответ:</strong> {formatChoiceLetter(answer.correct_choice)}</p>
                    <p className={`font-bold ${answer.is_correct ? 'text-emerald-700' : 'text-red-600'}`}>{answer.is_correct ? 'Правильно' : 'Неправильно'}</p>
                  </div>
                </article>
              ))}
            </div>
          </div>
        )}
      </section>
    </AdminLayout>
  );
}
