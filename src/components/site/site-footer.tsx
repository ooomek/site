import { useLanguage } from "../../lib/language";
import type { CompanyData, ServiceNavItem } from './types';

type Props = {
    company: CompanyData;
    services: ServiceNavItem[];
};

export function SiteFooter({ company, services }: Props) {
    const { t, localizePath } = useLanguage();
    const year = new Date().getFullYear();
    const email = company.email || 'info@expert-mek.com';

    return (
        <footer id="contacts" className="bg-[#101e3d] text-white">
            <div className="mx-auto grid w-full max-w-[1320px] grid-cols-1 gap-10 px-4 py-10 sm:px-6 lg:grid-cols-3 lg:px-8">
                <section>
                    <img src="/images/mek.png" alt={t("МЭК", "MEK")} className="h-14 w-auto object-contain" />
                    <div className="mt-4 space-y-3 text-sm leading-6 text-[#d8e5f3]">
                        <p>
                            <span className="font-semibold text-white">{t("Юридический адрес:", "Registered address:")}</span>{' '}
                            {company.legal_address || t("191036, г. Санкт-Петербург, Греческий проспект, д. 17", "17 Grechesky Prospekt, St. Petersburg, 191036, Russia")}
                        </p>
                        <p>
                            <span className="font-semibold text-white">{t("Фактический адрес:", "Office address:")}</span>{' '}
                            {company.actual_address || t("199155, г. Санкт-Петербург, наб. Макарова, д. 60, ст.1", "60 Makarova Embankment, Building 1, St. Petersburg, 199155, Russia")}
                        </p>
                        <p>
                            <span className="font-semibold text-white">{t("Телефон:", "Phone:")}</span> {company.phone || '+7 812 6792749'}
                        </p>
                        <p>
                            <span className="font-semibold text-white">{t("Электронная почта:", "Email:")}</span> {email}
                        </p>
                    </div>
                </section>

                <section>
                    <h3 className="text-xl font-bold">{t("Услуги", "Services")}</h3>
                    <ul className="mt-4 space-y-2 text-sm text-[#d8e5f3]">
                        {services.map((service) => (
                            <li key={service.id}>
                                <a href={localizePath(`/services/${service.slug}`)} className="hover:text-white">
                                    {service.title}
                                </a>
                            </li>
                        ))}
                    </ul>
                </section>

                <section>
                    <h3 className="text-xl font-bold">{t("Меню", "Navigation")}</h3>
                    <ul className="mt-4 space-y-2 text-sm text-[#d8e5f3]">
                        <li>
                            <a href={localizePath('/about')} className="hover:text-white">

                                {t("О компании", "About us")}
                            </a>
                        </li>
                        <li>
                            <a href={localizePath('/services')} className="hover:text-white">

                                {t("Услуги", "Services")}
                            </a>
                        </li>
                        <li>
                            <a href={localizePath('/news')} className="hover:text-white">
                                {t("Новости и статьи", "News & articles")}
                            </a>
                        </li>
                        <li>
                            <a href={localizePath('/contacts')} className="hover:text-white">

                                {t("Контакты", "Contacts")}
                            </a>
                        </li>
                        <li>
                            <a href="/ebook/chapter-1" className="hover:text-white">{t('Детская книга', 'Children’s book')}</a>
                        </li>
                    </ul>
                </section>
            </div>
            <hr className='w-full border-t border-white/20' />
            <div className="mx-auto max-w-[1320px] py-3 text-left text-xs text-[#afc4da] px-4 sm:px-6 lg:px-8">

                {t("Все права защищены ©", "All rights reserved ©")} {year}  {t("ООО «МЭК»", "MEK LLC")}
            </div>
        </footer>
    );
}
