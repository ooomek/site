import { ContentPageLayout, type ContentPageBreadcrumb, type ContentPageData, type ServiceSideItem } from '../../../components/site/content-page-layout';
import type { CompanyData } from '../../../components/site/types';
import { companyRu, servicesRu, technicalOrganizationalPageRu, technicalOrganizationalPageRuBreadcrumb } from '../../../data/ru';

export default function TechnicalOrganizationPage({
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
            page={technicalOrganizationalPageRu}
            breadcrumb={technicalOrganizationalPageRuBreadcrumb}
            canonical={canonical}
            robots="index,follow"
            description={technicalOrganizationalPageRu.subtitle ?? technicalOrganizationalPageRu.title}
        />
    );
}
