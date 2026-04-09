import { ContentPageLayout } from '../../../components/site/content-page-layout';
import { companyRu, servicesRu, industrialSafetyPageRu, industrialSafetyPageRuBreadcrumb } from '../../../data/ru';

export default function IndustrialSafetyPage({
    canonical,

}: {
    canonical: string;

}) {
    return (
        <ContentPageLayout
            company={companyRu}
            services={servicesRu}
            page={industrialSafetyPageRu}
            breadcrumb={industrialSafetyPageRuBreadcrumb}
            canonical={canonical}
            robots="index,follow"
            description={industrialSafetyPageRu.subtitle ?? industrialSafetyPageRu.title}
        />
    );
}
