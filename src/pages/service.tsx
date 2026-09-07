import { ContentPageLayout, type ContentPageData, type ContentPageBreadcrumb, type ServiceSideItem } from '../components/site/content-page-layout';
import { useLanguage } from '../lib/language';
import type { CompanyData } from '../components/site/types';

type ServiceView = {
    id: number;
    title: string;
    slug: string;
    subtitle: string | null;
    content: string | null;
    image_url: string | null;
};

export default function ServicePage({
    canonical,
    company,
    service,
    services,
}: {
    canonical: string;
    company: CompanyData;
    service: ServiceView;
    services: ServiceSideItem[];
}) {
    const { t } = useLanguage();

    const page: ContentPageData = {
        title: service.title,
        subtitle: service.subtitle,
        content: service.content,
        image_url: service.image_url,
    };

    const breadcrumb: ContentPageBreadcrumb = {
        middle_label: t('Услуги', 'Services'),
        middle_href: '/services',
        current_label: service.title,
    };

    return (
        <ContentPageLayout
            company={company}
            services={services}
            page={page}
            breadcrumb={breadcrumb}
            canonical={canonical}
            robots="index,follow"
            description={service.subtitle ?? `${t('Услуга', 'Service')}: ${service.title}`}
            initialSidebarServiceId={service.id}
        />
    );
}
