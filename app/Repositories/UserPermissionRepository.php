<?php
namespace App\Repositories;
use App\Models\UserPermission;
use App\Repositories\Abstracts\AbstractRepository;

class UserPermissionRepository extends AbstractRepository
{
    public function __construct()
    {
        parent::__construct(UserPermission::class);
    }

}
