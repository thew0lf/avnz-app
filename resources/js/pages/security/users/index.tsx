import { useState, useEffect, useMemo, useCallback } from 'react';
import AppLayout from '@/layouts/app-layout';
import { Button } from '@/components/ui/button';
import { Input } from '@/components/ui/input';
import { Alert, AlertTitle, AlertDescription } from '@/components/ui/alert';
import { type BreadcrumbItem } from '@/types';
import { Head, router, usePage } from '@inertiajs/react';
import { PencilIcon, Trash2Icon, X, XIcon, PlusIcon } from 'lucide-react';

import { ColumnDef } from '@tanstack/react-table';
import {
    Dialog,
    DialogContent,
    DialogHeader,
    DialogTitle,
    DialogFooter,
    DialogClose,
} from '@/components/ui/dialog';
import {
    DataTablePage,
    ActionsMenu,
    ConfirmationModal
} from '@/components/DataTable';
import { formatDate, getUserTimezone } from '@/lib/utils';

// Define User interface
interface User {
    id: string;
    name: string;
    email: string;
    created_at: string;
    updated_at: string;
}

const breadcrumbs: BreadcrumbItem[] = [
    { title: 'Dashboard', href: '/dashboard' },
    { title: 'Security', href: '/security' },
    { title: 'Users', href: '/security/users' },
];

