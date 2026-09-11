import { ArrowRight, ArrowUpRight } from 'lucide-react';
import { externalArticles, newsPublishers } from '../../data/news';
import { useLanguage } from '../../lib/language';

export function ExternalArticles({ preview = false }: { preview?: boolean }) {
  const { language, t, localizePath } = useLanguage();
  const sortedArticles = [...externalArticles].sort((a, b) => b.publishedAt.localeCompare(a.publishedAt));
  const articles = preview ? sortedArticles.slice(0, 2) : sortedArticles;
  const publisher = newsPublishers.atomicEnergy;
  const dateFormatter = new Intl.DateTimeFormat(language === 'ru' ? 'ru-RU' : 'en-GB', {
    day: 'numeric', month: 'long', year: 'numeric', timeZone: 'UTC',
  });

  return (
    <section id={preview ? 'news' : 'external-articles'} aria-labelledby={preview ? 'news-title' : 'publications-title'} className="scroll-mt-24 bg-[#f3f5f9] py-10 sm:py-14">
      <div className="mx-auto w-full max-w-[1320px] px-5 sm:px-6 lg:px-8">
        {preview && (
          <div className="mb-8 flex flex-wrap items-center justify-between gap-4">
            <h2 id="news-title" className="text-2xl font-extrabold text-brand-navy uppercase md:text-3xl">
              {t('Новости и статьи', 'News & articles')}
            </h2>
            <a href={localizePath('/news')} className="inline-flex min-h-11 items-center gap-3 text-sm font-semibold text-brand-navy underline-offset-4 hover:underline">
              {t('Все публикации', 'All publications')} <ArrowRight aria-hidden="true" className="size-5 text-brand-orange" />
            </a>
          </div>
        )}

        <div className="mb-7 flex flex-col justify-between gap-5 border-t border-[#dce2ec] pt-6 lg:flex-row lg:items-center">
          <div>
            {preview ? (
              <p className="text-lg font-semibold leading-snug text-brand-navy sm:text-xl">
                {t('Публикации в «Атомной энергии 2.0»', 'Articles in Atomic Energy 2.0')}
              </p>
            ) : (
              <h2 id="publications-title" className="text-xl font-bold leading-snug text-brand-navy sm:text-2xl">
                {t('Публикации в «Атомной энергии 2.0»', 'Articles in Atomic Energy 2.0')}
              </h2>
            )}
            <p className="mt-2 text-sm leading-6 text-[#526077]">
              {t('Материалы о МЭК на отраслевом портале.', 'Coverage of MEK in the industry publication. Original articles are in Russian.')}
            </p>
          </div>
          <a href={publisher.url} target="_blank" rel="noopener noreferrer" aria-label={`${publisher.name[language]} — ${t('открыть сайт в новой вкладке', 'open website in a new tab')}`} className="w-fit shrink-0 bg-white px-4 py-3">
            <img src={publisher.logo} alt={publisher.name[language]} width="315" height="58" loading="lazy" decoding="async" className="h-auto w-[210px] max-w-full" />
          </a>
        </div>

        <div className="grid gap-6 md:grid-cols-2">
          {articles.map(article => (
            <article key={article.id} className="min-w-0 border border-[#dce2ec] bg-white">
              <a href={article.url} target="_blank" rel="noopener noreferrer" aria-labelledby={`article-${article.id}`} aria-describedby={`article-external-${article.id}`} className="group flex h-full flex-col focus-visible:outline-offset-4">
                <div className="aspect-[16/9] overflow-hidden bg-[#e3e8f0]">
                  <img src={article.image} alt="" width="1200" height="675" loading="lazy" decoding="async" className="h-full w-full object-cover transition-transform duration-300 motion-safe:group-hover:scale-[1.025]" />
                </div>
                <div className="flex flex-1 flex-col p-5 sm:p-7">
                  <div className="mb-4 flex flex-wrap items-center gap-x-3 gap-y-1 text-sm leading-5 text-[#526077]">
                    <time dateTime={article.publishedAt}>{dateFormatter.format(new Date(`${article.publishedAt}T00:00:00Z`))}</time>
                    <span aria-hidden="true" className="h-1 w-1 rounded-full bg-brand-orange" />
                    <span>{newsPublishers[article.publisher].name[language]}</span>
                  </div>
                  <h3 id={`article-${article.id}`} className="text-xl font-bold leading-snug text-brand-navy sm:text-2xl">
                    {article.title[language]}
                  </h3>
                  <p className="mt-4 text-base leading-7 text-[#526077]">{article.summary[language]}</p>
                  <span className="mt-auto flex items-center justify-between gap-4 pt-7 text-sm font-semibold text-brand-navy">
                    <span className="underline-offset-4 group-hover:underline">{t('Читать на сайте издания', 'Read the original article')}</span>
                    <ArrowUpRight aria-hidden="true" className="size-6 shrink-0 text-brand-orange" />
                    <span id={`article-external-${article.id}`} className="sr-only">{t('(откроется в новой вкладке)', '(opens in a new tab)')}</span>
                  </span>
                </div>
              </a>
            </article>
          ))}
        </div>
      </div>
    </section>
  );
}
