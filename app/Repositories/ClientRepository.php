<?php

namespace App\Repositories;

use App\Repositories\Abstracts\AbstractRepository;
use App\Models\Client;

class ClientRepository extends AbstractRepository
{
    public function __construct(){
        parent::__construct(Client::class);
    }
}
