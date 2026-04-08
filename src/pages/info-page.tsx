import { ContentPageLayout, type ContentPageBreadcrumb, type ContentPageData, type ServiceSideItem } from '../components/site/content-page-layout';
import type { CompanyData } from '../components/site/types';
import { companyRu, servicesRu, aboutPageRu, aboutPageRuBreadcrumb } from '../data/ru';

export default function InfoPage({
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
            page={aboutPageRu}
            breadcrumb={aboutPageRuBreadcrumb}
            canonical={canonical}
            robots="index,follow"
            description={aboutPageRu.subtitle ?? aboutPageRu.title}
        />
    );
}
