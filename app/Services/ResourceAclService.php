<?php

namespace App\Services;

use App\Models\ResourceAcl;
use App\Models\User;

/**
 * Handles granting, checking, and revoking per‐user ACLs on individual resources.
 */
class ResourceAclService
{
    /**
     * Grant one or more permissions on a resource to a user.
     *
     * @param  User    $user
     * @param  string  $resourceType  e.g. 'project', 'client', 'company'
     * @param  string  $resourceId    MongoDB ObjectId string
     * @param  array   $permissions   List of permission keys, e.g. ['view', 'edit']
     * @return ResourceAcl
     */
    public function grant(
        User $user,
        string $resourceType,
        string $resourceId,
        array $permissions
    ): ResourceAcl {
        // Deduplicate permissions
        $permissions = array_values(array_unique($permissions));

        // Create or update the ACL entry
        return ResourceAcl::updateOrCreate(
            [
                'user_id'       => $user->getAuthIdentifier(),  // _id under the hood
                'resource_type' => $resourceType,
                'resource_id'   => $resourceId,
            ],
            [
                'permissions'   => $permissions,
            ]
        );
    }
}
