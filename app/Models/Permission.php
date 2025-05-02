<?php
declare(strict_types=1);

namespace App\Models;

use App\Models\Role;
use MongoDB\Laravel\Relations\{HasMany,BelongsToMany,BelongsTo};
use MongoDB\Laravel\Eloquent\Model;


class Permission extends Model
{

    protected $fillable = [
        'name',
        'description',
    ];
}
