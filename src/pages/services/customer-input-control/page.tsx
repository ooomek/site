import { ContentPageLayout } from '../../../components/site/content-page-layout';
import { useSiteData } from '../../../data';

export default function AgreementActionPage({
    canonical,

}: {
    canonical: string;
}) {
    const { company, services, customerInputControlPage, customerInputControlPageBreadcrumb } = useSiteData();

    return (
        <ContentPageLayout
            company={company}
            services={services}
            page={customerInputControlPage}
            breadcrumb={customerInputControlPageBreadcrumb}
            canonical={canonical}
            robots="index,follow"
            description={customerInputControlPage.subtitle ?? customerInputControlPage.title}
        />
    );
}
