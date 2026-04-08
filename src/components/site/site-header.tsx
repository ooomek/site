import { ChevronDown, Mail, Menu, X } from 'lucide-react';
import { useMemo, useState } from 'react';
import type { ServiceNavItem } from './types';

type Props = {
    email: string;
    services: ServiceNavItem[];
    presentationUrl?: string | null;
    sticky?: boolean;
    className?: string;
};

export function SiteHeader({
    email,
    services,
    presentationUrl = null,
    sticky = false,
    className = '',
}: Props) {
    const [mobileOpen, setMobileOpen] = useState(false);
    const serviceLinks = useMemo(
        () =>
            services.map((service) => (
                <a
                    key={service.id}
                    href={`/services/${service.slug}`}
                    className="block rounded-lg px-3 py-2.5 text-sm font-semibold tracking-wide text-white/90 uppercase hover:bg-white/10 hover:text-white focus-visible:ring-2 focus-visible:ring-white/30 focus-visible:outline-none"
                >
                    {service.title}
                </a>
            )),
        [services],
    );

    return (
        <header
            className={[
                'z-50 border-b border-[#255583] bg-[#12345d] text-white',
                sticky ? 'fixed top-0 right-0 left-0 shadow-md' : 'relative',
                className,
            ].join(' ')}
        >
            <div className="relative mx-auto flex h-16 w-full max-w-[1320px] items-center gap-4 px-5">
                <a href="/" className="relative z-10 shrink-0">
                    <img
                        src="/images/logo.png"
                        alt="МЭК"
                        className="h-10 w-auto object-contain"
                    />
                </a>

                <nav className="absolute top-0 left-1/2 hidden h-16 -translate-x-1/2 items-center gap-6 xl:gap-9 lg:flex">
                    <a
                        href="/about"
                        className="inline-flex h-16 items-center text-sm leading-none font-bold uppercase hover:text-[#d2e4f8] xl:text-base"
                    >
                        О компании
                    </a>
                    <div className="group relative">
                        <a
                            href="/services"
                            className="inline-flex h-16 items-center gap-1 text-sm leading-none font-bold uppercase hover:text-[#d2e4f8] xl:text-base"
                        >
                            Услуги <ChevronDown className="size-4" />
                        </a>

                        <div className="pointer-events-none absolute top-full left-0 w-[420px] translate-y-2 overflow-hidden rounded-xl border border-white/10 bg-[#0f2d50]/95 opacity-0 shadow-[0_18px_50px_rgba(0,0,0,0.35)] backdrop-blur-md transition duration-150 group-hover:pointer-events-auto group-hover:translate-y-0 group-hover:opacity-100">
                            <div className="max-h-[360px] overflow-auto p-2">
                                {serviceLinks}
                            </div>
                        </div>
                    </div>
                    <a
                        href="/contacts"
                        className="inline-flex h-16 items-center text-sm leading-none font-bold uppercase hover:text-[#d2e4f8] xl:text-base"
                    >
                        Контакты
                    </a>
                </nav>

                <div className="relative z-10 ml-auto hidden items-center gap-4 lg:flex">
                    {presentationUrl ? (
                        <a
                            href={presentationUrl}
                            target="_blank"
                            rel="noreferrer"
                            className="inline-flex h-10 items-center rounded border border-white/35 px-2 text-[11px] font-semibold whitespace-nowrap uppercase transition hover:bg-white/10 xl:px-4 xl:text-sm"
                        >
                            Презентация
                        </a>
                    ) : null}
                    <a
                        href={`mailto:${email}`}
                        className="inline-flex items-center gap-2 text-base font-semibold"
                    >
                        <Mail className="size-4" />
                        <span className="hidden xl:inline">{email}</span>
                    </a>
                </div>

                <button
                    type="button"
                    className="relative z-10 ml-auto inline-flex h-10 w-10 items-center justify-center rounded border border-white/35 lg:hidden"
                    onClick={() => setMobileOpen((v) => !v)}
                    aria-label="Открыть меню"
                >
                    {mobileOpen ? (
                        <X className="size-5" />
                    ) : (
                        <Menu className="size-5" />
                    )}
                </button>
            </div>

            {mobileOpen ? (
                <div className="border-t border-[#255583] bg-[#12345d] px-4 py-3 lg:hidden">
                    <div className="space-y-2 text-sm font-semibold uppercase">
                        <a
                            className="block rounded px-2 py-2 hover:bg-[#1e4e81]"
                            href="/about"
                        >
                            О компании
                        </a>
                        <div className="rounded bg-[#0f2d50] p-2">
                            <a
                                className="block rounded px-2 py-2 hover:bg-[#1e4e81]"
                                href="/services"
                            >
                                Услуги
                            </a>
                            <div className="mt-1 space-y-1">{serviceLinks}</div>
                        </div>
                        <a
                            className="block rounded px-2 py-2 hover:bg-[#1e4e81]"
                            href="/contacts"
                        >
                            Контакты
                        </a>
                        {presentationUrl ? <div className="my-1 border-t border-[#255583]" /> : null}
                        {presentationUrl ? (
                            <a
                                className="mt-2 inline-flex h-10 w-full items-center justify-center rounded border border-white/40 bg-[#0f2d50] px-3 text-center text-xs font-semibold uppercase transition hover:bg-[#1e4e81]"
                                href={presentationUrl}
                                target="_blank"
                                rel="noreferrer"
                            >
                                Презентация
                            </a>
                        ) : null}
                    </div>
                </div>
            ) : null}
        </header>
    );
}
