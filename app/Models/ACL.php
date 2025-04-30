<?php

namespace App\Models;

use MongoDB\Laravel\Eloquent\Model as Eloquent;

class ACL extends Eloquent
{
    // Define the collection name, e.g. "acls".
    protected $collection = 'acls';
    protected $connection = 'mongodb';
    protected $table = 'acls';
    /**
     * The attributes that are mass assignable.
     *
     * @var array<int, string>
     */
    protected $fillable = [
        'name',
        'description',
        'role',       // Example: 'admin', 'editor', 'user'
        'resource',   // Example: 'posts', 'comments', etc.
        'permissions' // Array, e.g. ['create', 'update', 'delete','list','all']
    ];
}
