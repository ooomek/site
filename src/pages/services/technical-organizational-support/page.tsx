import { ContentPageLayout } from '../../../components/site/content-page-layout';
import { companyRu, servicesRu, technicalOrganizationalPageRu, technicalOrganizationalPageRuBreadcrumb } from '../../../data/ru';

export default function TechnicalOrganizationPage({
    canonical,

}: {
    canonical: string;

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
