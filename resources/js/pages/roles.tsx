import AppLayout from '@/layouts/app-layout';
import { Head } from '@inertiajs/react';
import { Card, CardHeader, CardTitle, CardContent } from '@/components/ui/card';
import { type BreadcrumbItem } from '@/types';

interface Permission {
    id: number;
    name: string;
    description?: string;
}

interface Role {
    id: number;
    name: string;
    display_name?: string;
    permissions: Permission[];
}

interface RolesProps {
    roles: Role[];
}

const breadcrumbs: BreadcrumbItem[] = [
    { title: 'Dashboard', href: '/dashboard' },
    { title: 'Members & Roles', href: '/members-and-roles/roles' },
];

export default function Roles({ roles }: RolesProps) {
    return (
        <AppLayout breadcrumbs={breadcrumbs}>
            <Head title="Roles" />
            <div className="flex h-full flex-1 flex-col gap-4 rounded-xl p-4">
                <div className="grid grid-cols-1 gap-6 md:grid-cols-2 lg:grid-cols-3">
                    {roles.map((role) => (
                        <Card key={role.id} className="transition-shadow hover:shadow-lg">
                            <CardHeader>
                                <CardTitle>{role.display_name || role.name}</CardTitle>
                            </CardHeader>
                            <CardContent>
                                <p className="text-muted-foreground text-sm mb-2">Route: {role.name}</p>
                                <p className="font-semibold">Permissions:</p>
                                <ul className="list-disc ml-5 text-sm">
                                    {role.permissions.length > 0 ? (
                                        role.permissions.map((perm) => (
                                            <li key={perm.id}>{perm.description || perm.name}</li>
                                        ))
                                    ) : (
                                        <li>No permissions assigned</li>
                                    )}
                                </ul>
                            </CardContent>
                        </Card>
                    ))}
                </div>
            </div>
        </AppLayout>
    );
}
