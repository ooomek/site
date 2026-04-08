import { ArrowRight, ChevronRight } from 'lucide-react';
import { useEffect, useRef, useState } from 'react';
import { SiteFooter } from '../components/site/site-footer';
import { SiteHeader } from '../components/site/site-header';
import { SiteShell } from '../components/site/site-shell';
import type {
  CompanyData,
  ServiceData,
  LicenseData,
  PartnerData,
} from '../components/site/types';
import { Button } from '../components/ui/button';
import { companyRu, servicesRu, licensesRu, partnersRu } from '../data/ru';
import {
    Dialog,
    DialogContent,
    DialogDescription,
    DialogHeader,
    DialogTitle,
} from '../components/ui/dialog';
import { Input } from '../components/ui/input';
import { Label } from '../components/ui/label';
import { formatRuPhone } from '../lib/phone-mask';




export default function Welcome({
    canonical,

}: {
    canonical: string;

}) {
    const [orderOpen, setOrderOpen] = useState(false);
    const [orderSuccessVisible, setOrderSuccessVisible] = useState(false);
    const [serviceIndex, setServiceIndex] = useState(0);
    const [licenseIndex, setLicenseIndex] = useState(0);
    const [partnerIndex, setPartnerIndex] = useState(0);
    const servicesViewportRef = useRef<HTMLDivElement | null>(null);
    const licensesViewportRef = useRef<HTMLDivElement | null>(null);
    const partnersViewportRef = useRef<HTMLDivElement | null>(null);
const [orderSubmitting, setOrderSubmitting] = useState(false);
    const PAGE_SERVICES = 4;
    const PAGE_LICENSES = 3;
    const PAGE_PARTNERS = 4;

    const email = 'info@expert-mek.com';

    const [orderForm, setOrderForm] = useState({
        name: "",
        phone: "",
        email: "",
        service_id: "",
        message: "",
        policy_accepted: false,
      });
      
      const [orderErrors, setOrderErrors] = useState<Record<string, string>>({});
      const setOrderField = (field: string, value: string | boolean) => {
        setOrderForm((prev) => ({
          ...prev,
          [field]: value,
        }));
      };
      const resetOrderForm = () => {
        setOrderForm({
          name: "",
          phone: "",
          email: "",
          service_id: "",
          message: "",
          policy_accepted: false,
        });
        setOrderErrors({});
      };
    useEffect(() => {
        if (!orderSuccessVisible) return;

        const timerId = window.setTimeout(() => {
            setOrderSuccessVisible(false);
        }, 4000);

        return () => window.clearTimeout(timerId);
    }, [orderSuccessVisible]);

    const canPrevServices = serviceIndex > 0;
    const canNextServices = serviceIndex + PAGE_SERVICES < servicesRu.length;

    const onPrevServices = () => {
        if (!canPrevServices) return;
        setServiceIndex((v) => Math.max(0, v - 1));
    };

    const onNextServices = () => {
        if (!canNextServices) return;
        setServiceIndex((v) =>
            Math.min(Math.max(0, servicesRu.length - PAGE_SERVICES), v + 1),
        );
    };

    const canPrevLicenses = licenseIndex > 0;
    const canNextLicenses = licenseIndex + PAGE_LICENSES < licensesRu.length;
;

    const onPrevLicenses = () => {
        if (!canPrevLicenses) return;
        setLicenseIndex((v) => Math.max(0, v - 1));
    };

    const onNextLicenses = () => {
        if (!canNextLicenses) return;
        setLicenseIndex((v) =>
            Math.min(Math.max(0, licensesRu.length - PAGE_LICENSES), v + 1),
        );
    };

    const canPrevPartners = partnerIndex > 0;
    const canNextPartners = partnerIndex + PAGE_PARTNERS < partnersRu.length;;

    const onPrevPartners = () => {
        if (!canPrevPartners) return;
        setPartnerIndex((v) => Math.max(0, v - 1));
    };

    const onNextPartners = () => {
        if (!canNextPartners) return;
        setPartnerIndex((v) =>
            Math.min(Math.max(0, partnersRu.length - PAGE_PARTNERS), v + 1),
        );
    };

    useEffect(() => {
        scrollViewportToIndex(servicesViewportRef.current, serviceIndex);
    }, [serviceIndex]);

    useEffect(() => {
        scrollViewportToIndex(licensesViewportRef.current, licenseIndex);
    }, [licenseIndex]);

    useEffect(() => {
        scrollViewportToIndex(partnersViewportRef.current, partnerIndex);
    }, [partnerIndex]);
    useEffect(() => {
        document.title = "Главная";
      
        const setMeta = (name: string, content: string) => {
          let element = document.querySelector(`meta[name="${name}"]`);
          if (!element) {
            element = document.createElement("meta");
            element.setAttribute("name", name);
            document.head.appendChild(element);
          }
          element.setAttribute("content", content);
        };
      
        const setCanonical = (href: string) => {
          let link = document.querySelector('link[rel="canonical"]') as HTMLLinkElement | null;
          if (!link) {
            link = document.createElement("link");
            link.setAttribute("rel", "canonical");
            document.head.appendChild(link);
          }
          link.setAttribute("href", href);
        };
      
        setMeta(
          "description",
          "Сопровождение и контроль изготовления оборудования для российских и зарубежных АЭС."
        );
        setMeta("robots", "index,follow");
        setCanonical(canonical);
      }, [canonical]);
      const handleOrderSubmit = async (e: React.FormEvent<HTMLFormElement>) => {
    e.preventDefault();

    const errors: Record<string, string> = {};

    if (!orderForm.name.trim()) errors.name = 'Введите имя';
    if (!orderForm.phone.trim()) errors.phone = 'Введите телефон';
    if (!orderForm.email.trim()) errors.email = 'Введите e-mail';
    if (!orderForm.message.trim()) errors.message = 'Введите сообщение';
    if (!orderForm.policy_accepted) {
        errors.policy_accepted = 'Необходимо согласие на обработку данных';
    }

    setOrderErrors(errors);

    if (Object.keys(errors).length > 0) return;

    try {
        setOrderSubmitting(true);

        const selectedService = servicesRu.find(
            (service) => String(service.id) === orderForm.service_id
        );

        const response = await fetch('https://ooomek.vercel.app/api/contact', {
            method: 'POST',
            headers: {
                'Content-Type': 'application/json',
            },
            body: JSON.stringify({
                name: orderForm.name,
                email: orderForm.email,
                phone: orderForm.phone,
                message: orderForm.message,
                service: selectedService?.title || '',
            }),
        });

        const result = await response.json();

        if (!response.ok || !result.success) {
            throw new Error(result.message || 'Ошибка при отправке сообщения');
        }

        setOrderOpen(false);
        resetOrderForm();
        setOrderSuccessVisible(true);
    } catch (error) {
        setOrderErrors({
            form:
                error instanceof Error
                    ? error.message
                    : 'Ошибка при отправке сообщения',
        });
    } finally {
        setOrderSubmitting(false);
    }
};
    return (
        <>


                     <SiteShell
                company={companyRu}
                services={servicesRu.map((service) => ({
                    id: service.id,
                    title: service.title,
                    slug: service.slug,
                }))}
            >
                

                <section className="relative overflow-hidden">
                    <div className="absolute inset-0 bg-[#f5f5f5] bg-[url('/images/background-image.png')] bg-repeat opacity-40" />

                    <div className="relative z-10">
                        <SiteHeader
                            email={email}
                            services={servicesRu}
                            presentationUrl="pdf/presentation.pdf"
                        />

                        <div className="mx-auto flex w-full max-w-[1320px] flex-col px-5 pt-[75px]">
                            <h1 className="max-w-[980px] text-[32px] leading-[1.1] font-extrabold tracking-[-0.02em] uppercase md:text-[52px]">
                                Сопровождение и контроль изготовления
                                оборудования
                            </h1>

                            <p className="mt-2 text-[22px] leading-[1.15] uppercase md:text-[36px]">
                                Для российских и зарубежных АЭС
                            </p>

                            <div className="relative mt-7 ml-[calc(50%-50vw)] h-[220px] w-screen overflow-hidden border-y border-[#dbe3ee] bg-white sm:h-[320px] md:h-[460px] lg:h-[600px]">
                                <img
                                    src="/images/main.png"
                                    alt="Главный баннер"
                                    fetchPriority="high"
                                    decoding="async"
                                    className="h-full w-full object-cover"
                                />

                                <div className="absolute inset-0">
                                    <div className="relative mx-auto h-full w-full max-w-[1320px]">
                                        <div className="absolute top-0 left-full h-12 w-[calc((100vw-1320px)/2+1.25rem)] -translate-x-5 bg-[#12345d] sm:h-16" />

                                        <div className="relative h-full px-5">
                                            <Button
                                                type="button"
                                                onClick={() =>
                                                    setOrderOpen(true)
                                                }
                                                className="absolute top-0 right-0 h-12 rounded-none bg-[#12345d] px-5 text-xs font-semibold text-white uppercase hover:bg-[#0d2747] sm:h-16 sm:px-10 sm:text-base"
                                            >
                                                Заказать услугу
                                                <ArrowRight className="size-4 sm:size-6" />
                                            </Button>
                                        </div>
                                    </div>
                                </div>
                            </div>
                        </div>
                    </div>
                </section>

                <section
                    id="services"
                    className="border-y border-[#d9e2ee] bg-white py-6"
                >
                    <div className="mx-auto w-full max-w-[1320px] px-4 sm:px-6 lg:px-8">
                        {/* Заголовок меньше */}
                        <div className="flex items-center justify-between">
                            <h2 className="text-2xl font-extrabold text-[#12345d] uppercase md:text-3xl">
                                Услуги
                            </h2>
                        </div>

                        {/* Лента + стрелки по краям */}
                        <div className="relative mt-4 overflow-visible">
                            {/* Левая стрелка (торчит наружу на 50%) */}
                            {servicesRu.length > PAGE_SERVICES ? (
                                <button
                                    type="button"
                                    disabled={!canPrevServices}
                                    onClick={onPrevServices}
                                    className="absolute top-1/2 left-0 z-10 inline-flex h-11 w-11 -translate-x-1/2 -translate-y-1/2 items-center justify-center border border-[#d9e2ee] bg-white transition disabled:opacity-40"
                                    aria-label="Предыдущие услуги"
                                >
                                    <ChevronRight className="size-5 rotate-180 text-[#12345d]" />
                                </button>
                            ) : null}

                            {/* Правая стрелка */}
                            {servicesRu.length > PAGE_SERVICES ? (
                                <button
                                    type="button"
                                    disabled={!canNextServices}
                                    onClick={onNextServices}
                                    className="absolute top-1/2 right-0 z-10 inline-flex h-11 w-11 translate-x-1/2 -translate-y-1/2 items-center justify-center border border-[#d9e2ee] bg-white transition disabled:opacity-40"
                                    aria-label="Следующие услуги"
                                >
                                    <ChevronRight className="size-5 text-[#12345d]" />
                                </button>
                            ) : null}

                            <div className="relative overflow-hidden px-6 md:px-0">
                                <div
                                    ref={servicesViewportRef}
                                    className="overflow-x-hidden scroll-smooth"
                                >
                                    <div className="flex gap-0">
                                        {servicesRu.map((item) => (
                                            <a
                                                key={item.id}
                                                href={`/services/${item.slug}`}
                                                className={[
                                                    'block min-w-full px-6 py-4 md:min-w-1/2 xl:min-w-1/4',
                                                    'xl:min-h-[140px]',
                                                    'block transition-colors hover:bg-[#f7fbff]',
                                                    'xl:border-x xl:border-[#d9e2ee]',
                                                ].join(' ')}
                                            >
                                                <div className="flex items-start gap-4">
                                                    {item.icon_url ? (
                                                        <img
                                                            src={item.icon_url}
                                                            alt={item.title}
                                                            loading="lazy"
                                                            decoding="async"
                                                            className="h-[65px] w-[65px] object-contain"
                                                        />
                                                    ) : (

                                                        <div className="h-[65px] w-[65px] bg-[#e7eff8]" />
                                                    )}

                                                    <div>
                                                        <h3 className="text-sm font-extrabold text-[#12345d] uppercase">
                                                            {item.title}
                                                        </h3>

                                                        <div
                                                            className="mt-1 text-xs leading-5 text-[#334a64] [&_ol]:list-decimal [&_ol]:pl-5 [&_ul]:list-disc [&_ul]:pl-5"
                                                        >
                                                            {item.short_description}
                                                        </div>
                                                    </div>
                                                </div>
                                            </a>
                                        ))}
                                    </div>
                                </div>
                            </div>
                        </div>
                    </div>
                </section>

                <section className="bg-[#0b5ea9] py-10">
                    <div className="mx-auto w-full max-w-[1320px] px-4 sm:px-6 lg:px-8">
                        <CarouselHead
                            title="Лицензии"
                            dark
                            canPrev={canPrevLicenses}
                            canNext={canNextLicenses}
                            onPrev={onPrevLicenses}
                            onNext={onNextLicenses}
                            hidden={licensesRu.length <= 3}
                        />
                        <div className="relative mt-5 overflow-hidden">
                            <div
                                ref={licensesViewportRef}
                                className="overflow-x-hidden scroll-smooth"
                            >
                                <div className="flex gap-4">
                                    {licensesRu.map((item) => (
                                        <article
                                            key={item.id}
                                            className="min-w-full bg-[#12345d] p-5 text-white transition duration-300 hover:-translate-y-1 lg:min-w-[calc((100%-2rem)/3)]"
                                        >
                                            <div className="mx-auto flex h-56 w-44 items-center justify-center overflow-hidden bg-white">
                                                {item.image_url ? (
                                                    <img
                                                        src={item.image_url}
                                                        alt={item.title}
                                                        loading="lazy"
                                                        decoding="async"
                                                        className="h-full w-full object-contain"
                                                    />
                                                ) : (
                                                    <span className="text-sm text-[#12345d]">
                                                        Нет изображения
                                                    </span>
                                                )}
                                            </div>
                                            <h3 className="mt-4 text-sm leading-tight font-extrabold">
                                                {item.title}
                                            </h3>
                                            <div
                                                className="mt-3 text-xs leading-6 text-[#d8e5f3]"
                                            
                                            >
                                                {item.description}
                                            </div>
                                            {item.document_url ? (
                                                <a
                                                    href={item.document_url}
                                                    target="_blank"
                                                    rel="noreferrer"
                                                    className="mt-4 inline-flex text-sm font-semibold underline underline-offset-4"
                                                >
                                                    Открыть документ
                                                </a>
                                            ) : null}
                                        </article>
                                    ))}
                                </div>
                            </div>
                        </div>
                    </div>
                </section>
                <section className="bg-white py-10">
                    <div className="mx-auto w-full max-w-[1320px] px-4 sm:px-6 lg:px-8">
                        <CarouselHead
                            title="Наши партнеры"
                            canPrev={canPrevPartners}
                            canNext={canNextPartners}
                            onPrev={onPrevPartners}
                            onNext={onNextPartners}
                            hidden={partnersRu.length <= PAGE_PARTNERS}
                        />
                        <div className="relative mt-5 overflow-hidden">
                            <div
                                ref={partnersViewportRef}
                                className="overflow-x-hidden scroll-smooth"
                            >
                                <div className="flex gap-4">
                                    {partnersRu.map((partner) => (
                                        <a
                                            key={partner.id}
                                            href={partner.url || '#'}
                                            target={
                                                partner.url
                                                    ? '_blank'
                                                    : undefined
                                            }
                                            rel={
                                                partner.url
                                                    ? 'noreferrer'
                                                    : undefined
                                            }
                                            className="flex h-28 min-w-[calc((100%-1rem)/2)] items-center justify-center border border-[#dce5f0] bg-white p-4 transition duration-300 hover:-translate-y-1 lg:min-w-[calc((100%-3rem)/4)]"
                                        >
                                            {partner.logo_url ? (
                                                <img
                                                    src={partner.logo_url}
                                                    alt={partner.name}
                                                    loading="lazy"
                                                    decoding="async"
                                                    className="max-h-full max-w-full object-contain"
                                                />
                                            ) : (
                                                <span className="text-center text-sm font-semibold">
                                                    {partner.name}
                                                </span>
                                            )}
                                        </a>
                                    ))}
                                </div>
                            </div>
                        </div>
                    </div>
                </section>

                <section
                    id="project-geography"
                    className="relative overflow-hidden"
                >
                    {/* фон не перехватывает клики */}
                    <div className="pointer-events-none absolute inset-0 bg-[#f5f5f5] bg-[url('/images/background-image.png')] bg-repeat opacity-40" />

                    {/* заголовок в контейнере */}
                    <div className="relative mx-auto w-full max-w-[1320px] px-4 pt-[75px] sm:px-6 lg:px-8">
                        <h2 className="text-2xl font-extrabold text-[#12345d] uppercase md:text-3xl">
                            География проектов
                        </h2>
                    </div>

                    {/* карта на 100% экрана */}
                    <div className="relative z-20 mt-6 ml-[calc(50%-50vw)] w-screen">
                        <YandexConstructorMap />
                    </div>
                </section>
                <SiteFooter
                    company={companyRu}
                    services={servicesRu.map((service) => ({
                        id: service.id,
                        title: service.title,
                        slug: service.slug,
                    }))}
                />


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
                    <form onSubmit={handleOrderSubmit} className="space-y-4 sm:space-y-5">
                        <Field label="Ваше имя" id="order-name">
    <Input
        id="order-name"
        value={orderForm.name}
        onChange={(e) => setOrderField('name', e.target.value)}
        className="h-11 rounded-none border-0 bg-white text-sm text-black md:h-12 md:text-base"
    />
    <FieldError message={orderErrors.name} />
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
        value={orderForm.phone}
        onChange={(e) =>
            setOrderField('phone', formatRuPhone(e.target.value))
        }
        className="h-11 rounded-none border-0 bg-white text-sm text-black md:h-12 md:text-base"
    />
    <FieldError message={orderErrors.phone} />
</Field>
                        <Field label="Ваш e-mail" id="order-email">
    <Input
        id="order-email"
        type="email"
        value={orderForm.email}
        onChange={(e) => setOrderField('email', e.target.value)}
        className="h-11 rounded-none border-0 bg-white text-sm text-black md:h-12 md:text-base"
    />
    <FieldError message={orderErrors.email} />
</Field>
                        <Field label="Выбор услуги" id="order-service">
    <select
        id="order-service"
        value={orderForm.service_id}
        onChange={(e) => setOrderField('service_id', e.target.value)}
        className="h-11 w-full rounded-none border-0 bg-white px-3 text-sm text-black md:h-12 md:text-base"
    >
        <option value="">Выберите услугу</option>
        {servicesRu.map((service) => (
            <option key={service.id} value={service.id}>
                {service.title}
            </option>
        ))}
    </select>
    <FieldError message={orderErrors.service_id} />
</Field>
                        <Field label="Краткое описание задачи" id="order-message">
    <textarea
        id="order-message"
        value={orderForm.message}
        onChange={(e) => setOrderField('message', e.target.value)}
        className="min-h-24 w-full rounded-none border-0 bg-white px-3 py-2 text-sm text-black md:min-h-28 md:text-base"
    />
    <FieldError message={orderErrors.message} />
</Field>
                        <label className="flex items-start gap-3 text-sm leading-5 text-[#d8e5f3]">
    <input
        type="checkbox"
        checked={orderForm.policy_accepted}
        onChange={(e) =>
            setOrderField('policy_accepted', e.target.checked)
        }
        className="mt-0.5 h-4 w-4 shrink-0 rounded border-white/60 bg-transparent accent-white"
    />
    Я согласен(а) на обработку данных в соответствии с политикой конфиденциальности
</label>
<FieldError message={orderErrors.policy_accepted} />
<FieldError message={orderErrors.form} />
<Button
    type="submit"
    disabled={orderSubmitting}
    className="h-11 w-full rounded-none bg-white text-lg font-bold text-black hover:bg-[#f1f5fb] disabled:opacity-70 md:h-12 md:text-xl"
>
    {orderSubmitting ? 'Отправка...' : 'Обсудить детали'}
</Button>
                    </form>
                </DialogContent>
            </Dialog>
            {orderSuccessVisible ? (
                <div className="fixed right-4 bottom-4 z-60 rounded-md border border-[#0f3561] bg-white px-4 py-3 text-sm font-semibold text-[#0f3561] shadow-lg">
                    Сообщение отправлено. Мы скоро свяжемся с вами.
                </div>
            ) : null}
             </SiteShell>
        </>
    );
}

