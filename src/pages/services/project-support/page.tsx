import { ContentPageLayout } from '../../../components/site/content-page-layout';
import { companyRu, servicesRu, projectSupportPageRu, projectSupportPageRuBreadcrumb } from '../../../data/ru';

export default function ProjectSupportPage({
    canonical,

}: {
    canonical: string;
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
