import { useState, useEffect, useMemo, useCallback } from 'react';
import AppLayout from '@/layouts/app-layout';
import { Button } from '@/components/ui/button';
import { Input } from '@/components/ui/input';
import { Alert, AlertTitle, AlertDescription } from '@/components/ui/alert';
import { type BreadcrumbItem } from '@/types';
import { Head, router, usePage } from '@inertiajs/react';
import { PencilIcon, Trash2Icon, X, XIcon, PlusIcon, SearchIcon } from 'lucide-react';

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
import { Combobox } from '@/components/ui/combobox';

// Define interfaces
interface User {
    id: string;
    name: string;
    email: string;
}

interface Member {
    id: string;
    user_id: string;
    user: User;
    created_at: string;
}

interface Project {
    id: string;
    name: string;
    display_name: string;
}

interface SearchResult {
    id: string;
    name: string;
    email: string;
}

const breadcrumbs: BreadcrumbItem[] = [
    { title: 'Dashboard', href: '/dashboard' },
    { title: 'Security', href: '/security' },
    { title: 'Projects', href: '/security/projects' },
    { title: 'Project Members', href: '#' },
];

export default function ProjectMembers() {
    const [membersData, setMembersData] = useState<Member[]>([]);
    const [isAddModalOpen, setIsAddModalOpen] = useState<boolean>(false);
    const [isDeleteModalOpen, setIsDeleteModalOpen] = useState<boolean>(false);
    const [selectedMember, setSelectedMember] = useState<Member | null>(null);
    const [searchQuery, setSearchQuery] = useState<string>('');
    const [searchResults, setSearchResults] = useState<SearchResult[]>([]);
    const [selectedUser, setSelectedUser] = useState<SearchResult | null>(null);
    const [errors, setErrors] = useState<{
        user_id?: string;
    }>({});
    const [errorMessage, setErrorMessage] = useState<string | null>(null);
    const [selectedTimezone, setSelectedTimezone] = useState<string>(getUserTimezone());

    // Save the selected timezone to localStorage when it changes
    useEffect(() => {
        localStorage.setItem('reportTimezone', selectedTimezone);
    }, [selectedTimezone]);

    // Use the data passed from the server via Inertia
    const { props: { project, members, flash } } = usePage<{
        project: Project;
        members: Member[];
        flash: {
            success: string | null;
            error: string | null;
        };
    }>();

    useEffect(() => {
        setMembersData(members);
    }, [members]);

    const handleAdd = () => {
        setSearchQuery('');
        setSearchResults([]);
        setSelectedUser(null);
        setErrors({});
        setIsAddModalOpen(true);
    };

    const handleDelete = useCallback((id: string) => {
        const member = membersData.find(m => m.id === id);
        if (member) {
            setSelectedMember(member);
            setIsDeleteModalOpen(true);
        }
    }, [membersData]);

    const handleSearch = async (query: string) => {
        setSearchQuery(query);
        if (query.length < 2) {
            setSearchResults([]);
            return;
        }

        try {
            const response = await fetch(`/security/projects/members/search?query=${encodeURIComponent(query)}&project_id=${project.id}`);
            const data = await response.json();
            setSearchResults(data.users);
        } catch (error) {
            console.error('Error searching users:', error);
            setSearchResults([]);
        }
    };

    const handleAddMember = () => {
        if (!selectedUser) {
            setErrors({ user_id: 'Please select a user' });
            return;
        }

        router.post(`/security/projects/${project.id}/members`, {
            user_id: selectedUser.id
        }, {
            onSuccess: () => {
                setIsAddModalOpen(false);
                setSelectedUser(null);
                setSearchQuery('');
                setSearchResults([]);
            },
            onError: (errors) => {
                setErrors(errors);
                if (errors.error) {
                    setErrorMessage(errors.error);
                }
            }
        });
    };

    const handleDeleteMember = () => {
        if (!selectedMember) return;

        router.delete(`/security/projects/${project.id}/members`, {
            data: { user_id: selectedMember.user_id },
            onSuccess: () => {
                setIsDeleteModalOpen(false);
                setSelectedMember(null);
            },
            onError: (errors) => {
                if (errors.error) {
                    setErrorMessage(errors.error);
                }
            }
        });
    };

    // Define columns for the data table
    const columns = useMemo<ColumnDef<Member>[]>(() => [
        {
            accessorKey: 'user.name',
            header: 'Name',
        },
        {
            accessorKey: 'user.email',
            header: 'Email',
        },
        {
            accessorKey: 'created_at',
            header: 'Added On',
            cell: ({ row }) => formatDate(row.original.created_at, selectedTimezone),
        },
        {
            id: 'actions',
            cell: ({ row }) => (
                <ActionsMenu
                    actions={[
                        {
                            label: 'Delete',
                            icon: <Trash2Icon className="mr-2 h-4 w-4" />,
                            onClick: () => handleDelete(row.original.id),
                        },
                    ]}
                />
            ),
        },
    ], [handleDelete, selectedTimezone]);

    return (
        <AppLayout breadcrumbs={breadcrumbs}>
            <Head title={`${project.display_name} - Project Members`} />

            <div className="container mx-auto py-6">
                <div className="flex justify-between items-center mb-6">
                    <h1 className="text-2xl font-bold">{project.display_name} - Project Members</h1>
                    <Button onClick={handleAdd}>
                        <PlusIcon className="mr-2 h-4 w-4" />
                        Add Member
                    </Button>
                </div>

                {flash.success && (
                    <Alert className="mb-4" variant="success">
                        <AlertTitle>Success</AlertTitle>
                        <AlertDescription>{flash.success}</AlertDescription>
                    </Alert>
                )}

                {flash.error && (
                    <Alert className="mb-4" variant="destructive">
                        <AlertTitle>Error</AlertTitle>
                        <AlertDescription>{flash.error}</AlertDescription>
                    </Alert>
                )}

                <DataTablePage
                    columns={columns}
                    data={membersData}
                    searchPlaceholder="Search members..."
                    searchColumn="user.name"
                />

                {/* Add Member Modal */}
                <Dialog open={isAddModalOpen} onOpenChange={setIsAddModalOpen}>
                    <DialogContent>
                        <DialogHeader>
                            <DialogTitle>Add Project Member</DialogTitle>
                        </DialogHeader>
                        <div className="space-y-4 py-4">
                            {errorMessage && (
                                <Alert variant="destructive" className="mb-4">
                                    <AlertTitle>Error</AlertTitle>
                                    <AlertDescription>{errorMessage}</AlertDescription>
                                </Alert>
                            )}

                            <div className="space-y-2">
                                <label htmlFor="user-search" className="text-sm font-medium">
                                    Search User
                                </label>
                                <div className="flex items-center space-x-2">
                                    <Input
                                        id="user-search"
                                        placeholder="Search by name or email"
                                        value={searchQuery}
                                        onChange={(e) => handleSearch(e.target.value)}
                                        className="flex-1"
                                    />
                                    <Button variant="outline" size="icon" onClick={() => handleSearch(searchQuery)}>
                                        <SearchIcon className="h-4 w-4" />
                                    </Button>
                                </div>
                                {errors.user_id && (
                                    <p className="text-sm text-red-500">{errors.user_id}</p>
                                )}
                            </div>

                            {searchResults.length > 0 && (
                                <div className="border rounded-md max-h-60 overflow-y-auto">
                                    <ul className="divide-y">
                                        {searchResults.map((user) => (
                                            <li
                                                key={user.id}
                                                className={`p-2 cursor-pointer hover:bg-gray-100 ${
                                                    selectedUser?.id === user.id ? 'bg-gray-100' : ''
                                                }`}
                                                onClick={() => setSelectedUser(user)}
                                            >
                                                <div className="font-medium">{user.name}</div>
                                                <div className="text-sm text-gray-500">{user.email}</div>
                                            </li>
                                        ))}
                                    </ul>
                                </div>
                            )}

                            {selectedUser && (
                                <div className="mt-4 p-3 border rounded-md bg-gray-50">
                                    <div className="flex justify-between items-center">
                                        <div>
                                            <div className="font-medium">{selectedUser.name}</div>
                                            <div className="text-sm text-gray-500">{selectedUser.email}</div>
                                        </div>
                                        <Button
                                            variant="ghost"
                                            size="icon"
                                            onClick={() => setSelectedUser(null)}
                                        >
                                            <X className="h-4 w-4" />
                                        </Button>
                                    </div>
                                </div>
                            )}
                        </div>
                        <DialogFooter>
                            <DialogClose asChild>
                                <Button variant="outline">Cancel</Button>
                            </DialogClose>
                            <Button onClick={handleAddMember}>Add Member</Button>
                        </DialogFooter>
                    </DialogContent>
                </Dialog>

                {/* Delete Confirmation Modal */}
                <ConfirmationModal
                    isOpen={isDeleteModalOpen}
                    onClose={() => setIsDeleteModalOpen(false)}
                    onConfirm={handleDeleteMember}
                    title="Remove Member"
                    description={`Are you sure you want to remove ${selectedMember?.user.name} from this project?`}
                    confirmText="Remove"
                    cancelText="Cancel"
                />
            </div>
        </AppLayout>
    );
}
