import { ContentPageLayout } from '../../../components/site/content-page-layout';
import { useSiteData } from '../../../data';

export default function TechnicalAuditPage({
    canonical,

}: {
    canonical: string;

}) {
    const { company, services, technicalAuditPage, technicalAuditPageBreadcrumb } = useSiteData();

    return (
        <ContentPageLayout
            company={company}
            services={services}
            page={technicalAuditPage}
            breadcrumb={technicalAuditPageBreadcrumb}
            canonical={canonical}
            robots="index,follow"
            description={technicalAuditPage.subtitle ?? technicalAuditPage.title}
        />
    );
}
