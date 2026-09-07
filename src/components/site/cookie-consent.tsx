import { useLanguage } from "../../lib/language";
import { useState } from 'react';

const CONSENT_KEY = 'mek_cookie_consent_v1';

export function CookieConsent() {
    const { t } = useLanguage();
    const [visible, setVisible] = useState(() => {
        if (typeof window === 'undefined') return false;
        try {
            return window.localStorage.getItem(CONSENT_KEY) !== 'accepted';
        } catch {
            return true;
        }
    });

    const accept = () => {
        try {
            window.localStorage.setItem(CONSENT_KEY, 'accepted');
        } catch {
            // Keep consent dismissible when browser storage is unavailable.
        }
        setVisible(false);
    };

    if (!visible) return null;

    return (
        <div className="fixed right-0 bottom-0 left-0 z-[70] border-t border-[#2d3c5d] bg-[#101e3d]/95 p-3 text-white backdrop-blur">
            <div className="mx-auto flex w-full max-w-[1320px] flex-col gap-3 px-2 sm:flex-row sm:items-center sm:justify-between sm:px-5">
                <p className="text-sm leading-5 text-white/95">

                    {t("Мы используем cookies для корректной работы сайта и улучшения сервиса.", "We use cookies to keep the website working properly and improve our service.")}
                </p>
                <button
                    type="button"
                    onClick={accept}
                    className="inline-flex h-10 shrink-0 items-center justify-center bg-brand-orange px-5 text-sm font-semibold text-brand-navy uppercase transition hover:bg-[#ff942e]"
                >

                    {t("Принять", "Accept")}
                </button>
            </div>
        </div>
    );
}
