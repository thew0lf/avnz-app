import React, { useState, useEffect, useMemo, useCallback } from 'react';
import { Card, CardHeader, CardContent } from '@/components/ui/card';
import { Input } from '@/components/ui/input';
import { Button } from '@/components/ui/button';
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
} from '@radix-ui/react-dropdown-menu';
import { motion } from 'framer-motion';
import { Permission } from '@/types/permission';

export default function PermissionsPage() {
    const [permissionsData, setPermissionsData] = useState<Permission[]>([]);
    const [filter, setFilter] = useState<string>('');

    const fetchPermissions = useCallback(async () => {
        try {
            const res = await fetch('/api/permissions');
            if (!res.ok) throw new Error(`Error: ${res.statusText}`);
            setPermissionsData(await res.json());
        } catch (error) {
            console.error(error);
        }
    }, []);

    useEffect(() => {
        fetchPermissions();
    }, [fetchPermissions]);

    const handleDelete = useCallback(async (id: string) => {
        if (!confirm('Confirm delete?')) return;
        try {
            const res = await fetch(`/api/permissions/${id}`, { method: 'DELETE' });
            if (!res.ok) throw new Error(`Error: ${res.statusText}`);
            setPermissionsData(prev => prev.filter(p => p.id !== id));
        } catch (error) {
            console.error(error);
        }
    }, []);

    const filteredData = useMemo(
        () =>
            permissionsData.filter(p =>
                p.name.toLowerCase().includes(filter.toLowerCase())
            ),
        [permissionsData, filter]
    );

    const columns = useMemo<ColumnDef<Permission>[]>(
        () => [
            { header: 'Name', accessorKey: 'name' },
            { header: 'Guard', accessorKey: 'guard_name' },
            { header: 'Created', accessorKey: 'created_at' },
            { header: 'Updated', accessorKey: 'updated_at' },
            {
                id: 'actions',
                header: 'Actions',
                cell: ({ row }) => (
                    <DropdownMenu>
                        <DropdownMenuTrigger asChild>
                            <Button variant="ghost" className="p-2 rounded-2xl shadow-sm">
                                •••
                            </Button>
                        </DropdownMenuTrigger>
                        <DropdownMenuContent align="end">
                            <DropdownMenuItem onClick={() => {/* edit logic */}}>
                                Edit
                            </DropdownMenuItem>
                            <DropdownMenuItem onClick={() => handleDelete(row.original.id)}>
                                Delete
                            </DropdownMenuItem>
                        </DropdownMenuContent>
                    </DropdownMenu>
                ),
            },
        ],
        [handleDelete]
    );

    const table = useReactTable({
        data: filteredData,
        columns,
        getCoreRowModel: getCoreRowModel(),
    });

    return (
        <Card className="rounded-2xl shadow p-4 grid gap-4">
            <CardHeader>
                <div className="flex flex-col sm:flex-row sm:justify-between sm:items-center gap-2">
                    <h1 className="text-xl font-bold">Permissions</h1>
                    <Input
                        placeholder="Search permissions..."
                        value={filter}
                        onChange={e => setFilter(e.target.value)}
                        className="max-w-sm"
                    />
                </div>
            </CardHeader>
            <CardContent>
                <div className="overflow-auto">
                    <table className="min-w-full divide-y divide-gray-200">
                        <thead className="bg-gray-50">
                        {table.getHeaderGroups().map(headerGroup => (
                            <tr key={headerGroup.id}>
                                {headerGroup.headers.map(header => (
                                    <th
                                        key={header.id}
                                        className="px-4 py-2 text-left text-xs font-medium uppercase text-gray-500"
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
                        {table.getRowModel().rows.map(row => (
                            <motion.tr
                                key={row.id}
                                initial={{ opacity: 0, y: -5 }}
                                animate={{ opacity: 1, y: 0 }}
                                exit={{ opacity: 0, y: 5 }}
                                transition={{ duration: 0.2 }}
                            >
                                {row.getVisibleCells().map(cell => (
                                    <td
                                        key={cell.id}
                                        className="px-4 py-2 text-sm text-gray-900 whitespace-nowrap"
                                    >
                                        {flexRender(
                                            cell.column.columnDef.cell,
                                            cell.getContext()
                                        )}
                                    </td>
                                ))}
                            </motion.tr>
                        ))}
                        </tbody>
                    </table>
                </div>
            </CardContent>
        </Card>
    );
}
