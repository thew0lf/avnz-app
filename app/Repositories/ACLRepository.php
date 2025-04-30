<?php

namespace App\Repositories;

use App\Models\ACL;
use App\Repositories\Abstracts\AbstractRepository;

/**
 * Class ACLRepository
 *
 * Repository for managing ACL related operations.
 */
class ACLRepository extends AbstractRepository
{
    /**
     * ACLRepository constructor.
     */
    public function __construct()
    {
        parent::__construct(ACL::class);
    }
}
