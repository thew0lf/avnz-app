import { useState, useEffect, useCallback } from 'react';
import { Head, router, useForm, usePage } from '@inertiajs/react';
import AppLayout from '@/layouts/app-layout';
import { Card, CardHeader, CardTitle, CardContent, CardFooter } from '@/components/ui/card';
import { Button } from '@/components/ui/button';
import { Alert, AlertTitle, AlertDescription } from '@/components/ui/alert';
import { PlusIcon, PencilIcon, ViewIcon, Trash2Icon, X, XIcon } from 'lucide-react';
import { type BreadcrumbItem } from '@/types';
import {
    Dialog,
    DialogContent,
    DialogHeader,
    DialogTitle,
    DialogFooter,
    DialogClose,
    DialogDescription,
} from '@/components/ui/dialog';

interface Permission {
    id: number;
    name: string;
    display_name?: string;
    description?: string;
}

interface Role {
    id: number;
    display_name: string;
    name: string;
    permissions: Permission[];
}

interface RoleFormData {
    display_name: string;
    name: string;
    permissions: string[];
    [key: string]: any;
}

const breadcrumbs: BreadcrumbItem[] = [
    { title: 'Dashboard', href: '/dashboard' },
    { title: 'Members & Roles', href: '/members-and-roles' },
    { title: 'Roles', href: '/members-and-roles/roles' },
];

