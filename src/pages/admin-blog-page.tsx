import {
  CalendarDays,
  CheckCircle2,
  Edit3,
  FileText,
  ImagePlus,
  Plus,
  Search,
} from 'lucide-react';
import { useEffect, useMemo, useState } from 'react';
import { Link, useLocation, useNavigate } from 'react-router-dom';
import { AdminLayout, AdminLoadingState } from '../components/admin/admin-layout';
import { apiRequest, removeAccessToken } from '../services/api';
import { getAdminBlogPosts } from '../services/blog-api';
import type { BlogPost, BlogStatus } from '../types/blog';

function formatDate(value: string | null) {
  if (!value) return 'Не опубликовано';
  const date = new Date(value);
  return Number.isNaN(date.getTime())
    ? value
    : new Intl.DateTimeFormat('ru-RU', { day: 'numeric', month: 'short', year: 'numeric' }).format(date);
}

function formatPostStatus(status: BlogStatus) {
  return status === 'published' ? 'Опубликовано' : 'Черновик';
}

export default function AdminBlogPage() {
  const navigate = useNavigate();
  const location = useLocation();
  const success = (location.state as { success?: string } | null)?.success ?? '';
  const [loading, setLoading] = useState(true);
  const [posts, setPosts] = useState<BlogPost[]>([]);
  const [query, setQuery] = useState('');
  const [statusFilter, setStatusFilter] = useState<'all' | BlogStatus>('all');
  const [error, setError] = useState('');

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
        setPosts(await getAdminBlogPosts());
      } catch (loadError) {
        setError(loadError instanceof Error ? loadError.message : 'Не удалось загрузить публикации.');
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

  if (loading) return <AdminLoadingState label="Загрузка блога…" />;

  return (
    <AdminLayout
      title="Блог"
      description="Создавайте новости компании на русском и английском языках, сохраняйте черновики и публикуйте статьи на сайте."
      actions={(
        <Link
          to="/admin/blog/new"
          className="inline-flex min-h-11 items-center gap-2 bg-brand-orange px-5 text-sm font-bold text-brand-navy transition hover:bg-[#ff922f]"
        >
          <Plus className="size-5" aria-hidden="true" />
          Новая публикация
        </Link>
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
          { label: 'Все публикации', value: posts.length, icon: FileText },
          { label: 'Опубликовано', value: publishedCount, icon: CheckCircle2 },
          { label: 'Черновики', value: draftCount, icon: Edit3 },
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
            <h2 id="posts-title" className="text-xl font-bold text-brand-navy">Все публикации блога</h2>
            <p className="mt-1 text-sm text-[#667085]">Показано: {filteredPosts.length} из {posts.length}</p>
          </div>
          <div className="flex flex-col gap-3 sm:flex-row">
            <label className="relative block">
              <span className="sr-only">Поиск публикаций</span>
              <Search className="pointer-events-none absolute top-1/2 left-3 size-4 -translate-y-1/2 text-[#98a2b3]" />
              <input
                type="search"
                value={query}
                onChange={event => setQuery(event.target.value)}
                placeholder="Поиск по заголовку или адресу"
                className="h-11 w-full min-w-64 border border-[#d7dde8] bg-white pr-4 pl-10 text-sm outline-none focus:border-brand-orange"
              />
            </label>
            <select
              value={statusFilter}
              onChange={event => setStatusFilter(event.target.value as 'all' | BlogStatus)}
              aria-label="Фильтр публикаций по статусу"
              className="h-11 border border-[#d7dde8] bg-white px-4 text-sm outline-none focus:border-brand-orange"
            >
              <option value="all">Все статусы</option>
              <option value="published">Опубликованные</option>
              <option value="draft">Черновики</option>
            </select>
          </div>
        </div>

        {filteredPosts.length === 0 ? (
          <div className="flex min-h-72 flex-col items-center justify-center px-6 py-12 text-center">
            <div className="flex size-14 items-center justify-center bg-[#fff3e8] text-brand-orange"><FileText className="size-7" /></div>
            <h3 className="mt-5 text-lg font-bold text-brand-navy">Публикации не найдены</h3>
            <p className="mt-2 max-w-md text-sm leading-6 text-[#667085]">
              {posts.length === 0 ? 'Создайте первую статью компании, чтобы начать вести блог.' : 'Измените поисковый запрос или фильтр статуса.'}
            </p>
            {posts.length === 0 && (
              <Link to="/admin/blog/new" className="mt-5 inline-flex min-h-10 items-center gap-2 bg-brand-navy px-4 text-sm font-semibold text-white hover:bg-[#1b315f]">
                <Plus className="size-4" /> Создать первую публикацию
              </Link>
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
                      {formatPostStatus(post.status)}
                    </span>
                    <span className="text-xs text-[#98a2b3]">/{post.slug}</span>
                  </div>
                  <h3 className="mt-3 truncate text-lg font-bold text-brand-navy">{post.title_ru}</h3>
                  <p className="mt-1 line-clamp-2 text-sm leading-6 text-[#667085]">{post.excerpt_ru}</p>
                  <p className="mt-3 flex items-center gap-2 text-xs text-[#98a2b3]">
                    <CalendarDays className="size-4" /> {formatDate(post.published_at ?? post.created_at)}
                  </p>
                </div>
                <Link
                  to={`/admin/blog/${post.id}/edit`}
                  className="inline-flex min-h-10 items-center justify-center gap-2 border border-[#d7dde8] px-4 text-sm font-semibold text-brand-navy transition hover:border-brand-orange hover:text-brand-orange"
                >
                  <Edit3 className="size-4" /> Редактировать
                </Link>
              </article>
            ))}
          </div>
        )}
      </section>
    </AdminLayout>
  );
}
