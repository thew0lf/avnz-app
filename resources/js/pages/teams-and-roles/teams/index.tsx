import { useState, useEffect, useMemo, useCallback } from 'react';
import AppLayout from '@/layouts/app-layout';
import { Button } from '@/components/ui/button';
import { Alert, AlertTitle, AlertDescription } from '@/components/ui/alert';
import { type BreadcrumbItem } from '@/types';
import { Head, router, usePage } from '@inertiajs/react';
import { PencilIcon, Trash2Icon, X, XIcon, PlusIcon, EyeIcon } from 'lucide-react';

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
import { Select, SelectContent, SelectItem, SelectTrigger, SelectValue } from '@/components/ui/select';

// Define Team interface
interface Team {
    id: string;
    name: string;
    display_name: string;
    description: string | null;
    created_at: string;
    updated_at: string;
}

const breadcrumbs: BreadcrumbItem[] = [
    { title: 'Dashboard', href: '/dashboard' },
    { title: 'Teams & Roles', href: '/teams-and-roles' },
    { title: 'Teams', href: '/teams-and-roles/teams' },
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

// Define Team interface

export default function Teams() {
    const [teamsData, setTeamsData] = useState<Team[]>([]);
    const [isAddModalOpen, setIsAddModalOpen] = useState<boolean>(false);
    const [isEditModalOpen, setIsEditModalOpen] = useState<boolean>(false);
    const [isDeleteModalOpen, setIsDeleteModalOpen] = useState<boolean>(false);
    const [selectedTeam, setSelectedTeam] = useState<Team | null>(null);
    const [formData, setFormData] = useState({
        name: '',
        display_name: '',
        description: ''
    });
    const [errors, setErrors] = useState<{
        name?: string;
        display_name?: string;
        description?: string;
    }>({});
    const [errorMessage, setErrorMessage] = useState<string | null>(null);
    const [selectedTimezone, setSelectedTimezone] = useState<string>(getUserTimezone());

    // Save the selected timezone to localStorage when it changes
    useEffect(() => {
        localStorage.setItem('reportTimezone', selectedTimezone);
    }, [selectedTimezone]);

    // Use the teams data passed from the server via Inertia
    const { props: { teams, flash } } = usePage<{
        teams: Team[];
        flash: {
            success: string | null;
            error: string | null;
        };
    }>();

    useEffect(() => {
        setTeamsData(teams);
    }, [teams]);

    const handleAdd = () => {
        setFormData({
            name: '',
            display_name: '',
            description: ''
        });
        setErrors({});
        setIsAddModalOpen(true);
    };

    const handleEdit = useCallback((id: string) => {
        const team = teamsData.find(t => t.id === id);
        if (team) {
            setSelectedTeam(team);
            setFormData({
                name: team.name,
                display_name: team.display_name,
                description: team.description || ''
            });
            setIsEditModalOpen(true);
        }
    }, [teamsData]);

    const handleView = useCallback((id: string) => {
        router.visit(`/teams-and-roles/teams/${id}`);
    }, []);

    const validateForm = () => {
        const newErrors: {name?: string; display_name?: string; description?: string} = {};
        let isValid = true;

        if (!formData.name.trim()) {
            newErrors.name = 'Name is required';
            isValid = false;
        }

        if (!formData.display_name.trim()) {
            newErrors.display_name = 'Display name is required';
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
        router.post('/teams-and-roles/teams', formData, {
            preserveScroll: true,
            onSuccess: () => {
                setIsAddModalOpen(false);
                setErrors({});
            },
            onError: (errors) => {
                if (Object.keys(errors).length > 0) {
                    setErrors(errors);
                } else {
                    setErrorMessage(`Failed to create team. Please try again.`);
                    setIsAddModalOpen(false);
                }
            },
        });
    }, [formData]);

    const handleUpdate = useCallback(() => {
        if (!selectedTeam) return;

        if (!validateForm()) {
            return;
        }

        setErrorMessage(null); // Clear any previous error
        router.put(`/teams-and-roles/teams/${selectedTeam.id}`, formData, {
            preserveScroll: true,
            onSuccess: () => {
                setIsEditModalOpen(false);
                setErrors({});
            },
            onError: (errors) => {
                if (Object.keys(errors).length > 0) {
                    setErrors(errors);
                } else {
                    setErrorMessage(`Failed to update team "${selectedTeam.name}". Please try again.`);
                    setIsEditModalOpen(false);
                }
            },
        });
    }, [selectedTeam, formData]);

    const handleDeleteClick = useCallback((id: string) => {
        const team = teamsData.find(t => t.id === id);
        if (team) {
            setSelectedTeam(team);
            setIsDeleteModalOpen(true);
        }
    }, [teamsData]);

    const handleDelete = useCallback(() => {
        if (!selectedTeam) return;

        setErrorMessage(null); // Clear any previous error
        router.delete(`/teams-and-roles/teams/${selectedTeam.id}`, {
            preserveScroll: true,
            onSuccess: () => {
                setIsDeleteModalOpen(false);
            },
            onError: () => {
                setErrorMessage(`Failed to delete team "${selectedTeam.name}". Please try again.`);
                setIsDeleteModalOpen(false);
            },
        });
    }, [selectedTeam]);

    const columns = useMemo<ColumnDef<Team>[]>(
        () => [
            { header: 'Name', accessorKey: 'name' },
            {
                header: 'Display Name',
                accessorKey: 'display_name',
                cell: (info) => <span className="hidden md:inline">{info.getValue() as string}</span>
            },
            {
                header: 'Description',
                accessorKey: 'description',
                cell: (info) => {
                    const value = info.getValue() as string | null;
                    return <span className="hidden md:inline">{value || '-'}</span>;
                }
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
                                label: 'View',
                                icon: <EyeIcon className="h-4 w-4" />,
                                onClick: () => handleView(row.original.id)
                            },
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
        [handleView, handleEdit, handleDeleteClick, selectedTimezone]
    );


    return (
        <AppLayout breadcrumbs={breadcrumbs}>
            <Head title="Teams"/>

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
                title="Teams"
                data={teamsData}
                columns={columns}
                searchField="name"
                showTimezone={true}
                initialTimezone={selectedTimezone}
                onTimezoneChange={setSelectedTimezone}
                onAddNew={handleAdd}
                addButtonLabel="Add Team"
                renderMobileCard={(team, index) => (
                    <div
                        key={team.id}
                        className="bg-white dark:bg-gray-800 rounded-lg shadow p-4 border border-gray-100 dark:border-gray-700 transition-all duration-200 ease-in-out opacity-100"
                    >
                        <div className="flex justify-between items-center mb-2">
                            <h3 className="font-medium text-blue-600 dark:text-blue-400">{team.name}</h3>
                            <ActionsMenu
                                actions={[
                                    {
                                        label: 'View',
                                        icon: <EyeIcon className="h-4 w-4" />,
                                        onClick: () => handleView(team.id)
                                    },
                                    {
                                        label: 'Edit',
                                        icon: <PencilIcon className="h-4 w-4" />,
                                        onClick: () => handleEdit(team.id)
                                    },
                                    {
                                        label: 'Delete',
                                        icon: <Trash2Icon className="h-4 w-4" />,
                                        onClick: () => handleDeleteClick(team.id),
                                        variant: 'destructive'
                                    }
                                ]}
                            />
                        </div>
                        <div className="text-sm text-gray-600 dark:text-gray-300 space-y-1">
                            <p><span className="font-medium">Display Name:</span> {team.display_name}</p>
                            <p><span className="font-medium">Description:</span> {team.description || '-'}</p>
                            <p><span className="font-medium">Created:</span> {formatDate(team.created_at, selectedTimezone)}</p>
                            <p><span className="font-medium">Updated:</span> {formatDate(team.updated_at, selectedTimezone)}</p>
                        </div>
                    </div>
                )}
                emptyState={
                    <div className="text-center py-4 text-gray-500 dark:text-gray-400">
                        No teams found
                    </div>
                }
                successMessage={flash.success}
                errorMessage={errorMessage || flash.error}
                onClearError={() => setErrorMessage(null)}
            />

            {/* Add Team Modal */}
            <Dialog open={isAddModalOpen} onOpenChange={setIsAddModalOpen}>
                <DialogContent className="sm:max-w-md">
                    <DialogHeader>
                        <DialogTitle>Add Team</DialogTitle>
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
                            <label htmlFor="display_name" className="text-right text-sm font-medium">
                                Display Name
                            </label>
                            <div className="col-span-3 space-y-1">
                                <Input
                                    id="display_name"
                                    value={formData.display_name}
                                    onChange={(e) => setFormData({ ...formData, display_name: e.target.value })}
                                    className={errors.display_name ? "border-red-500" : ""}
                                    required
                                />
                                {errors.display_name && (
                                    <p className="text-red-500 text-xs">{errors.display_name}</p>
                                )}
                            </div>
                        </div>
                        <div className="grid grid-cols-4 items-center gap-4">
                            <label htmlFor="description" className="text-right text-sm font-medium">
                                Description
                            </label>
                            <div className="col-span-3 space-y-1">
                                <Input
                                    id="description"
                                    value={formData.description}
                                    onChange={(e) => setFormData({ ...formData, description: e.target.value })}
                                    className={errors.description ? "border-red-500" : ""}
                                />
                                {errors.description && (
                                    <p className="text-red-500 text-xs">{errors.description}</p>
                                )}
                            </div>
                        </div>
                    </div>
                    <DialogFooter>
                        <Button type="button" onClick={handleCreate}>
                            Create Team
                        </Button>
                    </DialogFooter>
                </DialogContent>
            </Dialog>

            {/* Edit Team Modal */}
            <Dialog open={isEditModalOpen} onOpenChange={setIsEditModalOpen}>
                <DialogContent className="sm:max-w-md">
                    <DialogHeader>
                        <DialogTitle>Edit Team</DialogTitle>
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
                            <label htmlFor="edit_display_name" className="text-right text-sm font-medium">
                                Display Name
                            </label>
                            <div className="col-span-3 space-y-1">
                                <Input
                                    id="edit_display_name"
                                    value={formData.display_name}
                                    onChange={(e) => setFormData({ ...formData, display_name: e.target.value })}
                                    className={errors.display_name ? "border-red-500" : ""}
                                    required
                                />
                                {errors.display_name && (
                                    <p className="text-red-500 text-xs">{errors.display_name}</p>
                                )}
                            </div>
                        </div>
                        <div className="grid grid-cols-4 items-center gap-4">
                            <label htmlFor="edit_description" className="text-right text-sm font-medium">
                                Description
                            </label>
                            <div className="col-span-3 space-y-1">
                                <Input
                                    id="edit_description"
                                    value={formData.description}
                                    onChange={(e) => setFormData({ ...formData, description: e.target.value })}
                                    className={errors.description ? "border-red-500" : ""}
                                />
                                {errors.description && (
                                    <p className="text-red-500 text-xs">{errors.description}</p>
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

            {/* Delete Team Modal */}
            <ConfirmationModal
                open={isDeleteModalOpen}
                onOpenChange={setIsDeleteModalOpen}
                title="Delete Team"
                confirmLabel="Delete"
                confirmVariant="destructive"
                onConfirm={handleDelete}
            >
                <div className="py-4">
                    <p className="text-center">Are you sure you want to delete the team <strong>{selectedTeam?.name}</strong>?</p>
                    <p className="text-center text-sm text-gray-500 mt-1">This action cannot be undone.</p>
                </div>
            </ConfirmationModal>
        </AppLayout>
    );
}
