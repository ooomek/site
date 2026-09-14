import { ArrowRight, CalendarDays } from 'lucide-react';
import { useEffect, useState } from 'react';
import { useLanguage } from '../../lib/language';
import { getPublishedBlogPosts } from '../../services/blog-api';
import type { BlogPost } from '../../types/blog';

export function CompanyBlog({ preview = false }: { preview?: boolean }) {
  const { language, t, localizePath } = useLanguage();
  const [posts, setPosts] = useState<BlogPost[]>([]);
  const [loading, setLoading] = useState(true);

  useEffect(() => {
    let active = true;
    getPublishedBlogPosts()
      .then(data => {
        if (active) setPosts(preview ? data.slice(0, 3) : data);
      })
      .catch(() => {
        if (active) setPosts([]);
      })
      .finally(() => {
        if (active) setLoading(false);
      });
    return () => { active = false; };
  }, [preview]);

  if (!loading && posts.length === 0) return null;

  const dateFormatter = new Intl.DateTimeFormat(language === 'ru' ? 'ru-RU' : 'en-GB', {
    day: 'numeric', month: 'long', year: 'numeric', timeZone: 'UTC',
  });

  return (
    <section className="bg-white py-10 sm:py-14" aria-labelledby={preview ? 'company-blog-preview-title' : 'company-blog-title'}>
      <div className="mx-auto w-full max-w-[1320px] px-5 sm:px-6 lg:px-8">
        <div className="mb-8 flex flex-wrap items-end justify-between gap-4 border-t border-[#dce2ec] pt-6">
          <div>
            <p className="text-xs font-semibold tracking-[0.16em] text-brand-orange uppercase">{t('Блог МЭК', 'MEK blog')}</p>
            <h2 id={preview ? 'company-blog-preview-title' : 'company-blog-title'} className="mt-2 text-2xl font-extrabold text-brand-navy uppercase md:text-3xl">
              {t('Новости компании', 'Company news')}
            </h2>
          </div>
          {preview && (
            <a href={localizePath('/news')} className="inline-flex min-h-11 items-center gap-3 text-sm font-semibold text-brand-navy underline-offset-4 hover:underline">
              {t('Все публикации', 'All publications')} <ArrowRight aria-hidden="true" className="size-5 text-brand-orange" />
            </a>
          )}
        </div>

        {loading ? (
          <div className="grid gap-6 md:grid-cols-3" aria-label={t('Загрузка новостей', 'Loading news')}>
            {[0, 1, 2].map(item => <div key={item} className="h-80 animate-pulse bg-[#eef1f6]" />)}
          </div>
        ) : (
          <div className="grid gap-6 md:grid-cols-2 lg:grid-cols-3">
            {posts.map(post => {
              const title = language === 'en' ? post.title_en?.trim() || post.title_ru : post.title_ru;
              const excerpt = language === 'en' ? post.excerpt_en?.trim() || post.excerpt_ru : post.excerpt_ru;
              const date = post.published_at ?? post.created_at;

              return (
                <article key={post.id} className="border border-[#dce2ec] bg-white">
                  <a href={localizePath(`/news/${post.slug}`)} className="group flex h-full flex-col focus-visible:outline-offset-4">
                    <div className="aspect-[16/9] overflow-hidden bg-[#e8ecf2]">
                      {post.cover_image_url ? (
                        <img src={post.cover_image_url} alt="" loading="lazy" decoding="async" className="h-full w-full object-cover transition-transform duration-300 motion-safe:group-hover:scale-[1.025]" />
                      ) : (
                        <div className="flex h-full items-center justify-center bg-brand-navy px-8 text-center text-2xl font-extrabold text-white/20 uppercase">MEK</div>
                      )}
                    </div>
                    <div className="flex flex-1 flex-col p-5 sm:p-6">
                      <time dateTime={date} className="flex items-center gap-2 text-xs font-medium text-[#667085]">
                        <CalendarDays className="size-4 text-brand-orange" aria-hidden="true" />
                        {dateFormatter.format(new Date(date))}
                      </time>
                      <h3 className="mt-4 text-xl font-bold leading-snug text-brand-navy">{title}</h3>
                      <p className="mt-3 line-clamp-3 text-sm leading-6 text-[#526077]">{excerpt}</p>
                      <span className="mt-auto inline-flex items-center gap-2 pt-6 text-sm font-semibold text-brand-navy underline-offset-4 group-hover:underline">
                        {t('Читать статью', 'Read article')} <ArrowRight className="size-4 text-brand-orange" aria-hidden="true" />
                      </span>
                    </div>
                  </a>
                </article>
              );
            })}
          </div>
        )}
      </div>
    </section>
  );
}
