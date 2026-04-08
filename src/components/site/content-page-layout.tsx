import DOMPurify from 'dompurify';
import { Head, useForm } from '@inertiajs/react';
import { ArrowLeft, ArrowRight } from 'lucide-react';
import { useEffect, useMemo, useState } from 'react';
import { Button } from '@/components/ui/button';
import {
    Dialog,
    DialogContent,
    DialogDescription,
    DialogHeader,
    DialogTitle,
} from '@/components/ui/dialog';
import { Input } from '@/components/ui/input';
import { Label } from '@/components/ui/label';
import { formatRuPhone } from '@/lib/phone-mask';
import { SiteFooter } from './site-footer';
import { SiteHeader } from './site-header';
import { SiteShell } from './site-shell';
import type { CompanyData } from './types';

export type ServiceSideItem = {
    id: number;
    title: string;
    slug: string;
    short_description?: string | null;
};

export type ContentPageData = {
    title: string;
    subtitle: string | null;
    content: string | null;
    image_url: string | null;
};

export type ContentPageBreadcrumb = {
    middle_label: string;
    middle_href: string;
    current_label: string;
};

type Props = {
    company: CompanyData;
    services: ServiceSideItem[];
    page: ContentPageData;
    breadcrumb: ContentPageBreadcrumb;
    canonical?: string;
    robots?: string;
    description?: string;
    initialSidebarServiceId?: number;
    showSidebar?: boolean;
    contentSlot?: React.ReactNode;
};

