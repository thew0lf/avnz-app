<?php

namespace App\Repositories;

use App\Repositories\Abstracts\AbstractRepository;
use App\Models\Company;

class CompanyRepository extends AbstractRepository
{
    public function __construct(){
        parent::__construct(Company::class);
    }
}
