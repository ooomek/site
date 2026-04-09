import { ContentPageLayout, type ContentPageBreadcrumb, type ContentPageData, type ServiceSideItem } from '../../../components/site/content-page-layout';
import type { CompanyData } from '../../../components/site/types';
import { companyRu, servicesRu, equipmentConformityPageRu, equipmentConformityPageRuBreadcrumb } from '../../../data/ru';

export default function EquipmentConformityPage({
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
            page={equipmentConformityPageRu}
            breadcrumb={equipmentConformityPageRuBreadcrumb}
            canonical={canonical}
            robots="index,follow"
            description={equipmentConformityPageRu.subtitle ?? equipmentConformityPageRu.title}
        />
    );
}
