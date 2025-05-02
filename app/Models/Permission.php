<?php
declare(strict_types=1);

namespace App\Models;

use MongoDB\Laravel\Relations\{BelongsToMany,BelongsTo};
use MongoDB\Laravel\Eloquent\Model;


class Permission extends Model
{

    protected $fillable = [
        'name',
        'description',
        'guard_name'
    ];

}
