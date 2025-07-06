<?php
// File: app/Services/TeamService.php
namespace App\Services;

use App\Models\Team;
use App\Models\User;
use App\Models\Role;
use App\Models\RoleAssignment;
use App\Repositories\TeamRepository;
use App\Services\Abstracts\AbstractService;
use MongoDB\BSON\ObjectId;

class TeamService extends AbstractService
{
    protected $roleService;

    public function __construct(RoleService $roleService)
    {
        $this->repository = new TeamRepository();
        $this->roleService = $roleService;
    }

    /**
     * Add a member to a team.
     *
     * @param Team $team
     * @param User $user
     * @return Team
     */
    public function addMember(Team $team, User $user): Team
    {
        $team->members()->attach($user->id);
        return $team;
    }

    /**
     * Remove a member from a team.
     *
     * @param Team $team
     * @param User $user
     * @return Team
     */
    public function removeMember(Team $team, User $user): Team
    {
        $team->members()->detach($user->id);

        // Also remove any role assignments for this user in this team
        RoleAssignment::where([
            'user_id' => new ObjectId($user->_id),
            'scope_type' => 'team',
            'scope_id' => new ObjectId($team->_id),
        ])->delete();

        return $team;
    }

    /**
     * Assign a role to a user within a team.
     *
     * @param Team $team
     * @param User $user
     * @param Role $role
     * @return RoleAssignment
     */
    public function assignRole(Team $team, User $user, Role $role): RoleAssignment
    {
        // Make sure the user is a member of the team
        if (!$team->members()->where('user_id', $user->id)->exists()) {
            $this->addMember($team, $user);
        }

        return $this->roleService->grant($user, $role, 'team', $team->id);
    }

    /**
     * Revoke a role from a user within a team.
     *
     * @param Team $team
     * @param User $user
     * @param Role $role
     * @return bool
     */
    public function revokeRole(Team $team, User $user, Role $role): bool
    {
        return $this->roleService->revoke($user, $role, 'team', $team->id);
    }

    /**
     * Check if a user has a role within a team.
     *
     * @param Team $team
     * @param User $user
     * @param Role|string $role
     * @return bool
     */
    public function hasRole(Team $team, User $user, $role): bool
    {
        return $this->roleService->has($user, $role, 'team', $team->id);
    }

    /**
     * Get all roles for a member within a team.
     *
     * @param Team $team
     * @param User $user
     * @return \Illuminate\Database\Eloquent\Collection
     */
    public function getMemberRoles(Team $team, User $user)
    {
        return $user->scopedRoles('team', $team->id);
    }
}
