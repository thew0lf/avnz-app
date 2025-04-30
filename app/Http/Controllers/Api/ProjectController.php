<?php

namespace App\Http\Controllers\Api;

use App\Http\Controllers\Controller;
use Illuminate\Http\Request;
use App\Services\ProjectService;

class ProjectController extends Controller
{
    public function __construct(
        protected ProjectService $projectService)
    {
    }

    /**
     * Return a project object.
     *
     * @param  \Illuminate\Http\Request  $request
     * @return \Illuminate\Http\JsonResponse
     */
    public function index(Request $request)
    {

        $projectName = config('app.name');
        $project = $this->projectService->findByName($projectName);
        $projectValues = ($project)?collect($project->getAttributes())
            ->only($project->getFillable())
            ->all():[];
        return response()->json( $projectValues );
    }
}
