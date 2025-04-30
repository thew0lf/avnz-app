<?php

namespace App\Services;

use App\Repositories\ProjectRepository;
use App\Services\Abstracts\AbstractService;

class ProjectService extends AbstractService
{
    public function __construct()
    {
        // Instantiate the repository to handle data operations for the project.
        $this->repository = new ProjectRepository();
    }
}
