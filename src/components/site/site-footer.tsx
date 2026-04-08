import type { CompanyData, ServiceNavItem } from './types';

type Props = {
    company: CompanyData;
    services: ServiceNavItem[];
};

export function SiteFooter({ company, services }: Props) {
    const year = new Date().getFullYear();
    const email = company.email || 'info@expert-mek.com';

    return (
        <footer id="contacts" className="bg-[#12345d] text-white">
            <div className="mx-auto grid w-full max-w-[1320px] grid-cols-1 gap-10 px-4 py-10 sm:px-6 lg:grid-cols-3 lg:px-8">
                <section>
                    <img src="/images/logo.png" alt="МЭК" className="h-14 w-auto object-contain" />
                    <div className="mt-4 space-y-3 text-sm leading-6 text-[#d8e5f3]">
                        <p>
                            <span className="font-semibold text-white">Юридический адрес:</span>{' '}
                            {company.legal_address || '191036, г. Санкт-Петербург, Греческий проспект, д. 17'}
                        </p>
                        <p>
                            <span className="font-semibold text-white">Фактический адрес:</span>{' '}
                            {company.actual_address || '199155, г. Санкт-Петербург, наб. Макарова, д. 60, ст.1'}
                        </p>
                        <p>
                            <span className="font-semibold text-white">Телефон:</span> {company.phone || '+7 (000) 000-00-00'}
                        </p>
                        <p>
                            <span className="font-semibold text-white">Электронная почта:</span> {email}
                        </p>
                    </div>
                </section>

                <section>
                    <h3 className="text-xl font-bold">Услуги</h3>
                    <ul className="mt-4 space-y-2 text-sm text-[#d8e5f3]">
                        {services.map((service) => (
                            <li key={service.id}>
                                <a href={`/services/${service.slug}`} className="hover:text-white">
                                    {service.title}
                                </a>
                            </li>
                        ))}
                    </ul>
                </section>

                <section>
                    <h3 className="text-xl font-bold">Меню</h3>
                    <ul className="mt-4 space-y-2 text-sm text-[#d8e5f3]">
                        <li>
                            <a href="/about" className="hover:text-white">
                                О компании
                            </a>
                        </li>
                        <li>
                            <a href="/services" className="hover:text-white">
                                Услуги
                            </a>
                        </li>
                        <li>
                            <a href="/contacts" className="hover:text-white">
                                Контакты
                            </a>
                        </li>
                    </ul>
                </section>
            </div>
            <hr className='w-full border-t border-white/20' />
            <div className="mx-auto max-w-[1320px] py-3 text-left text-xs text-[#afc4da] px-4 sm:px-6 lg:px-8">
                Все права защищены © {year} ООО «МЭК»
            </div>
        </footer>
    );
}
