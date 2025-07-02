import React from 'react';
import { Link, usePage } from '@inertiajs/react';
import { ChevronDown, LucideIcon } from 'lucide-react';

// @ts-ignore
import { type NavItem } from '@/types';

import {
    SidebarMenu,
    SidebarMenuItem,
    SidebarMenuButton,
    SidebarMenuSub,
    SidebarMenuSubItem,
    SidebarMenuSubButton,
} from '@/components/ui/sidebar';
import { Collapsible, CollapsibleTrigger, CollapsibleContent } from '@/components/ui/collapsible';

export interface NavItem {
    title: string;
    href: string;
    icon?: LucideIcon | null;
    isActive?: boolean;
    children?: NavItem[];
};

interface NavMainProps {
    items: NavItem[];
}

export function NavMain({ items }: NavMainProps) {
    const { url } = usePage();

    // Check if a menu item should be open based on current URL
    const isItemActive = (item: NavItem): boolean => {
        // Special case for dashboard or home page
        if (item.href === '/dashboard' && url === '/dashboard') {
            return true;
        }

        // For other routes, check if the current URL starts with the item's href
        // But avoid matching partial paths (e.g. /members should not match /members-and-roles)
        if (item.href !== '/' && item.href !== '/dashboard') {
            const itemPath = item.href.endsWith('/') ? item.href : `${item.href}/`;
            const currentPath = url.endsWith('/') ? url : `${url}/`;

            if (currentPath.startsWith(itemPath) || url === item.href) {
                return true;
            }
        }

        // Check if any children are active
        if (item.children) {
            return item.children.some(child => isItemActive(child));
        }

        return false;
    };

    const renderNavItem = (item: NavItem) => {
        if (item.children && item.children.length > 0) {
            return (
                <Collapsible key={item.title} defaultOpen={isItemActive(item)}>
                    <SidebarMenuItem>
                        <CollapsibleTrigger asChild>
                            <SidebarMenuButton
                                className={`flex items-center [&[data-state=open]>svg]:rotate-180 ${isItemActive(item) ? "bg-accent text-accent-foreground" : ""}`}
                            >
                                {item.icon && <item.icon className="mr-2" />}
                                <span>{item.title}</span>
                                <ChevronDown className="ml-auto h-4 w-4 transition-transform duration-200 ease-in-out" />
                            </SidebarMenuButton>
                        </CollapsibleTrigger>
                        <CollapsibleContent className="overflow-hidden transition-[height] duration-300 ease-out">
                            <SidebarMenuSub>
                                {item.children.map((child) => (
                                    <SidebarMenuSubItem key={child.title}>
                                        <SidebarMenuSubButton
                                            className={isItemActive(child) ? "bg-accent text-accent-foreground" : ""}
                                            asChild
                                        >
                                            <Link href={child.href}>{child.title}</Link>
                                        </SidebarMenuSubButton>
                                    </SidebarMenuSubItem>
                                ))}
                            </SidebarMenuSub>
                        </CollapsibleContent>
                    </SidebarMenuItem>
                </Collapsible>
            );
        }

        return (
            <SidebarMenuItem key={item.title}>
                <SidebarMenuButton
                    className={isItemActive(item) ? "bg-accent text-accent-foreground" : ""}
                    asChild
                >
                    <Link href={item.href}>
                        {item.icon && <item.icon className="mr-2" />}
                        <span>{item.title}</span>
                    </Link>
                </SidebarMenuButton>
            </SidebarMenuItem>
        );
    };

    return <SidebarMenu>{items.map(renderNavItem)}</SidebarMenu>;
}
