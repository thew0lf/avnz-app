import { useState, useEffect, useMemo, useCallback } from 'react';
import AppLayout from '@/layouts/app-layout';
import { Card, CardHeader, CardContent } from '@/components/ui/card';
import { Input } from '@/components/ui/input';
import { Button } from '@/components/ui/button';
import { Alert, AlertTitle, AlertDescription } from '@/components/ui/alert';
import { type BreadcrumbItem } from '@/types';
import { Head, router, usePage } from '@inertiajs/react';
import { MoreHorizontal, PencilIcon, Trash2Icon, X, XIcon } from 'lucide-react';

import {
    ColumnDef,
    useReactTable,
    getCoreRowModel,
    flexRender,
} from '@tanstack/react-table';
import {
    DropdownMenu,
    DropdownMenuTrigger,
    DropdownMenuContent,
    DropdownMenuItem,
    DropdownMenuLabel,
} from '@/components/ui/dropdown-menu';
import {
    Dialog,
    DialogContent,
    DialogHeader,
    DialogTitle,
    DialogFooter,
    DialogClose,
} from '@/components/ui/dialog';
import { Permission } from '@/types/permissions';

const breadcrumbs: BreadcrumbItem[] = [
    { title: 'Dashboard', href: '/dashboard' },
    { title: 'Members & Roles', href: '/members-and-roles' },
    { title: 'Permissions', href: '/members-and-roles/permissions' },
];

interface PermissionTableProps {
    data: Permission[];
    onEdit: (id: string) => void;
    onDelete: (id: string) => void;
}

const NoPermissionsFound = () => (
    <div className="text-center py-4 text-gray-500">
        No permissions found
    </div>
);

