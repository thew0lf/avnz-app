<?php

namespace App\Services;

use App\Repositories\CompanyRepository;
use App\Services\Abstracts\AbstractService;

class CompanyService extends AbstractService
{
    public function __construct(CompanyRepository $repository)
    {
        $this->repository = $repository;
    }
}
