import { Link, usePage } from '@inertiajs/react';
import { BookOpen, LayoutGrid, Bug, Handshake, Package, MessageSquareMore, Building, ScrollText } from 'lucide-react';
import { NavFooter } from '@/components/nav-footer';
import { NavMain } from '@/components/nav-main';
import { NavUser } from '@/components/nav-user';
import {
    Sidebar,
    SidebarContent,
    SidebarFooter,
    SidebarHeader,
    SidebarMenu,
    SidebarMenuButton,
    SidebarMenuItem,
} from '@/components/ui/sidebar';
import type { NavItem } from '@/types';
import AppLogo from './app-logo';

const footerNavItems: NavItem[] = [
    {
        title: 'Документация',
        href: 'https://laravel.com/docs/starter-kits#react',
        icon: BookOpen,
    },
    {
        title: 'Разработчик: Bital',
        href: 'mailto:bital2509@gmail.com',
        icon: Bug,
    },
];

export function AppSidebar() {
    const page = usePage();
    const unreadMessages = Number(page.props.admin?.unreadMessages ?? 0);

    const mainNavItems: NavItem[] = [
        {
            title: 'Админка',
            href: '/admin',
            icon: LayoutGrid,
        },
        {
            title: 'О компании',
            href: '/admin/company',
            icon: Building,
        },
        {
            title: 'Услуги',
            href: '/admin/services',
            icon: Package,
        },
        {
            title: 'Партнеры',
            href: '/admin/partners',
            icon: Handshake,
        },
        {
            title: 'Лицензии',
            href: '/admin/licenses',
            icon: ScrollText,
        },
        {
            title:
                unreadMessages > 0
                    ? `Обратная связь (${unreadMessages})`
                    : 'Обратная связь',
            href: '/admin/messages',
            icon: MessageSquareMore,
        },
    ];

    return (
        <Sidebar collapsible="icon" variant="inset">
            <SidebarHeader>
                <SidebarMenu>
                    <SidebarMenuItem>
                        <SidebarMenuButton size="lg" asChild>
                            <Link href="/admin" prefetch>
                                <AppLogo />
                            </Link>
                        </SidebarMenuButton>
                    </SidebarMenuItem>
                </SidebarMenu>
            </SidebarHeader>

            <SidebarContent>
                <NavMain items={mainNavItems} />
            </SidebarContent>

            <SidebarFooter>
                <NavFooter items={footerNavItems} className="mt-auto" />
                <NavUser />
            </SidebarFooter>
        </Sidebar>
    );
}
