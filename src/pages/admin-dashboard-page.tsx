import { useEffect, useState } from 'react';
import { useNavigate } from 'react-router-dom';
import { jsPDF } from 'jspdf';
import { supabase } from '../services/supabase';
import { withRetry } from '../utils/supabase-request';
import { apiRequest, removeAccessToken } from '../services/api';
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

// src/utils/supabase-request.ts

export function wait(ms: number) {
  return new Promise((resolve) => setTimeout(resolve, ms));
}

export async function withSupabaseRetry<T>(
  fn: (signal: AbortSignal) => PromiseLike<T>,
  retries = 2,
  timeoutMs = 10000
): Promise<T> {
  let lastError: unknown;

  for (let attempt = 0; attempt <= retries; attempt++) {
    const controller = new AbortController();

    const timeoutId = window.setTimeout(() => {
      controller.abort();
    }, timeoutMs);

    try {
      const result = await Promise.resolve(fn(controller.signal));
      window.clearTimeout(timeoutId);
      return result;
    } catch (error) {
      window.clearTimeout(timeoutId);
      lastError = error;

      if (attempt < retries) {
        await wait(1000);
      }
    }
  }

  throw lastError;
}

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

  return date.toLocaleString();
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
  const [signOutLoading, setSignOutLoading] = useState(false);
  const [error, setError] = useState('');
  const [rows, setRows] = useState<ExamResultRow[]>([]);
  const [selectedDetails, setSelectedDetails] = useState<ExamDetails | null>(null);
  const [detailsLoading, setDetailsLoading] = useState(false);
  const [pdfLoadingId, setPdfLoadingId] = useState<string | null>(null);

  useEffect(() => {
const checkAndLoad = async () => {
  try {
    await apiRequest('/api/auth/user');

    const response = await apiRequest<{ data: ExamResultRow[] } | ExamResultRow[]>(
  '/api/dashboard/results'
);

const rowsData = Array.isArray(response) ? response : response.data;


    setRows(rowsData ?? []);
  } catch (err) {
    removeAccessToken();
    navigate('/admin/login', { replace: true });
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
        err instanceof Error ? err.message : 'Failed to load exam details.';
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
      err instanceof Error ? err.message : 'Failed to generate PDF.';
    setError(message);
  } finally {
    setPdfLoadingId(null);
  }
};

const handleLogout = async () => {
  setSignOutLoading(true);

  try {
    await apiRequest('/api/auth/logout', {
      method: 'POST',
    });
  } catch {
    // ignore
  } finally {
    removeAccessToken();
    setSignOutLoading(false);
    navigate('/admin/login', { replace: true });
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
      <h1 className="text-3xl font-bold">Панель управления администратора</h1>
  <button
      onClick={() => navigate('/admin/questions')}
      className="rounded border px-4 py-2"
    >
      Вопросы
    </button>
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
            <th className="px-4 py-3">Действия</th>
          </tr>
        </thead>
        <tbody>
          {rows.length === 0 ? (
            <tr>
              <td colSpan={7} className="px-4 py-6 text-center">
                Результаты экзаменов не найдены.
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
                <td className="px-4 py-3">{formatStatus(row.status)}</td>
                <td className="px-4 py-3">
                  <div className="flex gap-2">
                    <button
                      onClick={() => handleViewDetails(row.attempt_id)}
                      className="rounded border px-3 py-1"
                    >
                      Просмотр
                    </button>

                    <button
                      onClick={() => handleDownloadPdf(row.attempt_id)}
                      disabled={pdfLoadingId === row.attempt_id}
                      className="rounded border px-3 py-1"
                    >
                      {pdfLoadingId === row.attempt_id ? 'Генерация...' : 'Скачать PDF'}
                    </button>
                  </div>
                </td>
              </tr>
            ))
          )}
        </tbody>
      </table>
    </div>

    <div className="mt-8">
      <h2 className="mb-4 text-2xl font-semibold">Детали экзамена</h2>

      {detailsLoading ? <p>Загрузка...</p> : null}

      {!detailsLoading && !selectedDetails ? (
        <p>Выберите результат, чтобы посмотреть ответы.</p>
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
<strong>Выбрано:</strong> {formatChoiceLetter(answer.selected_choice)}
  </p>
  <p>
<strong>Правильный ответ:</strong> {formatChoiceLetter(answer.correct_choice)}  </p>
  <p>
    <strong>Результат:</strong>{' '}
    <span className={answer.is_correct ? 'text-green-600' : 'text-red-600'}>
      {answer.is_correct ? 'Правильно' : 'Неправильно'}
    </span>
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