<?php
declare(strict_types=1);

namespace App\Services;

use App\Repositories\UserRepository;
use App\Services\Abstracts\AbstractService;

class UserService extends AbstractService
{
    public function __construct(){
            $this->repository = new UserRepository();
    }
}
