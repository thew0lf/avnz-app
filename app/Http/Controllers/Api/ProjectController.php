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
     * Return a project object with its related entities.
     *
     * @param  \Illuminate\Http\Request  $request
     * @return \Illuminate\Http\JsonResponse
     */
    public function index(Request $request): \Illuminate\Http\JsonResponse
    {
        try {
            $projectName = config('app.name');
            $project = $this->projectService->findByName($projectName);

            if (!$project) {
                return response()->json([]);
            }

            // Load related entities
            $project->load(['clients', 'users']);

            // Prepare response data
            $response = [
                'project' => collect($project->getAttributes())->only($project->getFillable())->all(),
                'clients' => $project->clients->map(function($client) {
                    return collect($client->getAttributes())->only($client->getFillable())->all();
                }),
                'users' => $project->users->map(function($user) {
                    return collect($user->getAttributes())->only(['_id', 'name', 'email'])->all();
                })
            ];

            return response()->json($response);
        } catch (\Exception $e) {
            \Log::error('Error in ProjectController::index(): ' . $e->getMessage());
            return response()->json(['error' => 'Failed to retrieve project information'], 500);
        }
    }
}
