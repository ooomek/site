import { ContentPageLayout} from '../components/site/content-page-layout';
import { companyRu, servicesRu, aboutPageRu, aboutPageRuBreadcrumb } from '../data/ru';

export default function InfoPage({
    canonical,

}: {
    canonical: string;

}) {
    return (
        <ContentPageLayout
            company={companyRu}
            services={servicesRu}
            page={aboutPageRu}
            breadcrumb={aboutPageRuBreadcrumb}
            canonical={canonical}
            robots="index,follow"
            description={aboutPageRu.subtitle ?? aboutPageRu.title}
        />
    );
}
