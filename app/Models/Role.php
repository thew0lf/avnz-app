<?php

namespace App\Models;

use MongoDB\Laravel\Eloquent\Model as Eloquent;

class Role extends Model
{
    protected $fillable = [
        'name',
        'description',
        'permissions', // array of Permission _id's
    ];

//    protected $casts = [
//        'permissions' => 'array',
//    ];

    /**
     * Permissions granted to this role
     */
    public function permissions()
    {
        return $this->belongsToMany(
        Permission::class,
        null,
        'permissions', // local key: array of permission IDs
        '_id'           // related key on Permission
    );
    }
}
