import { ContentPageLayout } from '../../../components/site/content-page-layout';
import { companyRu, servicesRu, technicalAuditPageRu, technicalAuditPageRuBreadcrumb } from '../../../data/ru';

export default function TechnicalAuditPage({
    canonical,

}: {
    canonical: string;

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
