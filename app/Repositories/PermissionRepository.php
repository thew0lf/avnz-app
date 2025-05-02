<?php
namespace App\Repositories;
use App\Models\Permission;
use App\Repositories\Abstracts\AbstractRepository;

class PermissionRepository extends AbstractRepository
{
    public function __construct()
    {
        parent::__construct(Permission::class);
    }

}
