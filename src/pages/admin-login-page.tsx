import { type FormEvent, useEffect, useState } from 'react';
import { ArrowRight, LockKeyhole, Mail, ShieldCheck } from 'lucide-react';
import { useNavigate } from 'react-router-dom';
import { apiRequest, getAccessToken, setAccessToken } from '../services/api';

export default function AdminLoginPage() {
  const navigate = useNavigate();

  const [email, setEmail] = useState('');
  const [password, setPassword] = useState('');
  const [loading, setLoading] = useState(false);
  const [error, setError] = useState('');

  useEffect(() => {
    if (getAccessToken()) {
      navigate('/admin/dashboard', { replace: true });
    }
  }, [navigate]);

  const handleLogin = async (e: FormEvent) => {
    e.preventDefault();
    setError('');

    if (!email.trim() || !password.trim()) {
      setError('Введите электронную почту и пароль.');
      return;
    }

    try {
      setLoading(true);

      const result = await apiRequest<{
        session: { access_token: string };
      }>('/api/auth/login', {
        method: 'POST',
        body: JSON.stringify({
          email: email.trim(),
          password,
        }),
      });

      setAccessToken(result.session.access_token);
      navigate('/admin/dashboard', { replace: true });
    } catch (err) {
      setError(err instanceof Error ? err.message : 'Не удалось войти.');
    } finally {
      setLoading(false);
    }
  };

  return (
    <main className="grid min-h-screen bg-white lg:grid-cols-[1.05fr_0.95fr]">
      <section className="relative hidden min-h-screen overflow-hidden bg-brand-navy lg:block">
        <img src="/images/BG.png" alt="" className="absolute inset-0 h-full w-full object-cover opacity-55" />
        <div className="absolute inset-0 bg-gradient-to-br from-brand-navy/95 via-brand-navy/60 to-brand-navy/20" />
        <div className="relative flex h-full flex-col justify-between p-12 xl:p-16">
          <a href="/?lang=ru" className="w-fit" aria-label="Открыть сайт МЭК">
            <img src="/images/mek.png" alt="MEK" width="1240" height="961" className="h-20 w-28 object-contain" />
          </a>
          <div className="max-w-xl pb-8 text-white">
            <span className="inline-flex items-center gap-2 border border-white/20 bg-white/10 px-4 py-2 text-xs font-semibold tracking-[0.14em] uppercase backdrop-blur-sm">
              <ShieldCheck className="size-4 text-brand-orange" /> Защищённое администрирование
            </span>
            <h1 className="mt-7 text-5xl font-extrabold leading-[1.08] tracking-[-0.04em] xl:text-6xl">
              Управляйте экзаменами и новостями компании в одном месте.
            </h1>
            <p className="mt-6 max-w-lg text-base leading-7 text-white/75">
              Проверяйте результаты экзаменов, ведите банк вопросов и публикуйте новости компании на двух языках.
            </p>
          </div>
        </div>
      </section>

      <section className="flex min-h-screen items-center justify-center px-5 py-12 sm:px-10">
        <div className="w-full max-w-md">
          <a href="/?lang=ru" className="mb-12 inline-block lg:hidden" aria-label="Открыть сайт МЭК">
            <img src="/images/mek.png" alt="MEK" width="1240" height="961" className="h-16 w-24 object-contain" />
          </a>
          <p className="text-xs font-semibold tracking-[0.18em] text-brand-orange uppercase">Центр управления МЭК</p>
          <h2 className="mt-3 text-4xl font-extrabold tracking-[-0.04em] text-brand-navy">Добро пожаловать</h2>
          <p className="mt-3 text-sm leading-6 text-[#667085]">Войдите под учётной записью администратора.</p>

          <form onSubmit={handleLogin} className="mt-9 space-y-5" noValidate>
            <label className="block">
              <span className="mb-2 block text-sm font-semibold text-brand-navy">Электронная почта</span>
              <span className="relative block">
                <Mail className="pointer-events-none absolute top-1/2 left-4 size-5 -translate-y-1/2 text-[#98a2b3]" />
                <input
                  type="email"
                  autoComplete="email"
                  value={email}
                  onChange={(e) => setEmail(e.target.value)}
                  className="h-13 w-full border border-[#cfd6e2] bg-white pr-4 pl-12 text-sm text-brand-navy outline-none transition placeholder:text-[#98a2b3] focus:border-brand-orange"
                  placeholder="admin@example.com"
                />
              </span>
            </label>

            <label className="block">
              <span className="mb-2 block text-sm font-semibold text-brand-navy">Пароль</span>
              <span className="relative block">
                <LockKeyhole className="pointer-events-none absolute top-1/2 left-4 size-5 -translate-y-1/2 text-[#98a2b3]" />
                <input
                  type="password"
                  autoComplete="current-password"
                  value={password}
                  onChange={(e) => setPassword(e.target.value)}
                  className="h-13 w-full border border-[#cfd6e2] bg-white pr-4 pl-12 text-sm text-brand-navy outline-none transition placeholder:text-[#98a2b3] focus:border-brand-orange"
                  placeholder="Введите пароль"
                />
              </span>
            </label>

            {error && <div className="border-l-4 border-red-500 bg-red-50 px-4 py-3 text-sm text-red-800" role="alert">{error}</div>}

            <button
              type="submit"
              disabled={loading}
              className="flex min-h-13 w-full items-center justify-center gap-3 bg-brand-orange px-5 text-sm font-bold text-brand-navy transition hover:bg-[#ff922f] disabled:opacity-60"
            >
              {loading ? 'Вход…' : 'Войти'}
              {!loading && <ArrowRight className="size-5" aria-hidden="true" />}
            </button>
          </form>
        </div>
      </section>
    </main>
  );
}
