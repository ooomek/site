import { ArrowLeft, ImagePlus } from 'lucide-react';
import DOMPurify from 'dompurify';
import { type ChangeEvent, type FormEvent, useEffect, useState } from 'react';
import { Link, useNavigate, useParams } from 'react-router-dom';
import { AdminLayout, AdminLoadingState } from '../components/admin/admin-layout';
import { RichTextEditor } from '../components/admin/rich-text-editor';
import { apiRequest, removeAccessToken } from '../services/api';
import { createBlogPost, getAdminBlogPosts, updateBlogPost, uploadBlogCover } from '../services/blog-api';
import type { BlogPost, BlogPostInput, BlogStatus } from '../types/blog';

type BlogForm = {
  slug: string;
  title_ru: string;
  title_en: string;
  excerpt_ru: string;
  excerpt_en: string;
  content_ru: string;
  content_en: string;
  cover_image_url: string;
  status: BlogStatus;
};

const emptyForm: BlogForm = {
  slug: '',
  title_ru: '',
  title_en: '',
  excerpt_ru: '',
  excerpt_en: '',
  content_ru: '',
  content_en: '',
  cover_image_url: '',
  status: 'draft',
};

const transliteration: Record<string, string> = {
  а: 'a', б: 'b', в: 'v', г: 'g', д: 'd', е: 'e', ё: 'e', ж: 'zh', з: 'z', и: 'i',
  й: 'y', к: 'k', л: 'l', м: 'm', н: 'n', о: 'o', п: 'p', р: 'r', с: 's', т: 't',
  у: 'u', ф: 'f', х: 'h', ц: 'ts', ч: 'ch', ш: 'sh', щ: 'sch', ъ: '', ы: 'y', ь: '',
  э: 'e', ю: 'yu', я: 'ya',
};

function makeSlug(value: string) {
  return value
    .toLowerCase()
    .split('')
    .map(character => transliteration[character] ?? character)
    .join('')
    .replace(/[^a-z0-9]+/g, '-')
    .replace(/^-+|-+$/g, '')
    .slice(0, 120);
}

function toForm(post: BlogPost): BlogForm {
  return {
    slug: post.slug,
    title_ru: post.title_ru,
    title_en: post.title_en ?? '',
    excerpt_ru: post.excerpt_ru,
    excerpt_en: post.excerpt_en ?? '',
    content_ru: post.content_ru,
    content_en: post.content_en ?? '',
    cover_image_url: post.cover_image_url ?? '',
    status: post.status,
  };
}

