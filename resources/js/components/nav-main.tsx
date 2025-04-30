import React from 'react';
import { Link } from '@inertiajs/react';
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
    const renderNavItem = (item: NavItem) => {
        if (item.children && item.children.length > 0) {
            return (
                <Collapsible key={item.title} defaultOpen={false}>
                    <SidebarMenuItem>
                        <CollapsibleTrigger asChild>
                            <SidebarMenuButton className="flex items-center [&[data-state=open]>svg]:rotate-180">
                                {item.icon && <item.icon className="mr-2" />}
                                <span>{item.title}</span>
                                <ChevronDown className="ml-auto h-4 w-4 transition-transform duration-200 ease-in-out" />
                            </SidebarMenuButton>
                        </CollapsibleTrigger>
                        <CollapsibleContent className="overflow-hidden transition-[height] duration-300 ease-out">
                            <SidebarMenuSub>
                                {item.children.map((child) => (
                                    <SidebarMenuSubItem key={child.title}>
                                        <SidebarMenuSubButton asChild>
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
                <SidebarMenuButton asChild>
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
