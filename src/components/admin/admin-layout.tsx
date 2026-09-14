import {
  BookOpenText,
  ChevronRight,
  ClipboardCheck,
  ExternalLink,
  FileQuestion,
  LogOut,
  Menu,
  X,
} from 'lucide-react';
import { type ReactNode, useState } from 'react';
import { NavLink, useNavigate } from 'react-router-dom';
import { apiRequest, removeAccessToken } from '../../services/api';

type AdminLayoutProps = {
  title: string;
  description: string;
  eyebrow?: string;
  actions?: ReactNode;
  children: ReactNode;
};

const navigation = [
  { label: 'Результаты экзаменов', to: '/admin/dashboard', icon: ClipboardCheck },
  { label: 'Банк вопросов', to: '/admin/questions', icon: FileQuestion },
  { label: 'Блог', to: '/admin/blog', icon: BookOpenText },
];

export function AdminLayout({ title, description, eyebrow = 'Администрирование', actions, children }: AdminLayoutProps) {
  const navigate = useNavigate();
  const [mobileOpen, setMobileOpen] = useState(false);
  const [signOutLoading, setSignOutLoading] = useState(false);

  const handleLogout = async () => {
    setSignOutLoading(true);
    try {
      await apiRequest('/api/auth/logout', { method: 'POST' });
    } catch {
      // The local token must still be cleared when the API cannot be reached.
    } finally {
      removeAccessToken();
      navigate('/admin/login', { replace: true });
    }
  };

  const sidebar = (
    <div className="flex h-full flex-col bg-brand-navy text-white">
      <div className="flex h-24 items-center border-b border-white/10 px-7">
        <a href="/?lang=ru" aria-label="Открыть сайт МЭК" className="flex items-center gap-4">
          <img src="/images/mek.png" alt="MEK" width="1240" height="961" className="h-14 w-[72px] object-contain" />
          <span className="border-l border-white/20 pl-4 text-xs font-semibold tracking-[0.2em] text-white/65 uppercase">
            Центр<br />управления
          </span>
        </a>
      </div>

      <div className="px-5 pt-8">
        <p className="px-3 text-[11px] font-semibold tracking-[0.18em] text-white/40 uppercase">Разделы</p>
        <nav aria-label="Навигация администратора" className="mt-3 space-y-1.5">
          {navigation.map(({ label, to, icon: Icon }) => (
            <NavLink
              key={to}
              to={to}
              onClick={() => setMobileOpen(false)}
              className={({ isActive }) =>
                `group flex min-h-12 items-center gap-3 border-l-2 px-4 text-sm font-semibold transition ${
                  isActive
                    ? 'border-brand-orange bg-white/10 text-white'
                    : 'border-transparent text-white/65 hover:bg-white/5 hover:text-white'
                }`
              }
            >
              <Icon className="size-5 text-brand-orange" aria-hidden="true" />
              <span>{label}</span>
              <ChevronRight className="ml-auto size-4 opacity-35 transition group-hover:translate-x-0.5 group-hover:opacity-75" aria-hidden="true" />
            </NavLink>
          ))}
        </nav>
      </div>

      <div className="mt-auto border-t border-white/10 p-5">
        <a
          href="/?lang=ru"
          target="_blank"
          rel="noreferrer"
          className="mb-2 flex min-h-11 items-center gap-3 px-4 text-sm font-medium text-white/65 transition hover:bg-white/5 hover:text-white"
        >
          <ExternalLink className="size-4 text-brand-orange" aria-hidden="true" />
          Открыть сайт
        </a>
        <button
          type="button"
          onClick={handleLogout}
          disabled={signOutLoading}
          className="flex min-h-11 w-full items-center gap-3 px-4 text-sm font-medium text-white/65 transition hover:bg-white/5 hover:text-white disabled:opacity-50"
        >
          <LogOut className="size-4 text-brand-orange" aria-hidden="true" />
          {signOutLoading ? 'Выход…' : 'Выйти'}
        </button>
      </div>
    </div>
  );

  return (
    <div className="min-h-screen bg-[#f4f6fa] text-brand-navy">
      <aside className="fixed inset-y-0 left-0 z-40 hidden w-[280px] lg:block">{sidebar}</aside>

      {mobileOpen && (
        <div className="fixed inset-0 z-50 lg:hidden">
          <button
            type="button"
            aria-label="Закрыть навигацию"
            onClick={() => setMobileOpen(false)}
            className="absolute inset-0 bg-brand-navy/70 backdrop-blur-sm"
          />
          <aside className="relative h-full w-[min(86vw,320px)] shadow-2xl">
            {sidebar}
            <button
              type="button"
              aria-label="Закрыть навигацию"
              onClick={() => setMobileOpen(false)}
              className="absolute top-6 right-5 flex size-10 items-center justify-center border border-white/20 text-white"
            >
              <X className="size-5" />
            </button>
          </aside>
        </div>
      )}

      <div className="lg:pl-[280px]">
        <div className="flex h-16 items-center justify-between border-b border-[#dfe4ec] bg-white px-5 sm:px-8 lg:hidden">
          <button
            type="button"
            onClick={() => setMobileOpen(true)}
            aria-label="Открыть навигацию"
            className="flex size-11 items-center justify-center border border-[#d7dde8] text-brand-navy"
          >
            <Menu className="size-5" />
          </button>
          <img src="/images/mek.png" alt="MEK" width="1240" height="961" className="h-11 w-14 object-contain" />
        </div>

        <header className="border-b border-[#dfe4ec] bg-white">
          <div className="mx-auto flex w-full max-w-[1500px] flex-col gap-5 px-5 py-7 sm:px-8 lg:flex-row lg:items-end lg:justify-between lg:px-10 lg:py-9">
            <div>
              <p className="text-xs font-semibold tracking-[0.18em] text-brand-orange uppercase">{eyebrow}</p>
              <h1 className="mt-2 text-3xl font-extrabold tracking-[-0.03em] text-brand-navy sm:text-4xl">{title}</h1>
              <p className="mt-2 max-w-3xl text-sm leading-6 text-[#667085] sm:text-base">{description}</p>
            </div>
            {actions && <div className="flex shrink-0 flex-wrap items-center gap-3">{actions}</div>}
          </div>
        </header>

        <main className="mx-auto w-full max-w-[1500px] px-5 py-7 sm:px-8 lg:px-10 lg:py-9">{children}</main>
      </div>
    </div>
  );
}

export function AdminLoadingState({ label = 'Загрузка…' }: { label?: string }) {
  return (
    <div className="flex min-h-screen items-center justify-center bg-[#f4f6fa]">
      <div className="flex items-center gap-3 text-sm font-semibold text-brand-navy">
        <span className="size-5 animate-spin rounded-full border-2 border-brand-orange border-t-transparent" aria-hidden="true" />
        {label}
      </div>
    </div>
  );
}
