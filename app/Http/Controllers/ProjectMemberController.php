<?php

namespace App\Http\Controllers;

use App\Models\Project;
use App\Models\User;
use App\Models\UserProject;
use Illuminate\Http\Request;
use Inertia\Inertia;
use Inertia\Response;
use Illuminate\Http\RedirectResponse;

class ProjectMemberController extends Controller
{
    /**
     * Display a listing of the project members.
     *
     * @param Project $project
     * @return Response
     */
    public function index(Project $project): Response
    {
        // Load the project with its members
        $project->load('userProjects.user');

        // Get the members data in a format suitable for the datatable
        $members = $project->userProjects->map(function ($userProject) {
            return [
                'id' => $userProject->id,
                'user_id' => $userProject->user_id,
                'user' => [
                    'id' => $userProject->user->id,
                    'name' => $userProject->user->name,
                    'email' => $userProject->user->email,
                ],
                'created_at' => $userProject->created_at,
            ];
        });

        return Inertia::render('security/projects/members/index', [
            'project' => $project,
            'members' => $members,
        ]);
    }

    /**
     * Store a newly created project member in storage.
     *
     * @param Request $request
     * @param Project $project
     * @return RedirectResponse
     */
    public function store(Request $request, Project $project): RedirectResponse
    {
        try {
            $data = $request->validate([
                'user_id' => 'required|exists:users,_id',
            ]);

            // Check if the user is already a member of the project
            $existingMember = UserProject::where('user_id', $data['user_id'])
                ->where('project_id', $project->id)
                ->first();

            if ($existingMember) {
                return redirect()->back()->with('error', 'User is already a member of this project.');
            }

            // Create the new user-project association
            UserProject::create([
                'user_id' => $data['user_id'],
                'project_id' => $project->id,
            ]);

            return redirect()->route('security.projects.members.index', $project)
                ->with('success', 'Member added to project successfully.');
        } catch (\Exception $e) {
            \Log::error('Error in ProjectMemberController::store(): ' . $e->getMessage());
            return redirect()->back()->with('error', 'Failed to add member to project. Please try again.');
        }
    }

    /**
     * Remove the specified project member from storage.
     *
     * @param Request $request
     * @param Project $project
     * @return RedirectResponse
     */
    public function destroy(Request $request, Project $project): RedirectResponse
    {
        try {
            $data = $request->validate([
                'user_id' => 'required|exists:users,_id',
            ]);

            // Find and delete the user-project association
            $userProject = UserProject::where('user_id', $data['user_id'])
                ->where('project_id', $project->id)
                ->first();

            if (!$userProject) {
                return redirect()->back()->with('error', 'User is not a member of this project.');
            }

            $userProject->delete();

            return redirect()->route('security.projects.members.index', $project)
                ->with('success', 'Member removed from project successfully.');
        } catch (\Exception $e) {
            \Log::error('Error in ProjectMemberController::destroy(): ' . $e->getMessage());
            return redirect()->back()->with('error', 'Failed to remove member from project. Please try again.');
        }
    }

    /**
     * Search for users to add to the project.
     *
     * @param Request $request
     * @return \Illuminate\Http\JsonResponse
     */
    public function search(Request $request)
    {
        try {
            $query = $request->input('query');
            $projectId = $request->input('project_id');

            // Get users that match the search query
            $users = User::where('name', 'like', "%{$query}%")
                ->orWhere('email', 'like', "%{$query}%")
                ->get();

            // Filter out users that are already members of the project
            $existingUserIds = UserProject::where('project_id', $projectId)
                ->pluck('user_id')
                ->toArray();

            $filteredUsers = $users->filter(function ($user) use ($existingUserIds) {
                return !in_array($user->id, $existingUserIds);
            })->values();

            return response()->json([
                'users' => $filteredUsers->map(function ($user) {
                    return [
                        'id' => $user->id,
                        'name' => $user->name,
                        'email' => $user->email,
                    ];
                }),
            ]);
        } catch (\Exception $e) {
            \Log::error('Error in ProjectMemberController::search(): ' . $e->getMessage());
            return response()->json(['error' => 'Failed to search users.'], 500);
        }
    }
}
