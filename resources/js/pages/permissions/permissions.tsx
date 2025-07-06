import { useState, useEffect, useMemo, useCallback } from 'react';
import AppLayout from '@/layouts/app-layout';
import { Button } from '@/components/ui/button';
import { type BreadcrumbItem } from '@/types';
import { Head, router, usePage } from '@inertiajs/react';
import { PencilIcon, Trash2Icon, X } from 'lucide-react';

import { ColumnDef } from '@tanstack/react-table';
import {
    Dialog,
    DialogContent,
    DialogHeader,
    DialogTitle,
    DialogFooter,
    DialogClose,
} from '@/components/ui/dialog';
import { Input } from '@/components/ui/input';
import {
    DataTablePage,
    ActionsMenu,
    ConfirmationModal
} from '@/components/DataTable';
import { Permission } from '@/types/permissions';
import { formatDate, getUserTimezone } from '@/lib/utils';
import { Select, SelectContent, SelectItem, SelectTrigger, SelectValue } from '@/components/ui/select';

const breadcrumbs: BreadcrumbItem[] = [
    { title: 'Dashboard', href: '/dashboard' },
    { title: 'Teams & Roles', href: '/teams-and-roles' },
    { title: 'Permissions', href: '/teams-and-roles/permissions' },
];

// List of common timezones
const timezones = [
    'Africa/Abidjan', 'Africa/Accra', 'Africa/Algiers', 'Africa/Bissau', 'Africa/Cairo', 'Africa/Casablanca',
    'Africa/Johannesburg', 'Africa/Lagos', 'Africa/Nairobi', 'America/Argentina/Buenos_Aires', 'America/Bogota',
    'America/Caracas', 'America/Chicago', 'America/Denver', 'America/Halifax', 'America/Los_Angeles',
    'America/Mexico_City', 'America/New_York', 'America/Phoenix', 'America/Santiago', 'America/Sao_Paulo',
    'America/St_Johns', 'America/Toronto', 'Asia/Baghdad', 'Asia/Bangkok', 'Asia/Beirut', 'Asia/Dhaka',
    'Asia/Dubai', 'Asia/Hong_Kong', 'Asia/Istanbul', 'Asia/Jakarta', 'Asia/Jerusalem', 'Asia/Karachi',
    'Asia/Kolkata', 'Asia/Kuala_Lumpur', 'Asia/Manila', 'Asia/Qatar', 'Asia/Seoul', 'Asia/Shanghai',
    'Asia/Singapore', 'Asia/Taipei', 'Asia/Tehran', 'Asia/Tokyo', 'Australia/Adelaide', 'Australia/Brisbane',
    'Australia/Darwin', 'Australia/Melbourne', 'Australia/Perth', 'Australia/Sydney', 'Europe/Amsterdam',
    'Europe/Athens', 'Europe/Belgrade', 'Europe/Berlin', 'Europe/Brussels', 'Europe/Bucharest', 'Europe/Budapest',
    'Europe/Copenhagen', 'Europe/Dublin', 'Europe/Helsinki', 'Europe/Lisbon', 'Europe/London', 'Europe/Madrid',
    'Europe/Moscow', 'Europe/Oslo', 'Europe/Paris', 'Europe/Prague', 'Europe/Rome', 'Europe/Stockholm',
    'Europe/Vienna', 'Europe/Warsaw', 'Europe/Zurich', 'Pacific/Auckland', 'Pacific/Fiji', 'Pacific/Honolulu',
    'Pacific/Midway', 'UTC'
];

export default function Permissions() {
    const [permissionsData, setPermissionsData] = useState<Permission[]>([]);
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
    const [selectedTimezone, setSelectedTimezone] = useState<string>(getUserTimezone());

    // Save the selected timezone to localStorage when it changes
    useEffect(() => {
        localStorage.setItem('reportTimezone', selectedTimezone);
    }, [selectedTimezone]);

    const handleTimezoneChange = (timezone: string) => {
        setSelectedTimezone(timezone);
    };

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
        router.put(`/teams-and-roles/permissions/${selectedPermission.id}`, editFormData, {
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
        router.delete(`/teams-and-roles/permissions/${selectedPermission.id}`, {
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
            <Head title="Permissions"/>


            <DataTablePage
                title="Permissions"
                data={permissionsData}
                columns={columns}
                searchField="name"
                showTimezone={true}
                initialTimezone={selectedTimezone}
                onTimezoneChange={handleTimezoneChange}
                renderMobileCard={(permission, index) => (
                    <div
                        key={permission.id}
                        className="bg-white dark:bg-gray-800 rounded-lg shadow p-4 border border-gray-100 dark:border-gray-700 transition-all duration-200 ease-in-out opacity-100"
                    >
                        <div className="flex justify-between items-center mb-2">
                            <h3 className="font-medium text-blue-600 dark:text-blue-400">{permission.name}</h3>
                            <ActionsMenu
                                actions={[
                                    {
                                        label: 'Edit',
                                        icon: <PencilIcon className="h-4 w-4" />,
                                        onClick: () => handleEdit(permission.id)
                                    },
                                    {
                                        label: 'Delete',
                                        icon: <Trash2Icon className="h-4 w-4" />,
                                        onClick: () => handleDeleteClick(permission.id),
                                        variant: 'destructive'
                                    }
                                ]}
                            />
                        </div>
                        <div className="text-sm text-gray-600 dark:text-gray-300 space-y-1">
                            <p><span className="font-medium">Guard:</span> {permission.guard_name}</p>
                            <p><span className="font-medium">Created:</span> {formatDate(permission.created_at, selectedTimezone)}</p>
                            <p><span className="font-medium">Updated:</span> {formatDate(permission.updated_at, selectedTimezone)}</p>
                        </div>
                    </div>
                )}
                emptyState={
                    <div className="text-center py-4 text-gray-500 dark:text-gray-400">
                        No permissions found
                    </div>
                }
                successMessage={flash.success}
                errorMessage={errorMessage || flash.error}
                onClearError={() => setErrorMessage(null)}
            />

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
            <ConfirmationModal
                open={isDeleteModalOpen}
                onOpenChange={setIsDeleteModalOpen}
                title="Delete Permission"
                confirmLabel="Delete"
                confirmVariant="destructive"
                onConfirm={handleDelete}
            >
                <div className="py-4">
                    <p className="text-center">Are you sure you want to delete the permission <strong>{selectedPermission?.name}</strong>?</p>
                    <p className="text-center text-sm text-gray-500 mt-1">This action cannot be undone.</p>
                </div>
            </ConfirmationModal>
        </AppLayout>
    );
}