export function ContentPageLayout({
    company,
    services,
    page,
    breadcrumb,
    canonical,
    robots = 'index,follow',
    description,
    initialSidebarServiceId,
    showSidebar = true,
    contentSlot,
}: Props) {
    const [orderOpen, setOrderOpen] = useState(false);
    const [orderSuccessVisible, setOrderSuccessVisible] = useState(false);
    const [sidebarDirection, setSidebarDirection] = useState<'next' | 'prev'>('next');
    const initialIndex = useMemo(() => {
        if (!initialSidebarServiceId) return 0;
        const i = services.findIndex((item) => item.id === initialSidebarServiceId);
        return i >= 0 ? i : 0;
    }, [services, initialSidebarServiceId]);
    const [sidebarIndex, setSidebarIndex] = useState<number>(initialIndex);

    const email = company.email || 'info@expert-mek.com';
    const canPrevSidebar = sidebarIndex > 0;
    const canNextSidebar = sidebarIndex < services.length - 1;
    const hasMiddleCrumb = breadcrumb.middle_label !== breadcrumb.current_label;

    const orderForm = useForm({
        name: '',
        phone: '',
        email: '',
        service_id: '',
        message: '',
        policy_accepted: false,
    });

    useEffect(() => {
        if (!orderSuccessVisible) return;

        const timerId = window.setTimeout(() => {
            setOrderSuccessVisible(false);
        }, 4000);

        return () => window.clearTimeout(timerId);
    }, [orderSuccessVisible]);

    return (
        <>
            <Head title={page.title}>
                <meta name="robots" content={robots} />
                {description ? <meta name="description" content={description} /> : null}
                {canonical ? <link rel="canonical" href={canonical} /> : null}
            </Head>
            <SiteShell company={company} services={services}>
                <section className="relative overflow-hidden bg-white">
                    <div className="absolute inset-0 bg-[url('/images/background-image.png')] bg-repeat opacity-35" />
                    <div className="relative z-10 flex min-h-0 flex-col">
                        <SiteHeader
                            email={email}
                            services={services}
                            presentationUrl={company.presentation_url}
                        />
                        <div className="w-full bg-[#086EB5]">
                            <div className="mx-auto w-full max-w-[1320px] px-5 py-2 text-sm font-semibold text-white">
                                <a href="/">Главная</a>
                                {' > '}
                                {hasMiddleCrumb ? (
                                    <>
                                        <a href={breadcrumb.middle_href}>{breadcrumb.middle_label}</a>
                                        {' > '}
                                        {breadcrumb.current_label}
                                    </>
                                ) : (
                                    breadcrumb.current_label
                                )}
                            </div>
                        </div>

                        <main className="mx-auto w-full max-w-[1320px] flex-1 px-5 pb-0">
                            {/* <h1 className="max-w-[980px] text-[32px] leading-[1.1] font-extrabold tracking-[-0.02em] uppercase md:text-[52px]">
                                {page.title}
                            </h1> */}

                            <div className="relative ml-[calc(50%-50vw)] h-[220px] w-screen overflow-hidden border-y border-[#dbe3ee] bg-white sm:h-[320px] md:h-[460px] lg:h-[600px]">
                                <img
                                    src="/images/main.png"
                                    alt={page.title}
                                    fetchPriority="high"
                                    decoding="async"
                                    className="h-full w-full object-cover"
                                />

                                <div className="absolute inset-0">
                                    <div className="relative mx-auto h-full w-full max-w-[1320px]">
                                        <div className="absolute bottom-0 left-full h-12 w-[calc((100vw-1320px)/2+1.25rem)] -translate-x-5 bg-[#12345d] sm:h-16" />

                                        <div className="relative h-full px-5">
                                            <Button
                                                type="button"
                                                onClick={() => setOrderOpen(true)}
                                                className="absolute right-0 bottom-0 h-12 rounded-none bg-[#12345d] px-5 text-xs font-semibold text-white uppercase hover:bg-[#0d2747] sm:h-16 sm:px-10 sm:text-base"
                                            >
                                                Заказать услугу
                                                <ArrowRight className="size-4 sm:size-6" />
                                            </Button>
                                        </div>
                                    </div>
                                </div>
                            </div>
                        </main>
                    </div>
                </section>

                <section className="w-full bg-white pt-4 pb-8 sm:pt-6 lg:pt-6">
                    <div className="mx-auto w-full max-w-[1320px] px-5">
                        <div className={showSidebar ? 'grid grid-cols-1 gap-8 lg:grid-cols-[minmax(0,1fr)_390px]' : ''}>
                            <div>
                                {page.title ? (
                                    <h2 className="text-[22px] leading-[1.15] font-extrabold text-[#0f3561] uppercase md:text-[36px]">
                                        {page.title}
                                    </h2>
                                ) : null}
                                {contentSlot ? (
                                    <div className="mt-5">{contentSlot}</div>
                                ) : (
                                    <article
                                        className="mt-5 text-base leading-[1.45] text-[#1b3858] md:text-lg [&_h2]:mb-3 [&_h2]:text-2xl [&_h2]:font-bold md:[&_h2]:text-3xl [&_h3]:mb-2 [&_h3]:text-xl [&_h3]:font-semibold md:[&_h3]:text-2xl [&_ul]:list-disc [&_ul]:pl-6 [&_ol]:list-decimal [&_ol]:pl-6 [&_p]:mb-4"
                                        dangerouslySetInnerHTML={{
                                            __html: DOMPurify.sanitize(
                                                page.content || '<p>Контент пока не заполнен.</p>',
                                            ),
                                        }}
                                    />
                                )}
                            </div>

                            {showSidebar ? <aside className="h-fit bg-[#ececec] p-6">
                                <div className="overflow-hidden">
                                    {services[sidebarIndex] ? (
                                        <a
                                            key={services[sidebarIndex].id}
                                            href={`/services/${services[sidebarIndex].slug}`}
                                            className={`block animate-in fade-in duration-300 ${sidebarDirection === 'next' ? 'slide-in-from-right-2' : 'slide-in-from-left-2'}`}
                                        >
                                            <h3 className="text-2xl leading-[1.1] font-extrabold text-[#0f2f52] md:text-3xl">
                                                {services[sidebarIndex].title}
                                            </h3>
                                            <div
                                                className="mt-4 text-sm leading-[1.35] text-[#24384f] md:text-base [&_ul]:list-disc [&_ul]:pl-5 [&_ol]:list-decimal [&_ol]:pl-5 [&_p]:mb-3"
                                                dangerouslySetInnerHTML={{
                                                    __html: DOMPurify.sanitize(
                                                        services[sidebarIndex].short_description ||
                                                        '<p>Описание услуги</p>',
                                                    ),
                                                }}
                                            />
                                        </a>
                                    ) : null}
                                </div>
                                <div className="mt-6 flex justify-end gap-2">
                                    <button
                                        type="button"
                                        disabled={!canPrevSidebar}
                                        onClick={() => {
                                            setSidebarDirection('prev');
                                            setSidebarIndex((v) => Math.max(0, v - 1));
                                        }}
                                        className="inline-flex h-12 w-12 items-center justify-center border border-[#1f3f63] text-[#1f3f63] transition hover:bg-[#dfe7f0] disabled:opacity-40"
                                        aria-label="Предыдущая услуга"
                                    >
                                        <ArrowLeft className="size-6" />
                                    </button>
                                    <button
                                        type="button"
                                        disabled={!canNextSidebar}
                                        onClick={() => {
                                            setSidebarDirection('next');
                                            setSidebarIndex((v) => Math.min(services.length - 1, v + 1));
                                        }}
                                        className="inline-flex h-12 w-12 items-center justify-center border border-[#1f3f63] text-[#1f3f63] transition hover:bg-[#dfe7f0] disabled:opacity-40"
                                        aria-label="Следующая услуга"
                                    >
                                        <ArrowRight className="size-6" />
                                    </button>
                                </div>
                            </aside> : null}
                        </div>
                    </div>
                </section>

                <SiteFooter company={company} services={services} />
            </SiteShell>

            <Dialog open={orderOpen} onOpenChange={setOrderOpen}>
                <DialogContent className="max-h-[92vh] w-[calc(100vw-1.5rem)] overflow-y-auto border-0 bg-[#0b5ea9] p-5 text-white sm:max-w-lg sm:p-6">
                    <DialogHeader>
                        <DialogTitle className="pr-8 text-2xl font-extrabold md:text-3xl">
                            Закажите сопровождение
                        </DialogTitle>
                        <DialogDescription className="text-sm text-[#d8e5f3] md:text-base">
                            Заполните форму, чтобы мы с вами связались для
                            обсуждения деталей
                        </DialogDescription>
                    </DialogHeader>
                    <form
                        onSubmit={(e) => {
                            e.preventDefault();
                            orderForm.post('/contact-messages', {
                                preserveScroll: true,
                                onSuccess: () => {
                                    setOrderOpen(false);
                                    orderForm.reset();
                                    setOrderSuccessVisible(true);
                                },
                            });
                        }}
                        className="space-y-4 sm:space-y-5"
                    >
                        <Field label="Ваше имя" id="order-name">
                            <Input
                                id="order-name"
                                value={orderForm.data.name}
                                onChange={(e) =>
                                    orderForm.setData('name', e.target.value)
                                }
                                className="h-11 rounded-none border-0 bg-white text-sm text-black md:h-12 md:text-base"
                            />
                            <FieldError message={orderForm.errors.name} />
                        </Field>
                        <Field label="Ваш телефон" id="order-phone">
                            <Input
                                id="order-phone"
                                type="tel"
                                inputMode="tel"
                                autoComplete="tel"
                                maxLength={18}
                                placeholder="+7 (___) ___-__-__"
                                pattern="\+7 \(\d{3}\) \d{3}-\d{2}-\d{2}"
                                value={orderForm.data.phone}
                                onChange={(e) =>
                                    orderForm.setData('phone', formatRuPhone(e.target.value))
                                }
                                className="h-11 rounded-none border-0 bg-white text-sm text-black md:h-12 md:text-base"
                            />
                            <FieldError message={orderForm.errors.phone} />
                        </Field>
                        <Field label="Ваш e-mail" id="order-email">
                            <Input
                                id="order-email"
                                type="email"
                                value={orderForm.data.email}
                                onChange={(e) =>
                                    orderForm.setData('email', e.target.value)
                                }
                                className="h-11 rounded-none border-0 bg-white text-sm text-black md:h-12 md:text-base"
                            />
                            <FieldError message={orderForm.errors.email} />
                        </Field>
                        <Field label="Выбор услуги" id="order-service">
                            <select
                                id="order-service"
                                value={orderForm.data.service_id}
                                onChange={(e) =>
                                    orderForm.setData(
                                        'service_id',
                                        e.target.value,
                                    )
                                }
                                className="h-11 w-full rounded-none border-0 bg-white px-3 text-sm text-black md:h-12 md:text-base"
                            >
                                <option value="">Выберите услугу</option>
                                {services.map((service) => (
                                    <option key={service.id} value={service.id}>
                                        {service.title}
                                    </option>
                                ))}
                            </select>
                            <FieldError message={orderForm.errors.service_id} />
                        </Field>
                        <Field
                            label="Краткое описание задачи"
                            id="order-message"
                        >
                            <textarea
                                id="order-message"
                                value={orderForm.data.message}
                                onChange={(e) =>
                                    orderForm.setData('message', e.target.value)
                                }
                                className="min-h-24 w-full rounded-none border-0 bg-white px-3 py-2 text-sm text-black md:min-h-28 md:text-base"
                            />
                            <FieldError message={orderForm.errors.message} />
                        </Field>
                        <label className="flex items-start gap-3 text-sm leading-5 text-[#d8e5f3]">
                            <input
                                type="checkbox"
                                checked={orderForm.data.policy_accepted}
                                onChange={(e) =>
                                    orderForm.setData(
                                        'policy_accepted',
                                        e.target.checked,
                                    )
                                }
                                className="mt-0.5 h-4 w-4 shrink-0 rounded border-white/60 bg-transparent accent-white"
                            />
                            Я согласен(а) на обработку данных в соответствии с
                            политикой конфиденциальности
                        </label>
                        <FieldError message={orderForm.errors.policy_accepted} />
                        <Button
                            type="submit"
                            className="h-11 w-full rounded-none bg-white text-lg font-bold text-black hover:bg-[#f1f5fb] md:h-12 md:text-xl"
                        >
                            Обсудить детали
                        </Button>
                    </form>
                </DialogContent>
            </Dialog>

            {orderSuccessVisible ? (
                <div className="fixed right-4 bottom-4 z-60 rounded-md border border-[#0f3561] bg-white px-4 py-3 text-sm font-semibold text-[#0f3561] shadow-lg">
                    Сообщение отправлено. Мы скоро свяжемся с вами.
                </div>
            ) : null}
        </>
    );
}

function Field({
    label,
    id,
    children,
}: {
    label: string;
    id: string;
    children: React.ReactNode;
}) {
    return (
        <div className="space-y-1">
            <Label htmlFor={id} className="text-base md:text-lg">
                {label}
            </Label>
            {children}
        </div>
    );
}

function FieldError({ message }: { message?: string }) {
    if (!message) return null;

    return <p className="text-xs text-[#ffd7d7]">{message}</p>;
}
