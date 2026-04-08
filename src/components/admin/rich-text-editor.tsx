import { Bold, List, ListOrdered, Pilcrow } from 'lucide-react';
import { useEffect, useRef, useState } from 'react';
import { Button } from '@/components/ui/button';
import { Label } from '@/components/ui/label';

type RichTextEditorProps = {
    id: string;
    label: string;
    value: string;
    onChange: (value: string) => void;
    minHeightClassName?: string;
};

export default function RichTextEditor({
    id,
    label,
    value,
    onChange,
    minHeightClassName = 'min-h-40',
}: RichTextEditorProps) {
    const editorRef = useRef<HTMLDivElement | null>(null);
    const [showHtml, setShowHtml] = useState(false);
    const labelId = `${id}-label`;

    const sanitizeHtml = (html: string): string => {
        const wrapper = document.createElement('div');
        wrapper.innerHTML = html;

        // Remove dangerous tags entirely (script, iframe, etc.)
        [
            'script', 'iframe', 'object', 'embed', 'form', 'input',
            'select', 'textarea', 'meta', 'link', 'style', 'base',
            'frame', 'frameset', 'applet', 'noscript',
        ].forEach((tag) => {
            wrapper.querySelectorAll(tag).forEach((el) => el.remove());
        });

        // Strip all attributes from remaining elements (event handlers, javascript: hrefs, etc.)
        wrapper.querySelectorAll<HTMLElement>('*').forEach((el) => {
            [...el.attributes].forEach((attr) => el.removeAttribute(attr.name));
        });

        wrapper.querySelectorAll('span').forEach((span) => {
            const parent = span.parentNode;
            if (!parent) return;
            while (span.firstChild) {
                parent.insertBefore(span.firstChild, span);
            }
            parent.removeChild(span);
        });

        wrapper.querySelectorAll('div').forEach((div) => {
            const parent = div.parentNode;
            if (!parent) return;

            const inner = div.innerHTML.trim();
            if (inner === '' || inner === '<br>') {
                parent.insertBefore(document.createElement('br'), div);
            } else {
                const paragraph = document.createElement('p');
                while (div.firstChild) {
                    paragraph.appendChild(div.firstChild);
                }
                parent.insertBefore(paragraph, div);
            }
            parent.removeChild(div);
        });

        wrapper.querySelectorAll('p').forEach((p) => {
            if (p.textContent?.trim() === '' && p.querySelector('br') === null) {
                p.remove();
            }
        });

        wrapper.innerHTML = wrapper.innerHTML.replace(/(<br>\s*){3,}/g, '<br><br>');

        return wrapper.innerHTML;
    };

    useEffect(() => {
        const el = editorRef.current;
        if (!el || showHtml) return;

        if (el.innerHTML !== (value || '')) {
            el.innerHTML = value || '';
        }
    }, [value, showHtml]);

    const runCommand = (command: string, commandValue?: string) => {
        const el = editorRef.current;
        if (!el || showHtml) return;

        el.focus();
        (document as Document & { execCommand: (cmd: string, ui?: boolean, v?: string) => boolean }).execCommand(
            'styleWithCSS',
            false,
            'false',
        );
        (document as Document & { execCommand: (cmd: string, ui?: boolean, v?: string) => boolean }).execCommand(
            command,
            false,
            commandValue,
        );
        const clean = sanitizeHtml(el.innerHTML);
        if (clean !== el.innerHTML) {
            el.innerHTML = clean;
        }
        onChange(clean);
    };

    return (
        <div className="space-y-2">
            <Label id={labelId}>{label}</Label>
            <div className="flex flex-wrap gap-2 rounded-md border border-border bg-muted/30 p-2">
                <Button
                    type="button"
                    variant="outline"
                    size="sm"
                    onClick={() => runCommand('bold')}
                    disabled={showHtml}
                >
                    <Bold className="size-4" />
                    Жирный
                </Button>
                <Button
                    type="button"
                    variant="outline"
                    size="sm"
                    onClick={() => runCommand('insertUnorderedList')}
                    disabled={showHtml}
                >
                    <List className="size-4" />
                    Список
                </Button>
                <Button
                    type="button"
                    variant="outline"
                    size="sm"
                    onClick={() => runCommand('insertOrderedList')}
                    disabled={showHtml}
                >
                    <ListOrdered className="size-4" />
                    Нумерация
                </Button>
                <Button
                    type="button"
                    variant="outline"
                    size="sm"
                    onClick={() => runCommand('formatBlock', 'p')}
                    disabled={showHtml}
                >
                    <Pilcrow className="size-4" />
                    Абзац
                </Button>
                <Button type="button" variant="outline" size="sm" onClick={() => setShowHtml((prev) => !prev)}>
                    {showHtml ? 'Визуально' : 'HTML'}
                </Button>
            </div>
            {showHtml ? (
                <textarea
                    id={id}
                    value={value}
                    onChange={(e) => onChange(e.target.value)}
                    className={`${minHeightClassName} w-full rounded-md border border-input bg-background px-3 py-2 font-mono text-sm focus-visible:border-ring focus-visible:ring-ring/50 focus-visible:ring-[3px] focus-visible:outline-none`}
                />
            ) : (
                <div
                    id={id}
                    ref={editorRef}
                    contentEditable
                    role="textbox"
                    aria-multiline="true"
                    aria-labelledby={labelId}
                    suppressContentEditableWarning
                    onKeyDown={(e) => {
                        if (e.key !== 'Enter') return;

                        const selection = window.getSelection();
                        const node = selection?.anchorNode;
                        const element =
                            node instanceof Element
                                ? node
                                : node?.parentElement ?? null;
                        const inList = Boolean(element?.closest('li'));
                        if (inList) return;

                        e.preventDefault();
                        runCommand('insertLineBreak');
                    }}
                    onInput={(e) => {
                        const el = e.currentTarget as HTMLDivElement;
                        const clean = sanitizeHtml(el.innerHTML);
                        if (clean !== el.innerHTML) {
                            el.innerHTML = clean;
                        }
                        onChange(clean);
                    }}
                    className={`${minHeightClassName} w-full rounded-md border border-input bg-background px-3 py-2 text-sm focus-visible:border-ring focus-visible:ring-ring/50 focus-visible:ring-[3px] focus-visible:outline-none [&_ul]:list-disc [&_ul]:pl-5 [&_ol]:list-decimal [&_ol]:pl-5 [&_li]:my-1 [&_p]:my-1`}
                />
            )}
            {value.trim() === '' ? (
                <p className="-mt-10 px-3 text-sm text-muted-foreground pointer-events-none">
                    Начните вводить текст...
                </p>
            ) : null}
        </div>
    );
}
