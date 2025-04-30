
import AppLayout from '@/layouts/app-layout';
import { Head } from '@inertiajs/react';

interface Role {
    id: number;
    name: string;
}

interface RolesProps {
    roles: Role[];
}

const breadcrumbs = [
    { title: 'Dashboard', href: '/dashboard' },
    { title: 'Members & Roles', href: '/members-and-roles/roles' },
];

export default function Roles({ roles }: RolesProps) {
    return (
        <AppLayout breadcrumbs={breadcrumbs}>
            <Head title="Roles" />
            <div className="p-4">
                <h1 className="text-2xl font-bold mb-4">Roles</h1>
                <ul>
                    {roles.map((role) => (
                        <li key={role.id} className="border p-2 rounded mb-2">
                            {role.name}
                        </li>
                    ))}
                </ul>
            </div>
        </AppLayout>
    );
}
