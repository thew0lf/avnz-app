<?php

namespace App\Http\Controllers;

use App\Models\Project;
use Illuminate\Http\Request;
use Illuminate\Validation\Rule;
use Inertia\Inertia;
use Inertia\Response;
use Illuminate\Http\RedirectResponse;

class ProjectController extends Controller
{
    /**
     * Display a listing of the projects.
     *
     * @return Response
     */
    public function index(): Response
    {
        $projects = Project::all();

        return Inertia::render('security/projects/index', [
            'projects' => $projects,
        ]);
    }

    /**
     * Store a newly created project in storage.
     *
     * @param Request $request
     * @return RedirectResponse
     */
    public function store(Request $request): RedirectResponse
    {
        try {
            $data = $request->validate([
                'name' => 'required|string|max:255|unique:projects',
                'display_name' => 'required|string|max:255',
                'address_id' => 'nullable|string',
            ]);

            $project = Project::create($data);

            return redirect()->route('security.projects.index')->with('success', 'Project created successfully.');
        } catch (\Exception $e) {
            \Log::error('Error in ProjectController::store(): ' . $e->getMessage());
            return redirect()->back()->with('error', 'Failed to create project. Please try again.');
        }
    }

    /**
     * Update the specified project in storage.
     *
     * @param Request $request
     * @param Project $project
     * @return RedirectResponse
     */
    public function update(Request $request, Project $project): RedirectResponse
    {
        try {
            $data = $request->validate([
                'name' => [
                    'required',
                    'string',
                    'max:255',
                    Rule::unique('projects')->ignore($project->id),
                ],
                'display_name' => 'required|string|max:255',
                'address_id' => 'nullable|string',
            ]);

            $project->update($data);

            return redirect()->route('security.projects.index')->with('success', 'Project updated successfully.');
        } catch (\Exception $e) {
            \Log::error('Error in ProjectController::update(): ' . $e->getMessage());
            return redirect()->back()->with('error', 'Failed to update project. Please try again.');
        }
    }

    /**
     * Remove the specified project from storage.
     *
     * @param Project $project
     * @return RedirectResponse
     */
    public function destroy(Project $project): RedirectResponse
    {
        try {
            // Delete all user-project associations
            $project->userProjects()->delete();

            // Delete all project-client associations
            $project->projectClients()->delete();

            // Delete all role assignments for this project
            $project->roleAssignments()->delete();

            // Delete the project
            $project->delete();

            return redirect()->route('security.projects.index')->with('success', 'Project deleted successfully.');
        } catch (\Exception $e) {
            \Log::error('Error in ProjectController::destroy(): ' . $e->getMessage());
            return redirect()->back()->with('error', 'Failed to delete project. Please try again.');
        }
    }
}
