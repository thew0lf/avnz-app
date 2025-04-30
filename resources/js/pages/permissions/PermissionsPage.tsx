import React, {useEffect, useState} from "react";
import {ColumnDef, flexRender, getCoreRowModel, useReactTable,} from "@tanstack/react-table";
import {DropdownMenu, DropdownMenuContent, DropdownMenuItem, DropdownMenuTrigger,} from "@radix-ui/react-dropdown-menu";
import {LucideMoreVertical, LucideTrash2} from "lucide-react";

type Permission = {
  _id: string;
  name: string;
  description: string;
  role: string;
  resource: string;
  permissions: string[]; // e.g. ['create', 'update', 'delete', 'list']
};

type PermissionRow = Omit<Permission, "permissions"> & {
  permissions: string[];
};

const apiUrl = "/api/permissions";

export default function PermissionsPage() {
  const [permissionsData, setPermissionsData] = useState<Permission[]>([]);
  const [loading, setLoading] = useState<boolean>(false);
  const [error, setError] = useState<string | null>(null);

  // Fetch permissions from backend
  const fetchPermissions = async () => {
    setLoading(true);
    setError(null);
    try {
      const res = await fetch(apiUrl);
      if (!res.ok) throw new Error("Failed to fetch permissions");
      const data = (await res.json()) as Permission[];
      setPermissionsData(data);
    } catch (err: any) {
      setError(err.message || "Unknown error");
    } finally {
      setLoading(false);
    }
  };

  // Delete a permission item by id
  const deletePermission = async (id: string) => {
    if (!confirm("Are you sure you want to delete this permission?")) return;
    try {
      const res = await fetch(`${apiUrl}/${id}`, { method: "DELETE" });
      if (!res.ok) throw new Error("Failed to delete permission");
      setPermissionsData((prev) => prev.filter((p) => p._id !== id));
    } catch (err: any) {
      alert(err.message || "Unknown error deleting permission");
    }
  };

  // Toggle checkbox logic: we do not implement update here; just display
  // If you want to support updates you can implement them similarly.

  useEffect(() => {
    fetchPermissions();
  }, []);

  // Columns definition for react-table
  const columns = React.useMemo<ColumnDef<PermissionRow>[]>(
    () => [
      {
        accessorKey: "name",
        header: "Name",
        cell: (info) => info.getValue(),
      },
      {
        accessorKey: "description",
        header: "Description",
        cell: (info) => info.getValue(),
      },
      {
        accessorKey: "role",
        header: "Role",
        cell: (info) => info.getValue(),
      },
      {
        accessorKey: "resource",
        header: "Resource",
        cell: (info) => info.getValue(),
      },
      {
        id: "list",
        header: "List",
        cell: (info) => {
          const perms = info.row.original.permissions;
          return (
            <input
              type="checkbox"
              readOnly
              checked={perms.includes("list")}
              aria-label="List permission checkbox"
            />
          );
        },
      },
      {
        id: "create",
        header: "Create",
        cell: (info) => {
          const perms = info.row.original.permissions;
          return (
            <input
              type="checkbox"
              readOnly
              checked={perms.includes("create")}
              aria-label="Create permission checkbox"
            />
          );
        },
      },
      {
        id: "update",
        header: "Update",
        cell: (info) => {
          const perms = info.row.original.permissions;
          return (
            <input
              type="checkbox"
              readOnly
              checked={perms.includes("update")}
              aria-label="Update permission checkbox"
            />
          );
        },
      },
      {
        id: "delete",
        header: "Delete",
        cell: (info) => {
          const perms = info.row.original.permissions;
          return (
            <input
              type="checkbox"
              readOnly
              checked={perms.includes("delete")}
              aria-label="Delete permission checkbox"
            />
          );
        },
      },
      {
        id: "actions",
        header: "Actions",
        cell: ({ row }) => {
          const permission = row.original;
          return (
            <DropdownMenu>
              <DropdownMenuTrigger asChild>
                <button
                  aria-label="Actions"
                  className="p-1 rounded hover:bg-gray-200"
                  type="button"
                >
                  <LucideMoreVertical size={18} />
                </button>
              </DropdownMenuTrigger>
              <DropdownMenuContent>
                <DropdownMenuItem
                  onClick={() => deletePermission(permission._id)}
                  className="flex items-center gap-2 text-red-600"
                >
                  <LucideTrash2 size={16} />
                  Delete
                </DropdownMenuItem>
              </DropdownMenuContent>
            </DropdownMenu>
          );
        },
      },
    ],
    [permissionsData]
  );

  const table = useReactTable({
    data: permissionsData,
    columns,
    getCoreRowModel: getCoreRowModel(),
  });

  return (
    <main className="p-6">
      <h1 className="text-2xl font-semibold mb-4">Permissions</h1>
      {loading && <p>Loading permissions...</p>}
      {error && (
        <p className="text-red-600 mb-4" role="alert">
          {error}
        </p>
      )}
      {!loading && !error && (
        <div className="overflow-x-auto border rounded">
          <table className="w-full border-collapse">
            <thead className="bg-gray-100">
              {table.getHeaderGroups().map((headerGroup) => (
                <tr key={headerGroup.id}>
                  {headerGroup.headers.map((header) => (
                    <th
                      key={header.id}
                      className="border p-2 text-left text-sm font-medium"
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
            <tbody>
              {table.getRowModel().rows.length === 0 && (
                <tr>
                  <td
                    colSpan={columns.length}
                    className="p-4 text-center text-gray-500"
                  >
                    No permissions found.
                  </td>
                </tr>
              )}
              {table.getRowModel().rows.map((row) => (
                <tr key={row.id} className="hover:bg-gray-50">
                  {row.getVisibleCells().map((cell) => (
                    <td
                      key={cell.id}
                      className="border p-2 text-sm dark:text-gray-900"
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
        </div>
      )}
    </main>
  );
}
