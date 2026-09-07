import DOMPurify from "dompurify";
import { ArrowLeft, ArrowRight } from "lucide-react";
import { useEffect, useMemo, useState } from "react";
import { Button } from "../../components/ui/button";
import {
  Dialog,
  DialogContent,
  DialogDescription,
  DialogHeader,
  DialogTitle,
} from "../../components/ui/dialog";
import { Input } from "../../components/ui/input";
import { Label } from "../../components/ui/label";
import { useLanguage } from "../../lib/language";
import { formatRuPhone } from "../../lib/phone-mask";
import { SiteFooter } from "./site-footer";
import { SiteHeader } from "./site-header";
import { SiteShell } from "./site-shell";
import type { CompanyData } from "./types";

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
  canonical: string;
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
  robots = "index,follow",
  description,
  initialSidebarServiceId,
  showSidebar = true,
  contentSlot,
}: Props) {
  const { language, t, localizePath } = useLanguage();
  const [orderOpen, setOrderOpen] = useState(false);
  const [orderSuccessVisible, setOrderSuccessVisible] = useState(false);
  const [sidebarDirection, setSidebarDirection] = useState<"next" | "prev">(
    "next",
  );
  const initialIndex = useMemo(() => {
    if (!initialSidebarServiceId) return 0;
    const i = services.findIndex((item) => item.id === initialSidebarServiceId);
    return i >= 0 ? i : 0;
  }, [services, initialSidebarServiceId]);
  const [sidebarIndex, setSidebarIndex] = useState<number>(initialIndex);
  const [orderSubmitting, setOrderSubmitting] = useState(false);

  const email = company.email || "info@expert-mek.com";
  const canPrevSidebar = sidebarIndex > 0;
  const canNextSidebar = sidebarIndex < services.length - 1;
  const hasMiddleCrumb = breadcrumb.middle_label !== breadcrumb.current_label;
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
  useEffect(() => {
    document.title = `${page.title} | ${language === "en" ? "MEK" : "МЭК"}`;

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
      description || page.subtitle || page.title,
    );
    setMeta("robots", robots);
    setCanonical(localizePath(canonical));
  }, [canonical, description, language, localizePath, page.subtitle, page.title, robots]);
    const handleOrderSubmit = async (e: React.FormEvent<HTMLFormElement>) => {
      e.preventDefault();
  
      const errors: Record<string, string> = {};
  
      if (!orderForm.name.trim()) errors.name = t("Введите имя", "Enter your name");
      if (!orderForm.phone.trim()) errors.phone = t("Введите телефон", "Enter your phone number");
      if (!orderForm.email.trim()) errors.email = t("Введите e-mail", "Enter your email address");
      if (orderForm.phone.trim() && (language === "ru"
        ? !/^\+7 \(\d{3}\) \d{3}-\d{2}-\d{2}$/.test(orderForm.phone)
        : !/^\+?[\d\s().-]{7,25}$/.test(orderForm.phone) || orderForm.phone.replace(/\D/g, "").length < 7)) {
        errors.phone = t("Введите корректный номер телефона", "Enter a valid phone number");
      }
      if (orderForm.email.trim() && !/^[^\s@]+@[^\s@]+\.[^\s@]+$/.test(orderForm.email)) {
        errors.email = t("Введите корректный e-mail", "Enter a valid email address");
      }
      if (!orderForm.message.trim()) errors.message = t("Введите сообщение", "Enter your message");
      if (!orderForm.policy_accepted) {
          errors.policy_accepted = t("Необходимо согласие на обработку данных", "Please agree to the processing of your personal data");
      }
  
      setOrderErrors(errors);
  
      if (Object.keys(errors).length > 0) return;
  
      try {
          setOrderSubmitting(true);
  
          const selectedService = services.find(
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
              throw new Error("Contact request failed");
          }
  
          setOrderOpen(false);
          resetOrderForm();
          setOrderSuccessVisible(true);
      } catch {
          setOrderErrors({
              form: t("Не удалось отправить сообщение. Попробуйте ещё раз или напишите нам на e-mail.", "Your message could not be sent. Please try again or contact us by email."),
          });
      } finally {
          setOrderSubmitting(false);
      }
  };
  return (
    <>
      <SiteShell company={company} services={services}>
        <section className="relative overflow-hidden bg-white">
          <div className="relative z-10 flex min-h-0 flex-col">
            <SiteHeader
              email={email}
              services={services}
              presentationUrl={company.presentation_url}
            />
            <div className="w-full bg-[#101e3d]">
              <div className="mx-auto w-full max-w-[1320px] px-5 py-2 text-sm font-semibold text-white">
                <a href={localizePath("/")}>{t("Главная", "Home")}</a>
                {" > "}
                {hasMiddleCrumb ? (
                  <>
                    <a href={localizePath(breadcrumb.middle_href)}>
                      {breadcrumb.middle_label}
                    </a>
                    {" > "}
                    {breadcrumb.current_label}
                  </>
                ) : (
                  breadcrumb.current_label
                )}
              </div>
            </div>

            <div className="mx-auto w-full max-w-[1320px] flex-1 px-5 pb-0">
              <div className="relative ml-[calc(50%-50vw)] h-[200px] w-screen overflow-hidden border-y border-[#dbe3ee] bg-white sm:h-[260px] lg:h-[320px]">
                <img
                  src="/images/BG.png"
                  alt=""
                  fetchPriority="high"
                  decoding="async"
                  className="h-full w-full object-cover object-[center_48%]"
                />

                <div className="absolute inset-0">
                  <div className="relative mx-auto h-full w-full max-w-[1320px]">
                    <div className="absolute bottom-0 left-full h-12 w-[calc((100vw-1320px)/2+1.25rem)] -translate-x-5 bg-[#ff7a00] sm:h-16" />

                    <div className="relative h-full px-5">
                      <Button
                        type="button"
                        onClick={() => setOrderOpen(true)}
                        className="absolute right-0 bottom-0 h-12 rounded-none bg-[#ff7a00] px-5 text-xs font-bold text-[#101e3d] uppercase hover:bg-[#ff942e] sm:h-16 sm:px-10 sm:text-base"
                      >
                        {t("Заказать услугу", "Request a service")}
                        <ArrowRight className="size-4 sm:size-6" />
                      </Button>
                    </div>
                  </div>
                </div>
              </div>
            </div>
          </div>
        </section>

        <main className="w-full bg-white py-8 sm:py-10 lg:py-12">
          <div className="mx-auto w-full max-w-[1320px] px-5">
            <div
              className={
                showSidebar
                  ? "grid grid-cols-1 gap-8 lg:grid-cols-[minmax(0,1fr)_350px]"
                  : ""
              }
            >
              <div className="min-w-0">
                {page.title ? (
                  <h1 className="text-[24px] leading-[1.15] font-extrabold text-[#101e3d] uppercase md:text-[36px]">
                    {page.title}
                  </h1>
                ) : null}
                {contentSlot ? (
                  <div className="mt-5">{contentSlot}</div>
                ) : (
                  <article
                    className="mt-5 text-base leading-relaxed text-[#283954] md:text-lg [&_h2]:mb-3 [&_h2]:text-2xl [&_h2]:font-bold md:[&_h2]:text-3xl [&_h3]:mb-2 [&_h3]:text-xl [&_h3]:font-semibold md:[&_h3]:text-2xl [&_ul]:list-disc [&_ul]:pl-6 [&_ol]:list-decimal [&_ol]:pl-6 [&_p]:mb-4"
                    dangerouslySetInnerHTML={{
                      __html: DOMPurify.sanitize(
                        page.content || t("<p>Контент пока не заполнен.</p>", "<p>Content will be available soon.</p>"),
                      ),
                    }}
                  />
                )}
              </div>

              {showSidebar ? (
                <aside className="h-fit border-t-4 border-[#ff7a00] bg-[#f3f5f9] p-6">
                  <div className="overflow-hidden">
                    {services[sidebarIndex] ? (
                      <a
                        key={services[sidebarIndex].id}
                        href={localizePath(`/services/${services[sidebarIndex].slug}`)}
                        className={`block animate-in fade-in duration-300 ${sidebarDirection === "next" ? "slide-in-from-right-2" : "slide-in-from-left-2"}`}
                      >
                        <h3 className="text-2xl leading-[1.1] font-extrabold text-[#101e3d] md:text-3xl">
                          {services[sidebarIndex].title}
                        </h3>
                        <div
                          className="mt-4 text-sm leading-[1.35] text-[#24384f] md:text-base [&_ul]:list-disc [&_ul]:pl-5 [&_ol]:list-decimal [&_ol]:pl-5 [&_p]:mb-3"
                          dangerouslySetInnerHTML={{
                            __html: DOMPurify.sanitize(
                              services[sidebarIndex].short_description ||
                                t("<p>Описание услуги</p>", "<p>Service description</p>"),
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
                        setSidebarDirection("prev");
                        setSidebarIndex((v) => Math.max(0, v - 1));
                      }}
                      className="inline-flex h-12 w-12 items-center justify-center border border-[#1f3f63] text-[#1f3f63] transition hover:bg-[#ff7a00] disabled:opacity-40"
                      aria-label={t("Предыдущая услуга", "Previous service")}
                    >
                      <ArrowLeft className="size-6" />
                    </button>
                    <button
                      type="button"
                      disabled={!canNextSidebar}
                      onClick={() => {
                        setSidebarDirection("next");
                        setSidebarIndex((v) =>
                          Math.min(services.length - 1, v + 1),
                        );
                      }}
                      className="inline-flex h-12 w-12 items-center justify-center border border-[#1f3f63] text-[#1f3f63] transition hover:bg-[#ff7a00] disabled:opacity-40"
                      aria-label={t("Следующая услуга", "Next service")}
                    >
                      <ArrowRight className="size-6" />
                    </button>
                  </div>
                </aside>
              ) : null}
            </div>
          </div>
        </main>
<Dialog open={orderOpen} onOpenChange={setOrderOpen}>
                <DialogContent className="max-h-[92vh] w-[calc(100vw-1.5rem)] overflow-y-auto border-0 bg-[#101e3d] p-5 text-white sm:max-w-lg sm:p-6">
                    <DialogHeader>
                        <DialogTitle className="pr-8 text-2xl font-extrabold md:text-3xl">
                            {t("Закажите сопровождение", "Let’s discuss your project")}
                        </DialogTitle>
                        <DialogDescription className="text-sm text-[#d8e5f3] md:text-base">
                            {t("Заполните форму, чтобы мы с вами связались для обсуждения деталей", "Fill out the form and we will contact you to discuss the details.")}
                        </DialogDescription>
                    </DialogHeader>
                    <form onSubmit={handleOrderSubmit} noValidate className="space-y-4 sm:space-y-5">
                        <Field label={t("Ваше имя", "Your name")} id="order-name">
    <Input
        id="order-name"
        value={orderForm.name}
        onChange={(e) => setOrderField('name', e.target.value)}
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
        maxLength={language === "ru" ? 18 : 25}
        placeholder="+7 (___) ___-__-__"
        pattern={language === "ru" ? "\\+7 \\(\\d{3}\\) \\d{3}-\\d{2}-\\d{2}" : undefined}
        value={orderForm.phone}
        onChange={(e) =>
            setOrderField('phone', language === 'ru' ? formatRuPhone(e.target.value) : e.target.value)
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
        onChange={(e) => setOrderField('email', e.target.value)}
        className="h-11 rounded-none border-0 bg-white text-sm text-black md:h-12 md:text-base"
    />
    <FieldError message={orderErrors.email} />
</Field>
                        <Field label={t("Выбор услуги", "Service")} id="order-service">
    <select
        id="order-service"
        value={orderForm.service_id}
        onChange={(e) => setOrderField('service_id', e.target.value)}
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
                        <Field label={t("Краткое описание задачи", "Briefly describe your project")} id="order-message">
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
    {t("Я согласен(а) на обработку данных в соответствии с политикой конфиденциальности", "I agree to the processing of my personal data in accordance with the privacy policy.")}
</label>
<FieldError message={orderErrors.policy_accepted} />
<FieldError message={orderErrors.form} />
<Button
    type="submit"
    disabled={orderSubmitting}
    className="h-11 w-full rounded-none bg-[#ff7a00] text-lg font-bold text-[#101e3d] hover:bg-[#ff942e] disabled:opacity-70 md:h-12 md:text-xl"
>
    {orderSubmitting ? t("Отправка...", "Sending...") : t("Обсудить детали", "Discuss the details")}
</Button>
                    </form>
                </DialogContent>
            </Dialog>
        <SiteFooter company={company} services={services} />
      </SiteShell>

      {orderSuccessVisible ? (
        <div role="status" className="fixed right-4 bottom-4 z-60 max-w-[calc(100vw-2rem)] rounded-md border border-[#101e3d] bg-white px-4 py-3 text-sm font-semibold text-[#101e3d] shadow-lg">
          {t("Сообщение отправлено. Мы скоро свяжемся с вами.", "Message sent. We will contact you shortly.")}
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

  return <p role="alert" className="text-xs text-[#ffd7d7]">{message}</p>;
}
