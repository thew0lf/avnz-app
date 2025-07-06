<?php

namespace App\Repositories;

use App\Models\Team;
use App\Repositories\Abstracts\AbstractRepository;

class TeamRepository extends AbstractRepository
{
    public function __construct()
    {
        $this->model = new Team();
    }
}
