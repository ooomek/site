import { Upload } from 'lucide-react';
import { useId } from 'react';
import { Button } from '@/components/ui/button';
import { Label } from '@/components/ui/label';

type FilePickerProps = {
    label: string;
    accept?: string;
    fileName?: string | null;
    hint?: string;
    onChange: (file: File | null) => void;
};

export default function FilePicker({
    label,
    accept,
    fileName,
    hint,
    onChange,
}: FilePickerProps) {
    const id = useId();

    return (
        <div className="space-y-2">
            <Label htmlFor={id}>{label}</Label>
            <div className="flex flex-col gap-2 rounded-md border border-border bg-background p-3">
                <div className="flex flex-wrap items-center gap-3">
                    <Button type="button" variant="outline" asChild>
                        <label htmlFor={id} className="cursor-pointer">
                            <Upload className="size-4" />
                            Выбрать файл
                        </label>
                    </Button>
                    <span className="text-sm text-muted-foreground">
                        {fileName || 'Файл не выбран'}
                    </span>
                </div>
                <input
                    id={id}
                    type="file"
                    accept={accept}
                    className="hidden"
                    onChange={(e) => onChange(e.target.files?.[0] ?? null)}
                />
                {hint ? <p className="text-xs text-muted-foreground">{hint}</p> : null}
            </div>
        </div>
    );
}
