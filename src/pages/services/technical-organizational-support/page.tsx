import { ContentPageLayout } from '../../../components/site/content-page-layout';
import { useSiteData } from '../../../data';

export default function TechnicalOrganizationPage({
    canonical,

}: {
    canonical: string;

}) {
    const { company, services, technicalOrganizationalPage, technicalOrganizationalPageBreadcrumb } = useSiteData();

    return (
        <ContentPageLayout
            company={company}
            services={services}
            page={technicalOrganizationalPage}
            breadcrumb={technicalOrganizationalPageBreadcrumb}
            canonical={canonical}
            robots="index,follow"
            description={technicalOrganizationalPage.subtitle ?? technicalOrganizationalPage.title}
        />
    );
}
