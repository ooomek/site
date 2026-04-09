import { ContentPageLayout } from '../components/site/content-page-layout';
import { companyRu, servicesRu, contactsPageRu, contactsPageRuBreadcrumb } from '../data/ru';

export default function ContactPage({
    canonical,

}: {
    canonical: string;

}) {
    return (
        <ContentPageLayout
            company={companyRu}
            services={servicesRu}
            page={contactsPageRu}
            breadcrumb={contactsPageRuBreadcrumb}
            canonical={canonical}
            robots="index,follow"
            description={contactsPageRu.subtitle ?? contactsPageRu.title}
        />
    );
}
