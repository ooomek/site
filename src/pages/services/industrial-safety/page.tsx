import { ContentPageLayout, type ContentPageBreadcrumb, type ContentPageData, type ServiceSideItem } from '../../../components/site/content-page-layout';
import type { CompanyData } from '../../../components/site/types';
import { companyRu, servicesRu, industrialSafetyPageRu, industrialSafetyPageRuBreadcrumb } from '../../../data/ru';

export default function IndustrialSafetyPage({
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
            page={industrialSafetyPageRu}
            breadcrumb={industrialSafetyPageRuBreadcrumb}
            canonical={canonical}
            robots="index,follow"
            description={industrialSafetyPageRu.subtitle ?? industrialSafetyPageRu.title}
        />
    );
}
