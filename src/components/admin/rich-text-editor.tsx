import {
  AlignCenter,
  AlignLeft,
  AlignRight,
  Bold,
  Italic,
  Link2,
  List,
  ListOrdered,
  Quote,
  RemoveFormatting,
  Underline,
  Unlink,
} from 'lucide-react';
import DOMPurify from 'dompurify';
import { useEffect, useRef, useState } from 'react';

type RichTextEditorProps = {
  value: string;
  onChange: (value: string) => void;
  required?: boolean;
  label: string;
};

function escapeHtml(value: string) {
  return value
    .replaceAll('&', '&amp;')
    .replaceAll('<', '&lt;')
    .replaceAll('>', '&gt;')
    .replaceAll('"', '&quot;')
    .replaceAll("'", '&#039;');
}

function normalizeValue(value: string) {
  if (!value.trim()) return '';
  if (/<\/?[a-z][\s\S]*>/i.test(value)) return DOMPurify.sanitize(value);
  return value
    .split(/\n\s*\n/)
    .filter(Boolean)
    .map(paragraph => `<p>${escapeHtml(paragraph.trim()).replaceAll('\n', '<br>')}</p>`)
    .join('');
}

export function RichTextEditor({ value, onChange, required = false, label }: RichTextEditorProps) {
  const editorRef = useRef<HTMLDivElement>(null);
  const savedSelection = useRef<Range | null>(null);
  const [textColor, setTextColor] = useState('#101e3d');

  useEffect(() => {
    const editor = editorRef.current;
    if (!editor) return;
    const normalized = normalizeValue(value);
    if (editor.innerHTML !== normalized && document.activeElement !== editor) editor.innerHTML = normalized;
  }, [value]);

  const rememberSelection = () => {
    const editor = editorRef.current;
    const selection = window.getSelection();
    if (!editor || !selection?.rangeCount || !editor.contains(selection.anchorNode)) return;
    savedSelection.current = selection.getRangeAt(0).cloneRange();
  };

  const restoreSelection = () => {
    const editor = editorRef.current;
    if (!editor) return;
    editor.focus();
    const selection = window.getSelection();
    if (selection && savedSelection.current) {
      selection.removeAllRanges();
      selection.addRange(savedSelection.current);
    }
  };

  const emitChange = () => onChange(editorRef.current?.innerHTML ?? '');

  const runCommand = (command: string, commandValue?: string) => {
    restoreSelection();
    document.execCommand(command, false, commandValue);
    rememberSelection();
    emitChange();
  };

  const addLink = () => {
    rememberSelection();
    const url = window.prompt('Введите адрес ссылки', 'https://');
    if (!url) return;
    const normalizedUrl = url.trim();
    if (!/^(https?:\/\/|mailto:|\/)/i.test(normalizedUrl)) {
      window.alert('Ссылка должна начинаться с https://, http://, mailto: или /.');
      return;
    }
    runCommand('createLink', normalizedUrl);
  };

  const buttonClass = 'flex size-9 items-center justify-center border border-transparent text-brand-navy transition hover:border-[#cfd6e2] hover:bg-white hover:text-brand-orange';

  return (
    <div className="overflow-hidden border border-[#cfd6e2] bg-white focus-within:border-brand-orange">
      <div className="flex flex-wrap items-center gap-1 border-b border-[#dfe4ec] bg-[#f7f8fa] p-2" aria-label={`Панель форматирования: ${label}`}>
        <select
          defaultValue="p"
          aria-label="Стиль текста"
          title="Стиль текста"
          onMouseDown={rememberSelection}
          onChange={event => {
            runCommand('formatBlock', event.target.value);
            event.target.value = 'p';
          }}
          className="h-9 border border-[#cfd6e2] bg-white px-2 text-xs font-semibold text-brand-navy outline-none focus:border-brand-orange"
        >
          <option value="p">Обычный текст</option>
          <option value="h2">Заголовок 2</option>
          <option value="h3">Заголовок 3</option>
        </select>
        <span className="mx-1 h-6 w-px bg-[#d7dde8]" aria-hidden="true" />
        <ToolbarButton label="Полужирный" onClick={() => runCommand('bold')} className={buttonClass}><Bold /></ToolbarButton>
        <ToolbarButton label="Курсив" onClick={() => runCommand('italic')} className={buttonClass}><Italic /></ToolbarButton>
        <ToolbarButton label="Подчёркнутый" onClick={() => runCommand('underline')} className={buttonClass}><Underline /></ToolbarButton>
        <label className={`${buttonClass} relative`} title="Цвет текста">
          <span className="text-sm font-extrabold" aria-hidden="true">A</span>
          <span className="absolute right-2 bottom-1 left-2 h-1" style={{ backgroundColor: textColor }} aria-hidden="true" />
          <span className="sr-only">Цвет текста</span>
          <input
            type="color"
            defaultValue="#101e3d"
            onMouseDown={rememberSelection}
            onChange={event => {
              setTextColor(event.target.value);
              runCommand('foreColor', event.target.value);
            }}
            className="absolute inset-0 cursor-pointer opacity-0"
          />
        </label>
        <span className="mx-1 h-6 w-px bg-[#d7dde8]" aria-hidden="true" />
        <ToolbarButton label="Маркированный список" onClick={() => runCommand('insertUnorderedList')} className={buttonClass}><List /></ToolbarButton>
        <ToolbarButton label="Нумерованный список" onClick={() => runCommand('insertOrderedList')} className={buttonClass}><ListOrdered /></ToolbarButton>
        <ToolbarButton label="Цитата" onClick={() => runCommand('formatBlock', 'blockquote')} className={buttonClass}><Quote /></ToolbarButton>
        <span className="mx-1 h-6 w-px bg-[#d7dde8]" aria-hidden="true" />
        <ToolbarButton label="По левому краю" onClick={() => runCommand('justifyLeft')} className={buttonClass}><AlignLeft /></ToolbarButton>
        <ToolbarButton label="По центру" onClick={() => runCommand('justifyCenter')} className={buttonClass}><AlignCenter /></ToolbarButton>
        <ToolbarButton label="По правому краю" onClick={() => runCommand('justifyRight')} className={buttonClass}><AlignRight /></ToolbarButton>
        <span className="mx-1 h-6 w-px bg-[#d7dde8]" aria-hidden="true" />
        <ToolbarButton label="Добавить ссылку" onClick={addLink} className={buttonClass}><Link2 /></ToolbarButton>
        <ToolbarButton label="Удалить ссылку" onClick={() => runCommand('unlink')} className={buttonClass}><Unlink /></ToolbarButton>
        <ToolbarButton label="Очистить форматирование" onClick={() => runCommand('removeFormat')} className={buttonClass}><RemoveFormatting /></ToolbarButton>
      </div>
      <div
        ref={editorRef}
        contentEditable
        suppressContentEditableWarning
        role="textbox"
        aria-label={label}
        aria-multiline="true"
        aria-required={required}
        onInput={emitChange}
        onKeyUp={rememberSelection}
        onMouseUp={rememberSelection}
        onBlur={rememberSelection}
        className="blog-rich-content min-h-80 px-4 py-3 text-sm leading-7 text-brand-navy outline-none"
        data-placeholder="Начните писать текст статьи…"
      />
    </div>
  );
}

function ToolbarButton({ label, onClick, className, children }: { label: string; onClick: () => void; className: string; children: React.ReactNode }) {
  return (
    <button
      type="button"
      title={label}
      aria-label={label}
      onMouseDown={event => event.preventDefault()}
      onClick={onClick}
      className={className}
    >
      <span className="[&>svg]:size-4">{children}</span>
    </button>
  );
}
