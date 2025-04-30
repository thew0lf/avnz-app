<?php

namespace App\Repositories;

use App\Repositories\Abstracts\AbstractRepository;
use App\Models\Project;

class ProjectRepository extends AbstractRepository
{
    function __construct(){
        parent::__construct(Project::class);
    }
}
