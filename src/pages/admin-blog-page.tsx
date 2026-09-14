import {
  CalendarDays,
  CheckCircle2,
  Edit3,
  FileText,
  ImagePlus,
  Plus,
  Search,
  X,
} from 'lucide-react';
import { type ChangeEvent, type FormEvent, useEffect, useMemo, useState } from 'react';
import { useNavigate } from 'react-router-dom';
import { AdminLayout, AdminLoadingState } from '../components/admin/admin-layout';
import { apiRequest, removeAccessToken } from '../services/api';
import {
  createBlogPost,
  getAdminBlogPosts,
  updateBlogPost,
  uploadBlogCover,
} from '../services/blog-api';
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

function formatDate(value: string | null) {
  if (!value) return 'Not published';
  const date = new Date(value);
  return Number.isNaN(date.getTime())
    ? value
    : new Intl.DateTimeFormat('en-GB', { day: 'numeric', month: 'short', year: 'numeric' }).format(date);
}

export default function AdminBlogPage() {
  const navigate = useNavigate();
  const [loading, setLoading] = useState(true);
  const [posts, setPosts] = useState<BlogPost[]>([]);
  const [query, setQuery] = useState('');
  const [statusFilter, setStatusFilter] = useState<'all' | BlogStatus>('all');
  const [error, setError] = useState('');
  const [success, setSuccess] = useState('');
  const [editorOpen, setEditorOpen] = useState(false);
  const [editingPost, setEditingPost] = useState<BlogPost | null>(null);
  const [form, setForm] = useState<BlogForm>(emptyForm);
  const [coverFile, setCoverFile] = useState<File | null>(null);
  const [slugWasEdited, setSlugWasEdited] = useState(false);
  const [saving, setSaving] = useState(false);
  const [formError, setFormError] = useState('');

  const loadPosts = async () => {
    const data = await getAdminBlogPosts();
    setPosts(data);
  };

  useEffect(() => {
    const initialize = async () => {
      try {
        await apiRequest('/api/auth/user');
      } catch {
        removeAccessToken();
        navigate('/admin/login', { replace: true });
        return;
      }

      try {
        await loadPosts();
      } catch (loadError) {
        setError(loadError instanceof Error ? loadError.message : 'Could not load blog posts.');
      } finally {
        setLoading(false);
      }
    };
    initialize();
  }, [navigate]);

  const filteredPosts = useMemo(() => {
    const normalizedQuery = query.trim().toLowerCase();
    return posts.filter(post => {
      const matchesStatus = statusFilter === 'all' || post.status === statusFilter;
      const matchesQuery = !normalizedQuery || [post.title_ru, post.title_en, post.slug]
        .filter(Boolean)
        .some(value => value!.toLowerCase().includes(normalizedQuery));
      return matchesStatus && matchesQuery;
    });
  }, [posts, query, statusFilter]);

  const publishedCount = posts.filter(post => post.status === 'published').length;
  const draftCount = posts.length - publishedCount;

  const openCreate = () => {
    setEditingPost(null);
    setForm(emptyForm);
    setCoverFile(null);
    setSlugWasEdited(false);
    setFormError('');
    setEditorOpen(true);
  };

  const openEdit = (post: BlogPost) => {
    setEditingPost(post);
    setForm(toForm(post));
    setCoverFile(null);
    setSlugWasEdited(true);
    setFormError('');
    setEditorOpen(true);
  };

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
      setFormError('Use a JPG, PNG, WebP, or AVIF image.');
      event.target.value = '';
      return;
    }
    if (file.size > 5 * 1024 * 1024) {
      setFormError('The cover image must be 5 MB or smaller.');
      event.target.value = '';
      return;
    }
    setCoverFile(file);
  };

  const handleSubmit = async (event: FormEvent) => {
    event.preventDefault();
    setFormError('');
    setSuccess('');

    if (!form.title_ru.trim() || !form.slug.trim() || !form.excerpt_ru.trim() || !form.content_ru.trim()) {
      setFormError('Complete the required Russian title, slug, excerpt, and article content.');
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
        content_ru: form.content_ru.trim(),
        content_en: form.content_en.trim() || null,
        cover_image_url: coverImageUrl,
        status: form.status,
        published_at: editingPost?.published_at ?? null,
      };

      if (editingPost) {
        await updateBlogPost(editingPost.id, payload);
        setSuccess('Blog post updated.');
      } else {
        await createBlogPost(payload);
        setSuccess(form.status === 'published' ? 'Blog post published.' : 'Draft saved.');
      }

      await loadPosts();
      setEditorOpen(false);
    } catch (saveError) {
      setFormError(saveError instanceof Error ? saveError.message : 'Could not save the blog post.');
    } finally {
      setSaving(false);
    }
  };

  if (loading) return <AdminLoadingState label="Loading blog…" />;

  return (
    <AdminLayout
      title="Blog"
      description="Write company news in Russian and English, save drafts, and publish articles to the website."
      actions={(
        <button
          type="button"
          onClick={openCreate}
          className="inline-flex min-h-11 items-center gap-2 bg-brand-orange px-5 text-sm font-bold text-brand-navy transition hover:bg-[#ff922f]"
        >
          <Plus className="size-5" aria-hidden="true" />
          New post
        </button>
      )}
    >
      {error && (
        <div className="mb-6 border-l-4 border-red-500 bg-red-50 px-5 py-4 text-sm text-red-800" role="alert">{error}</div>
      )}
      {success && (
        <div className="mb-6 flex items-center gap-3 border-l-4 border-emerald-500 bg-emerald-50 px-5 py-4 text-sm font-medium text-emerald-800" role="status">
          <CheckCircle2 className="size-5" aria-hidden="true" /> {success}
        </div>
      )}

      <div className="grid gap-4 sm:grid-cols-3">
        {[
          { label: 'All posts', value: posts.length, icon: FileText },
          { label: 'Published', value: publishedCount, icon: CheckCircle2 },
          { label: 'Drafts', value: draftCount, icon: Edit3 },
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

      <section className="mt-7 border border-[#dfe4ec] bg-white shadow-[0_12px_40px_rgba(16,30,61,0.05)]" aria-labelledby="posts-title">
        <div className="flex flex-col gap-4 border-b border-[#e5e9f0] p-5 sm:flex-row sm:items-center sm:justify-between sm:p-6">
          <div>
            <h2 id="posts-title" className="text-xl font-bold text-brand-navy">All blog posts</h2>
            <p className="mt-1 text-sm text-[#667085]">{filteredPosts.length} of {posts.length} posts</p>
          </div>
          <div className="flex flex-col gap-3 sm:flex-row">
            <label className="relative block">
              <span className="sr-only">Search posts</span>
              <Search className="pointer-events-none absolute top-1/2 left-3 size-4 -translate-y-1/2 text-[#98a2b3]" />
              <input
                type="search"
                value={query}
                onChange={event => setQuery(event.target.value)}
                placeholder="Search title or slug"
                className="h-11 w-full min-w-64 border border-[#d7dde8] bg-white pr-4 pl-10 text-sm outline-none focus:border-brand-orange"
              />
            </label>
            <select
              value={statusFilter}
              onChange={event => setStatusFilter(event.target.value as 'all' | BlogStatus)}
              aria-label="Filter posts by status"
              className="h-11 border border-[#d7dde8] bg-white px-4 text-sm outline-none focus:border-brand-orange"
            >
              <option value="all">All statuses</option>
              <option value="published">Published</option>
              <option value="draft">Drafts</option>
            </select>
          </div>
        </div>

        {filteredPosts.length === 0 ? (
          <div className="flex min-h-72 flex-col items-center justify-center px-6 py-12 text-center">
            <div className="flex size-14 items-center justify-center bg-[#fff3e8] text-brand-orange"><FileText className="size-7" /></div>
            <h3 className="mt-5 text-lg font-bold text-brand-navy">No blog posts found</h3>
            <p className="mt-2 max-w-md text-sm leading-6 text-[#667085]">
              {posts.length === 0 ? 'Create the first company article to start the blog.' : 'Try a different search or status filter.'}
            </p>
            {posts.length === 0 && (
              <button type="button" onClick={openCreate} className="mt-5 inline-flex min-h-10 items-center gap-2 bg-brand-navy px-4 text-sm font-semibold text-white hover:bg-[#1b315f]">
                <Plus className="size-4" /> Create first post
              </button>
            )}
          </div>
        ) : (
          <div className="divide-y divide-[#e5e9f0]">
            {filteredPosts.map(post => (
              <article key={post.id} className="grid gap-5 p-5 sm:grid-cols-[150px_1fr_auto] sm:items-center sm:p-6">
                <div className="aspect-[16/10] overflow-hidden bg-[#eef1f6]">
                  {post.cover_image_url ? (
                    <img src={post.cover_image_url} alt="" className="h-full w-full object-cover" />
                  ) : (
                    <div className="flex h-full items-center justify-center text-[#98a2b3]"><ImagePlus className="size-7" /></div>
                  )}
                </div>
                <div className="min-w-0">
                  <div className="flex flex-wrap items-center gap-2">
                    <span className={`px-2.5 py-1 text-[11px] font-bold tracking-wide uppercase ${post.status === 'published' ? 'bg-emerald-50 text-emerald-700' : 'bg-amber-50 text-amber-700'}`}>
                      {post.status}
                    </span>
                    <span className="text-xs text-[#98a2b3]">/{post.slug}</span>
                  </div>
                  <h3 className="mt-3 truncate text-lg font-bold text-brand-navy">{post.title_ru}</h3>
                  <p className="mt-1 line-clamp-2 text-sm leading-6 text-[#667085]">{post.excerpt_ru}</p>
                  <p className="mt-3 flex items-center gap-2 text-xs text-[#98a2b3]">
                    <CalendarDays className="size-4" /> {formatDate(post.published_at ?? post.created_at)}
                  </p>
                </div>
                <button
                  type="button"
                  onClick={() => openEdit(post)}
                  className="inline-flex min-h-10 items-center justify-center gap-2 border border-[#d7dde8] px-4 text-sm font-semibold text-brand-navy transition hover:border-brand-orange hover:text-brand-orange"
                >
                  <Edit3 className="size-4" /> Edit
                </button>
              </article>
            ))}
          </div>
        )}
      </section>

      {editorOpen && (
        <div className="fixed inset-0 z-50 flex justify-end" role="dialog" aria-modal="true" aria-labelledby="blog-editor-title">
          <button type="button" aria-label="Close editor" onClick={() => !saving && setEditorOpen(false)} className="absolute inset-0 bg-brand-navy/70 backdrop-blur-sm" />
          <div className="relative h-full w-full max-w-3xl overflow-y-auto bg-[#f8f9fb] shadow-2xl">
            <div className="sticky top-0 z-10 flex items-start justify-between gap-4 border-b border-[#dfe4ec] bg-white px-5 py-5 sm:px-8">
              <div>
                <p className="text-xs font-semibold tracking-[0.16em] text-brand-orange uppercase">Blog editor</p>
                <h2 id="blog-editor-title" className="mt-1 text-2xl font-extrabold text-brand-navy">{editingPost ? 'Edit post' : 'Create a new post'}</h2>
              </div>
              <button type="button" onClick={() => !saving && setEditorOpen(false)} aria-label="Close editor" className="flex size-10 items-center justify-center border border-[#d7dde8] text-brand-navy hover:border-brand-orange">
                <X className="size-5" />
              </button>
            </div>

            <form onSubmit={handleSubmit} className="space-y-6 p-5 sm:p-8">
              <fieldset className="border border-[#dfe4ec] bg-white p-5 sm:p-6">
                <legend className="px-2 text-sm font-bold text-brand-navy">Publication</legend>
                <div className="grid gap-5 sm:grid-cols-2">
                  <Field label="Status" required>
                    <select value={form.status} onChange={event => updateField('status', event.target.value as BlogStatus)} className={inputClass}>
                      <option value="draft">Draft</option>
                      <option value="published">Published</option>
                    </select>
                  </Field>
                  <Field label="URL slug" required hint="Latin letters, numbers, and hyphens">
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
                  <Field label="Cover image" hint="JPG, PNG, WebP, or AVIF. Maximum 5 MB.">
                    <label className="flex min-h-24 cursor-pointer items-center gap-4 border border-dashed border-[#bfc7d4] bg-[#fafbfc] px-5 transition hover:border-brand-orange">
                      <span className="flex size-11 shrink-0 items-center justify-center bg-[#fff3e8] text-brand-orange"><ImagePlus className="size-5" /></span>
                      <span className="min-w-0 text-sm text-[#667085]">
                        <strong className="block truncate text-brand-navy">{coverFile?.name ?? (form.cover_image_url ? 'Replace current cover' : 'Choose a cover image')}</strong>
                        <span>{coverFile ? `${(coverFile.size / 1024 / 1024).toFixed(2)} MB` : 'Click to browse files'}</span>
                      </span>
                      <input type="file" accept="image/jpeg,image/png,image/webp,image/avif" onChange={handleCoverChange} className="sr-only" />
                    </label>
                  </Field>
                </div>
              </fieldset>

              <LanguageFields
                language="Russian"
                required
                title={form.title_ru}
                excerpt={form.excerpt_ru}
                content={form.content_ru}
                onTitleChange={handleRussianTitleChange}
                onExcerptChange={value => updateField('excerpt_ru', value)}
                onContentChange={value => updateField('content_ru', value)}
              />

              <LanguageFields
                language="English"
                title={form.title_en}
                excerpt={form.excerpt_en}
                content={form.content_en}
                onTitleChange={value => updateField('title_en', value)}
                onExcerptChange={value => updateField('excerpt_en', value)}
                onContentChange={value => updateField('content_en', value)}
              />

              {formError && <div className="border-l-4 border-red-500 bg-red-50 px-5 py-4 text-sm text-red-800" role="alert">{formError}</div>}

              <div className="flex flex-col-reverse gap-3 border-t border-[#dfe4ec] pt-6 sm:flex-row sm:justify-end">
                <button type="button" onClick={() => setEditorOpen(false)} disabled={saving} className="min-h-11 border border-[#cfd6e2] px-5 text-sm font-semibold text-brand-navy hover:border-brand-orange disabled:opacity-50">Cancel</button>
                <button type="submit" disabled={saving} className="min-h-11 bg-brand-orange px-6 text-sm font-bold text-brand-navy hover:bg-[#ff922f] disabled:opacity-50">
                  {saving ? 'Saving…' : form.status === 'published' ? 'Publish post' : 'Save draft'}
                </button>
              </div>
            </form>
          </div>
        </div>
      )}
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
    <fieldset className="border border-[#dfe4ec] bg-white p-5 sm:p-6">
      <legend className="px-2 text-sm font-bold text-brand-navy">{language} content {required ? '(required)' : '(optional)'}</legend>
      <div className="space-y-5">
        <Field label="Title" required={required}>
          <input value={title} onChange={event => onTitleChange(event.target.value)} maxLength={180} required={required} className={inputClass} />
        </Field>
        <Field label="Short excerpt" required={required} hint={`${excerpt.length}/500 characters`}>
          <textarea value={excerpt} onChange={event => onExcerptChange(event.target.value)} maxLength={500} required={required} rows={3} className={inputClass} />
        </Field>
        <Field label="Article content" required={required} hint="Use blank lines to separate paragraphs.">
          <textarea value={content} onChange={event => onContentChange(event.target.value)} maxLength={50000} required={required} rows={12} className={`${inputClass} resize-y leading-6`} />
        </Field>
      </div>
    </fieldset>
  );
}
