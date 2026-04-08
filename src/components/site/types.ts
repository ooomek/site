export type CompanyData = {
    legal_address: string | null;
    actual_address: string | null;
    phone: string | null;
    email: string | null;
    presentation_url: string | null;
};

export type ServiceNavItem = {
    id: number;
    title: string;
    slug: string;
};
export type ServiceData = {
    id: number;
    title: string;
    short_description: string | null;
    slug: string;
    icon_url: string | null;
    image_url: string | null;
};

export type LicenseData = {
    id: number;
    title: string;
    description: string | null;
    image_url: string | null;
    document_url: string | null;
};

export type PartnerData = {
    id: number;
    name: string;
    url: string | null;
    logo_url: string | null;
};
export type ContentPageData = {
  title: string;
  subtitle: string | null;
  content: string | null;
  image_url: string | null;
};
export type ContentPageBreadcrumb = {
  middle_label: string;
  middle_href: string;
  current_label: string;
};