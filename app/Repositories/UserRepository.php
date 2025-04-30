<?php

namespace App\Repositories;

use App\Models\User;
use App\Repositories\Abstracts\AbstractRepository;

class UserRepository extends AbstractRepository
{
    public function __construct()
    {
        parent::__construct(User::class);
    }
}
