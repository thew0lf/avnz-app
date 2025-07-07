<?php
declare(strict_types=1);

namespace App\Models;

use MongoDB\Laravel\Eloquent\Model;
use MongoDB\Laravel\Eloquent\SoftDeletes;
use MongoDB\Laravel\Relations\BelongsTo;
use MongoDB\Laravel\Relations\BelongsToMany;
use MongoDB\Laravel\Relations\HasMany;

class Project extends Model
{
    use SoftDeletes;

    protected $collection = 'projects';

    protected $fillable = [
        'name', 'address_id', 'display_name'
    ];

    public function addressBook(): BelongsTo
    {
        return $this->belongsTo(AddressBook::class, 'address_id');
    }

    /**
     * The clients that belong to the project.
     */
    public function clients(): BelongsToMany
    {
        return $this->belongsToMany(Client::class);
    }

    /**
     * The project-client associations.
     */
    public function projectClients(): HasMany
    {
        return $this->hasMany(ProjectClient::class);
    }

    /**
     * The users that belong to the project.
     */
    public function users(): BelongsToMany
    {
        return $this->belongsToMany(User::class);
    }

    /**
     * The project-user associations.
     */
    public function userProjects(): HasMany
    {
        return $this->hasMany(UserProject::class);
    }

    /**
     * The role assignments for this project.
     */
    public function roleAssignments(): HasMany
    {
        return $this->hasMany(RoleAssignment::class, 'scope_id', '_id')
            ->where('scope_type', 'project');
    }
}
