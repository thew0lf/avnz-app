<?php

namespace App\Models;

use MongoDB\Laravel\Eloquent\Model;
use MongoDB\Laravel\Relations\BelongsToMany;

class Role extends Model
{
    protected $fillable = [
        'name',
        'display_name',
        'description',
        'permissions', // array of Permission _id's
    ];

    protected $casts = [
        'permissions' => 'array',
    ];

    /**
     * Permissions granted to this role
     */
    public function users(): BelongsToMany
    {
        return $this->belongsToMany(
            User::class,      // related model
            'role_user',      // pivot collection
            'role_ids',       // foreign key referencing this model (Role) in pivot
            'user_ids'        // foreign key referencing related model (User) in pivot
        );
    }

}
