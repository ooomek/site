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