export default function Permissions() {
    const [permissionsData, setPermissionsData] = useState<Permission[]>([]);
    const [filter, setFilter] = useState<string>('');
    const [isEditModalOpen, setIsEditModalOpen] = useState<boolean>(false);
    const [isDeleteModalOpen, setIsDeleteModalOpen] = useState<boolean>(false);
    const [selectedPermission, setSelectedPermission] = useState<Permission | null>(null);
    const [editFormData, setEditFormData] = useState({
        name: '',
        guard_name: ''
    });
    const [errors, setErrors] = useState<{
        name?: string;
        guard_name?: string;
    }>({});
    const [errorMessage, setErrorMessage] = useState<string | null>(null);

    // Use the permissions data passed from the server via Inertia
    const { props: { permissions, flash } } = usePage<{
        permissions: Permission[];
        flash: {
            success: string | null;
            error: string | null;
        };
    }>();

    useEffect(() => {
        setPermissionsData(permissions);
    }, [permissions]);

    // No need to fetch permissions as they are passed from the server via Inertia

    const handleEdit = useCallback((id: string) => {
        const permission = permissionsData.find(p => p.id === id);
        if (permission) {
            setSelectedPermission(permission);
            setEditFormData({
                name: permission.name,
                guard_name: permission.guard_name
            });
            setIsEditModalOpen(true);
        }
    }, [permissionsData]);

    const validateEditForm = () => {
        const newErrors: {name?: string; guard_name?: string} = {};
        let isValid = true;

        if (!editFormData.name.trim()) {
            newErrors.name = 'Name is required';
            isValid = false;
        }

        if (!editFormData.guard_name.trim()) {
            newErrors.guard_name = 'Guard name is required';
            isValid = false;
        }

        setErrors(newErrors);
        return isValid;
    };

    const handleUpdate = useCallback(() => {
        if (!selectedPermission) return;

        if (!validateEditForm()) {
            return;
        }

        setErrorMessage(null); // Clear any previous error
        router.put(`/members-and-roles/permissions/${selectedPermission.id}`, editFormData, {
            preserveScroll: true,
            onSuccess: () => {
                setIsEditModalOpen(false);
                setErrors({});
            },
            onError: (errors) => {
                if (Object.keys(errors).length > 0) {
                    setErrors(errors);
                } else {
                    setErrorMessage(`Failed to update permission "${selectedPermission.name}". Please try again.`);
                    setIsEditModalOpen(false);
                }
            },
        });
    }, [selectedPermission, editFormData]);

    const handleDeleteClick = useCallback((id: string) => {
        const permission = permissionsData.find(p => p.id === id);
        if (permission) {
            setSelectedPermission(permission);
            setIsDeleteModalOpen(true);
        }
    }, [permissionsData]);

    const handleDelete = useCallback(() => {
        if (!selectedPermission) return;

        setErrorMessage(null); // Clear any previous error
        router.delete(`/members-and-roles/permissions/${selectedPermission.id}`, {
            preserveScroll: true,
            onSuccess: () => {
                setIsDeleteModalOpen(false);
            },
            onError: () => {
                setErrorMessage(`Failed to delete permission "${selectedPermission.name}". Please try again.`);
                setIsDeleteModalOpen(false);
            },
        });
    }, [selectedPermission]);

    const filteredData = useMemo(
        () =>
            permissionsData.filter((p) =>
                p.name.toLowerCase().includes(filter.toLowerCase())
            ),
        [permissionsData, filter]
    );

    const columns = useMemo<ColumnDef<Permission>[]>(
        () => [
            { header: 'Name', accessorKey: 'name' },
            {
                header: 'Guard',
                accessorKey: 'guard_name',
                cell: (info) => <span className="hidden md:inline">{info.getValue() as string}</span>
            },
            {
                header: 'Created',
                accessorKey: 'created_at',
                cell: (info) => <span className="hidden md:inline">{info.getValue() as string}</span>
            },
            {
                header: 'Updated',
                accessorKey: 'updated_at',
                cell: (info) => <span className="hidden md:inline">{info.getValue() as string}</span>
            },
            {
                id: 'actions',
                header: '',
                cell: ({ row }) => (
                    <DropdownMenu>
                        <DropdownMenuTrigger asChild>
                            <Button variant="ghost" size="sm" className="h-8 w-8 p-0">
                                <span className="sr-only">Open menu</span>
                                <MoreHorizontal className="h-4 w-4" />
                            </Button>
                        </DropdownMenuTrigger>
                        <DropdownMenuContent align="end">
                            <DropdownMenuLabel className="font-bold">Actions</DropdownMenuLabel>
                            <DropdownMenuItem onClick={() => handleEdit(row.original.id)}>
                                <PencilIcon className="mr-2 h-4 w-4" />
                                Edit
                            </DropdownMenuItem>
                            <DropdownMenuItem onClick={() => handleDeleteClick(row.original.id)} variant="destructive">
                                <Trash2Icon className="mr-2 h-4 w-4" />
                                Delete
                            </DropdownMenuItem>
                        </DropdownMenuContent>
                    </DropdownMenu>
                ),
            },
        ],
        [handleDelete, handleEdit]
    );

    const table = useReactTable({
        data: filteredData,
        columns,
        getCoreRowModel: getCoreRowModel(),
    });

    return (
        <AppLayout breadcrumbs={breadcrumbs}>
            <Head title="Permissions"/>
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
            <div className="flex h-full flex-1 flex-col gap-4 rounded-xl p-4">
                <Card className="rounded-2xl shadow p-4 grid gap-4">
                    <CardHeader>
                        <div className="flex flex-col sm:flex-row sm:justify-between sm:items-center gap-2">
                            <h1 className="text-xl font-bold">Permissions</h1>
                            <Input
                                placeholder="Search permissions..."
                                value={filter}
                                onChange={(e) => setFilter(e.target.value)}
                                className="max-w-sm"
                            />
                        </div>
                    </CardHeader>

                    {/* Mobile view - Card layout */}
                    <div className="md:hidden">
                        <div className="grid gap-4">
                            {filteredData.length === 0 ? (
                                <NoPermissionsFound />
                            ) : (
                                table.getRowModel().rows.map((row) => (
                                    <div
                                        key={row.id}
                                        className="bg-white rounded-lg shadow p-4 border border-gray-100 transition-all duration-200 ease-in-out opacity-100"
                                    >
                                        <div className="flex justify-between items-center mb-2">
                                            <h3 className="font-medium text-blue-600">{row.original.name}</h3>
                                            {flexRender(
                                                table.getHeaderGroups()[0].headers[4].column.columnDef.cell,
                                                row.getVisibleCells()[4].getContext()
                                            )}
                                        </div>
                                        <div className="text-sm text-gray-600 space-y-1">
                                            <p><span className="font-medium">Guard:</span> {row.original.guard_name}</p>
                                            <p><span className="font-medium">Created:</span> {row.original.created_at}</p>
                                            <p><span className="font-medium">Updated:</span> {row.original.updated_at}</p>
                                        </div>
                                    </div>
                                ))
                            )}
                        </div>
                    </div>

                    {/* Desktop view - Table layout */}
                    <CardContent className="hidden md:block">
                        <div className="overflow-auto rounded-md border">
                            {filteredData.length === 0 ? (
                                <NoPermissionsFound />
                            ) : (
                                <table className="min-w-full divide-y divide-gray-200">
                                    <thead className="bg-gray-50">
                                    {table.getHeaderGroups().map((headerGroup) => (
                                        <tr key={headerGroup.id}>
                                            {headerGroup.headers.map((header) => (
                                                <th
                                                    key={header.id}
                                                    className="px-4 py-3 text-left text-xs font-medium uppercase text-gray-500"
                                                >
                                                    {header.isPlaceholder
                                                        ? null
                                                        : flexRender(
                                                            header.column.columnDef.header,
                                                            header.getContext()
                                                        )}
                                                </th>
                                            ))}
                                        </tr>
                                    ))}
                                    </thead>
                                    <tbody className="bg-white divide-y divide-gray-100">
                                    {table.getRowModel().rows.map((row) => (
                                        <tr
                                            key={row.id}
                                            className="hover:bg-gray-50 transition-colors duration-200"
                                        >
                                            {row.getVisibleCells().map((cell) => (
                                                <td
                                                    key={cell.id}
                                                    className="px-4 py-3 text-sm text-gray-900"
                                                >
                                                    {flexRender(
                                                        cell.column.columnDef.cell,
                                                        cell.getContext()
                                                    )}
                                                </td>
                                            ))}
                                        </tr>
                                    ))}
                                    </tbody>
                                </table>
                            )}
                        </div>
                    </CardContent>
                </Card>
            </div>

            {/* Edit Permission Modal */}
            <Dialog open={isEditModalOpen} onOpenChange={setIsEditModalOpen}>
                <DialogContent className="sm:max-w-md">
                    <DialogHeader>
                        <DialogTitle>Edit Permission</DialogTitle>
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
                                    value={editFormData.name}
                                    onChange={(e) => setEditFormData({ ...editFormData, name: e.target.value })}
                                    className={errors.name ? "border-red-500" : ""}
                                    required
                                />
                                {errors.name && (
                                    <p className="text-red-500 text-xs">{errors.name}</p>
                                )}
                            </div>
                        </div>
                        <div className="grid grid-cols-4 items-center gap-4">
                            <label htmlFor="guard_name" className="text-right text-sm font-medium">
                                Guard Name
                            </label>
                            <div className="col-span-3 space-y-1">
                                <Input
                                    id="guard_name"
                                    value={editFormData.guard_name}
                                    onChange={(e) => setEditFormData({ ...editFormData, guard_name: e.target.value })}
                                    className={errors.guard_name ? "border-red-500" : ""}
                                    required
                                />
                                {errors.guard_name && (
                                    <p className="text-red-500 text-xs">{errors.guard_name}</p>
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

            {/* Delete Permission Modal */}
            <Dialog open={isDeleteModalOpen} onOpenChange={setIsDeleteModalOpen}>
                <DialogContent className="sm:max-w-md">
                    <DialogHeader>
                        <DialogTitle>Delete Permission</DialogTitle>
                        <DialogClose className="absolute right-4 top-4 rounded-sm opacity-70 ring-offset-background transition-opacity hover:opacity-100 focus:outline-none focus:ring-2 focus:ring-ring focus:ring-offset-2 disabled:pointer-events-none data-[state=open]:bg-accent data-[state=open]:text-muted-foreground">
                            <X className="h-4 w-4" />
                            <span className="sr-only">Close</span>
                        </DialogClose>
                    </DialogHeader>
                    <div className="py-4">
                        <p className="text-center">Are you sure you want to delete the permission <strong>{selectedPermission?.name}</strong>?</p>
                        <p className="text-center text-sm text-gray-500 mt-1">This action cannot be undone.</p>
                    </div>
                    <DialogFooter className="flex space-x-2 justify-end">
                        <Button type="button" variant="outline" onClick={() => setIsDeleteModalOpen(false)}>
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
