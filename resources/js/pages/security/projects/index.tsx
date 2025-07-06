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

// Define Project interface
interface Project {
    id: string;
    name: string;
    display_name: string;
    address_id: string | null;
    created_at: string;
    updated_at: string;
}

const breadcrumbs: BreadcrumbItem[] = [
    { title: 'Dashboard', href: '/dashboard' },
    { title: 'Security', href: '/security' },
    { title: 'Projects', href: '/security/projects' },
];

export default function Projects() {
    const [projectsData, setProjectsData] = useState<Project[]>([]);
    const [isAddModalOpen, setIsAddModalOpen] = useState<boolean>(false);
    const [isEditModalOpen, setIsEditModalOpen] = useState<boolean>(false);
    const [isDeleteModalOpen, setIsDeleteModalOpen] = useState<boolean>(false);
    const [selectedProject, setSelectedProject] = useState<Project | null>(null);
    const [formData, setFormData] = useState({
        name: '',
        display_name: '',
        address_id: ''
    });
    const [errors, setErrors] = useState<{
        name?: string;
        display_name?: string;
        address_id?: string;
    }>({});
    const [errorMessage, setErrorMessage] = useState<string | null>(null);
    const [selectedTimezone, setSelectedTimezone] = useState<string>(getUserTimezone());

    // Save the selected timezone to localStorage when it changes
    useEffect(() => {
        localStorage.setItem('reportTimezone', selectedTimezone);
    }, [selectedTimezone]);

    // Use the projects data passed from the server via Inertia
    const { props: { projects, flash } } = usePage<{
        projects: Project[];
        flash: {
            success: string | null;
            error: string | null;
        };
    }>();

    useEffect(() => {
        setProjectsData(projects);
    }, [projects]);

    const handleAdd = () => {
        setFormData({
            name: '',
            display_name: '',
            address_id: ''
        });
        setErrors({});
        setIsAddModalOpen(true);
    };

    const handleEdit = useCallback((id: string) => {
        const project = projectsData.find(p => p.id === id);
        if (project) {
            setSelectedProject(project);
            setFormData({
                name: project.name,
                display_name: project.display_name,
                address_id: project.address_id || ''
            });
            setIsEditModalOpen(true);
        }
    }, [projectsData]);

    const validateForm = () => {
        const newErrors: {name?: string; display_name?: string; address_id?: string} = {};
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
        router.post('/security/projects', formData, {
            preserveScroll: true,
            onSuccess: () => {
                setIsAddModalOpen(false);
                setErrors({});
            },
            onError: (errors) => {
                if (Object.keys(errors).length > 0) {
                    setErrors(errors);
                } else {
                    setErrorMessage(`Failed to create project. Please try again.`);
                    setIsAddModalOpen(false);
                }
            },
        });
    }, [formData]);

    const handleUpdate = useCallback(() => {
        if (!selectedProject) return;

        if (!validateForm()) {
            return;
        }

        setErrorMessage(null); // Clear any previous error
        router.put(`/security/projects/${selectedProject.id}`, formData, {
            preserveScroll: true,
            onSuccess: () => {
                setIsEditModalOpen(false);
                setErrors({});
            },
            onError: (errors) => {
                if (Object.keys(errors).length > 0) {
                    setErrors(errors);
                } else {
                    setErrorMessage(`Failed to update project "${selectedProject.name}". Please try again.`);
                    setIsEditModalOpen(false);
                }
            },
        });
    }, [selectedProject, formData]);

    const handleDeleteClick = useCallback((id: string) => {
        const project = projectsData.find(p => p.id === id);
        if (project) {
            setSelectedProject(project);
            setIsDeleteModalOpen(true);
        }
    }, [projectsData]);

    const handleDelete = useCallback(() => {
        if (!selectedProject) return;

        setErrorMessage(null); // Clear any previous error
        router.delete(`/security/projects/${selectedProject.id}`, {
            preserveScroll: true,
            onSuccess: () => {
                setIsDeleteModalOpen(false);
            },
            onError: () => {
                setErrorMessage(`Failed to delete project "${selectedProject.name}". Please try again.`);
                setIsDeleteModalOpen(false);
            },
        });
    }, [selectedProject]);

    const columns = useMemo<ColumnDef<Project>[]>(
        () => [
            { header: 'Name', accessorKey: 'name' },
            {
                header: 'Display Name',
                accessorKey: 'display_name',
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
            <Head title="Projects"/>

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
                title="Projects"
                data={projectsData}
                columns={columns}
                searchField="name"
                showTimezone={true}
                initialTimezone={selectedTimezone}
                onTimezoneChange={setSelectedTimezone}
                onAddNew={handleAdd}
                addButtonLabel="Add Project"
                renderMobileCard={(project, index) => (
                    <div
                        key={project.id}
                        className="bg-white dark:bg-gray-800 rounded-lg shadow p-4 border border-gray-100 dark:border-gray-700 transition-all duration-200 ease-in-out opacity-100"
                    >
                        <div className="flex justify-between items-center mb-2">
                            <h3 className="font-medium text-blue-600 dark:text-blue-400">{project.name}</h3>
                            <ActionsMenu
                                actions={[
                                    {
                                        label: 'Edit',
                                        icon: <PencilIcon className="h-4 w-4" />,
                                        onClick: () => handleEdit(project.id)
                                    },
                                    {
                                        label: 'Delete',
                                        icon: <Trash2Icon className="h-4 w-4" />,
                                        onClick: () => handleDeleteClick(project.id),
                                        variant: 'destructive'
                                    }
                                ]}
                            />
                        </div>
                        <div className="text-sm text-gray-600 dark:text-gray-300 space-y-1">
                            <p><span className="font-medium">Display Name:</span> {project.display_name}</p>
                            <p><span className="font-medium">Created:</span> {formatDate(project.created_at, selectedTimezone)}</p>
                            <p><span className="font-medium">Updated:</span> {formatDate(project.updated_at, selectedTimezone)}</p>
                        </div>
                    </div>
                )}
                emptyState={
                    <div className="text-center py-4 text-gray-500 dark:text-gray-400">
                        No projects found
                    </div>
                }
                successMessage={flash.success}
                errorMessage={errorMessage || flash.error}
                onClearError={() => setErrorMessage(null)}
            />

            {/* Add Project Modal */}
            <Dialog open={isAddModalOpen} onOpenChange={setIsAddModalOpen}>
                <DialogContent className="sm:max-w-md">
                    <DialogHeader>
                        <DialogTitle>Add Project</DialogTitle>
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
                            <label htmlFor="address_id" className="text-right text-sm font-medium">
                                Address ID
                            </label>
                            <div className="col-span-3 space-y-1">
                                <Input
                                    id="address_id"
                                    value={formData.address_id}
                                    onChange={(e) => setFormData({ ...formData, address_id: e.target.value })}
                                    className={errors.address_id ? "border-red-500" : ""}
                                />
                                {errors.address_id && (
                                    <p className="text-red-500 text-xs">{errors.address_id}</p>
                                )}
                            </div>
                        </div>
                    </div>
                    <DialogFooter>
                        <Button type="button" onClick={handleCreate}>
                            Create Project
                        </Button>
                    </DialogFooter>
                </DialogContent>
            </Dialog>

            {/* Edit Project Modal */}
            <Dialog open={isEditModalOpen} onOpenChange={setIsEditModalOpen}>
                <DialogContent className="sm:max-w-md">
                    <DialogHeader>
                        <DialogTitle>Edit Project</DialogTitle>
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
                            <label htmlFor="edit_address_id" className="text-right text-sm font-medium">
                                Address ID
                            </label>
                            <div className="col-span-3 space-y-1">
                                <Input
                                    id="edit_address_id"
                                    value={formData.address_id}
                                    onChange={(e) => setFormData({ ...formData, address_id: e.target.value })}
                                    className={errors.address_id ? "border-red-500" : ""}
                                />
                                {errors.address_id && (
                                    <p className="text-red-500 text-xs">{errors.address_id}</p>
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

            {/* Delete Project Modal */}
            <ConfirmationModal
                open={isDeleteModalOpen}
                onOpenChange={setIsDeleteModalOpen}
                title="Delete Project"
                confirmLabel="Delete"
                confirmVariant="destructive"
                onConfirm={handleDelete}
            >
                <div className="py-4">
                    <p className="text-center">Are you sure you want to delete the project <strong>{selectedProject?.name}</strong>?</p>
                    <p className="text-center text-sm text-gray-500 mt-1">This action cannot be undone.</p>
                </div>
            </ConfirmationModal>
        </AppLayout>
    );
}