function hasText(value: string) {
  return value
    .replace(/<[^>]*>/g, ' ')
    .replace(/&nbsp;|&#160;/gi, ' ')
    .replace(/&[a-z0-9#]+;/gi, 'x')
    .trim().length > 0;
}

export default function AdminBlogEditorPage() {
  const { postId } = useParams<{ postId: string }>();
  const navigate = useNavigate();
  const [loading, setLoading] = useState(true);
  const [editingPost, setEditingPost] = useState<BlogPost | null>(null);
  const [form, setForm] = useState<BlogForm>(emptyForm);
  const [coverFile, setCoverFile] = useState<File | null>(null);
  const [slugWasEdited, setSlugWasEdited] = useState(Boolean(postId));
  const [saving, setSaving] = useState(false);
  const [formError, setFormError] = useState('');

  useEffect(() => {
    const initialize = async () => {
      try {
        await apiRequest('/api/auth/user');
      } catch {
        removeAccessToken();
        navigate('/admin/login', { replace: true });
        return;
      }

      if (postId) {
        try {
          const posts = await getAdminBlogPosts();
          const post = posts.find(item => item.id === postId);
          if (!post) {
            navigate('/admin/blog', { replace: true, state: { success: 'Публикация не найдена.' } });
            return;
          }
          setEditingPost(post);
          setForm(toForm(post));
          setSlugWasEdited(true);
        } catch (loadError) {
          setFormError(loadError instanceof Error ? loadError.message : 'Не удалось загрузить публикацию.');
        }
      }
      setLoading(false);
    };
    initialize();
  }, [navigate, postId]);

  const updateField = <K extends keyof BlogForm>(field: K, value: BlogForm[K]) => {
    setForm(current => ({ ...current, [field]: value }));
  };

  const handleRussianTitleChange = (value: string) => {
    setForm(current => ({
      ...current,
      title_ru: value,
      slug: slugWasEdited ? current.slug : makeSlug(value),
    }));
  };

  const handleCoverChange = (event: ChangeEvent<HTMLInputElement>) => {
    const file = event.target.files?.[0] ?? null;
    setFormError('');
    if (!file) {
      setCoverFile(null);
      return;
    }
    if (!['image/jpeg', 'image/png', 'image/webp', 'image/avif'].includes(file.type)) {
      setFormError('Используйте изображение в формате JPG, PNG, WebP или AVIF.');
      event.target.value = '';
      return;
    }
    if (file.size > 5 * 1024 * 1024) {
      setFormError('Размер обложки не должен превышать 5 МБ.');
      event.target.value = '';
      return;
    }
    setCoverFile(file);
  };

  const handleSubmit = async (event: FormEvent) => {
    event.preventDefault();
    setFormError('');

    if (!form.title_ru.trim() || !form.slug.trim() || !form.excerpt_ru.trim() || !hasText(form.content_ru)) {
      setFormError('Заполните обязательные поля: заголовок, адрес, краткое описание и текст статьи на русском языке.');
      return;
    }

    try {
      setSaving(true);
      const coverImageUrl = coverFile ? await uploadBlogCover(coverFile) : form.cover_image_url.trim() || null;
      const payload: BlogPostInput = {
        slug: form.slug.trim(),
        title_ru: form.title_ru.trim(),
        title_en: form.title_en.trim() || null,
        excerpt_ru: form.excerpt_ru.trim(),
        excerpt_en: form.excerpt_en.trim() || null,
        content_ru: DOMPurify.sanitize(form.content_ru.trim()),
        content_en: hasText(form.content_en) ? DOMPurify.sanitize(form.content_en.trim()) : null,
        cover_image_url: coverImageUrl,
        status: form.status,
        published_at: editingPost?.published_at ?? null,
      };

      if (editingPost) {
        await updateBlogPost(editingPost.id, payload);
        navigate('/admin/blog', { replace: true, state: { success: 'Публикация обновлена.' } });
      } else {
        await createBlogPost(payload);
        navigate('/admin/blog', {
          replace: true,
          state: { success: form.status === 'published' ? 'Публикация размещена на сайте.' : 'Черновик сохранён.' },
        });
      }
    } catch (saveError) {
      setFormError(saveError instanceof Error ? saveError.message : 'Не удалось сохранить публикацию.');
      setSaving(false);
    }
  };

  if (loading) return <AdminLoadingState label={postId ? 'Загрузка публикации…' : 'Открытие редактора…'} />;

  return (
    <AdminLayout
      eyebrow="Редактор блога"
      title={editingPost ? 'Редактирование публикации' : 'Новая публикация'}
      description="Заполните материалы на русском и английском языках, оформите текст и выберите статус публикации."
      actions={(
        <Link to="/admin/blog" className="inline-flex min-h-11 items-center gap-2 border border-[#cfd6e2] bg-white px-5 text-sm font-semibold text-brand-navy hover:border-brand-orange">
          <ArrowLeft className="size-4" /> К списку публикаций
        </Link>
      )}
    >
      <form onSubmit={handleSubmit} className="mx-auto max-w-[1120px] space-y-6">
        <fieldset className="border border-[#dfe4ec] bg-white p-5 shadow-[0_8px_30px_rgba(16,30,61,0.04)] sm:p-7">
          <legend className="px-2 text-sm font-bold text-brand-navy">Публикация</legend>
          <div className="grid gap-5 sm:grid-cols-2">
            <Field label="Статус" required>
              <select value={form.status} onChange={event => updateField('status', event.target.value as BlogStatus)} className={inputClass}>
                <option value="draft">Черновик</option>
                <option value="published">Опубликовано</option>
              </select>
            </Field>
            <Field label="Адрес страницы" required hint="Латинские буквы, цифры и дефисы">
              <input
                value={form.slug}
                onChange={event => {
                  setSlugWasEdited(true);
                  updateField('slug', makeSlug(event.target.value));
                }}
                placeholder="company-news-title"
                className={inputClass}
                required
              />
            </Field>
          </div>
          <div className="mt-5">
            <Field label="Обложка" hint="JPG, PNG, WebP или AVIF. Максимальный размер — 5 МБ.">
              <label className="flex min-h-24 cursor-pointer items-center gap-4 border border-dashed border-[#bfc7d4] bg-[#fafbfc] px-5 transition hover:border-brand-orange">
                <span className="flex size-11 shrink-0 items-center justify-center bg-[#fff3e8] text-brand-orange"><ImagePlus className="size-5" /></span>
                <span className="min-w-0 text-sm text-[#667085]">
                  <strong className="block truncate text-brand-navy">{coverFile?.name ?? (form.cover_image_url ? 'Заменить текущую обложку' : 'Выбрать обложку')}</strong>
                  <span>{coverFile ? `${(coverFile.size / 1024 / 1024).toFixed(2)} МБ` : 'Нажмите, чтобы выбрать файл'}</span>
                </span>
                <input type="file" accept="image/jpeg,image/png,image/webp,image/avif" onChange={handleCoverChange} className="sr-only" />
              </label>
            </Field>
          </div>
        </fieldset>

        <LanguageFields
          language="Русская версия"
          required
          title={form.title_ru}
          excerpt={form.excerpt_ru}
          content={form.content_ru}
          onTitleChange={handleRussianTitleChange}
          onExcerptChange={value => updateField('excerpt_ru', value)}
          onContentChange={value => updateField('content_ru', value)}
        />

        <LanguageFields
          language="Английская версия"
          title={form.title_en}
          excerpt={form.excerpt_en}
          content={form.content_en}
          onTitleChange={value => updateField('title_en', value)}
          onExcerptChange={value => updateField('excerpt_en', value)}
          onContentChange={value => updateField('content_en', value)}
        />

        {formError && <div className="border-l-4 border-red-500 bg-red-50 px-5 py-4 text-sm text-red-800" role="alert">{formError}</div>}

        <div className="sticky bottom-0 flex flex-col-reverse gap-3 border border-[#dfe4ec] bg-white/95 p-4 shadow-[0_-10px_35px_rgba(16,30,61,0.08)] backdrop-blur sm:flex-row sm:justify-end">
          <Link to="/admin/blog" className="inline-flex min-h-11 items-center justify-center border border-[#cfd6e2] px-5 text-sm font-semibold text-brand-navy hover:border-brand-orange">Отмена</Link>
          <button type="submit" disabled={saving} className="min-h-11 bg-brand-orange px-7 text-sm font-bold text-brand-navy hover:bg-[#ff922f] disabled:opacity-50">
            {saving ? 'Сохранение…' : form.status === 'published' ? 'Опубликовать' : 'Сохранить черновик'}
          </button>
        </div>
      </form>
    </AdminLayout>
  );
}

const inputClass = 'min-h-11 w-full border border-[#cfd6e2] bg-white px-3 py-2 text-sm text-brand-navy outline-none placeholder:text-[#98a2b3] focus:border-brand-orange';

function Field({ label, hint, required = false, children }: { label: string; hint?: string; required?: boolean; children: React.ReactNode }) {
  return (
    <label className="block">
      <span className="mb-2 block text-sm font-semibold text-brand-navy">
        {label}{required && <span className="ml-1 text-brand-orange">*</span>}
      </span>
      {children}
      {hint && <span className="mt-1.5 block text-xs leading-5 text-[#98a2b3]">{hint}</span>}
    </label>
  );
}

function LanguageFields({
  language,
  required = false,
  title,
  excerpt,
  content,
  onTitleChange,
  onExcerptChange,
  onContentChange,
}: {
  language: string;
  required?: boolean;
  title: string;
  excerpt: string;
  content: string;
  onTitleChange: (value: string) => void;
  onExcerptChange: (value: string) => void;
  onContentChange: (value: string) => void;
}) {
  return (
    <fieldset className="border border-[#dfe4ec] bg-white p-5 shadow-[0_8px_30px_rgba(16,30,61,0.04)] sm:p-7">
      <legend className="px-2 text-sm font-bold text-brand-navy">{language} {required ? '(обязательно)' : '(необязательно)'}</legend>
      <div className="space-y-5">
        <Field label="Заголовок" required={required}>
          <input value={title} onChange={event => onTitleChange(event.target.value)} maxLength={180} required={required} className={inputClass} />
        </Field>
        <Field label="Краткое описание" required={required} hint={`${excerpt.length}/500 символов`}>
          <textarea value={excerpt} onChange={event => onExcerptChange(event.target.value)} maxLength={500} required={required} rows={3} className={inputClass} />
        </Field>
        <div>
          <span className="mb-2 block text-sm font-semibold text-brand-navy">
            Текст статьи{required && <span className="ml-1 text-brand-orange">*</span>}
          </span>
          <RichTextEditor value={content} onChange={onContentChange} required={required} label={`Текст статьи — ${language}`} />
          <span className="mt-1.5 block text-xs leading-5 text-[#98a2b3]">Выделите текст, затем используйте панель форматирования.</span>
        </div>
      </div>
    </fieldset>
  );
}
