<?php

namespace App\Http\Controllers;

use App\Models\Role;
use App\Models\Permission;
use App\Services\RoleService;
use Illuminate\Http\Request;
use Illuminate\Validation\Rule;
use Inertia\Inertia;
use Inertia\Response;
use Illuminate\Http\RedirectResponse;

class RoleController extends Controller
{
    /**
     * The role service instance.
     *
     * @var \App\Services\RoleService
     */
    protected $roleService;

    /**
     * Create a new controller instance.
     *
     * @param  \App\Services\RoleService  $roleService
     * @return void
     */
    public function __construct(RoleService $roleService)
    {
        $this->roleService = $roleService;
    }
    /**
     * Display a listing of the roles.
     *
     * @return Response
     */
    public function index(): Response
    {
        try {
            $roles = $this->roleService->all();
            // Load permissions relationship for each role
            $roles->load('permissions');
        } catch (\Exception $e) {
            \Log::error('Error in RoleController::index(): ' . $e->getMessage());
            $roles = $this->roleService->all();
        }

        try {
            $permissions = Permission::all();
        } catch (\Exception $e) {
            \Log::error('Error loading permissions in RoleController::index(): ' . $e->getMessage());
            $permissions = [];
        }

        return Inertia::render('Roles/Index', [
            'roles' => $roles,
            'permissions' => $permissions,
        ]);
    }

    /**
     * Show the form for creating a new role.
     *
     * @return Response
     */
    public function create(): Response
    {
        try {
            $permissions = Permission::all();
        } catch (\Exception $e) {
            \Log::error('Error loading permissions in RoleController::create(): ' . $e->getMessage());
            $permissions = [];
        }

        return Inertia::render('Roles/Create', [
            'permissions' => $permissions,
        ]);
    }

    /**
     * Show the form for editing the specified role.
     *
     * @param Role $role
     * @return Response
     */
    public function edit(Role $role): Response
    {
        try {
            // Note: Ideally, this would use a service method to load the role with permissions
            // but we'll keep this direct model operation for now
            $role->load('permissions');
        } catch (\Exception $e) {
            \Log::error('Error loading permissions in RoleController::edit(): ' . $e->getMessage());
        }

        try {
            $permissions = Permission::all();
        } catch (\Exception $e) {
            \Log::error('Error loading permissions in RoleController::edit(): ' . $e->getMessage());
            $permissions = [];
        }

        return Inertia::render('Roles/Edit', [
            'role' => $role,
            'permissions' => $permissions,
        ]);
    }

    /**
     * Store a newly created role in storage.
     *
     * @param Request $request
     * @return RedirectResponse
     */
    public function store(Request $request): RedirectResponse
    {
        try {
            $data = $request->validate([
                'display_name' => 'required|string|max:255',
                'name' => 'required|string|max:255|unique:roles,name',
                'permissions' => 'nullable|array',
                'permissions.*' => 'exists:permissions,_id',
            ]);

            // Create role using the service
            $role = $this->roleService->create([
                'display_name' => $data['display_name'],
                'name' => $data['name'],
                'permissions' => [], // Initialize with empty permissions
            ]);

            // Set permissions to the role
            $this->roleService->setPermissionsToRole($role, $data['permissions'] ?? []);

            return redirect()->route('members-and-roles.roles.index')->with('success', 'Role created successfully.');
        } catch (\Exception $e) {
            \Log::error('Error in RoleController::store(): ' . $e->getMessage());
            return redirect()->back()->with('error', 'Failed to create role. Please try again.');
        }
    }

    /**
     * Update the specified role in storage.
     *
     * @param Request $request
     * @param Role $role
     * @return \Inertia\Response|\Illuminate\Http\RedirectResponse
     */
    public function update(Request $request, Role $role)
    {
        try {
            $data = $request->validate([
                'display_name' => 'required|string|max:255',
                'name' => [
                    'required',
                    'string',
                    'max:255',
                    Rule::unique('roles')->ignore($role->id),
                ],
                'permissions' => 'nullable|array',
                'permissions.*' => 'exists:permissions,_id',
            ]);

            // Update role using the service
            $this->roleService->update([
                'display_name' => $data['display_name'],
                'name' => $data['name'],
            ], $role->id);

            // Set permissions to the role (replacing any existing ones)
            $this->roleService->setPermissionsToRole($role, $data['permissions'] ?? []);

            // Redirect back to list or edit page with a success message
            return redirect()
                ->route('members-and-roles.roles.index')
                ->with('success', 'Role updated successfully.');
        } catch (\Exception $e) {
            \Log::error('Error in RoleController::update(): ' . $e->getMessage());

            // Redirect back with error flash message
            return redirect()->back()->with('error', 'Failed to update role. Please try again.');
        }
    }


    /**
     * Remove the specified role from storage.
     *
     * @param Role $role
     * @return RedirectResponse
     */
    public function destroy(Role $role): RedirectResponse
    {
        try {
            $this->roleService->delete($role->id);
            return redirect()->route('members-and-roles.roles.index')->with('success', 'Role deleted successfully.');
        } catch (\Exception $e) {
            \Log::error('Error in RoleController::destroy(): ' . $e->getMessage());
            return redirect()->back()->with('error', 'Failed to delete role. Please try again.');
        }
    }
}
