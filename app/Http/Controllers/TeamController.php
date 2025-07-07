<?php

namespace App\Http\Controllers;

use App\Models\Team;
use App\Models\User;
use App\Models\Role;
use App\Services\TeamService;
use App\Services\RoleService;
use Illuminate\Http\Request;
use Illuminate\Validation\Rule;
use Inertia\Inertia;
use Inertia\Response;
use Illuminate\Http\RedirectResponse;

class TeamController extends Controller
{
    protected $teamService;
    protected $roleService;

    public function __construct(TeamService $teamService, RoleService $roleService)
    {
        $this->teamService = $teamService;
        $this->roleService = $roleService;
    }

    /**
     * Display a listing of the teams.
     *
     * @return Response
     */
    public function index(): Response
    {
        $teams = Team::all();

        return Inertia::render('security/teams/index', [
            'teams' => $teams,
        ]);
    }

    /**
     * Show the form for creating a new team.
     *
     * @return Response
     */
    public function create(): Response
    {
        return Inertia::render('Teams/Create');
    }

    /**
     * Store a newly created team in storage.
     *
     * @param Request $request
     * @return RedirectResponse
     */
    public function store(Request $request): RedirectResponse
    {
        try {
            $data = $request->validate([
                'name' => 'required|string|max:255|unique:teams',
                'display_name' => 'required|string|max:255',
                'description' => 'nullable|string',
            ]);

            $team = Team::create($data);

            return redirect()->route('security.teams.index')->with('success', 'Team created successfully.');
        } catch (\Exception $e) {
            \Log::error('Error in TeamController::store(): ' . $e->getMessage());
            return redirect()->back()->with('error', 'Failed to create team. Please try again.');
        }
    }

    /**
     * Display the specified team.
     *
     * @param Team $team
     * @return Response
     */
    public function show(Team $team): Response
    {
        $team->load('members');
        $roles = Role::all();

        return Inertia::render('Teams/Show', [
            'team' => $team,
            'roles' => $roles,
        ]);
    }

    /**
     * Show the form for editing the specified team.
     *
     * @param Team $team
     * @return Response
     */
    public function edit(Team $team): Response
    {
        return Inertia::render('Teams/Edit', [
            'team' => $team,
        ]);
    }

    /**
     * Update the specified team in storage.
     *
     * @param Request $request
     * @param Team $team
     * @return RedirectResponse
     */
    public function update(Request $request, Team $team): RedirectResponse
    {
        try {
            $data = $request->validate([
                'name' => [
                    'required',
                    'string',
                    'max:255',
                    Rule::unique('teams')->ignore($team->id),
                ],
                'display_name' => 'required|string|max:255',
                'description' => 'nullable|string',
            ]);

            $team->update($data);

            return redirect()->route('security.teams.index')->with('success', 'Team updated successfully.');
        } catch (\Exception $e) {
            \Log::error('Error in TeamController::update(): ' . $e->getMessage());
            return redirect()->back()->with('error', 'Failed to update team. Please try again.');
        }
    }

    /**
     * Remove the specified team from storage.
     *
     * @param Team $team
     * @return RedirectResponse
     */
    public function destroy(Team $team): RedirectResponse
    {
        try {
            // Delete all user-team associations
            $team->userTeams()->delete();

            // Delete all role assignments for this team
            $team->roleAssignments()->delete();

            // Delete the team
            $team->delete();

            return redirect()->route('security.teams.index')->with('success', 'Team deleted successfully.');
        } catch (\Exception $e) {
            \Log::error('Error in TeamController::destroy(): ' . $e->getMessage());
            return redirect()->back()->with('error', 'Failed to delete team. Please try again.');
        }
    }

    /**
     * Add a member to a team.
     *
     * @param Request $request
     * @param Team $team
     * @return RedirectResponse
     */
    public function addMember(Request $request, Team $team): RedirectResponse
    {
        try {
            $data = $request->validate([
                'user_id' => 'required|exists:users,_id',
            ]);

            $user = User::findOrFail($data['user_id']);
            $this->teamService->addMember($team, $user);

            return redirect()->route('security.teams.show', $team)->with('success', 'Member added to team successfully.');
        } catch (\Exception $e) {
            \Log::error('Error in TeamController::addMember(): ' . $e->getMessage());
            return redirect()->back()->with('error', 'Failed to add member to team. Please try again.');
        }
    }

    /**
     * Remove a member from a team.
     *
     * @param Request $request
     * @param Team $team
     * @return RedirectResponse
     */
    public function removeMember(Request $request, Team $team): RedirectResponse
    {
        try {
            $data = $request->validate([
                'user_id' => 'required|exists:users,_id',
            ]);

            $user = User::findOrFail($data['user_id']);
            $this->teamService->removeMember($team, $user);

            return redirect()->route('security.teams.show', $team)->with('success', 'Member removed from team successfully.');
        } catch (\Exception $e) {
            \Log::error('Error in TeamController::removeMember(): ' . $e->getMessage());
            return redirect()->back()->with('error', 'Failed to remove member from team. Please try again.');
        }
    }

    /**
     * Assign a role to a user within a team.
     *
     * @param Request $request
     * @param Team $team
     * @return RedirectResponse
     */
    public function assignRole(Request $request, Team $team): RedirectResponse
    {
        try {
            $data = $request->validate([
                'user_id' => 'required|exists:users,_id',
                'role_id' => 'required|exists:roles,_id',
            ]);

            $user = User::findOrFail($data['user_id']);
            $role = Role::findOrFail($data['role_id']);

            $this->teamService->assignRole($team, $user, $role);

            return redirect()->route('security.teams.show', $team)->with('success', 'Role assigned successfully.');
        } catch (\Exception $e) {
            \Log::error('Error in TeamController::assignRole(): ' . $e->getMessage());
            return redirect()->back()->with('error', 'Failed to assign role. Please try again.');
        }
    }

    /**
     * Revoke a role from a user within a team.
     *
     * @param Request $request
     * @param Team $team
     * @return RedirectResponse
     */
    public function revokeRole(Request $request, Team $team): RedirectResponse
    {
        try {
            $data = $request->validate([
                'user_id' => 'required|exists:users,_id',
                'role_id' => 'required|exists:roles,_id',
            ]);

            $user = User::findOrFail($data['user_id']);
            $role = Role::findOrFail($data['role_id']);

            $this->teamService->revokeRole($team, $user, $role);

            return redirect()->route('security.teams.show', $team)->with('success', 'Role revoked successfully.');
        } catch (\Exception $e) {
            \Log::error('Error in TeamController::revokeRole(): ' . $e->getMessage());
            return redirect()->back()->with('error', 'Failed to revoke role. Please try again.');
        }
    }
}
