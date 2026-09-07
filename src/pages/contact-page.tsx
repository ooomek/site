import { ContentPageLayout } from '../components/site/content-page-layout';
import { useSiteData } from '../data';

export default function ContactPage({
    canonical,

}: {
    canonical: string;

}) {
    const { company, services, contactsPage, contactsPageBreadcrumb } = useSiteData();

    return (
        <ContentPageLayout
            company={company}
            services={services}
            page={contactsPage}
            breadcrumb={contactsPageBreadcrumb}
            canonical={canonical}
            robots="index,follow"
            description={contactsPage.subtitle ?? contactsPage.title}
        />
    );
}
