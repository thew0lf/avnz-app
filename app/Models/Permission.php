<?php
declare(strict_types=1);

namespace App\Models;

use MongoDB\Laravel\Relations\{BelongsToMany,BelongsTo};
use MongoDB\Laravel\Eloquent\Model;


class Permission extends Model
{
    public const ACTIONS = ['list', 'view', 'create', 'modify', 'delete'];
    protected $fillable = [
        'name',
        'description',
        'guard_name'
    ];

    public function roles(): BelongsToMany
    {
        return $this->belongsToMany(Role::class, null, 'permissions', 'roles');
    }
}
