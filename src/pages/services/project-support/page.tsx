import { ContentPageLayout, type ContentPageBreadcrumb, type ContentPageData, type ServiceSideItem } from '../../../components/site/content-page-layout';
import type { CompanyData } from '../../../components/site/types';
import { companyRu, servicesRu, projectSupportPageRu, projectSupportPageRuBreadcrumb } from '../../../data/ru';

export default function ProjectSupportPage({
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
            page={projectSupportPageRu}
            breadcrumb={projectSupportPageRuBreadcrumb}
            canonical={canonical}
            robots="index,follow"
            description={projectSupportPageRu.subtitle ?? projectSupportPageRu.title}
        />
    );
}
