import { ContentPageLayout, type ContentPageBreadcrumb, type ContentPageData, type ServiceSideItem } from '../components/site/content-page-layout';
import type { CompanyData } from '../components/site/types';
import { companyRu, servicesRu } from '../data/ru';

type ServiceTile = ServiceSideItem & {
    image_url?: string | null;
};

export default function ServicesPage({
    canonical,
    company,
    services,
}: {
    canonical: string;
    company: CompanyData;
    services: ServiceTile[];
}) {
    const page: ContentPageData = {
        title: 'Услуги',
        subtitle: null,
        content: null,
        image_url: null,
    };

    const breadcrumb: ContentPageBreadcrumb = {
        middle_label: 'Услуги',
        middle_href: '/services',
        current_label: 'Услуги',
    };

    return (
        <ContentPageLayout
            company={companyRu}
            services={servicesRu}
            page={page}
            breadcrumb={breadcrumb}
            canonical={canonical}
            robots="index,follow"
            description="Каталог услуг компании: технический аудит, промышленный мониторинг, подтверждение соответствия и другие направления."
            showSidebar={false}
            contentSlot={
                <section className="border border-[#d4d4d4] bg-[#f3f3f3]">
                    <div className="grid grid-cols-1 md:grid-cols-2 xl:grid-cols-3">
                        {servicesRu.map((service) => (
                            <a
                                key={service.id}
                                href={`/services/${service.slug}`}
                                className="group border-r border-b border-[#d4d4d4] bg-white p-3 transition hover:bg-[#f8f8f8]"
                            >
                                <div className="h-52 overflow-hidden bg-white">
                                    {service.image_url ? (
                                        <img
                                            src={service.image_url}
                                            alt={service.title}
                                            className="h-full w-full object-cover transition duration-500 group-hover:scale-[1.02]"
                                        />
                                    ) : (
                                        <div className="flex h-full items-center justify-center text-sm text-[#5a6f88]">
                                            Нет изображения
                                        </div>
                                    )}
                                </div>
                                <h3 className="pt-3 text-base font-medium text-[#12345d] md:text-lg">
                                    {service.title}
                                </h3>
                            </a>
                        ))}
                    </div>
                </section>
            }
        />
    );
}
