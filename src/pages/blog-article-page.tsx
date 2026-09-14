import { ArrowLeft, CalendarDays } from 'lucide-react';
import DOMPurify from 'dompurify';
import { useEffect, useState } from 'react';
import { useParams } from 'react-router-dom';
import { SiteFooter } from '../components/site/site-footer';
import { SiteHeader } from '../components/site/site-header';
import { SiteShell } from '../components/site/site-shell';
import { useSiteData } from '../data';
import { useLanguage } from '../lib/language';
import { getPublishedBlogPost } from '../services/blog-api';
import type { BlogPost } from '../types/blog';

function escapeHtml(value: string) {
  return value
    .replaceAll('&', '&amp;')
    .replaceAll('<', '&lt;')
    .replaceAll('>', '&gt;')
    .replaceAll('"', '&quot;')
    .replaceAll("'", '&#039;');
}

function renderArticleHtml(value: string) {
  const trimmed = value.trim();
  if (!trimmed) return '';
  if (/<\/?[a-z][\s\S]*>/i.test(trimmed)) {
    return DOMPurify.sanitize(trimmed, { ADD_ATTR: ['target'] });
  }
  const paragraphs = trimmed
    .split(/\n\s*\n/)
    .filter(Boolean)
    .map(paragraph => `<p>${escapeHtml(paragraph.trim()).replaceAll('\n', '<br>')}</p>`)
    .join('');
  return DOMPurify.sanitize(paragraphs);
}

export default function BlogArticlePage({ siteUrl }: { siteUrl: string }) {
  const { slug = '' } = useParams();
  const { company, services } = useSiteData();
  const { language, t, localizePath } = useLanguage();
  const [post, setPost] = useState<BlogPost | null>(null);
  const [loading, setLoading] = useState(true);
  const [error, setError] = useState('');

  useEffect(() => {
    let active = true;
    getPublishedBlogPost(slug)
      .then(data => { if (active) setPost(data); })
      .catch(fetchError => {
        if (active) setError(fetchError instanceof Error ? fetchError.message : t('Статья не найдена.', 'Article not found.'));
      })
      .finally(() => { if (active) setLoading(false); });
    return () => { active = false; };
  }, [slug, t]);

  const title = post ? (language === 'en' ? post.title_en?.trim() || post.title_ru : post.title_ru) : t('Статья', 'Article');
  const excerpt = post ? (language === 'en' ? post.excerpt_en?.trim() || post.excerpt_ru : post.excerpt_ru) : '';
  const content = post ? (language === 'en' ? post.content_en?.trim() || post.content_ru : post.content_ru) : '';
  const contentHtml = renderArticleHtml(content);

  useEffect(() => {
    document.title = `${title} | ${language === 'ru' ? 'МЭК' : 'MEK'}`;
    let description = document.querySelector<HTMLMetaElement>('meta[name="description"]');
    if (!description) {
      description = document.createElement('meta');
      description.name = 'description';
      document.head.appendChild(description);
    }
    description.content = excerpt || t('Новости компании МЭК', 'MEK company news');

    let canonical = document.querySelector<HTMLLinkElement>('link[rel="canonical"]');
    if (!canonical) {
      canonical = document.createElement('link');
      canonical.rel = 'canonical';
      document.head.appendChild(canonical);
    }
    canonical.href = `${siteUrl}/news/${slug}`;
  }, [excerpt, language, siteUrl, slug, t, title]);

  const date = post?.published_at ?? post?.created_at ?? null;
  const dateFormatter = new Intl.DateTimeFormat(language === 'ru' ? 'ru-RU' : 'en-GB', {
    day: 'numeric', month: 'long', year: 'numeric', timeZone: 'UTC',
  });

  return (
    <SiteShell company={company} services={services}>
      <SiteHeader email={company.email || 'info@expert-mek.com'} services={services} presentationUrl={company.presentation_url} />
      <main className="min-h-[60vh] bg-[#f4f6fa]">
        <div className="bg-brand-navy text-white">
          <div className="mx-auto max-w-[1100px] px-5 py-9 sm:px-6 sm:py-12 lg:px-8">
            <a href={localizePath('/news')} className="inline-flex min-h-11 items-center gap-2 text-sm font-semibold text-white/75 hover:text-brand-orange">
              <ArrowLeft className="size-4" /> {t('Все новости', 'All news')}
            </a>
          </div>
        </div>

        {loading ? (
          <div className="mx-auto max-w-[920px] px-5 py-14 sm:px-6 lg:px-8">
            <div className="h-10 w-4/5 animate-pulse bg-[#e1e5ec]" />
            <div className="mt-6 h-80 animate-pulse bg-[#e1e5ec]" />
          </div>
        ) : error || !post ? (
          <div className="mx-auto max-w-[920px] px-5 py-20 text-center sm:px-6 lg:px-8">
            <h1 className="text-3xl font-extrabold text-brand-navy">{t('Статья не найдена', 'Article not found')}</h1>
            <p className="mt-4 text-[#667085]">{error}</p>
            <a href={localizePath('/news')} className="mt-8 inline-flex min-h-11 items-center bg-brand-orange px-5 text-sm font-bold text-brand-navy">{t('Вернуться к новостям', 'Return to news')}</a>
          </div>
        ) : (
          <article className="mx-auto max-w-[920px] px-5 py-12 sm:px-6 sm:py-16 lg:px-8">
            <header>
              <p className="text-xs font-semibold tracking-[0.16em] text-brand-orange uppercase">{t('Блог МЭК', 'MEK blog')}</p>
              <h1 className="mt-4 text-3xl font-extrabold leading-tight tracking-[-0.025em] text-brand-navy sm:text-5xl">{title}</h1>
              {date && (
                <time dateTime={date} className="mt-6 flex items-center gap-2 text-sm text-[#667085]">
                  <CalendarDays className="size-4 text-brand-orange" /> {dateFormatter.format(new Date(date))}
                </time>
              )}
              <p className="mt-7 border-l-4 border-brand-orange pl-5 text-lg leading-8 text-[#526077] sm:text-xl">{excerpt}</p>
            </header>

            {post.cover_image_url && (
              <img src={post.cover_image_url} alt="" className="mt-9 aspect-[16/9] w-full object-cover" />
            )}

            <div
              className="blog-rich-content mt-10 text-base leading-8 text-[#26354f] sm:text-lg"
              dangerouslySetInnerHTML={{ __html: contentHtml }}
            />
          </article>
        )}
      </main>
      <SiteFooter company={company} services={services} />
    </SiteShell>
  );
}
