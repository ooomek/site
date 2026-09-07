import { ContentPageLayout} from '../components/site/content-page-layout';
import { useSiteData } from '../data';

export default function InfoPage({
    canonical,

}: {
    canonical: string;

}) {
    const { company, services, aboutPage, aboutPageBreadcrumb } = useSiteData();

    return (
        <ContentPageLayout
            company={company}
            services={services}
            page={aboutPage}
            breadcrumb={aboutPageBreadcrumb}
            canonical={canonical}
            robots="index,follow"
            description={aboutPage.subtitle ?? aboutPage.title}
        />
    );
}
