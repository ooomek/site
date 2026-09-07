import { ContentPageLayout } from '../../../components/site/content-page-layout';
import { useSiteData } from '../../../data';

export default function ProjectSupportPage({
    canonical,

}: {
    canonical: string;
}) {
    const { company, services, projectSupportPage, projectSupportPageBreadcrumb } = useSiteData();

    return (
        <ContentPageLayout
            company={company}
            services={services}
            page={projectSupportPage}
            breadcrumb={projectSupportPageBreadcrumb}
            canonical={canonical}
            robots="index,follow"
            description={projectSupportPage.subtitle ?? projectSupportPage.title}
        />
    );
}
