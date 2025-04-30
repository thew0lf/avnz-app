<?php

namespace App\Models;

use MongoDB\Laravel\Eloquent\Model as Eloquent;

class Permission extends Eloquent
{
    // Define the collection name, e.g. "acls".
    /**
     * The attributes that are mass assignable.
     *
     * @var array<int, string>
     */
    protected $fillable = [
        'name',
        'description',
        'role',       // Example: 'admin', 'editor', 'user'
        'resource',
        'permissions' // Array, e.g. ['create', 'update', 'delete','list']
    ];
}