export default function Users() {
    const [usersData, setUsersData] = useState<User[]>([]);
    const [isAddModalOpen, setIsAddModalOpen] = useState<boolean>(false);
    const [isEditModalOpen, setIsEditModalOpen] = useState<boolean>(false);
    const [isDeleteModalOpen, setIsDeleteModalOpen] = useState<boolean>(false);
    const [selectedUser, setSelectedUser] = useState<User | null>(null);
    const [formData, setFormData] = useState({
        name: '',
        email: '',
        password: ''
    });
    const [errors, setErrors] = useState<{
        name?: string;
        email?: string;
        password?: string;
    }>({});
    const [errorMessage, setErrorMessage] = useState<string | null>(null);
    const [selectedTimezone, setSelectedTimezone] = useState<string>(getUserTimezone());

    // Save the selected timezone to localStorage when it changes
    useEffect(() => {
        localStorage.setItem('reportTimezone', selectedTimezone);
    }, [selectedTimezone]);

    // Use the users data passed from the server via Inertia
    const { props: { users, flash } } = usePage<{
        users: User[];
        flash: {
            success: string | null;
            error: string | null;
        };
    }>();

    useEffect(() => {
        setUsersData(users);
    }, [users]);

    const handleAdd = () => {
        setFormData({
            name: '',
            email: '',
            password: ''
        });
        setErrors({});
        setIsAddModalOpen(true);
    };

    const handleEdit = useCallback((id: string) => {
        const user = usersData.find(u => u.id === id);
        if (user) {
            setSelectedUser(user);
            setFormData({
                name: user.name,
                email: user.email,
                password: '' // Don't populate password for security reasons
            });
            setIsEditModalOpen(true);
        }
    }, [usersData]);

    const validateForm = (isEdit: boolean = false) => {
        const newErrors: {name?: string; email?: string; password?: string} = {};
        let isValid = true;

        if (!formData.name.trim()) {
            newErrors.name = 'Name is required';
            isValid = false;
        }

        if (!formData.email.trim()) {
            newErrors.email = 'Email is required';
            isValid = false;
        } else if (!/\S+@\S+\.\S+/.test(formData.email)) {
            newErrors.email = 'Email is invalid';
            isValid = false;
        }

        if (!isEdit && !formData.password.trim()) {
            newErrors.password = 'Password is required';
            isValid = false;
        } else if (formData.password && formData.password.length < 8) {
            newErrors.password = 'Password must be at least 8 characters';
            isValid = false;
        }

        setErrors(newErrors);
        return isValid;
    };

    const handleCreate = useCallback(() => {
        if (!validateForm()) {
            return;
        }

        setErrorMessage(null); // Clear any previous error
        router.post('/security/users', formData, {
            preserveScroll: true,
            onSuccess: () => {
                setIsAddModalOpen(false);
                setErrors({});
            },
            onError: (errors) => {
                if (Object.keys(errors).length > 0) {
                    setErrors(errors);
                } else {
                    setErrorMessage(`Failed to create user. Please try again.`);
                    setIsAddModalOpen(false);
                }
            },
        });
    }, [formData]);

    const handleUpdate = useCallback(() => {
        if (!selectedUser) return;

        if (!validateForm(true)) {
            return;
        }

        setErrorMessage(null); // Clear any previous error
        router.put(`/security/users/${selectedUser.id}`, formData, {
            preserveScroll: true,
            onSuccess: () => {
                setIsEditModalOpen(false);
                setErrors({});
            },
            onError: (errors) => {
                if (Object.keys(errors).length > 0) {
                    setErrors(errors);
                } else {
                    setErrorMessage(`Failed to update user "${selectedUser.name}". Please try again.`);
                    setIsEditModalOpen(false);
                }
            },
        });
    }, [selectedUser, formData]);

    const handleDeleteClick = useCallback((id: string) => {
        const user = usersData.find(u => u.id === id);
        if (user) {
            setSelectedUser(user);
            setIsDeleteModalOpen(true);
        }
    }, [usersData]);

    const handleDelete = useCallback(() => {
        if (!selectedUser) return;

        setErrorMessage(null); // Clear any previous error
        router.delete(`/security/users/${selectedUser.id}`, {
            preserveScroll: true,
            onSuccess: () => {
                setIsDeleteModalOpen(false);
            },
            onError: () => {
                setErrorMessage(`Failed to delete user "${selectedUser.name}". Please try again.`);
                setIsDeleteModalOpen(false);
            },
        });
    }, [selectedUser]);

    const columns = useMemo<ColumnDef<User>[]>(
        () => [
            { header: 'Name', accessorKey: 'name' },
            { header: 'Email', accessorKey: 'email' },
            {
                header: 'Created',
                accessorKey: 'created_at',
                cell: (info) => (
                    <span className="hidden md:inline">
                        {formatDate(info.getValue() as string, selectedTimezone)}
                    </span>
                )
            },
            {
                header: 'Updated',
                accessorKey: 'updated_at',
                cell: (info) => (
                    <span className="hidden md:inline">
                        {formatDate(info.getValue() as string, selectedTimezone)}
                    </span>
                )
            },
            {
                id: 'actions',
                header: '',
                cell: ({ row }) => (
                    <ActionsMenu
                        actions={[
                            {
                                label: 'Edit',
                                icon: <PencilIcon className="h-4 w-4" />,
                                onClick: () => handleEdit(row.original.id)
                            },
                            {
                                label: 'Delete',
                                icon: <Trash2Icon className="h-4 w-4" />,
                                onClick: () => handleDeleteClick(row.original.id),
                                variant: 'destructive'
                            }
                        ]}
                    />
                ),
            },
        ],
        [handleEdit, handleDeleteClick, selectedTimezone]
    );

    return (
        <AppLayout breadcrumbs={breadcrumbs}>
            <Head title="Users"/>

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

            <DataTablePage
                title="Users"
                data={usersData}
                columns={columns}
                searchField="name"
                showTimezone={true}
                initialTimezone={selectedTimezone}
                onTimezoneChange={setSelectedTimezone}
                onAddNew={handleAdd}
                addButtonLabel="Add User"
                renderMobileCard={(user, index) => (
                    <div
                        key={user.id}
                        className="bg-white dark:bg-gray-800 rounded-lg shadow p-4 border border-gray-100 dark:border-gray-700 transition-all duration-200 ease-in-out opacity-100"
                    >
                        <div className="flex justify-between items-center mb-2">
                            <h3 className="font-medium text-blue-600 dark:text-blue-400">{user.name}</h3>
                            <ActionsMenu
                                actions={[
                                    {
                                        label: 'Edit',
                                        icon: <PencilIcon className="h-4 w-4" />,
                                        onClick: () => handleEdit(user.id)
                                    },
                                    {
                                        label: 'Delete',
                                        icon: <Trash2Icon className="h-4 w-4" />,
                                        onClick: () => handleDeleteClick(user.id),
                                        variant: 'destructive'
                                    }
                                ]}
                            />
                        </div>
                        <div className="text-sm text-gray-600 dark:text-gray-300 space-y-1">
                            <p><span className="font-medium">Email:</span> {user.email}</p>
                            <p><span className="font-medium">Created:</span> {formatDate(user.created_at, selectedTimezone)}</p>
                            <p><span className="font-medium">Updated:</span> {formatDate(user.updated_at, selectedTimezone)}</p>
                        </div>
                    </div>
                )}
                emptyState={
                    <div className="text-center py-4 text-gray-500 dark:text-gray-400">
                        No users found
                    </div>
                }
                successMessage={flash.success}
                errorMessage={errorMessage || flash.error}
                onClearError={() => setErrorMessage(null)}
            />

            {/* Add User Modal */}
            <Dialog open={isAddModalOpen} onOpenChange={setIsAddModalOpen}>
                <DialogContent className="sm:max-w-md">
                    <DialogHeader>
                        <DialogTitle>Add User</DialogTitle>
                        <DialogClose className="absolute right-4 top-4 rounded-sm opacity-70 ring-offset-background transition-opacity hover:opacity-100 focus:outline-none focus:ring-2 focus:ring-ring focus:ring-offset-2 disabled:pointer-events-none data-[state=open]:bg-accent data-[state=open]:text-muted-foreground">
                            <X className="h-4 w-4" />
                            <span className="sr-only">Close</span>
                        </DialogClose>
                    </DialogHeader>
                    <div className="grid gap-4 py-4">
                        <div className="grid grid-cols-4 items-center gap-4">
                            <label htmlFor="name" className="text-right text-sm font-medium">
                                Name
                            </label>
                            <div className="col-span-3 space-y-1">
                                <Input
                                    id="name"
                                    value={formData.name}
                                    onChange={(e) => setFormData({ ...formData, name: e.target.value })}
                                    className={errors.name ? "border-red-500" : ""}
                                    required
                                />
                                {errors.name && (
                                    <p className="text-red-500 text-xs">{errors.name}</p>
                                )}
                            </div>
                        </div>
                        <div className="grid grid-cols-4 items-center gap-4">
                            <label htmlFor="email" className="text-right text-sm font-medium">
                                Email
                            </label>
                            <div className="col-span-3 space-y-1">
                                <Input
                                    id="email"
                                    type="email"
                                    value={formData.email}
                                    onChange={(e) => setFormData({ ...formData, email: e.target.value })}
                                    className={errors.email ? "border-red-500" : ""}
                                    required
                                />
                                {errors.email && (
                                    <p className="text-red-500 text-xs">{errors.email}</p>
                                )}
                            </div>
                        </div>
                        <div className="grid grid-cols-4 items-center gap-4">
                            <label htmlFor="password" className="text-right text-sm font-medium">
                                Password
                            </label>
                            <div className="col-span-3 space-y-1">
                                <Input
                                    id="password"
                                    type="password"
                                    value={formData.password}
                                    onChange={(e) => setFormData({ ...formData, password: e.target.value })}
                                    className={errors.password ? "border-red-500" : ""}
                                    required
                                />
                                {errors.password && (
                                    <p className="text-red-500 text-xs">{errors.password}</p>
                                )}
                            </div>
                        </div>
                    </div>
                    <DialogFooter>
                        <Button type="button" onClick={handleCreate}>
                            Create User
                        </Button>
                    </DialogFooter>
                </DialogContent>
            </Dialog>

            {/* Edit User Modal */}
            <Dialog open={isEditModalOpen} onOpenChange={setIsEditModalOpen}>
                <DialogContent className="sm:max-w-md">
                    <DialogHeader>
                        <DialogTitle>Edit User</DialogTitle>
                        <DialogClose className="absolute right-4 top-4 rounded-sm opacity-70 ring-offset-background transition-opacity hover:opacity-100 focus:outline-none focus:ring-2 focus:ring-ring focus:ring-offset-2 disabled:pointer-events-none data-[state=open]:bg-accent data-[state=open]:text-muted-foreground">
                            <X className="h-4 w-4" />
                            <span className="sr-only">Close</span>
                        </DialogClose>
                    </DialogHeader>
                    <div className="grid gap-4 py-4">
                        <div className="grid grid-cols-4 items-center gap-4">
                            <label htmlFor="edit_name" className="text-right text-sm font-medium">
                                Name
                            </label>
                            <div className="col-span-3 space-y-1">
                                <Input
                                    id="edit_name"
                                    value={formData.name}
                                    onChange={(e) => setFormData({ ...formData, name: e.target.value })}
                                    className={errors.name ? "border-red-500" : ""}
                                    required
                                />
                                {errors.name && (
                                    <p className="text-red-500 text-xs">{errors.name}</p>
                                )}
                            </div>
                        </div>
                        <div className="grid grid-cols-4 items-center gap-4">
                            <label htmlFor="edit_email" className="text-right text-sm font-medium">
                                Email
                            </label>
                            <div className="col-span-3 space-y-1">
                                <Input
                                    id="edit_email"
                                    type="email"
                                    value={formData.email}
                                    onChange={(e) => setFormData({ ...formData, email: e.target.value })}
                                    className={errors.email ? "border-red-500" : ""}
                                    required
                                />
                                {errors.email && (
                                    <p className="text-red-500 text-xs">{errors.email}</p>
                                )}
                            </div>
                        </div>
                        <div className="grid grid-cols-4 items-center gap-4">
                            <label htmlFor="edit_password" className="text-right text-sm font-medium">
                                Password
                            </label>
                            <div className="col-span-3 space-y-1">
                                <Input
                                    id="edit_password"
                                    type="password"
                                    value={formData.password}
                                    onChange={(e) => setFormData({ ...formData, password: e.target.value })}
                                    className={errors.password ? "border-red-500" : ""}
                                    placeholder="Leave blank to keep current password"
                                />
                                {errors.password && (
                                    <p className="text-red-500 text-xs">{errors.password}</p>
                                )}
                            </div>
                        </div>
                    </div>
                    <DialogFooter>
                        <Button type="button" onClick={handleUpdate}>
                            Save Changes
                        </Button>
                    </DialogFooter>
                </DialogContent>
            </Dialog>

            {/* Delete User Modal */}
            <ConfirmationModal
                open={isDeleteModalOpen}
                onOpenChange={setIsDeleteModalOpen}
                title="Delete User"
                confirmLabel="Delete"
                confirmVariant="destructive"
                onConfirm={handleDelete}
            >
                <div className="py-4">
                    <p className="text-center">Are you sure you want to delete the user <strong>{selectedUser?.name}</strong>?</p>
                    <p className="text-center text-sm text-gray-500 mt-1">This action cannot be undone.</p>
                </div>
            </ConfirmationModal>
        </AppLayout>
    );
}
