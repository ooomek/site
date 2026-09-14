import { useEffect } from 'react';
import { ExternalArticles } from '../components/site/external-articles';
import { CompanyBlog } from '../components/site/company-blog';
import { SiteFooter } from '../components/site/site-footer';
import { SiteHeader } from '../components/site/site-header';
import { SiteShell } from '../components/site/site-shell';
import { useSiteData } from '../data';
import { useLanguage } from '../lib/language';

export default function NewsPage({ canonical }: { canonical: string }) {
  const { company, services } = useSiteData();
  const { language, t, localizePath } = useLanguage();
  const title = t('Новости и статьи', 'News & articles');
  const description = t('Публикации о МЭК: технический аудит, цифровые решения и работа компании в атомной отрасли.', 'Coverage of MEK: technical audits, digital solutions, and the company’s work in the nuclear industry.');

  useEffect(() => {
    document.title = `${title} | ${language === 'ru' ? 'МЭК' : 'MEK'}`;
    for (const [name, content] of [['description', description], ['robots', 'index,follow']]) {
      let meta = document.querySelector<HTMLMetaElement>(`meta[name="${name}"]`);
      if (!meta) {
        meta = document.createElement('meta');
        meta.name = name;
        document.head.appendChild(meta);
      }
      meta.content = content;
    }
    let link = document.querySelector<HTMLLinkElement>('link[rel="canonical"]');
    if (!link) {
      link = document.createElement('link');
      link.rel = 'canonical';
      document.head.appendChild(link);
    }
    link.href = localizePath(canonical);
  }, [canonical, description, language, localizePath, title]);

  return (
    <SiteShell company={company} services={services}>
      <SiteHeader email={company.email || 'info@expert-mek.com'} services={services} presentationUrl={company.presentation_url} />
      <main>
        <div className="bg-brand-navy text-white">
          <div className="mx-auto max-w-[1320px] px-5 py-9 sm:px-6 sm:py-12 lg:px-8">
            <nav aria-label={t('Хлебные крошки', 'Breadcrumb')} className="mb-6 flex flex-wrap gap-2 text-sm text-white/75">
              <a href={localizePath('/')} className="hover:text-brand-orange">{t('Главная', 'Home')}</a>
              <span aria-hidden="true">/</span>
              <span aria-current="page">{title}</span>
            </nav>
            <div className="mb-5 h-1 w-12 bg-brand-orange" />
            <h1 className="text-3xl font-extrabold uppercase sm:text-4xl">{title}</h1>
          </div>
        </div>
        <CompanyBlog />
        <ExternalArticles />
      </main>
      <SiteFooter company={company} services={services} />
    </SiteShell>
  );
}
