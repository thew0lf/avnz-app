<?php
// File: app/Services/RoleService.php
namespace App\Services;

use App\Models\{User,Role,Permission,RoleAssignment};

use App\Repositories\RoleRepository;
use App\Services\Abstracts\AbstractService;
use Illuminate\Database\Eloquent\ModelNotFoundException;

class RoleService extends AbstractService
{
    public function __construct()
    {
        $this->repository = new RoleRepository();
    }
    /**
     * Grant a role to a user.
     *
     * @param  User              $user
     * @param  string|Role       $role         Role name or Role instance
     * @param  string|null       $scopeType    e.g. 'company', 'client', 'project'
     * @param  mixed|null        $scopeId      The ID of the scoped resource
     * @return RoleAssignment|\MongoDB\Laravel\Eloquent\Model
     */
    public function grant(User $user, $role, ?string $scopeType = null, $scopeId = null)
    {
        // resolve Role instance
        if (is_string($role)) {
            $role = Role::where('name', $role)->firstOrFail();
        }

        // global role?
        if (is_null($scopeType) && is_null($scopeId)) {
            // attach to the pivot array `roles`
            $user->roles()->syncWithoutDetaching([$role->id]);
            return $role;
        }

        // scoped role: use RoleAssignment model
        return RoleAssignment::firstOrCreate([
            'user_id'    => $user->id,
            'role_id'    => $role->id,
            'scope_type' => $scopeType,
            'scope_id'   => $scopeId,
        ]);
    }

    /**
     * Check if a user has a given role.
     *
     * @param  User         $user
     * @param  string|Role  $roleNameOrModel
     * @param  string|null  $scopeType
     * @param  mixed|null   $scopeId
     * @return bool
     */
    public function has(User $user, $roleNameOrModel, ?string $scopeType = null, $scopeId = null): bool
    {
        $roleName = $roleNameOrModel instanceof Role
            ? $roleNameOrModel->name
            : $roleNameOrModel;

        // global check
        if (is_null($scopeType) && is_null($scopeId)) {
            return $user->roles
                ->pluck('name')
                ->contains($roleName);
        }

        // scoped check via RoleAssignment
        return RoleAssignment::where('user_id',    $user->id)
            ->where('scope_type', $scopeType)
            ->where('scope_id',   $scopeId)
            ->whereHas('role', fn($q) => $q->where('name', $roleName))
            ->exists();
    }

    /**
     * Revoke a role from a user.
     *
     * @param  User              $user
     * @param  string|Role       $role
     * @param  string|null       $scopeType
     * @param  mixed|null        $scopeId
     * @return bool
     */
    public function revoke(User $user, $role, ?string $scopeType = null, $scopeId = null): bool
    {
        // resolve Role instance
        if (is_string($role)) {
            $role = Role::where('name', $role)->firstOrFail();
        }

        // global revoke
        if (is_null($scopeType) && is_null($scopeId)) {
            $user->roles()->detach($role->id);
            return true;
        }

        // scoped revoke
        return RoleAssignment::where([
                'user_id'    => $user->id,
                'role_id'    => $role->id,
                'scope_type' => $scopeType,
                'scope_id'   => $scopeId,
            ])->delete() > 0;
    }
    public function addPermissionsToRole(Role $role, array $permissionIds): Role
    {
        // Merge existing permissions with new ones (avoid duplicates)
        $currentPermissions = $role->permissions ?: [];
        $updatedPermissions = array_unique(array_merge($currentPermissions, $permissionIds));

        // Save updated permissions
        $role->permissions = $updatedPermissions;
        $role->save();

        return $role;
    }


    public function addPermissionsByNameToRole(Role $role, array $permissionNames): Role
    {
        $permissionIds = [];

        foreach ($permissionNames as $name) {
            $permission = Permission::firstOrCreate(['name' => $name], [
                'guard_name' => 'web',
            ]);
            $permissionIds[] = $permission->_id;
        }

        $currentPermissions = $role->permissions ?: [];
        $updatedPermissions = array_unique(array_merge($currentPermissions, $permissionIds));

        $role->permissions = $updatedPermissions;
        $role->save();

        return $role;
    }

}
