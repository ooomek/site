import { ContentPageLayout } from '../../../components/site/content-page-layout';
import { companyRu, servicesRu, customerInputControlPageRu, customerInputControlPageRuBreadcrumb } from '../../../data/ru';

export default function AgreementActionPage({
    canonical,

}: {
    canonical: string;
}) {
    return (
        <ContentPageLayout
            company={companyRu}
            services={servicesRu}
            page={customerInputControlPageRu}
            breadcrumb={customerInputControlPageRuBreadcrumb}
            canonical={canonical}
            robots="index,follow"
            description={customerInputControlPageRu.subtitle ?? customerInputControlPageRu.title}
        />
    );
}
