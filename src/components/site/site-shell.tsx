import { useEffect, useState } from 'react';
import { CookieConsent } from './cookie-consent';
import { SiteHeader } from './site-header';
import type { CompanyData, ServiceNavItem } from './types';

type Props = {
    company: CompanyData;
    services: ServiceNavItem[];
    children: React.ReactNode;
};

export function SiteShell({ company, services, children }: Props) {
    const [stickyVisible, setStickyVisible] = useState(false);
    const email = company.email || 'info@expert-mek.com';

    useEffect(() => {
        const onScroll = () => setStickyVisible(window.scrollY > window.innerHeight * 0.85);
        onScroll();
        window.addEventListener('scroll', onScroll, { passive: true });
        return () => window.removeEventListener('scroll', onScroll);
    }, []);

    return (
        <div className="bg-[#f5f7fa] text-[#102946]">
            <SiteHeader
                sticky
                email={email}
                services={services}
                presentationUrl={company.presentation_url}
                className={`transition-all duration-500 ${stickyVisible ? 'translate-y-0 opacity-100' : 'pointer-events-none -translate-y-full opacity-0'}`}
            />
            {children}
            <CookieConsent />
        </div>
    );
}
