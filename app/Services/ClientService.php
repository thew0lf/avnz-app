<?php

namespace App\Services;

use App\Repositories\ClientRepository;
use App\Services\Abstracts\AbstractService;
use App\Models\Client;

/**
 * Service to handle Client related operations.
 */
class ClientService extends AbstractService
{
    public function __construct()
    {
        $this->repository = new ClientRepository();
    }

}
