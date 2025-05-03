import React, { useState, useEffect, useMemo, useCallback } from 'react';
import { Card, CardHeader, CardTitle, CardContent, CardFooter } from '@/components/ui/card';
import { Button } from '@/components/ui/button';
import { PlusIcon, PencilIcon,ViewIcon } from 'lucide-react';
import { Head } from '@inertiajs/react';
import { Input } from '../../components/ui/input.js';
import { flexRender } from '@tanstack/react-table';
import { motion } from 'framer-motion';
import AppLayout from '../../layouts/app-layout.js';
import { type BreadcrumbItem } from '@/types';

const breadcrumbs: BreadcrumbItem[] = [
    { title: 'Dashboard', href: '/dashboard' },
    { title: 'Members & Roles', href: '/members-and-roles' },
    { title: 'Roles', href: '/members-and-roles/roles' },
];

export default function Index() {
    const [roles, setRoles] = React.useState<Role[]>([]);

    React.useEffect(() => {
        fetch('/api/roles') // or your actual API route
            .then(res => res.json())
            .then(data => setRoles(data))
            .catch(console.error);
    }, []);


    return (
        <AppLayout breadcrumbs={breadcrumbs}>
            <Head title="Roles" />
            <div className="flex h-full flex-1 flex-col gap-4 rounded-xl p-4">
                <div className="grid grid-cols-1 gap-6 md:grid-cols-2 lg:grid-cols-3">
                    {/* Role cards */}
                    {roles.map((role) => (
                        <Card key={role.id} className="transition-shadow hover:shadow-lg">
                            <CardHeader>
                                <CardTitle>{role.display_name}</CardTitle>
                            </CardHeader>

                            <CardContent>
                                <p className="text-muted-foreground text-sm">Route: {role.name}</p>
                                <div className="mt-3">
                                    <p className="text-sm">Permissions:</p>
                                    <ul className="list-inside list-disc space-y-1">
                                        {role.permissions.map((perm) => (
                                            <li className="text-sm marker:text-blue-500" key={perm.id}>
                                                {perm.description}
                                            </li>
                                        ))}
                                    </ul>
                                </div>
                            </CardContent>

                            <CardFooter>
                                <span className="mr-2">
                                <Button variant="outline" size="sm" onClick={() => Inertia.visit(route('roles.edit', role.id))}>
                                    <ViewIcon className="mr-2 h-4 w-4" />
                                    View
                                </Button>
                                </span>
                                <span className="ml-2">
                                <Button variant="outline" size="sm" onClick={() => Inertia.visit(route('roles.edit', role.id))}>
                                    <PencilIcon className="mr-2 h-4 w-4" />
                                    Modify
                                </Button>
                                </span>

                            </CardFooter>
                        </Card>
                    ))}

                    {/* Card to create a new role */}
                    <Card
                        onClick={() => Inertia.visit(route('roles.create'))}
                        className="flex cursor-pointer flex-col items-center justify-center border-2 border-dashed hover:bg-gray-50"
                    >
                        <CardContent className="flex flex-col items-center py-12">
                            <p>
                                <svg
                                    width="160"
                                    height="160"
                                    viewBox="0 0 160 160"
                                    fill="none"
                                    xmlns="http://www.w3.org/2000/svg"
                                    className="mx-auto mt-6"
                                >
                                    <rect width="160" height="160" rx="16" fill="#EFF6FF" />
                                    <circle cx="80" cy="60" r="24" fill="#C7D2FE" />
                                    <path
                                        d="M44 132c0-18 36-18 36-18s36 0 36 18v4H44v-4z"
                                        fill="#C7D2FE"
                                    />
                                    <rect x="100" y="96" width="40" height="8" rx="4" fill="#6366F1" />
                                    <rect x="116" y="80" width="8" height="40" rx="4" fill="#6366F1" />
                                </svg>
                            </p>
                        </CardContent>
                    </Card>

                </div>
            </div>
        </AppLayout>
    );
}
