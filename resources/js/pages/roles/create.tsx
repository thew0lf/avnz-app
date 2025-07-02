import { useState, useEffect } from 'react';
import { Head, router, usePage } from '@inertiajs/react';
import AppLayout from '@/layouts/app-layout';
import { Card, CardContent } from '@/components/ui/card';
import { Button } from '@/components/ui/button';
import { Alert, AlertTitle, AlertDescription } from '@/components/ui/alert';
import { XIcon } from 'lucide-react';
import { type BreadcrumbItem } from '@/types';

const breadcrumbs: BreadcrumbItem[] = [
    { title: 'Dashboard', href: '/dashboard' },
    { title: 'Members & Roles', href: '/members-and-roles' },
    { title: 'Roles', href: '/members-and-roles/roles' },
    { title: 'Create Role', href: '/members-and-roles/roles/create' },
];

interface Permission {
    id: number;
    display_name: string;
    description?: string;
}

interface RoleFormData {
    display_name: string;
    name: string;
    permissions: number[];
}

export default function Create() {
    const [data, setData] = useState<RoleFormData>({ display_name: '', name: '', permissions: [] });
    const [permissions, setPermissions] = useState<Permission[]>([]);
    const [selectAll, setSelectAll] = useState(false);
    const [errorMessage, setErrorMessage] = useState<string | null>(null);

    // Use the permissions data passed from the server via Inertia
    const { props: { permissions: initialPermissions } } = usePage<{
        permissions: Permission[]
    }>();

    useEffect(() => {
        setPermissions(initialPermissions);
    }, [initialPermissions]);

    useEffect(() => {
        if (selectAll) {
            setData((prev) => ({ ...prev, permissions: permissions.map((p) => p.id) }));
        } else {
            setData((prev) => ({ ...prev, permissions: [] }));
        }
    }, [selectAll, permissions]);

    const handleSubmit = (e: React.FormEvent) => {
        e.preventDefault();
        setErrorMessage(null); // Clear any previous error
        router.post(route('roles.store'), data, {
            onSuccess: () => {
                router.visit('/members-and-roles/roles');
            },
            onError: (errors) => {
                // If there's a general error message
                if (errors.error) {
                    setErrorMessage(errors.error);
                } else if (errors._error) {
                    setErrorMessage(errors._error);
                } else {
                    setErrorMessage('An error occurred while creating the role. Please try again.');
                }
            },
        });
    };

    const togglePermission = (id: number) => {
        setData((prev) => {
            const isSelected = prev.permissions.includes(id);
            const newPerms = isSelected
                ? prev.permissions.filter((p) => p !== id)
                : [...prev.permissions, id];
            setSelectAll(newPerms.length === permissions.length);
            return { ...prev, permissions: newPerms };
        });
    };

    return (
        <AppLayout breadcrumbs={breadcrumbs}>
            <Head title="Create Role" />
            {errorMessage && (
                <div className="p-4">
                    <Alert variant="destructive" className="relative">
                        <AlertTitle>Error</AlertTitle>
                        <AlertDescription>{errorMessage}</AlertDescription>
                        <button
                            onClick={() => setErrorMessage(null)}
                            className="absolute top-2 right-2 p-1 rounded-full hover:bg-red-100 dark:hover:bg-red-900"
                            aria-label="Close error message"
                        >
                            <XIcon className="h-4 w-4" />
                        </button>
                    </Alert>
                </div>
            )}
            <form onSubmit={handleSubmit} className="space-y-6 p-4">
                <Card>
                    <CardContent>
                        <div>
                            <label className="block font-medium">Display Name</label>
                            <input
                                type="text"
                                value={data.display_name}
                                onChange={(e) => setData({ ...data, display_name: e.target.value })}
                                className="w-full mt-1 border rounded p-2"
                                required
                            />
                        </div>

                        <div>
                            <label className="block font-medium mt-4">Route Name</label>
                            <input
                                type="text"
                                value={data.name}
                                onChange={(e) => setData({ ...data, name: e.target.value })}
                                className="w-full mt-1 border rounded p-2"
                                required
                            />
                        </div>

                        <div className="mt-4">
                            <p className="font-medium">Permissions</p>
                            <label className="inline-flex items-center mt-2">
                                <input
                                    type="checkbox"
                                    checked={selectAll}
                                    onChange={() => setSelectAll(!selectAll)}
                                    className="mr-2"
                                />
                                <span>All</span>
                            </label>
                            <div className="grid grid-cols-2 gap-2 mt-2">
                                {permissions.map((perm) => (
                                    <label key={perm.id} className="inline-flex items-center">
                                        <input
                                            type="checkbox"
                                            checked={data.permissions.includes(perm.id)}
                                            onChange={() => togglePermission(perm.id)}
                                            className="mr-2"
                                        />
                                        <span>{perm.display_name || perm.description}</span>
                                    </label>
                                ))}
                            </div>
                        </div>

                        <div className="mt-6">
                            <Button type="submit">Create Role</Button>
                        </div>
                    </CardContent>
                </Card>
            </form>
        </AppLayout>
    );
}
