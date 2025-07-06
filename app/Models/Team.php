<?php

namespace App\Models;

use MongoDB\Laravel\Eloquent\Model;
use MongoDB\Laravel\Relations\BelongsToMany;
use MongoDB\Laravel\Relations\HasMany;

class Team extends Model
{
    protected $fillable = [
        'name',
        'display_name',
        'description',
        'project_ids',
        'client_ids',
        'company_ids',
    ];

    /**
     * The members that belong to the team.
     */
    public function members(): BelongsToMany
    {
        return $this->belongsToMany(User::class);
    }

    /**
     * The role assignments for this team.
     */
    public function roleAssignments(): HasMany
    {
        return $this->hasMany(RoleAssignment::class, 'scope_id', '_id')
            ->where('scope_type', 'team');
    }

    /**
     * The projects that belong to the team.
     */
    public function projects(): BelongsToMany
    {
        return $this->belongsToMany(Project::class);
    }

    /**
     * The clients that belong to the team.
     */
    public function clients(): BelongsToMany
    {
        return $this->belongsToMany(Client::class);
    }

    /**
     * The companies that belong to the team.
     */
    public function companies(): BelongsToMany
    {
        return $this->belongsToMany(Company::class);
    }
}
