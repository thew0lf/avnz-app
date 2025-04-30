import React from 'react';
import { Link } from '@inertiajs/react';
import {
    SidebarMenu,
    SidebarMenuItem,
    SidebarMenuButton,
    SidebarMenuSub,
    SidebarMenuSubItem,
    SidebarMenuSubButton,
} from '@/components/ui/sidebar';
import { Collapsible, CollapsibleTrigger, CollapsibleContent } from '@/components/ui/collapsible';
import { type NavItem } from '@/types';

interface NavMainProps {
    items: NavItem[];
}

export function NavMain({ items }: NavMainProps) {
    return (
        <SidebarMenu>
            {items.map((item) => {
                // Render a collapsible dropdown if the item has children.
                if (item.children && item.children.length > 0) {
                    return (
                        <Collapsible key={item.title} defaultOpen={false} className="group/collapsible">
                            <SidebarMenuItem>
                                <CollapsibleTrigger asChild>
                                    <SidebarMenuButton>
                                        {item.icon && <item.icon className="mr-2" />}
                                        <span>{item.title}</span>
                                    </SidebarMenuButton>
                                </CollapsibleTrigger>
                                <CollapsibleContent>
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

                // Render a standard menu item if no children exist.
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
            })}
        </SidebarMenu>
    );
}