function CarouselHead({
    title,
    canPrev,
    canNext,
    onPrev,
    onNext,
    hidden = false,
    dark = false,
}: {
    title: string;
    canPrev: boolean;
    canNext: boolean;
    onPrev: () => void;
    onNext: () => void;
    hidden?: boolean;
    dark?: boolean;
}) {
    return (
        <div className="flex items-center justify-between">
            <h2
                className={`text-2xl font-extrabold uppercase md:text-3xl ${dark ? 'text-white' : 'text-[#12345d]'}`}
            >
                {title}
            </h2>
            {hidden ? null : (
                <div className="flex items-center gap-2">
                    <button
                        type="button"
                        disabled={!canPrev}
                        onClick={onPrev}
                        className={`inline-flex h-11 w-11 items-center justify-center border transition disabled:opacity-40 ${dark ? 'border-white/40 text-white' : 'border-[#19416d] text-[#19416d]'}`}
                    >
                        <ChevronRight className="size-5 rotate-180" />
                    </button>
                    <button
                        type="button"
                        disabled={!canNext}
                        onClick={onNext}
                        className={`inline-flex h-11 w-11 items-center justify-center border transition disabled:opacity-40 ${dark ? 'border-white/40 text-white' : 'border-[#19416d] text-[#19416d]'}`}
                    >
                        <ChevronRight className="size-5" />
                    </button>
                </div>
            )}
        </div>
    );
}

