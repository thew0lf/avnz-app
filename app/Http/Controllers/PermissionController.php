<?php

namespace App\Http\Controllers;

use App\Models\Permission;
use Illuminate\Http\Request;
use Illuminate\Validation\Rule;
use Inertia\Inertia;
use Inertia\Response;
use Illuminate\Http\RedirectResponse;

class PermissionController extends Controller
{
    /**
     * Display a listing of the permissions.
     *
     * @return Response
     */
    public function index(): Response
    {
        $permissions = Permission::all();
        return Inertia::render('permissions/permissions', [
            'permissions' => $permissions
        ]);
    }

    /**
     * Store a newly created permission in storage.
     *
     * @param Request $request
     * @return RedirectResponse
     */
    public function store(Request $request): RedirectResponse
    {
        try {
            $validated = $request->validate([
                'name' => ['required', 'string', 'max:255', 'unique:permissions,name'],
                'description' => ['nullable', 'string'],
                'role' => ['required', 'string', 'max:255'],
                'resource' => ['required', 'string', 'max:255'],
                'permissions' => ['required', 'array'],
                'permissions.*' => ['string', Rule::in(['list', 'create', 'update', 'delete'])],
            ]);

            Permission::create($validated);

            return redirect()->route('members-and-roles.permissions.index')
                ->with('success', 'Permission created successfully.');
        } catch (\Exception $e) {
            \Log::error('Error in PermissionController::store(): ' . $e->getMessage());
            return redirect()->back()
                ->with('error', 'Failed to create permission. Please try again.');
        }
    }

    /**
     * Display the specified permission.
     *
     * @param Permission $permission
     * @return Response
     */
    public function show(Permission $permission): Response
    {
        return Inertia::render('permissions/show', [
            'permission' => $permission
        ]);
    }

    /**
     * Update the specified permission in storage.
     *
     * @param Request $request
     * @param Permission $permission
     * @return RedirectResponse
     */
    public function update(Request $request, Permission $permission): RedirectResponse
    {
        try {
            $validated = $request->validate([
                'name' => ['sometimes', 'string', 'max:255', Rule::unique('permissions')->ignore($permission->id)],
                'description' => ['nullable', 'string'],
                'role' => ['sometimes', 'string', 'max:255'],
                'resource' => ['sometimes', 'string', 'max:255'],
                'permissions' => ['sometimes', 'array'],
                'permissions.*' => ['string', Rule::in(Permission::ACTIONS)],
            ]);

            $permission->update($validated);

            return redirect()->route('members-and-roles.permissions.index')
                ->with('success', 'Permission updated successfully.');
        } catch (\Exception $e) {
            \Log::error('Error in PermissionController::update(): ' . $e->getMessage());
            return redirect()->back()
                ->with('error', 'Failed to update permission. Please try again.');
        }
    }

    /**
     * Remove the specified permission from storage.
     *
     * @param Permission $permission
     * @return RedirectResponse
     */
    public function destroy(Permission $permission): RedirectResponse
    {
        try {
            $permission->delete();
            return redirect()->route('members-and-roles.permissions.index')
                ->with('success', 'Permission deleted successfully.');
        } catch (\Exception $e) {
            \Log::error('Error in PermissionController::destroy(): ' . $e->getMessage());
            return redirect()->back()
                ->with('error', 'Failed to delete permission. Please try again.');
        }
    }
}
