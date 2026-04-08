import type { Auth } from '@/types/auth';

declare module '@inertiajs/core' {
    export interface InertiaConfig {
        sharedPageProps: {
            name: string;
            auth: Auth;
            admin: {
                unreadMessages: number;
            };
            sidebarOpen: boolean;
            [key: string]: unknown;
        };
    }
}
