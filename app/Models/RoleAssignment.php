<?php
namespace App\Models;

use MongoDB\Laravel\Eloquent\Model;

class RoleAssignment extends Model
{

    protected $fillable = [
        'user_id',     // ObjectId of User
        'role_id',     // ObjectId of Role
        'scope_type',  // 'company', 'client', or 'project'
        'scope_id',    // ObjectId of the scoped document
    ];

    /**
     * The user this assignment belongs to
     */
    public function user()
    {
        return $this->belongsTo(User::class, 'user_id', '_id');
    }

    /**
     * The role assigned
     */
    public function role()
    {
        return $this->belongsTo(Role::class, 'role_id', '_id');
    }
}
