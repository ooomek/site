import { ChevronDown, Mail, Menu, X } from 'lucide-react';
import { useState } from 'react';
import { useLanguage } from '../../lib/language';
import type { ServiceNavItem } from './types';

type Props = {
  email: string;
  services: ServiceNavItem[];
  presentationUrl?: string | null;
  sticky?: boolean;
  className?: string;
  hidden?: boolean;
};

export function SiteHeader({ email, services, presentationUrl = null, sticky = false, className = '', hidden = false }: Props) {
  const [mobileOpen, setMobileOpen] = useState(false);
  const { language, setLanguage, t, localizePath } = useLanguage();
  const navClass = 'inline-flex min-h-11 items-center whitespace-nowrap text-sm font-semibold transition-colors hover:text-brand-orange focus-visible:outline-2 focus-visible:outline-brand-orange';

  return (
    <header inert={hidden || undefined} aria-hidden={hidden || undefined} className={`z-50 border-b border-white/10 bg-brand-navy text-white ${sticky ? 'fixed inset-x-0 top-0 shadow-md' : 'relative'} ${className}`}>
      <div className="mx-auto flex min-h-20 w-full max-w-[1320px] items-center gap-3 px-5 lg:gap-6">
        <a href={localizePath('/')} aria-label={t('МЭК — Главная', 'MEK — Home')} className="shrink-0">
          <img src="/images/mek.png" alt={t('МЭК', 'MEK')} width="1240" height="961" className="h-14 w-[74px] object-contain" />
        </a>
        <nav aria-label={t('Основная навигация', 'Main navigation')} className="ml-3 hidden items-center gap-5 lg:flex xl:ml-6 xl:gap-7">
          <a href={localizePath('/about')} className={navClass}>{t('О компании', 'About us')}</a>
          <div className="group relative">
            <a href={localizePath('/services')} className={`${navClass} gap-1`}>
              {t('Услуги', 'Services')} <ChevronDown className="size-4" />
            </a>
            <div className="invisible absolute top-full left-0 w-[400px] border border-white/15 bg-brand-navy p-2 opacity-0 shadow-xl transition group-hover:visible group-hover:opacity-100 group-focus-within:visible group-focus-within:opacity-100">
              {services.map(service => (
                <a key={service.id} href={localizePath(`/services/${service.slug}`)} className="block px-3 py-3 text-sm leading-5 text-white/85 hover:bg-white/5 hover:text-brand-orange focus-visible:outline-brand-orange">{service.title}</a>
              ))}
            </div>
          </div>
          <a href={localizePath('/news')} className={navClass}>{t('Новости и статьи', 'News & articles')}</a>
          <a href={localizePath('/contacts')} className={navClass}>{t('Контакты', 'Contacts')}</a>
        </nav>
        <div className="ml-auto flex items-center gap-3 lg:gap-5">
          {presentationUrl && <a href={presentationUrl} target="_blank" rel="noreferrer" className="hidden min-h-10 items-center border border-white/25 px-4 text-sm font-medium transition hover:border-brand-orange hover:text-brand-orange xl:inline-flex">{t('Презентация', 'Presentation')}</a>}
          <a href={`mailto:${email}`} aria-label={email} className="hidden items-center gap-2 text-sm transition hover:text-brand-orange lg:inline-flex">
            <Mail className="size-4 text-brand-orange" /><span className="hidden 2xl:inline">{email}</span>
          </a>
          <div role="group" aria-label={t('Язык сайта', 'Website language')} className="flex items-center border border-white/25 p-1">
            {(['ru', 'en'] as const).map(locale => (
              <button key={locale} type="button" lang={locale} aria-label={locale === 'ru' ? 'Русский' : 'English'} aria-pressed={language === locale} onClick={() => setLanguage(locale)} className={`min-h-9 min-w-10 px-2 text-sm font-semibold transition focus-visible:outline-2 focus-visible:outline-offset-2 focus-visible:outline-brand-orange ${language === locale ? 'bg-brand-orange text-brand-navy' : 'text-white/80 hover:text-brand-orange'}`}>{locale.toUpperCase()}</button>
            ))}
          </div>
          <button type="button" onClick={() => setMobileOpen(!mobileOpen)} aria-label={mobileOpen ? t('Закрыть меню', 'Close menu') : t('Открыть меню', 'Open menu')} aria-expanded={mobileOpen} aria-controls={sticky ? 'sticky-mobile-menu' : 'mobile-menu'} className="inline-flex size-11 items-center justify-center border border-white/25 hover:text-brand-orange lg:hidden">
            {mobileOpen ? <X className="size-5" /> : <Menu className="size-5" />}
          </button>
        </div>
      </div>
      {mobileOpen && <nav id={sticky ? 'sticky-mobile-menu' : 'mobile-menu'} aria-label={t('Мобильная навигация', 'Mobile navigation')} className="border-t border-white/10 px-5 pb-4 lg:hidden">
        <a href={localizePath('/about')} className="block py-3 text-sm hover:text-brand-orange">{t('О компании', 'About us')}</a>
        <a href={localizePath('/services')} className="block py-3 text-sm hover:text-brand-orange">{t('Услуги', 'Services')}</a>
        <a href={localizePath('/news')} className="block py-3 text-sm hover:text-brand-orange">{t('Новости и статьи', 'News & articles')}</a>
        <a href={localizePath('/contacts')} className="block py-3 text-sm hover:text-brand-orange">{t('Контакты', 'Contacts')}</a>
        {presentationUrl && <a href={presentationUrl} target="_blank" rel="noreferrer" className="block py-3 text-sm hover:text-brand-orange">{t('Презентация', 'Presentation')}</a>}
        <a href={`mailto:${email}`} className="block py-3 text-sm text-brand-orange">{email}</a>
      </nav>}
    </header>
  );
}
