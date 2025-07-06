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

// Define Company interface
interface Company {
    id: string;
    name: string;
    address_book_id: string | null;
    project_id: string | null;
    status: string | null;
    short_code: string | null;
    key: string;
    created_at: string;
    updated_at: string;
}

const breadcrumbs: BreadcrumbItem[] = [
    { title: 'Dashboard', href: '/dashboard' },
    { title: 'Security', href: '/security' },
    { title: 'Companies', href: '/security/companies' },
];

export default function Companies() {
    const [companiesData, setCompaniesData] = useState<Company[]>([]);
    const [isAddModalOpen, setIsAddModalOpen] = useState<boolean>(false);
    const [isEditModalOpen, setIsEditModalOpen] = useState<boolean>(false);
    const [isDeleteModalOpen, setIsDeleteModalOpen] = useState<boolean>(false);
    const [selectedCompany, setSelectedCompany] = useState<Company | null>(null);
    const [formData, setFormData] = useState({
        name: '',
        address_book_id: '',
        project_id: '',
        status: '',
        short_code: ''
    });
    const [errors, setErrors] = useState<{
        name?: string;
        address_book_id?: string;
        project_id?: string;
        status?: string;
        short_code?: string;
    }>({});
    const [errorMessage, setErrorMessage] = useState<string | null>(null);
    const [selectedTimezone, setSelectedTimezone] = useState<string>(getUserTimezone());

    // Save the selected timezone to localStorage when it changes
    useEffect(() => {
        localStorage.setItem('reportTimezone', selectedTimezone);
    }, [selectedTimezone]);

    // Use the companies data passed from the server via Inertia
    const { props: { companies, flash } } = usePage<{
        companies: Company[];
        flash: {
            success: string | null;
            error: string | null;
        };
    }>();

    useEffect(() => {
        setCompaniesData(companies);
    }, [companies]);

    const handleAdd = () => {
        setFormData({
            name: '',
            address_book_id: '',
            project_id: '',
            status: '',
            short_code: ''
        });
        setErrors({});
        setIsAddModalOpen(true);
    };

    const handleEdit = useCallback((id: string) => {
        const company = companiesData.find(c => c.id === id);
        if (company) {
            setSelectedCompany(company);
            setFormData({
                name: company.name,
                address_book_id: company.address_book_id || '',
                project_id: company.project_id || '',
                status: company.status || '',
                short_code: company.short_code || ''
            });
            setIsEditModalOpen(true);
        }
    }, [companiesData]);

    const validateForm = () => {
        const newErrors: {
            name?: string;
            address_book_id?: string;
            project_id?: string;
            status?: string;
            short_code?: string;
        } = {};
        let isValid = true;

        if (!formData.name.trim()) {
            newErrors.name = 'Name is required';
            isValid = false;
        }

        if (formData.short_code && formData.short_code.length > 10) {
            newErrors.short_code = 'Short code must be 10 characters or less';
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
        router.post('/security/companies', formData, {
            preserveScroll: true,
            onSuccess: () => {
                setIsAddModalOpen(false);
                setErrors({});
            },
            onError: (errors) => {
                if (Object.keys(errors).length > 0) {
                    setErrors(errors);
                } else {
                    setErrorMessage(`Failed to create company. Please try again.`);
                    setIsAddModalOpen(false);
                }
            },
        });
    }, [formData]);

    const handleUpdate = useCallback(() => {
        if (!selectedCompany) return;

        if (!validateForm()) {
            return;
        }

        setErrorMessage(null); // Clear any previous error
        router.put(`/security/companies/${selectedCompany.id}`, formData, {
            preserveScroll: true,
            onSuccess: () => {
                setIsEditModalOpen(false);
                setErrors({});
            },
            onError: (errors) => {
                if (Object.keys(errors).length > 0) {
                    setErrors(errors);
                } else {
                    setErrorMessage(`Failed to update company "${selectedCompany.name}". Please try again.`);
                    setIsEditModalOpen(false);
                }
            },
        });
    }, [selectedCompany, formData]);

    const handleDeleteClick = useCallback((id: string) => {
        const company = companiesData.find(c => c.id === id);
        if (company) {
            setSelectedCompany(company);
            setIsDeleteModalOpen(true);
        }
    }, [companiesData]);

    const handleDelete = useCallback(() => {
        if (!selectedCompany) return;

        setErrorMessage(null); // Clear any previous error
        router.delete(`/security/companies/${selectedCompany.id}`, {
            preserveScroll: true,
            onSuccess: () => {
                setIsDeleteModalOpen(false);
            },
            onError: () => {
                setErrorMessage(`Failed to delete company "${selectedCompany.name}". Please try again.`);
                setIsDeleteModalOpen(false);
            },
        });
    }, [selectedCompany]);

    const columns = useMemo<ColumnDef<Company>[]>(
        () => [
            { header: 'Name', accessorKey: 'name' },
            {
                header: 'Short Code',
                accessorKey: 'short_code',
                cell: (info) => {
                    const value = info.getValue() as string | null;
                    return <span className="hidden md:inline">{value || '-'}</span>;
                }
            },
            {
                header: 'Status',
                accessorKey: 'status',
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
            <Head title="Companies"/>

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
                title="Companies"
                data={companiesData}
                columns={columns}
                searchField="name"
                showTimezone={true}
                initialTimezone={selectedTimezone}
                onTimezoneChange={setSelectedTimezone}
                onAddNew={handleAdd}
                addButtonLabel="Add Company"
                renderMobileCard={(company, index) => (
                    <div
                        key={company.id}
                        className="bg-white dark:bg-gray-800 rounded-lg shadow p-4 border border-gray-100 dark:border-gray-700 transition-all duration-200 ease-in-out opacity-100"
                    >
                        <div className="flex justify-between items-center mb-2">
                            <h3 className="font-medium text-blue-600 dark:text-blue-400">{company.name}</h3>
                            <ActionsMenu
                                actions={[
                                    {
                                        label: 'Edit',
                                        icon: <PencilIcon className="h-4 w-4" />,
                                        onClick: () => handleEdit(company.id)
                                    },
                                    {
                                        label: 'Delete',
                                        icon: <Trash2Icon className="h-4 w-4" />,
                                        onClick: () => handleDeleteClick(company.id),
                                        variant: 'destructive'
                                    }
                                ]}
                            />
                        </div>
                        <div className="text-sm text-gray-600 dark:text-gray-300 space-y-1">
                            <p><span className="font-medium">Short Code:</span> {company.short_code || '-'}</p>
                            <p><span className="font-medium">Status:</span> {company.status || '-'}</p>
                            <p><span className="font-medium">Created:</span> {formatDate(company.created_at, selectedTimezone)}</p>
                            <p><span className="font-medium">Updated:</span> {formatDate(company.updated_at, selectedTimezone)}</p>
                        </div>
                    </div>
                )}
                emptyState={
                    <div className="text-center py-4 text-gray-500 dark:text-gray-400">
                        No companies found
                    </div>
                }
                successMessage={flash.success}
                errorMessage={errorMessage || flash.error}
                onClearError={() => setErrorMessage(null)}
            />

            {/* Add Company Modal */}
            <Dialog open={isAddModalOpen} onOpenChange={setIsAddModalOpen}>
                <DialogContent className="sm:max-w-md">
                    <DialogHeader>
                        <DialogTitle>Add Company</DialogTitle>
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
                            <label htmlFor="short_code" className="text-right text-sm font-medium">
                                Short Code
                            </label>
                            <div className="col-span-3 space-y-1">
                                <Input
                                    id="short_code"
                                    value={formData.short_code}
                                    onChange={(e) => setFormData({ ...formData, short_code: e.target.value })}
                                    className={errors.short_code ? "border-red-500" : ""}
                                    maxLength={10}
                                />
                                {errors.short_code && (
                                    <p className="text-red-500 text-xs">{errors.short_code}</p>
                                )}
                            </div>
                        </div>
                        <div className="grid grid-cols-4 items-center gap-4">
                            <label htmlFor="status" className="text-right text-sm font-medium">
                                Status
                            </label>
                            <div className="col-span-3 space-y-1">
                                <Input
                                    id="status"
                                    value={formData.status}
                                    onChange={(e) => setFormData({ ...formData, status: e.target.value })}
                                    className={errors.status ? "border-red-500" : ""}
                                />
                                {errors.status && (
                                    <p className="text-red-500 text-xs">{errors.status}</p>
                                )}
                            </div>
                        </div>
                        <div className="grid grid-cols-4 items-center gap-4">
                            <label htmlFor="project_id" className="text-right text-sm font-medium">
                                Project ID
                            </label>
                            <div className="col-span-3 space-y-1">
                                <Input
                                    id="project_id"
                                    value={formData.project_id}
                                    onChange={(e) => setFormData({ ...formData, project_id: e.target.value })}
                                    className={errors.project_id ? "border-red-500" : ""}
                                />
                                {errors.project_id && (
                                    <p className="text-red-500 text-xs">{errors.project_id}</p>
                                )}
                            </div>
                        </div>
                        <div className="grid grid-cols-4 items-center gap-4">
                            <label htmlFor="address_book_id" className="text-right text-sm font-medium">
                                Address Book ID
                            </label>
                            <div className="col-span-3 space-y-1">
                                <Input
                                    id="address_book_id"
                                    value={formData.address_book_id}
                                    onChange={(e) => setFormData({ ...formData, address_book_id: e.target.value })}
                                    className={errors.address_book_id ? "border-red-500" : ""}
                                />
                                {errors.address_book_id && (
                                    <p className="text-red-500 text-xs">{errors.address_book_id}</p>
                                )}
                            </div>
                        </div>
                    </div>
                    <DialogFooter>
                        <Button type="button" onClick={handleCreate}>
                            Create Company
                        </Button>
                    </DialogFooter>
                </DialogContent>
            </Dialog>

            {/* Edit Company Modal */}
            <Dialog open={isEditModalOpen} onOpenChange={setIsEditModalOpen}>
                <DialogContent className="sm:max-w-md">
                    <DialogHeader>
                        <DialogTitle>Edit Company</DialogTitle>
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
                            <label htmlFor="edit_short_code" className="text-right text-sm font-medium">
                                Short Code
                            </label>
                            <div className="col-span-3 space-y-1">
                                <Input
                                    id="edit_short_code"
                                    value={formData.short_code}
                                    onChange={(e) => setFormData({ ...formData, short_code: e.target.value })}
                                    className={errors.short_code ? "border-red-500" : ""}
                                    maxLength={10}
                                />
                                {errors.short_code && (
                                    <p className="text-red-500 text-xs">{errors.short_code}</p>
                                )}
                            </div>
                        </div>
                        <div className="grid grid-cols-4 items-center gap-4">
                            <label htmlFor="edit_status" className="text-right text-sm font-medium">
                                Status
                            </label>
                            <div className="col-span-3 space-y-1">
                                <Input
                                    id="edit_status"
                                    value={formData.status}
                                    onChange={(e) => setFormData({ ...formData, status: e.target.value })}
                                    className={errors.status ? "border-red-500" : ""}
                                />
                                {errors.status && (
                                    <p className="text-red-500 text-xs">{errors.status}</p>
                                )}
                            </div>
                        </div>
                        <div className="grid grid-cols-4 items-center gap-4">
                            <label htmlFor="edit_project_id" className="text-right text-sm font-medium">
                                Project ID
                            </label>
                            <div className="col-span-3 space-y-1">
                                <Input
                                    id="edit_project_id"
                                    value={formData.project_id}
                                    onChange={(e) => setFormData({ ...formData, project_id: e.target.value })}
                                    className={errors.project_id ? "border-red-500" : ""}
                                />
                                {errors.project_id && (
                                    <p className="text-red-500 text-xs">{errors.project_id}</p>
                                )}
                            </div>
                        </div>
                        <div className="grid grid-cols-4 items-center gap-4">
                            <label htmlFor="edit_address_book_id" className="text-right text-sm font-medium">
                                Address Book ID
                            </label>
                            <div className="col-span-3 space-y-1">
                                <Input
                                    id="edit_address_book_id"
                                    value={formData.address_book_id}
                                    onChange={(e) => setFormData({ ...formData, address_book_id: e.target.value })}
                                    className={errors.address_book_id ? "border-red-500" : ""}
                                />
                                {errors.address_book_id && (
                                    <p className="text-red-500 text-xs">{errors.address_book_id}</p>
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

            {/* Delete Company Modal */}
            <ConfirmationModal
                open={isDeleteModalOpen}
                onOpenChange={setIsDeleteModalOpen}
                title="Delete Company"
                confirmLabel="Delete"
                confirmVariant="destructive"
                onConfirm={handleDelete}
            >
                <div className="py-4">
                    <p className="text-center">Are you sure you want to delete the company <strong>{selectedCompany?.name}</strong>?</p>
                    <p className="text-center text-sm text-gray-500 mt-1">This action cannot be undone.</p>
                </div>
            </ConfirmationModal>
        </AppLayout>
    );
}
