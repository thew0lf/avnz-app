<?php

namespace App\Services;

use App\Models\User;
use App\Repositories\PermissionRepository;
use App\Services\Abstracts\AbstractService;
use App\Models\{Project,Client,Company,Permission};


class PermissionService extends AbstractService
{

    protected $projectPermissions = ['admin'];
    protected $clientPermissions = ['client_admin', 'client_user', 'dashboard',];
    protected $companyPermissions = ['company_admin', 'company_user'];
    protected $teamPermissions = ['team_admin', 'team_member'];

    public function __construct()
    {
        $this->repository = new PermissionRepository();
    }
    /**
     * Check if a user has a specific permission in the given scopes
     *
     * @param Project $project
     * @param Client $client
     * @param Company $company
     * @param User $user
     * @param string $permissionName
     * @return bool
     */
    public function hasPermission(Project $project, Client $client, Company $company, User $user, string $permissionName): bool
    {
        // Check if user has global admin permission
        if ($user->hasGlobalPermission('administrator')) {
            return true;
        }

        // Check project scope
        if ($user->hasPermissionInScope($permissionName, 'project', $project->id)) {
            return true;
        }

        // Check client scope
        if ($user->hasPermissionInScope($permissionName, 'client', $client->id)) {
            return true;
        }

        // Check company scope
        if ($user->hasPermissionInScope($permissionName, 'company', $company->id)) {
            return true;
        }

        return false;
    }

    /**
     * Get all permissions for a user across all scopes
     *
     * @param User $user
     * @return array
     */
    public function getPermissions(User $user): array
    {
        // Get all role assignments for the user
        $roleAssignments = $user->roleAssignments()->with('role.permissions')->get();

        // Extract all unique permission names
        $permissions = [];
        foreach ($roleAssignments as $assignment) {
            foreach ($assignment->role->permissions as $permission) {
                $permissions[] = $permission->name;
            }
        }

        return array_unique($permissions);
    }
    /**
     * Check if a user has any of the specified permissions
     *
     * @param User $user
     * @param array $permissionNames
     * @return bool
     */
    public function hasAnyPermission(User $user, array $permissionNames): bool
    {
        // Check if user has global admin permission
        if ($user->hasGlobalPermission('administrator')) {
            return true;
        }

        // Get all permissions for the user
        $userPermissions = $this->getPermissions($user);

        // Check if any of the specified permissions are in the user's permissions
        return !empty(array_intersect($userPermissions, $permissionNames));
    }
    /**
     * Assign the given permissions to the user in the specified scopes.
     *
     * @param User $user
     * @param Project $project
     * @param Client $client
     * @param Company $company
     * @param array $permissionNames Array of permission names
     */
    public function givePermissionsTo(User $user, Project $project, Client $client, Company $company, array $permissionNames): void
    {
        // Create a role with the given permissions
        $roleName = 'custom_' . $user->id . '_' . time();
        $role = Role::create([
            'name' => $roleName,
            'display_name' => 'Custom Role for ' . $user->name,
            'description' => 'Custom role created for ' . $user->name,
        ]);

        // Add permissions to the role
        $permissions = Permission::whereIn('name', $permissionNames)->get();
        $permissionIds = $permissions->pluck('_id')->toArray();
        $role->update(['permissions' => $permissionIds]);

        // Assign the role to the user in each scope
        $user->assignRoleScope($role, 'project', $project->id);
        $user->assignRoleScope($role, 'client', $client->id);
        $user->assignRoleScope($role, 'company', $company->id);
    }

    public function getProjectPermissions(): array
    {
        return $this->projectPermissions;
    }
    public function getClientPermissions(): array
    {
        return $this->clientPermissions;
    }
    public function getCompanyPermissions(): array
    {
        return $this->companyPermissions;
    }

    public function getTeamPermissions(): array
    {
        return $this->teamPermissions;
    }

    public function getRegistrationPermissions(): array
    {
        return array_merge($this->clientPermissions, $this->companyPermissions, $this->teamPermissions);
    }
    public function getAllByIds(array $permissionIds): array
    {
        return $this->repository->getQuery()->whereIn('_id', $permissionIds)->get()->toArray();
    }
}
