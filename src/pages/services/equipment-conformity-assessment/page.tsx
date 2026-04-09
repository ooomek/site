import { ContentPageLayout} from '../../../components/site/content-page-layout';
import { companyRu, servicesRu, equipmentConformityPageRu, equipmentConformityPageRuBreadcrumb } from '../../../data/ru';

export default function EquipmentConformityPage({
    canonical,

}: {
    canonical: string;
}) {
    return (
        <ContentPageLayout
            company={companyRu}
            services={servicesRu}
            page={equipmentConformityPageRu}
            breadcrumb={equipmentConformityPageRuBreadcrumb}
            canonical={canonical}
            robots="index,follow"
            description={equipmentConformityPageRu.subtitle ?? equipmentConformityPageRu.title}
        />
    );
}