export default function Index() {
    // Use the roles and permissions data passed from the server via Inertia
    const { props: { roles: initialRoles, permissions: initialPermissions, flash } } = usePage<{
        roles: Role[];
        permissions: Permission[];
        flash: {
            success: string | null;
            error: string | null;
        };
    }>();

    const [roles, setRoles] = useState<Role[]>(initialRoles);
    const [allPermissions, setAllPermissions] = useState<Permission[]>(initialPermissions);
    const [selectedRole, setSelectedRole] = useState<Role | null>(null);
    const [viewModalOpen, setViewModalOpen] = useState(false);
    const [editModalOpen, setEditModalOpen] = useState(false);
    const [deleteModalOpen, setDeleteModalOpen] = useState(false);
    const [isLoading, setIsLoading] = useState(false);
    const [errorMessage, setErrorMessage] = useState<string | null>(null);


    const { data, setData, errors, put, processing, reset } = useForm<RoleFormData>({
        display_name: '',
        name: '',
        permissions: [],
    });

    const handleView = useCallback(async (id: number) => {
        setIsLoading(true);
        try {
            const role = roles.find(r => r.id === id);
            if (role) {
                setSelectedRole(role);
                setViewModalOpen(true);
            }
        } catch (error) {
            console.error('Error fetching role details:', error);
        } finally {
            setIsLoading(false);
        }
    }, [roles]);

    const handleEdit = useCallback(async (id: number) => {
        setIsLoading(true);
        try {
            const role = roles.find(r => r.id === id);
            if (role) {
                setSelectedRole(role);
                setData({
                    display_name: role.display_name,
                    name: role.name,
                    permissions: role.permissions,
                });
                setEditModalOpen(true);
            }
        } catch (error) {
            console.error('Error fetching role details:', error);
        } finally {
            setIsLoading(false);
        }
    }, [roles, setData]);

    const handleCreate = useCallback(() => {
        router.visit(route('members-and-roles.roles.create'));
    }, []);

    const handleDelete = useCallback(() => {
        if (!selectedRole) return;

        setErrorMessage(null); // Clear any previous errors
        router.delete(`/members-and-roles/roles/${selectedRole.id}`, {
            preserveScroll: true,
            onSuccess: () => {
                setDeleteModalOpen(false);
                // The page will be refreshed automatically with the updated roles
            },
            onError: () => {
                setErrorMessage(`Failed to delete role "${selectedRole.display_name}". Please try again.`);
                setDeleteModalOpen(false);
            },
        });
    }, [selectedRole]);

    const handleSubmitEdit = useCallback((e: React.FormEvent) => {
        e.preventDefault();
        if (!selectedRole) return;

        setErrorMessage(null); // Clear any previous errors
        put(`/members-and-roles/roles/${selectedRole.id}`, {
            preserveScroll: true,
            onSuccess: (page) => {
                // Update the local state with the updated role data
                if (page.props.roles) {
                    setRoles(page.props.roles);
                } else {
                    // If the updated roles aren't provided in the response, update the specific role
                    const updatedRole = {
                        ...selectedRole,
                        display_name: data.display_name,
                        name: data.name,
                        permissions: data.permissions.map(p => parseInt(p)),
                    };

                    setRoles(prevRoles =>
                        prevRoles.map(role =>
                            role.id === selectedRole.id ? updatedRole : role
                        )
                    );
                }

                setEditModalOpen(false);
                reset();
            },
            onError: (errors) => {
                // If there's a general error message
                if (errors.error) {
                    setErrorMessage(errors.error);
                    setEditModalOpen(false);
                } else if (errors._error) {
                    setErrorMessage(errors._error);
                    setEditModalOpen(false);
                } else if (Object.keys(errors).length > 0) {
                    // Form validation errors are handled by the form itself
                    // We don't need to close the modal or show a general error
                }
            },
        });
    }, [selectedRole, put, reset, data]);

    const togglePermission = useCallback((id: number) => {
        const strId = String(id);
        const newPermissions = data.permissions.includes(strId)
            ? data.permissions.filter(p => p !== strId)
            : [...data.permissions, strId];
        setData('permissions', newPermissions);
    }, [data.permissions, setData]);

    const toggleAllPermissions = useCallback((checked: boolean) => {
        const newPermissions = checked
            ? allPermissions.map(p => String(p.id))
            : [];
        setData('permissions', newPermissions);
    }, [allPermissions, setData]);

    return (
        <AppLayout breadcrumbs={breadcrumbs}>
            <Head title="Roles" />
            {flash.success && (
                <div className="p-4">
                    <Alert className="relative border-green-500 bg-green-50 text-green-800">
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
                            className="absolute top-2 right-2 rounded-full p-1 hover:bg-red-100 dark:hover:bg-red-900"
                            aria-label="Close error message"
                        >
                            <XIcon className="h-4 w-4" />
                        </button>
                    </Alert>
                </div>
            )}
            <div className="flex h-full flex-1 flex-col gap-4 rounded-xl p-4">
                <div className="grid grid-cols-1 gap-6 md:grid-cols-2 lg:grid-cols-3">
                    {initialRoles.map((role) => {
                        return (
                            <Card key={role.id} className="transition-shadow hover:shadow-lg">
                                <CardHeader>
                                    <CardTitle>{role.display_name}</CardTitle>
                                </CardHeader>

                                <CardContent>
                                    <p className="text-muted-foreground text-sm">Route: {role.name}</p>
                                    <div className="mt-3">
                                        <p className="text-sm font-medium">Permissions:</p>
                                        <ul className="list-inside space-y-1">
                                            {allPermissions.map((perm) => {
                                                const hasPermission = role.permissions.some((p) => p === perm.id);
                                                return (
                                                    <li className="flex items-center gap-2 text-sm" key={perm.id}>
                                                        {hasPermission ? (
                                                            <div className="h-2 w-2 rounded-full bg-green-500" />
                                                        ) : (
                                                            <X className="h-3 w-3 text-red-500" />
                                                        )}
                                                        {perm.description || perm.name}
                                                    </li>
                                                );
                                            })}
                                        </ul>
                                    </div>
                                </CardContent>

                                <CardFooter className="flex space-x-2">
                                    <Button variant="outline" size="sm" onClick={() => handleView(role.id)}>
                                        <ViewIcon className="mr-2 h-4 w-4" /> View
                                    </Button>
                                    <Button variant="outline" size="sm" onClick={() => handleEdit(role.id)}>
                                        <PencilIcon className="mr-2 h-4 w-4" /> Modify
                                    </Button>
                                </CardFooter>
                            </Card>
                        );
                    })}

                    <Card
                        onClick={handleCreate}
                        className="flex cursor-pointer flex-col items-center justify-center border-2 border-dashed hover:bg-gray-50"
                    >
                        <CardContent className="flex flex-col items-center py-12">
                            <PlusIcon className="text-primary mb-2 h-8 w-8" />
                            <p className="text-primary text-sm font-medium">Add New Role</p>
                        </CardContent>
                    </Card>
                </div>
            </div>

            {/* View Role Modal */}
            <Dialog open={viewModalOpen} onOpenChange={setViewModalOpen}>
                <DialogContent className="sm:max-w-md">
                    <DialogHeader>
                        <DialogTitle>View Role</DialogTitle>
                        <DialogDescription>
                            View details and permissions for this role.
                        </DialogDescription>
                        <DialogClose className="ring-offset-background focus:ring-ring data-[state=open]:bg-accent data-[state=open]:text-muted-foreground absolute top-4 right-4 rounded-sm opacity-70 transition-opacity hover:opacity-100 focus:ring-2 focus:ring-offset-2 focus:outline-none disabled:pointer-events-none">
                            <X className="h-4 w-4" />
                            <span className="sr-only">Close</span>
                        </DialogClose>
                    </DialogHeader>
                    {selectedRole && (
                        <div className="py-4">
                            <div className="mb-4">
                                <h3 className="text-lg font-semibold">{selectedRole.display_name}</h3>
                                <p className="text-sm text-gray-500">Route: {selectedRole.name}</p>
                            </div>
                            <div>
                                <p className="font-medium">Permissions:</p>
                                <ul className="mt-2 list-inside space-y-1">
                                    {allPermissions.map((perm) => {
                                        const hasPermission = selectedRole?.permissions?.some((p) => p === perm.id) || false;
                                        return (
                                            <li className="flex items-center gap-2 text-sm" key={perm.id}>
                                                {hasPermission ? (
                                                    <div className="h-2 w-2 rounded-full bg-green-500" />
                                                ) : (
                                                    <X className="h-3 w-3 text-red-500" />
                                                )}
                                                {perm.description || perm.name}
                                            </li>
                                        );
                                    })}
                                </ul>
                            </div>
                        </div>
                    )}
                    <DialogFooter className="flex justify-end space-x-2">
                        <Button
                            variant="outline"
                            onClick={() => {
                                setViewModalOpen(false);
                                if (selectedRole) {
                                    handleEdit(selectedRole.id);
                                }
                            }}
                        >
                            <PencilIcon className="mr-2 h-4 w-4" /> Edit
                        </Button>
                        <Button
                            variant="destructive"
                            onClick={() => {
                                setViewModalOpen(false);
                                setDeleteModalOpen(true);
                            }}
                        >
                            <Trash2Icon className="mr-2 h-4 w-4" /> Delete
                        </Button>
                    </DialogFooter>
                </DialogContent>
            </Dialog>

            {/* Edit Role Modal */}
            <Dialog open={editModalOpen} onOpenChange={setEditModalOpen}>
                <DialogContent className="sm:max-w-md">
                    <DialogHeader>
                        <DialogTitle>Edit Role</DialogTitle>
                        <DialogDescription>
                            Modify the role details and permissions.
                        </DialogDescription>
                        <DialogClose className="ring-offset-background focus:ring-ring data-[state=open]:bg-accent data-[state=open]:text-muted-foreground absolute top-4 right-4 rounded-sm opacity-70 transition-opacity hover:opacity-100 focus:ring-2 focus:ring-offset-2 focus:outline-none disabled:pointer-events-none">
                            <X className="h-4 w-4" />
                            <span className="sr-only">Close</span>
                        </DialogClose>
                    </DialogHeader>

                    <form onSubmit={handleSubmitEdit} className="space-y-4 py-4">
                        {/* Display Name Field */}
                        <div className="space-y-2">
                            <label htmlFor="display_name" className="text-sm font-medium leading-none peer-disabled:cursor-not-allowed peer-disabled:opacity-70">
                                Display Name
                            </label>
                            <input
                                id="display_name"
                                type="text"
                                value={data.display_name}
                                onChange={(e) => setData('display_name', e.target.value)}
                                className={`flex h-10 w-full rounded-md border border-input bg-background px-3 py-2 text-sm ring-offset-background file:border-0 file:bg-transparent file:text-sm file:font-medium placeholder:text-muted-foreground focus-visible:outline-none focus-visible:ring-2 focus-visible:ring-ring focus-visible:ring-offset-2 disabled:cursor-not-allowed disabled:opacity-50 ${
                                    errors.display_name ? 'border-red-500 focus-visible:ring-red-500' : ''
                                }`}
                                required
                            />
                            {errors.display_name && (
                                <p className="text-sm font-medium text-red-500">{errors.display_name}</p>
                            )}
                        </div>

                        {/* Route Name Field */}
                        <div className="space-y-2">
                            <label htmlFor="route_name" className="text-sm font-medium leading-none peer-disabled:cursor-not-allowed peer-disabled:opacity-70">
                                Route Name
                            </label>
                            <input
                                id="route_name"
                                type="text"
                                value={data.name}
                                onChange={(e) => setData('name', e.target.value)}
                                className={`flex h-10 w-full rounded-md border border-input bg-background px-3 py-2 text-sm ring-offset-background file:border-0 file:bg-transparent file:text-sm file:font-medium placeholder:text-muted-foreground focus-visible:outline-none focus-visible:ring-2 focus-visible:ring-ring focus-visible:ring-offset-2 disabled:cursor-not-allowed disabled:opacity-50 ${
                                    errors.name ? 'border-red-500 focus-visible:ring-red-500' : ''
                                }`}
                                required
                            />
                            {errors.name && (
                                <p className="text-sm font-medium text-red-500">{errors.name}</p>
                            )}
                        </div>

                        {/* Permissions Section */}
                        <div className="space-y-2">
                            <div className="flex items-center justify-between">
                                <label className="text-sm font-medium leading-none">Permissions</label>
                                <Button
                                    type="button"
                                    variant="outline"
                                    size="sm"
                                    onClick={(e) => toggleAllPermissions(data.permissions.length !== allPermissions.length)}
                                    className="h-8 text-xs"
                                >
                                    {data.permissions.length === allPermissions.length ? 'Deselect All' : 'Select All'}
                                </Button>
                            </div>

                            <div className="max-h-60 overflow-y-auto rounded-md border border-input p-2">
                                <div className="grid grid-cols-1 gap-2 md:grid-cols-2">
                                    {allPermissions.map((perm) => (
                                        <label
                                            key={perm.id}
                                            className="flex items-center space-x-2 rounded-md p-2 hover:bg-muted"
                                        >
                                            <input
                                                type="checkbox"
                                                checked={data.permissions.includes(String(perm.id))}
                                                onChange={() => togglePermission(perm.id)}
                                                className="h-4 w-4 rounded border-gray-300 text-primary focus:ring-primary"
                                            />
                                            <span className="text-sm">{perm.description || perm.name}</span>
                                        </label>
                                    ))}
                                </div>
                            </div>

                            {errors.permissions && (
                                <p className="text-sm font-medium text-red-500">{errors.permissions}</p>
                            )}
                        </div>

                        <DialogFooter>
                            <Button
                                type="button"
                                variant="outline"
                                onClick={() => setEditModalOpen(false)}
                                className="mr-2"
                            >
                                Cancel
                            </Button>
                            <Button type="submit" disabled={processing}>
                                {processing ? 'Updating...' : 'Update Role'}
                            </Button>
                        </DialogFooter>
                    </form>
                </DialogContent>
            </Dialog>

            {/* Delete Role Modal */}
            <Dialog open={deleteModalOpen} onOpenChange={setDeleteModalOpen}>
                <DialogContent className="sm:max-w-md">
                    <DialogHeader>
                        <DialogTitle>Delete Role</DialogTitle>
                        <DialogDescription>
                            Confirm deletion of this role.
                        </DialogDescription>
                        <DialogClose className="ring-offset-background focus:ring-ring data-[state=open]:bg-accent data-[state=open]:text-muted-foreground absolute top-4 right-4 rounded-sm opacity-70 transition-opacity hover:opacity-100 focus:ring-2 focus:ring-offset-2 focus:outline-none disabled:pointer-events-none">
                            <X className="h-4 w-4" />
                            <span className="sr-only">Close</span>
                        </DialogClose>
                    </DialogHeader>
                    <div className="py-4">
                        <p className="text-center">
                            Are you sure you want to delete the role <strong>{selectedRole?.display_name}</strong>?
                        </p>
                        <p className="mt-1 text-center text-sm text-gray-500">This action cannot be undone.</p>
                    </div>
                    <DialogFooter className="flex justify-end space-x-2">
                        <Button type="button" variant="outline" onClick={() => setDeleteModalOpen(false)}>
                            Cancel
                        </Button>
                        <Button type="button" variant="destructive" onClick={handleDelete}>
                            Delete
                        </Button>
                    </DialogFooter>
                </DialogContent>
            </Dialog>
        </AppLayout>
    );
}
