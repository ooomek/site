import { ContentPageLayout} from '../../../components/site/content-page-layout';
import { useSiteData } from '../../../data';

export default function EquipmentConformityPage({
    canonical,

}: {
    canonical: string;
}) {
    const { company, services, equipmentConformityPage, equipmentConformityPageBreadcrumb } = useSiteData();

    return (
        <ContentPageLayout
            company={company}
            services={services}
            page={equipmentConformityPage}
            breadcrumb={equipmentConformityPageBreadcrumb}
            canonical={canonical}
            robots="index,follow"
            description={equipmentConformityPage.subtitle ?? equipmentConformityPage.title}
        />
    );
}
