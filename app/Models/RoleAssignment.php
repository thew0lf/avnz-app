<?php
namespace App\Models;

use MongoDB\Laravel\Eloquent\Model;
use MongoDB\Laravel\Relations\BelongsTo;

class RoleAssignment extends Model
{
    protected $collection = 'role_assignments';

    protected $fillable = [
        'user_id',     // ObjectId of User
        'role_id',     // ObjectId of Role
        'scope_type',  // 'company', 'client', 'project', or 'team'
        'scope_id',    // ObjectId of the scoped document
    ];

    /**
     * The indexes that should be created on the collection.
     *
     * @var array
     */
    protected $indexes = [
        ['key' => ['user_id' => 1]],
        ['key' => ['role_id' => 1]],
        ['key' => ['scope_type' => 1]],
        ['key' => ['scope_id' => 1]],
        ['key' => ['user_id' => 1, 'scope_type' => 1, 'scope_id' => 1]],
        ['key' => ['user_id' => 1, 'role_id' => 1, 'scope_type' => 1, 'scope_id' => 1], 'unique' => true],
    ];

    /**
     * The user this assignment belongs to
     */
    public function user(): BelongsTo
    {
        return $this->belongsTo(User::class, 'user_id', '_id');
    }

    /**
     * The role assigned
     */
    public function role(): BelongsTo
    {
        return $this->belongsTo(Role::class, 'role_id', '_id');
    }

    /**
     * Get the project this assignment belongs to (if scope_type is 'project')
     */
    public function project(): BelongsTo
    {
        return $this->belongsTo(Project::class, 'scope_id', '_id')
            ->where('scope_type', 'project');
    }

    /**
     * Get the client this assignment belongs to (if scope_type is 'client')
     */
    public function client(): BelongsTo
    {
        return $this->belongsTo(Client::class, 'scope_id', '_id')
            ->where('scope_type', 'client');
    }

    /**
     * Get the company this assignment belongs to (if scope_type is 'company')
     */
    public function company(): BelongsTo
    {
        return $this->belongsTo(Company::class, 'scope_id', '_id')
            ->where('scope_type', 'company');
    }

    /**
     * Get the team this assignment belongs to (if scope_type is 'team')
     */
    public function team(): BelongsTo
    {
        return $this->belongsTo(Team::class, 'scope_id', '_id')
            ->where('scope_type', 'team');
    }

    /**
     * Create a new role assignment
     */
    public static function createAssignment(User $user, Role $role, string $scopeType, $scopeId)
    {
        return self::create([
            'user_id'    => $user->id,
            'role_id'    => $role->id,
            'scope_type' => $scopeType,
            'scope_id'   => $scopeId,
        ]);
    }
}
