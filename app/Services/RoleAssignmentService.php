<?php
// app/Services/RoleAssignmentService.php

namespace App\Services;

use App\Models\RoleAssignment;
use App\Models\User;
use App\Models\Role;

class RoleAssignmentService
{
    /**
     * Assign a role to a user on a given resource.
     */
    public function assign(
        User $user,
        Role $role,
        string $resourceType,
        string $resourceId
    ): RoleAssignment {
        return RoleAssignment::updateOrCreate(
            [
                'user_id'       => $user->getAuthIdentifier(),
                'role_id'       => $role->_id,
                'resource_type' => $resourceType,
                'resource_id'   => $resourceId,
            ],
            []
        );
    }

    /**
     * Remove a role assignment.
     */
    public function revoke(
        User $user,
        Role $role,
        string $resourceType,
        string $resourceId
    ): bool {
        return (bool) RoleAssignment::where([
            'user_id'       => $user->getAuthIdentifier(),
            'role_id'       => $role->_id,
            'resource_type' => $resourceType,
            'resource_id'   => $resourceId,
        ])->delete();
    }
}
