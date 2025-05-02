// src/Pages/Roles.tsx
import AppLayout from '@/layouts/app-layout';
import { Head } from '@inertiajs/react';
import { RolePermissionsModal } from '@/components/permissions-modal';

const breadcrumbs = [
    { title: 'Dashboard', href: '/dashboard' },
    { title: 'Members & Roles' },
    { title: 'Roles', href: '/members-and-roles/roles' },
];

export default function Roles() {
    return (
        <AppLayout breadcrumbs={breadcrumbs}>
            <Head title="Roles" />

            <div className="grid auto-rows-min gap-4 rounded-xl p-4 grid-cols-3">
                {/* Administrator Card */}
                <div className="bg-white rounded-lg shadow p-4 max-w-sm">
                    <h3 className="text-xl font-semibold text-gray-900">Administrator</h3>
                    <p className="mt-2 text-sm text-gray-600">
                        Total users with this role: 5
                    </p>
                    <ul className="mt-4 space-y-2">
                        <li className="flex items-start">
                            <span className="inline-block w-2 h-2 mt-1 mr-2 bg-blue-500 rounded-full" />
                            <span className="text-gray-700">All Admin Controls</span>
                        </li>
                    </ul>
                    <div className="mt-6 flex justify-center space-x-4">
                        {/* Wrapped “View Role” in the RolePermissionsModal trigger */}
                        <RolePermissionsModal>
                            <button className="px-4 py-2 bg-white border border-gray-300 rounded text-gray-900 hover:bg-gray-50">
                                View Role
                            </button>
                        </RolePermissionsModal>
                        <button className="px-4 py-2 bg-blue-600 text-white rounded hover:bg-blue-700">
                            Edit Role
                        </button>
                    </div>
                </div>

                {/* Manager Card */}
                <div className="bg-white rounded-lg shadow p-4 max-w-sm">
                    <h3 className="text-xl font-semibold text-gray-900">Manager</h3>
                    <p className="mt-2 text-sm text-gray-600">
                        Total users with this role: 8
                    </p>
                    <ul className="mt-4 space-y-2">
                        <li className="flex items-start">
                            <span className="inline-block w-2 h-2 mt-1 mr-2 bg-green-500 rounded-full" />
                            <span className="text-gray-700">Manage team tasks</span>
                        </li>
                    </ul>
                    <div className="mt-6 flex justify-center space-x-4">
                        <button className="px-4 py-2 bg-white border border-gray-300 rounded text-gray-900 hover:bg-gray-50">
                            View Role
                        </button>
                        <button className="px-4 py-2 bg-blue-600 text-white rounded hover:bg-blue-700">
                            Edit Role
                        </button>
                    </div>
                </div>

                {/* Member Card */}
                <div className="bg-white rounded-lg shadow p-4 max-w-sm">
                    <h3 className="text-xl font-semibold text-gray-900">Member</h3>
                    <p className="mt-2 text-sm text-gray-600">
                        Total users with this role: 20
                    </p>
                    <ul className="mt-4 space-y-2">
                        <li className="flex items-start">
                            <span className="inline-block w-2 h-2 mt-1 mr-2 bg-red-500 rounded-full" />
                            <span className="text-gray-700">Basic access</span>
                        </li>
                    </ul>
                    <div className="mt-6 flex justify-center space-x-4">
                        <button className="px-4 py-2 bg-white border border-gray-300 rounded text-gray-900 hover:bg-gray-50">
                            View Role
                        </button>
                        <button className="px-4 py-2 bg-blue-600 text-white rounded hover:bg-blue-700">
                            Edit Role
                        </button>
                    </div>
                </div>

                {/* Member Card */}
                <div className="bg-white rounded-lg shadow p-4 max-w-sm">
                    <h3 className="text-xl font-semibold text-gray-900">Member</h3>
                    <p className="mt-2 text-sm text-gray-600">
                        Total users with this role: 20
                    </p>
                    <ul className="mt-4 space-y-2">
                        <li className="flex items-start">
                            <span className="inline-block w-2 h-2 mt-1 mr-2 bg-red-500 rounded-full" />
                            <span className="text-gray-700">Basic access</span>
                        </li>
                    </ul>
                    <div className="mt-6 flex justify-center space-x-4">
                        <button className="px-4 py-2 bg-white border border-gray-300 rounded text-gray-900 hover:bg-gray-50">
                            View Role
                        </button>
                        <button className="px-4 py-2 bg-blue-600 text-white rounded hover:bg-blue-700">
                            Edit Role
                        </button>
                    </div>
                </div>

                {/* Add New Role Card */}
                <div className="bg-white rounded-lg shadow p-4 max-w-sm flex flex-col items-center">
                    <h3 className="text-xl font-semibold text-gray-600 text-center">
                        Add New Role
                    </h3>
                    <svg
                        width="160"
                        height="160"
                        viewBox="0 0 160 160"
                        fill="none"
                        xmlns="http://www.w3.org/2000/svg"
                        className="mx-auto mt-6"
                    >
                        <rect width="160" height="160" rx="16" fill="#EFF6FF" />
                        <circle cx="80" cy="60" r="24" fill="#C7D2FE" />
                        <path
                            d="M44 132c0-18 36-18 36-18s36 0 36 18v4H44v-4z"
                            fill="#C7D2FE"
                        />
                        <rect x="100" y="96" width="40" height="8" rx="4" fill="#6366F1" />
                        <rect x="116" y="80" width="8" height="40" rx="4" fill="#6366F1" />
                    </svg>
                </div>
            </div>
        </AppLayout>
    );
}
