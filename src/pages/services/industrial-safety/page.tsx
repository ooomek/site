import { ContentPageLayout } from '../../../components/site/content-page-layout';
import { useSiteData } from '../../../data';

export default function IndustrialSafetyPage({
    canonical,

}: {
    canonical: string;

}) {
    const { company, services, industrialSafetyPage, industrialSafetyPageBreadcrumb } = useSiteData();

    return (
        <ContentPageLayout
            company={company}
            services={services}
            page={industrialSafetyPage}
            breadcrumb={industrialSafetyPageBreadcrumb}
            canonical={canonical}
            robots="index,follow"
            description={industrialSafetyPage.subtitle ?? industrialSafetyPage.title}
        />
    );
}
