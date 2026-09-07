import { ArrowRight, ChevronRight } from "lucide-react";
import { useEffect, useRef, useState } from "react";
import { SiteFooter } from "../components/site/site-footer";
import { SiteHeader } from "../components/site/site-header";
import { SiteShell } from "../components/site/site-shell";

import { Button } from "../components/ui/button";
import { useSiteData } from "../data";
import { useLanguage } from "../lib/language";
import {
  Dialog,
  DialogContent,
  DialogDescription,
  DialogHeader,
  DialogTitle,
} from "../components/ui/dialog";
import { Input } from "../components/ui/input";
import { Label } from "../components/ui/label";
import { formatRuPhone } from "../lib/phone-mask";

export default function Welcome({ canonical }: { canonical: string }) {
  const { language, t, localizePath } = useLanguage();
  const { company, services, licenses, partners, certificate } = useSiteData();
  const [orderOpen, setOrderOpen] = useState(false);
  const [orderSuccessVisible, setOrderSuccessVisible] = useState(false);
  const [serviceIndex, setServiceIndex] = useState(0);
  const [licenseIndex, setLicenseIndex] = useState(0);
  const [partnerIndex, setPartnerIndex] = useState(0);
  const servicesViewportRef = useRef<HTMLDivElement | null>(null);
  const licensesViewportRef = useRef<HTMLDivElement | null>(null);
  const partnersViewportRef = useRef<HTMLDivElement | null>(null);
  const [orderSubmitting, setOrderSubmitting] = useState(false);
  const [PAGE_SERVICES, setServicesPerPage] = useState(() => window.innerWidth >= 1280 ? 4 : window.innerWidth >= 768 ? 2 : 1);
  const PAGE_LICENSES = 3;
  const [PAGE_PARTNERS, setPartnersPerPage] = useState(() => window.innerWidth >= 1024 ? 4 : 2);

  useEffect(() => {
    const onResize = () => {
      const serviceCount = window.innerWidth >= 1280 ? 4 : window.innerWidth >= 768 ? 2 : 1;
      const partnerCount = window.innerWidth >= 1024 ? 4 : 2;
      setServicesPerPage(serviceCount);
      setPartnersPerPage(partnerCount);
      setServiceIndex(index => Math.min(index, Math.max(0, services.length - serviceCount)));
      setPartnerIndex(index => Math.min(index, Math.max(0, partners.length - partnerCount)));
    };
    window.addEventListener('resize', onResize);
    return () => window.removeEventListener('resize', onResize);
  }, [services.length, partners.length]);

  const email = "info@expert-mek.com";

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
  const canNextServices = serviceIndex + PAGE_SERVICES < services.length;

  const onPrevServices = () => {
    if (!canPrevServices) return;
    setServiceIndex((v) => Math.max(0, v - 1));
  };

  const onNextServices = () => {
    if (!canNextServices) return;
    setServiceIndex((v) =>
      Math.min(Math.max(0, services.length - PAGE_SERVICES), v + 1),
    );
  };

  const canPrevLicenses = licenseIndex > 0;
  const canNextLicenses = licenseIndex + PAGE_LICENSES < licenses.length;
  const onPrevLicenses = () => {
    if (!canPrevLicenses) return;
    setLicenseIndex((v) => Math.max(0, v - 1));
  };

  const onNextLicenses = () => {
    if (!canNextLicenses) return;
    setLicenseIndex((v) =>
      Math.min(Math.max(0, licenses.length - PAGE_LICENSES), v + 1),
    );
  };

  const canPrevPartners = partnerIndex > 0;
  const canNextPartners = partnerIndex + PAGE_PARTNERS < partners.length;

  const onPrevPartners = () => {
    if (!canPrevPartners) return;
    setPartnerIndex((v) => Math.max(0, v - 1));
  };

  const onNextPartners = () => {
    if (!canNextPartners) return;
    setPartnerIndex((v) =>
      Math.min(Math.max(0, partners.length - PAGE_PARTNERS), v + 1),
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
    document.title = t("Главная", "MEK — Home");

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
      let link = document.querySelector(
        'link[rel="canonical"]',
      ) as HTMLLinkElement | null;
      if (!link) {
        link = document.createElement("link");
        link.setAttribute("rel", "canonical");
        document.head.appendChild(link);
      }
      link.setAttribute("href", href);
    };

    setMeta(
      "description",
      t("Сопровождение и контроль изготовления оборудования для российских и зарубежных АЭС.", "Manufacturing support and equipment inspection for nuclear power plants in Russia and worldwide."),
    );
    setMeta("robots", "index,follow");
    setCanonical(localizePath(canonical));
  }, [canonical, t, localizePath]);
  const handleOrderSubmit = async (e: React.FormEvent<HTMLFormElement>) => {
    e.preventDefault();

    const errors: Record<string, string> = {};

    if (!orderForm.name.trim()) errors.name = t("Введите имя", "Enter your name");
    if (!orderForm.phone.trim()) errors.phone = t("Введите телефон", "Enter your phone number");
    if (!orderForm.email.trim()) errors.email = t("Введите e-mail", "Enter your email address");
    if (orderForm.phone.trim() && (language === "ru"
      ? !/^\+7 \(\d{3}\) \d{3}-\d{2}-\d{2}$/.test(orderForm.phone)
      : !/^\+?[\d\s().-]{7,30}$/.test(orderForm.phone) || orderForm.phone.replace(/\D/g, "").length < 7)) {
      errors.phone = t("Введите корректный номер телефона", "Enter a valid phone number");
    }
    if (orderForm.email.trim() && !/^[^\s@]+@[^\s@]+\.[^\s@]+$/.test(orderForm.email)) {
      errors.email = t("Введите корректный e-mail", "Enter a valid email address");
    }
    if (!orderForm.message.trim()) errors.message = t("Введите сообщение", "Enter your message");
    if (!orderForm.policy_accepted) {
      errors.policy_accepted = t("Необходимо согласие на обработку данных", "Please consent to the processing of your personal data");
    }

    setOrderErrors(errors);

    if (Object.keys(errors).length > 0) return;

    try {
      setOrderSubmitting(true);

      const selectedService = services.find(
        (service) => String(service.id) === orderForm.service_id,
      );

      const response = await fetch("https://ooomek.vercel.app/api/contact", {
        method: "POST",
        headers: {
          "Content-Type": "application/json",
        },
        body: JSON.stringify({
          name: orderForm.name,
          email: orderForm.email,
          phone: orderForm.phone,
          message: orderForm.message,
          service: selectedService?.title || "",
        }),
      });

      const result = await response.json();

      if (!response.ok || !result.success) {
        throw new Error(result.message || t("Ошибка при отправке сообщения", "Your message could not be sent. Please try again or email us."));
      }

      setOrderOpen(false);
      resetOrderForm();
      setOrderSuccessVisible(true);
    } catch {
      setOrderErrors({
        form: t("Ошибка при отправке сообщения", "Your message could not be sent. Please try again or email us."),
      });
    } finally {
      setOrderSubmitting(false);
    }
  };
  return (
    <>
      <SiteShell
        company={company}
        services={services.map((service) => ({
          id: service.id,
          title: service.title,
          slug: service.slug,
        }))}
      >
        <SiteHeader email={email} services={services} presentationUrl="/pdf/presentation.pdf" />
        <main>
        <section className="relative isolate overflow-hidden bg-brand-navy text-white">
          <img src="/images/BG.png" alt="" fetchPriority="high" decoding="async" width="1536" height="1024" className="absolute inset-0 -z-20 h-full w-full object-cover object-[62%_center]" />
          <div className="absolute inset-0 -z-10 bg-[linear-gradient(90deg,rgba(10,23,49,0.94)_0%,rgba(10,23,49,0.83)_38%,rgba(10,23,49,0.24)_75%,rgba(10,23,49,0.1)_100%)]" />
          <div className="mx-auto flex min-h-[540px] w-full max-w-[1320px] flex-col justify-center px-5 py-16 sm:min-h-[590px] lg:min-h-[650px] lg:py-24">
            <div className="mb-7 h-1 w-16 bg-brand-orange" />
            <h1 className="max-w-[760px] text-[clamp(1.85rem,3.8vw,3.25rem)] leading-[1.12] font-bold tracking-[-0.025em] uppercase">
              {t("Сопровождение и контроль изготовления оборудования", "Equipment manufacturing support and inspection")}
            </h1>
            <p className="mt-6 max-w-[560px] text-lg leading-relaxed text-white/85 sm:text-xl">
              {t("Для российских и зарубежных АЭС", "For nuclear power plants in Russia and worldwide")}
            </p>
            <Button type="button" onClick={() => setOrderOpen(true)} className="mt-9 h-14 w-fit rounded-none bg-brand-orange px-7 text-sm font-bold text-brand-navy uppercase hover:bg-[#ff942e] sm:text-base">
              {t("Заказать услугу", "Request a service")} <ArrowRight className="ml-3 size-5" />
            </Button>
          </div>
        </section>

        <section
          id="services"
          className="border-y border-[#d9e2ee] bg-white py-6"
        >
          <div className="mx-auto w-full max-w-[1320px] px-4 sm:px-6 lg:px-8">
            {/* Заголовок меньше */}
            <div className="flex items-center justify-between">
              <h2 className="text-2xl font-extrabold text-[#101e3d] uppercase md:text-3xl">
                {t("Услуги", "Services")}
              </h2>
            </div>

            {/* Лента + стрелки по краям */}
            <div className="relative mt-4 overflow-visible">
              {/* Левая стрелка (торчит наружу на 50%) */}
              {services.length > PAGE_SERVICES ? (
                <button
                  type="button"
                  disabled={!canPrevServices}
                  onClick={onPrevServices}
                  className="absolute top-1/2 left-0 z-10 inline-flex h-11 w-11 sm:-translate-x-1/2 -translate-y-1/2 items-center justify-center border border-[#d9e2ee] bg-white transition disabled:opacity-40"
                  aria-label={t("Предыдущие услуги", "Previous services")}
                >
                  <ChevronRight className="size-5 rotate-180 text-[#101e3d]" />
                </button>
              ) : null}

              {/* Правая стрелка */}
              {services.length > PAGE_SERVICES ? (
                <button
                  type="button"
                  disabled={!canNextServices}
                  onClick={onNextServices}
                  className="absolute top-1/2 right-0 z-10 inline-flex h-11 w-11 sm:translate-x-1/2 -translate-y-1/2 items-center justify-center border border-[#d9e2ee] bg-white transition disabled:opacity-40"
                  aria-label={t("Следующие услуги", "Next services")}
                >
                  <ChevronRight className="size-5 text-[#101e3d]" />
                </button>
              ) : null}

              <div className="relative overflow-hidden px-6 md:px-0">
                <div
                  ref={servicesViewportRef}
                  className="overflow-x-hidden scroll-smooth"
                >
                  <div className="flex gap-0">
                    {services.map((item) => (
                      <a
                        key={item.id}
                        href={localizePath(`/services/${item.slug}`)}
                        className={[
                          "block min-w-full px-6 py-4 md:min-w-1/2 xl:min-w-1/4",
                          "xl:min-h-[140px]",
                          "block transition-colors hover:bg-[#f7fbff]",
                          "xl:border-x xl:border-[#d9e2ee]",
                        ].join(" ")}
                      >
                        <div className="flex flex-col items-start gap-4 sm:flex-row">
                          {item.icon_url ? (
                            <span className={`isolate block h-[52px] w-[52px] shrink-0 ${item.id === 1 ? '' : 'bg-brand-orange'}`}>
                            <img
                              src={item.icon_url}
                              alt={item.title}
                              loading="lazy"
                              decoding="async"
                              className={`h-full w-full ${item.id === 1
                                ? 'object-contain [filter:brightness(0)_saturate(100%)_invert(51%)_sepia(100%)_saturate(2900%)_hue-rotate(1deg)_brightness(106%)_contrast(105%)]'
                                : 'object-cover bg-white mix-blend-screen [filter:grayscale(1)_contrast(3)]'}`}
                            />
                            </span>
                          ) : (
                            <div className="h-[65px] w-[65px] bg-[#e7eff8]" />
                          )}

                          <div>
                            <h3 className="text-sm font-extrabold text-[#101e3d] uppercase">
                              {item.title}
                            </h3>

                            <div className="mt-1 text-sm leading-5 text-[#334a64] [&_ol]:list-decimal [&_ol]:pl-5 [&_ul]:list-disc [&_ul]:pl-5">
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

 <section className="bg-[#101e3d] py-10">
  <div className="mx-auto w-full max-w-[1320px] px-4 sm:px-6 lg:px-8">
    <CarouselHead
      title={t("Лицензии", "Licenses")}
      dark
      canPrev={canPrevLicenses}
      canNext={canNextLicenses}
      onPrev={onPrevLicenses}
      onNext={onNextLicenses}
      hidden={licenses.length <= 3}
    />

    <div className="relative mt-5 overflow-hidden">
      <div
        ref={licensesViewportRef}
        className="overflow-x-auto scroll-smooth lg:overflow-x-hidden"
      >
        <div className="flex gap-4">
          {licenses.map((item) => (
            <article
              key={item.id}
              className="w-[85%] shrink-0 border border-white/15 bg-[#192b4d] p-5 text-white transition duration-300 hover:-translate-y-1 sm:w-[60%] lg:w-[calc((100%-2rem)/3)]"
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
                  <span className="text-sm text-[#101e3d]">
                    {t("Нет изображения", "No image available")}
                  </span>
                )}
              </div>

              <h3 className="mt-4 text-sm leading-tight font-extrabold">
                {item.title}
              </h3>

              <div className="mt-3 text-sm leading-6 text-[#d8e5f3]">
                {item.description}
              </div>

              {item.document_url ? (
                <a
                  href={item.document_url}
                  target="_blank"
                  rel="noreferrer"
                  className="mt-4 inline-flex text-sm font-semibold text-brand-orange underline underline-offset-4 hover:text-[#ffb16b]"
                >
                  {t("Открыть документ", "Open document")}
                </a>
              ) : null}
            </article>
          ))}
        </div>
      </div>
    </div>
  </div>
</section>
 <section className="bg-[#101e3d] py-10">
  <div className="mx-auto w-full max-w-[1320px] px-4 sm:px-6 lg:px-8">
    <CarouselHead
      title={t("Сертификаты соответствия", "Certificates of conformity")}
      dark
      canPrev={canPrevLicenses}
      canNext={canNextLicenses}
      onPrev={onPrevLicenses}
      onNext={onNextLicenses}
      hidden={certificate.length <= 3}
    />

    <div className="relative mt-5 overflow-hidden">
      <div

        className="overflow-x-auto scroll-smooth lg:overflow-x-hidden"
      >
        <div className="flex gap-4">
          {certificate.map((item) => (
            <article
              key={item.id}
              className="w-[85%] shrink-0 border border-white/15 bg-[#192b4d] p-5 text-white transition duration-300 hover:-translate-y-1 sm:w-[60%] lg:w-[calc((100%-2rem)/3)]"
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
                  <span className="text-sm text-[#101e3d]">
                    {t("Нет изображения", "No image available")}
                  </span>
                )}
              </div>

              <h3 className="mt-4 text-sm leading-tight font-extrabold">
                {item.title}
              </h3>

              <div className="mt-3 text-sm leading-6 text-[#d8e5f3]">
                {item.description}
              </div>

              {item.document_url ? (
                <a
                  href={item.document_url}
                  target="_blank"
                  rel="noreferrer"
                  className="mt-4 inline-flex text-sm font-semibold text-brand-orange underline underline-offset-4 hover:text-[#ffb16b]"
                >
                  {t("Открыть документ", "Open document")}
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
              title={t("Наши партнеры", "Our partners")}
              canPrev={canPrevPartners}
              canNext={canNextPartners}
              onPrev={onPrevPartners}
              onNext={onNextPartners}
              hidden={partners.length <= PAGE_PARTNERS}
            />
            <div className="relative mt-5 overflow-hidden">
              <div
                ref={partnersViewportRef}
                className="overflow-x-hidden scroll-smooth"
              >
                <div className="flex gap-4">
                  {partners.map((partner) => (
                    <a
                      key={partner.id}
                      href={partner.url || "#"}
                      target={partner.url ? "_blank" : undefined}
                      rel={partner.url ? "noreferrer" : undefined}
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

        <section id="project-geography" className="relative overflow-hidden">
          {/* фон не перехватывает клики */}
          <div className="pointer-events-none absolute inset-0 bg-[#f3f5f9]" />

          {/* заголовок в контейнере */}
          <div className="relative mx-auto w-full max-w-[1320px] px-4 pt-[75px] sm:px-6 lg:px-8">
            <h2 className="text-2xl font-extrabold text-[#101e3d] uppercase md:text-3xl">
              {t("География проектов", "Project locations")}
            </h2>
          </div>

          {/* карта на 100% экрана */}
          <div className="relative z-20 mt-6 ml-[calc(50%-50vw)] w-screen">
            <YandexConstructorMap />
          </div>
        </section>
        </main>
        <SiteFooter
          company={company}
          services={services.map((service) => ({
            id: service.id,
            title: service.title,
            slug: service.slug,
          }))}
        />

        <Dialog open={orderOpen} onOpenChange={setOrderOpen}>
          <DialogContent className="max-h-[92vh] w-[calc(100vw-1.5rem)] overflow-y-auto border-0 bg-[#101e3d] p-5 text-white sm:max-w-lg sm:p-6">
            <DialogHeader>
              <DialogTitle className="pr-8 text-2xl font-extrabold md:text-3xl">
                {t("Закажите сопровождение", "Discuss your project")}
              </DialogTitle>
              <DialogDescription className="text-sm text-[#d8e5f3] md:text-base">
                {t("Заполните форму, чтобы мы с вами связались для обсуждения деталей", "Complete the form and we will contact you to discuss the details.")}
              </DialogDescription>
            </DialogHeader>
            <form
              onSubmit={handleOrderSubmit}
              noValidate
              className="space-y-4 sm:space-y-5"
            >
              <Field label={t("Ваше имя", "Your name")} id="order-name">
                <Input
                  id="order-name"
                  value={orderForm.name}
                  onChange={(e) => setOrderField("name", e.target.value)}
                  className="h-11 rounded-none border-0 bg-white text-sm text-black md:h-12 md:text-base"
                />
                <FieldError message={orderErrors.name} />
              </Field>
              <Field label={t("Ваш телефон", "Your phone number")} id="order-phone">
                <Input
                  id="order-phone"
                  type="tel"
                  inputMode="tel"
                  autoComplete="tel"
                  maxLength={language === "ru" ? 18 : 30}
                  placeholder="+7 (___) ___-__-__"
                  pattern={language === "ru" ? "\\+7 \\(\\d{3}\\) \\d{3}-\\d{2}-\\d{2}" : undefined}
                  value={orderForm.phone}
                  onChange={(e) =>
                    setOrderField("phone", language === "ru" ? formatRuPhone(e.target.value) : e.target.value)
                  }
                  className="h-11 rounded-none border-0 bg-white text-sm text-black md:h-12 md:text-base"
                />
                <FieldError message={orderErrors.phone} />
              </Field>
              <Field label={t("Ваш e-mail", "Your email")} id="order-email">
                <Input
                  id="order-email"
                  type="email"
                  value={orderForm.email}
                  onChange={(e) => setOrderField("email", e.target.value)}
                  className="h-11 rounded-none border-0 bg-white text-sm text-black md:h-12 md:text-base"
                />
                <FieldError message={orderErrors.email} />
              </Field>
              <Field label={t("Выбор услуги", "Service")} id="order-service">
                <select
                  id="order-service"
                  value={orderForm.service_id}
                  onChange={(e) => setOrderField("service_id", e.target.value)}
                  className="h-11 w-full rounded-none border-0 bg-white px-3 text-sm text-black md:h-12 md:text-base"
                >
                  <option value="">{t("Выберите услугу", "Select a service")}</option>
                  {services.map((service) => (
                    <option key={service.id} value={service.id}>
                      {service.title}
                    </option>
                  ))}
                </select>
                <FieldError message={orderErrors.service_id} />
              </Field>
              <Field label={t("Краткое описание задачи", "Brief project description")} id="order-message">
                <textarea
                  id="order-message"
                  value={orderForm.message}
                  onChange={(e) => setOrderField("message", e.target.value)}
                  className="min-h-24 w-full rounded-none border-0 bg-white px-3 py-2 text-sm text-black md:min-h-28 md:text-base"
                />
                <FieldError message={orderErrors.message} />
              </Field>
              <label className="flex items-start gap-3 text-sm leading-5 text-[#d8e5f3]">
                <input
                  type="checkbox"
                  checked={orderForm.policy_accepted}
                  onChange={(e) =>
                    setOrderField("policy_accepted", e.target.checked)
                  }
                  className="mt-0.5 h-4 w-4 shrink-0 rounded border-white/60 bg-transparent accent-brand-orange"
                />
                {t("Я согласен(а) на обработку данных в соответствии с политикой конфиденциальности", "I consent to the processing of my personal data in accordance with the privacy policy.")}
              </label>
              <FieldError message={orderErrors.policy_accepted} />
              <FieldError message={orderErrors.form} />
              <Button
                type="submit"
                disabled={orderSubmitting}
                className="h-11 w-full rounded-none bg-brand-orange text-lg font-bold text-brand-navy hover:bg-[#ff942e] disabled:opacity-70 md:h-12 md:text-xl"
              >
                {orderSubmitting ? t("Отправка...", "Sending...") : t("Обсудить детали", "Send request")}
              </Button>
            </form>
          </DialogContent>
        </Dialog>
        {orderSuccessVisible ? (
          <div role="status" className="fixed right-4 bottom-4 z-60 rounded-md border border-[#101e3d] bg-white px-4 py-3 text-sm font-semibold text-[#101e3d] shadow-lg">
            {t("Сообщение отправлено. Мы скоро свяжемся с вами.", "Message sent. We will contact you shortly.")}
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
  const { t } = useLanguage();
  return (
    <div className="flex items-center justify-between gap-4">
      <h2
        className={`text-2xl font-extrabold uppercase md:text-3xl ${dark ? "text-white" : "text-[#101e3d]"}`}
      >
        {title}
      </h2>
      {hidden ? null : (
        <div className="flex items-center gap-2">
          <button
            type="button"
            disabled={!canPrev}
            aria-label={t("Назад", "Previous")}
            onClick={onPrev}
            className={`inline-flex h-11 w-11 items-center justify-center border transition disabled:opacity-40 ${dark ? "border-white/40 text-white" : "border-[#19416d] text-[#19416d]"}`}
          >
            <ChevronRight className="size-5 rotate-180" />
          </button>
          <button
            type="button"
            disabled={!canNext}
            aria-label={t("Далее", "Next")}
            onClick={onNext}
            className={`inline-flex h-11 w-11 items-center justify-center border transition disabled:opacity-40 ${dark ? "border-white/40 text-white" : "border-[#19416d] text-[#19416d]"}`}
          >
            <ChevronRight className="size-5" />
          </button>
        </div>
      )}
    </div>
  );
}

function YandexConstructorMap() {
  const { language, t } = useLanguage();
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
      { rootMargin: "600px 0px" },
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
          title={t("География проектов", "Project locations")}
          src={`https://yandex.ru/map-widget/v1/?lang=${language === "en" ? "en_US" : "ru_RU"}&scroll=false&source=constructor-api&um=constructor%3A68b5f5515158c26c554d5801e0c2c898edb710bcdab9eb6752de7068f7669943`}
          loading="lazy"
          allowFullScreen
          className="h-full w-full border-0"
        />
      ) : (
        <div className="flex h-full w-full items-center justify-center bg-[#e7e7e7] text-sm font-semibold text-[#101e3d]">
          {t("Карта загрузится при прокрутке к этому блоку", "The map will load when you scroll to this section.")}
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

  return <p role="alert" className="text-xs text-[#ffd7d7]">{message}</p>;
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
