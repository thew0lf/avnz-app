import { Head, router, usePage, useForm } from '@inertiajs/react';
import AppLayout from '@/layouts/app-layout';
import { Card, CardContent } from '@/components/ui/card';
import { Button } from '@/components/ui/button';
import { Alert, AlertTitle, AlertDescription } from '@/components/ui/alert';
import { XIcon } from 'lucide-react';
import { useState } from 'react';
import { type BreadcrumbItem } from '@/types';

const breadcrumbs: BreadcrumbItem[] = [
    { title: 'Dashboard', href: '/dashboard' },
    { title: 'Members & Roles', href: '/members-and-roles' },
    { title: 'Roles', href: '/members-and-roles/roles' },
    { title: 'Edit Role', href: '#' },
];

interface Permission {
    id: number;
    name: string;
    description?: string;
}

interface RoleData {
    id: number;
    display_name: string;
    name: string;
    permissions: Permission[];
}

interface RoleFormData {
    display_name: string;
    name: string;
    permissions: number[];
    [key: string]: any;
}

export default function Edit() {
    const { props: { role, permissions, flash } } = usePage<{
        role: RoleData;
        permissions: Permission[];
        flash: {
            success: string | null;
            error: string | null;
        };
    }>();

    const [errorMessage, setErrorMessage] = useState<string | null>(null);

    const { data, setData, put, processing, errors } = useForm<RoleFormData>({
        display_name: role.display_name,
        name: role.name,
        permissions: role.permissions.map((p) => p.id),
    });

    const handleSubmit = (e: React.FormEvent) => {
        e.preventDefault();
        setErrorMessage(null); // Clear any previous error
        put(`/members-and-roles/roles/${role.id}`, {
            preserveScroll: true,
            onError: (errors) => {
                // If there's a general error message
                if (errors.error) {
                    setErrorMessage(errors.error);
                } else if (errors._error) {
                    setErrorMessage(errors._error);
                } else {
                    setErrorMessage('An error occurred while updating the role. Please try again.');
                }
            },
        });
    };

    const togglePermission = (id: number) => {
        const newPermissions = data.permissions.includes(id)
            ? data.permissions.filter((p) => p !== id)
            : [...data.permissions, id];
        setData('permissions', newPermissions);
    };

    const toggleAllPermissions = (checked: boolean) => {
        const newPermissions = checked
            ? permissions.map((p) => p.id)
            : [];
        setData('permissions', newPermissions);
    };

    return (
        <AppLayout breadcrumbs={breadcrumbs}>
            <Head title="Edit Role" />
            {flash.success && (
                <div className="p-4">
                    <Alert className="relative bg-green-50 border-green-500 text-green-800">
                        <AlertTitle>Success</AlertTitle>
                        <AlertDescription>{flash.success}</AlertDescription>
                    </Alert>
                </div>
            )}
            {flash.error && (
                <div className="p-4">
                    <Alert variant="destructive" className="relative">
                        <AlertTitle>Error</AlertTitle>
                        <AlertDescription>{flash.error}</AlertDescription>
                    </Alert>
                </div>
            )}
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
                                onChange={(e) => setData('display_name', e.target.value)}
                                className={`w-full mt-1 border rounded p-2 ${errors.display_name ? 'border-red-500' : ''}`}
                                required
                            />
                            {errors.display_name && (
                                <div className="text-red-500 text-sm mt-1">{errors.display_name}</div>
                            )}
                        </div>

                        <div>
                            <label className="block font-medium mt-4">Route Name</label>
                            <input
                                type="text"
                                value={data.name}
                                onChange={(e) => setData('name', e.target.value)}
                                className={`w-full mt-1 border rounded p-2 ${errors.name ? 'border-red-500' : ''}`}
                                required
                            />
                            {errors.name && (
                                <div className="text-red-500 text-sm mt-1">{errors.name}</div>
                            )}
                        </div>

                        <div className="mt-4">
                            <p className="font-medium">Permissions</p>
                            <div className="grid grid-cols-2 gap-2 mt-1">
                                <div className="col-span-2 border-b pb-2 mb-2">
                                    <label className="inline-flex items-center font-medium">
                                        <input
                                            type="checkbox"
                                            checked={data.permissions.length === permissions.length}
                                            onChange={(e) => toggleAllPermissions(e.target.checked)}
                                            className="mr-2"
                                        />
                                        <span>Select All</span>
                                    </label>
                                </div>
                                {permissions.map((perm) => (
                                    <label key={perm.id} className="inline-flex items-center">
                                        <input
                                            type="checkbox"
                                            checked={data.permissions.includes(perm.id)}
                                            onChange={() => togglePermission(perm.id)}
                                            className="mr-2"
                                        />
                                        <span>{perm.description || perm.name}</span>
                                    </label>
                                ))}
                            </div>
                        </div>

                        <div className="mt-6">
                            <Button type="submit" disabled={processing}>
                                {processing ? 'Updating...' : 'Update Role'}
                            </Button>
                        </div>
                        {errors.permissions && (
                            <div className="text-red-500 text-sm mt-2">{errors.permissions}</div>
                        )}
                    </CardContent>
                </Card>
            </form>
        </AppLayout>
    );
}
