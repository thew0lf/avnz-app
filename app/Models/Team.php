<?php

namespace App\Models;

use MongoDB\Laravel\Eloquent\Model;
use MongoDB\Laravel\Eloquent\SoftDeletes;
use MongoDB\Laravel\Relations\BelongsTo;
use MongoDB\Laravel\Relations\BelongsToMany;
use MongoDB\Laravel\Relations\HasMany;

class Team extends Model
{
    use SoftDeletes;

    protected $collection = 'teams';

    protected $fillable = [
        'name',
        'display_name',
        'description',
        'company_id',
    ];

    /**
     * The company that this team belongs to.
     */
    public function company(): BelongsTo
    {
        return $this->belongsTo(Company::class);
    }

    /**
     * The users that belong to the team.
     */
    public function users(): BelongsToMany
    {
        return $this->belongsToMany(User::class);
    }

    /**
     * The team-user associations.
     */
    public function userTeams(): HasMany
    {
        return $this->hasMany(UserTeam::class);
    }

    /**
     * The role assignments for this team.
     */
    public function roleAssignments(): HasMany
    {
        return $this->hasMany(RoleAssignment::class, 'scope_id', '_id')
            ->where('scope_type', 'team');
    }
}
