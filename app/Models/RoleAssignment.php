<?php
namespace App\Models;

use MongoDB\Laravel\Eloquent\Model;

class RoleAssignment extends Model
{

    protected $fillable = [
        'user_id',     // ObjectId of User
        'role_id',     // ObjectId of Role
        'scope_type',  // 'company', 'client', 'project', or 'team'
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

    /**
     * Get the team this assignment belongs to (if scope_type is 'team')
     */
    public function team()
    {
        return $this->belongsTo(Team::class, 'scope_id', '_id')
            ->where('scope_type', 'team');
    }
}
