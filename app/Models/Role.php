<?php

namespace App\Models;

use MongoDB\Laravel\Eloquent\Model;
use MongoDB\Laravel\Relations\BelongsToMany;
use MongoDB\Laravel\Relations\HasMany;

class Role extends Model
{
    protected $fillable = [
        'name',
        'display_name',
        'description',
        'permissions', // array of Permission _id's
    ];

    public function permissions(): HasMany
    {

        return $this->hasMany(Permission::class, null, 'roles', 'permissions')
            ->whereIn('_id', array_map(function ($id) {
                return new \MongoDB\BSON\ObjectId($id);
            }, $this->attributes['permissions'] ?? []));
    }

}
