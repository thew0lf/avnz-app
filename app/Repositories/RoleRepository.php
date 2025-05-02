<?php

namespace App\Repositories;

use App\Models\Role;
use App\Repositories\Abstracts\AbstractRepository;

/**
 * Class ACLRepository
 *
 * Repository for managing Role related operations.
 */
class RoleRepository extends AbstractRepository
{
    /**
     * ACLRepository constructor.
     */
    public function __construct()
    {
        parent::__construct(Role::class);
    }
}
