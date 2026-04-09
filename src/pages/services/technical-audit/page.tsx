import { ContentPageLayout, type ContentPageBreadcrumb, type ContentPageData, type ServiceSideItem } from '../../../components/site/content-page-layout';
import type { CompanyData } from '../../../components/site/types';
import { companyRu, servicesRu, technicalAuditPageRu, technicalAuditPageRuBreadcrumb } from '../../../data/ru';

export default function TechnicalAuditPage({
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
            page={technicalAuditPageRu}
            breadcrumb={technicalAuditPageRuBreadcrumb}
            canonical={canonical}
            robots="index,follow"
            description={technicalAuditPageRu.subtitle ?? technicalAuditPageRu.title}
        />
    );
}
