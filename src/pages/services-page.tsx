import { ContentPageLayout, type ContentPageBreadcrumb, type ContentPageData } from '../components/site/content-page-layout';
import { useSiteData } from '../data';
import { useLanguage } from '../lib/language';



export default function ServicesPage({
    canonical,
}: {
    canonical: string;

}) {
    const { company, services } = useSiteData();
    const { t, localizePath } = useLanguage();

    const page: ContentPageData = {
        title: t('Услуги', 'Services'),
        subtitle: null,
        content: null,
        image_url: null,
    };

    const breadcrumb: ContentPageBreadcrumb = {
        middle_label: t('Услуги', 'Services'),
        middle_href: '/services',
        current_label: t('Услуги', 'Services'),
    };

    return (
        <ContentPageLayout
            company={company}
            services={services}
            page={page}
            breadcrumb={breadcrumb}
            canonical={canonical}
            robots="index,follow"
            description={t("Каталог услуг компании: технический аудит, промышленный мониторинг, подтверждение соответствия и другие направления.", "Explore our services: technical audits, industrial safety, equipment conformity assessment, and project support.")}
            showSidebar={false}
            contentSlot={
                <section className="border border-[#d4d4d4] bg-[#f3f5f9]">
                    <div className="grid grid-cols-1 md:grid-cols-2 xl:grid-cols-3">
                        {services.map((service) => (
                            <a
                                key={service.id}
                                href={localizePath(`/services/${service.slug}`)}
                                className="group border-r border-b border-[#d4d4d4] bg-white p-3 transition hover:bg-[#f3f5f9]"
                            >
                                <div className="h-52 overflow-hidden bg-white">
                                    {service.image_url ? (
                                        <img
                                            src={service.image_url.startsWith("/") ? service.image_url : `/${service.image_url}`}
                                            alt={service.title}
                                            className="h-full w-full object-cover transition duration-500 group-hover:scale-[1.02]"
                                        />
                                    ) : (
                                        <div className="flex h-full items-center justify-center text-sm text-[#5a6f88]">
                                            {t("Нет изображения", "Image unavailable")}
                                        </div>
                                    )}
                                </div>
                                <h3 className="pt-3 text-base font-medium text-[#101e3d] md:text-lg">
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