function YandexConstructorMap() {
    const sectionRef = useRef<HTMLDivElement | null>(null);
    const [mapEnabled, setMapEnabled] = useState(false);

    useEffect(() => {
        if (!sectionRef.current || mapEnabled) return;

        const observer = new IntersectionObserver(
            (entries) => {
                if (entries.some((entry) => entry.isIntersecting)) {
                    setMapEnabled(true);
                    observer.disconnect();
                }
            },
            { rootMargin: '600px 0px' },
        );

        observer.observe(sectionRef.current);

        return () => observer.disconnect();
    }, [mapEnabled]);

    return (
        <div
            ref={sectionRef}
            className="relative h-[420px] w-full overflow-hidden yandex-constructor-map md:h-[560px] lg:h-[720px]"
        >
            {mapEnabled ? (
                <iframe
                    title="География проектов"
                    src="https://yandex.ru/map-widget/v1/?lang=ru_RU&scroll=false&source=constructor-api&um=constructor%3A68b5f5515158c26c554d5801e0c2c898edb710bcdab9eb6752de7068f7669943"
                    loading="lazy"
                    allowFullScreen
                    className="h-full w-full border-0"
                />
            ) : (
                <div className="flex h-full w-full items-center justify-center bg-[#e7e7e7] text-sm font-semibold text-[#12345d]">
                    Карта загрузится при прокрутке к этому блоку
                </div>
            )}
        </div>
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
            <Label htmlFor={id} className="text-lg md:text-xl">
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

function scrollViewportToIndex(viewport: HTMLDivElement | null, index: number) {
    if (!viewport) return;
    const track = viewport.firstElementChild as HTMLElement | null;
    if (!track) return;
    const child = track.children.item(index) as HTMLElement | null;
    if (!child) return;

    animateHorizontalScroll(viewport, child.offsetLeft, 420);
}

const activeScrollAnimations = new WeakMap<HTMLElement, number>();

function animateHorizontalScroll(
    element: HTMLElement,
    targetLeft: number,
    durationMs = 420,
) {
    const startLeft = element.scrollLeft;
    const distance = targetLeft - startLeft;

    if (Math.abs(distance) < 1) return;

    const previousFrame = activeScrollAnimations.get(element);
    if (previousFrame) {
        cancelAnimationFrame(previousFrame);
    }

    const startAt = performance.now();

    const easeOutCubic = (t: number) => 1 - Math.pow(1 - t, 3);

    const tick = (now: number) => {
        const elapsed = now - startAt;
        const progress = Math.min(1, elapsed / durationMs);
        const eased = easeOutCubic(progress);

        element.scrollLeft = startLeft + distance * eased;

        if (progress < 1) {
            const frame = requestAnimationFrame(tick);
            activeScrollAnimations.set(element, frame);
            return;
        }

        activeScrollAnimations.delete(element);
    };

    const frame = requestAnimationFrame(tick);
    activeScrollAnimations.set(element, frame);
}
