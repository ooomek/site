import { ContentPageLayout, type ContentPageBreadcrumb, type ContentPageData, type ServiceSideItem } from '../../../components/site/content-page-layout';
import type { CompanyData } from '../../../components/site/types';
import { companyRu, servicesRu, customerInputControlPageRu, customerInputControlPageRuBreadcrumb } from '../../../data/ru';

export default function AgreementActionPage({
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
            page={customerInputControlPageRu}
            breadcrumb={customerInputControlPageRuBreadcrumb}
            canonical={canonical}
            robots="index,follow"
            description={customerInputControlPageRu.subtitle ?? customerInputControlPageRu.title}
        />
    );
}
