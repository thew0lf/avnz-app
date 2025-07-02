import { Head, router, usePage } from '@inertiajs/react';
import { useState } from 'react';
import AppLayout from '@/layouts/app-layout';
import { Card, CardHeader, CardTitle, CardContent, CardFooter } from '@/components/ui/card';
import { Button } from '@/components/ui/button';
import { PencilIcon, Trash2Icon, X } from 'lucide-react';
import { type BreadcrumbItem } from '@/types';
import {
    Dialog,
    DialogContent,
    DialogHeader,
    DialogTitle,
    DialogFooter,
    DialogClose,
} from '@/components/ui/dialog';

const breadcrumbs: BreadcrumbItem[] = [
    { title: 'Dashboard', href: '/dashboard' },
    { title: 'Members & Roles', href: '/members-and-roles' },
    { title: 'Roles', href: '/members-and-roles/roles' },
    { title: 'View Role', href: '/members-and-roles/roles/show' },
];

interface Permission {
    id: number;
    name: string;
    description: string;
}

interface RoleData {
    id: number;
    display_name: string;
    name: string;
    permissions: Permission[];
}

export default function Show() {
    const { props: { role } } = usePage<{ role: RoleData }>();
    const [isDeleteModalOpen, setIsDeleteModalOpen] = useState<boolean>(false);

    const handleDeleteClick = () => {
        setIsDeleteModalOpen(true);
    };

    const handleDelete = () => {
        router.delete(`/members-and-roles/roles/${role.id}`, {
            onSuccess: () => {
                setIsDeleteModalOpen(false);
            }
        });
    };

    return (
        <AppLayout breadcrumbs={breadcrumbs}>
            <div className="flex h-full flex-1 flex-col gap-4 rounded-xl p-4">
                <Head title="View Role" />
                <Card>
                    <CardHeader>
                        <CardTitle>{role.display_name}</CardTitle>
                    </CardHeader>
                    <CardContent>
                        <p><strong>Route:</strong> {role.name}</p>
                        <div className="mt-3">
                            <strong>Permissions:</strong>
                            <ul className="list-inside list-disc space-y-1">
                                {role.permissions.map((perm) => (
                                    <li className="text-sm marker:text-blue-500" key={perm.id}>
                                        {perm.description || perm.name}
                                    </li>
                                ))}
                            </ul>
                        </div>
                    </CardContent>
                    <CardFooter className="flex gap-2">
                        <Button
                            variant="outline"
                            onClick={() => router.visit(route('members-and-roles.roles.edit', role.id))}
                        >
                            <PencilIcon className="mr-2 h-4 w-4" /> Edit
                        </Button>
                        <Button
                            variant="destructive"
                            onClick={handleDeleteClick}
                        >
                            <Trash2Icon className="mr-2 h-4 w-4" /> Delete
                        </Button>
                    </CardFooter>
                </Card>
            </div>

            {/* Delete Role Modal */}
            <Dialog open={isDeleteModalOpen} onOpenChange={setIsDeleteModalOpen}>
                <DialogContent className="sm:max-w-md">
                    <DialogHeader>
                        <DialogTitle>Delete Role</DialogTitle>
                        <DialogClose className="absolute right-4 top-4 rounded-sm opacity-70 ring-offset-background transition-opacity hover:opacity-100 focus:outline-none focus:ring-2 focus:ring-ring focus:ring-offset-2 disabled:pointer-events-none data-[state=open]:bg-accent data-[state=open]:text-muted-foreground">
                            <X className="h-4 w-4" />
                            <span className="sr-only">Close</span>
                        </DialogClose>
                    </DialogHeader>
                    <div className="py-4">
                        <p className="text-center">Are you sure you want to delete the role <strong>{role.display_name}</strong>?</p>
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
