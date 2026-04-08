import { useState } from 'react';

const CONSENT_KEY = 'mek_cookie_consent_v1';

export function CookieConsent() {
    const [visible, setVisible] = useState(() => {
        if (typeof window === 'undefined') return false;
        return window.localStorage.getItem(CONSENT_KEY) !== 'accepted';
    });

    const accept = () => {
        window.localStorage.setItem(CONSENT_KEY, 'accepted');
        setVisible(false);
    };

    if (!visible) return null;

    return (
        <div className="fixed right-0 bottom-0 left-0 z-[70] border-t border-[#255583] bg-[#12345d]/95 p-3 text-white backdrop-blur">
            <div className="mx-auto flex w-full max-w-[1320px] flex-col gap-3 px-2 sm:flex-row sm:items-center sm:justify-between sm:px-5">
                <p className="text-sm leading-5 text-white/95">
                    Мы используем cookies для корректной работы сайта и улучшения сервиса.
                </p>
                <button
                    type="button"
                    onClick={accept}
                    className="inline-flex h-10 items-center justify-center rounded border border-white/40 px-4 text-sm font-semibold uppercase transition hover:bg-white/10"
                >
                    Принять
                </button>
            </div>
        </div>
    );
}
