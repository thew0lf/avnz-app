<?php

namespace App\Http\Controllers\Auth\Dashboard\MembersAndRoles;

use App\Http\Controllers\Auth\AuthenticatedController;
use App\Http\Controllers\Controller;
use Inertia\Inertia;
use Inertia\Response;
use App\Models\{Role,Permission};

class RoleController extends Controller
{
    /**
     * Display a listing of roles.
     *
     * @return \Inertia\Response
     */
    public function index() : Response
    {
        try {
            $roles = Role::all();
        } catch (\Exception $e) {
            \Log::error('Error in MembersAndRoles/RoleController::index(): ' . $e->getMessage());
            $roles = [];
        }

        try {
            $permissions = Permission::all();
        } catch (\Exception $e) {
            \Log::error('Error loading permissions in MembersAndRoles/RoleController::index(): ' . $e->getMessage());
            $permissions = [];
        }

        return Inertia::render('roles/index', [
            'roles' => $roles,
            'permissions' => $permissions,
        ]);
    }

    public function create() : Response
    {
        try {
            $permissions = Permission::all();
        } catch (\Exception $e) {
            \Log::error('Error loading permissions in MembersAndRoles/RoleController::create(): ' . $e->getMessage());
            $permissions = [];
        }

        return Inertia::render('roles/create', [
            'permissions' => $permissions,
        ]);
    }

    public function show(Role $role) : Response
    {
        try {
            $role->load('permissions');
        } catch (\Exception $e) {
            \Log::error('Error loading permissions in MembersAndRoles/RoleController::show(): ' . $e->getMessage());
        }

        return Inertia::render('roles/show', [
            'roleId' => $role->id,
            'role' => $role,
        ]);
    }

    public function edit(Role $role):Response
    {
        try {
            $role->load('permissions');
        } catch (\Exception $e) {
            \Log::error('Error loading permissions in MembersAndRoles/RoleController::edit(): ' . $e->getMessage());
        }

        try {
            $permissions = Permission::all();
        } catch (\Exception $e) {
            \Log::error('Error loading permissions in MembersAndRoles/RoleController::edit(): ' . $e->getMessage());
            $permissions = [];
        }

        return Inertia::render('roles/edit', [
            'roleId' => $role->id,
            'role' => $role,
            'permissions' => $permissions,
        ]);
    }
}
