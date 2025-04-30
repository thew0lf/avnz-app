<?php
declare(strict_types=1);

namespace App\Models;

use MongoDB\Laravel\Eloquent\Model;

class UserPermission extends Model
{
    protected $connection = 'mongodb';
    protected $collection = 'user_permissions';

    protected $fillable = [
        'project_id',
        'client_id',
        'company_id',
        'user_id',
        'roles',
    ];
}
