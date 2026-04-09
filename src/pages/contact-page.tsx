import { ContentPageLayout, type ContentPageBreadcrumb, type ContentPageData, type ServiceSideItem } from '../components/site/content-page-layout';
import type { CompanyData } from '../components/site/types';
import { companyRu, servicesRu, contactsPageRu, contactsPageRuBreadcrumb } from '../data/ru';

export default function ContactPage({
    canonical,

}: {
    canonical: string;
    company: CompanyData;
    services: ServiceSideItem[];
    page: ContentPageData;
    breadcrumb: ContentPageBreadcrumb;
}) {
    return (
        <ContentPageLayout
            company={companyRu}
            services={servicesRu}
            page={contactsPageRu}
            breadcrumb={contactsPageRuBreadcrumb}
            canonical={canonical}
            robots="index,follow"
            description={contactsPageRu.subtitle ?? contactsPageRu.title}
        />
    );
}
