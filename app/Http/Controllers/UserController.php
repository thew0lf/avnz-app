<?php

namespace App\Http\Controllers;

use App\Models\User;
use Illuminate\Http\Request;
use Illuminate\Validation\Rule;
use Inertia\Inertia;
use Inertia\Response;
use Illuminate\Http\RedirectResponse;

class UserController extends Controller
{
    /**
     * Display a listing of the users.
     *
     * @return Response
     */
    public function index(): Response
    {
        $users = User::all();

        return Inertia::render('security/users/index', [
            'users' => $users,
        ]);
    }

    /**
     * Store a newly created user in storage.
     *
     * @param Request $request
     * @return RedirectResponse
     */
    public function store(Request $request): RedirectResponse
    {
        try {
            $data = $request->validate([
                'name' => 'required|string|max:255',
                'email' => 'required|string|email|max:255|unique:users',
                'password' => 'required|string|min:8',
            ]);

            $user = User::create($data);

            return redirect()->route('security.users.index')->with('success', 'User created successfully.');
        } catch (\Exception $e) {
            \Log::error('Error in UserController::store(): ' . $e->getMessage());
            return redirect()->back()->with('error', 'Failed to create user. Please try again.');
        }
    }

    /**
     * Update the specified user in storage.
     *
     * @param Request $request
     * @param User $user
     * @return RedirectResponse
     */
    public function update(Request $request, User $user): RedirectResponse
    {
        try {
            $data = $request->validate([
                'name' => 'required|string|max:255',
                'email' => [
                    'required',
                    'string',
                    'email',
                    'max:255',
                    Rule::unique('users')->ignore($user->id),
                ],
                'password' => 'nullable|string|min:8',
            ]);

            // Only update password if it's provided
            if (empty($data['password'])) {
                unset($data['password']);
            }

            $user->update($data);

            return redirect()->route('security.users.index')->with('success', 'User updated successfully.');
        } catch (\Exception $e) {
            \Log::error('Error in UserController::update(): ' . $e->getMessage());
            return redirect()->back()->with('error', 'Failed to update user. Please try again.');
        }
    }

    /**
     * Remove the specified user from storage.
     *
     * @param User $user
     * @return RedirectResponse
     */
    public function destroy(User $user): RedirectResponse
    {
        try {
            // Delete all user associations
            $user->userProjects()->delete();
            $user->userClients()->delete();
            $user->userCompanies()->delete();
            $user->userTeams()->delete();

            // Delete all role assignments for this user
            $user->roleAssignments()->delete();

            // Delete the user
            $user->delete();

            return redirect()->route('security.users.index')->with('success', 'User deleted successfully.');
        } catch (\Exception $e) {
            \Log::error('Error in UserController::destroy(): ' . $e->getMessage());
            return redirect()->back()->with('error', 'Failed to delete user. Please try again.');
        }
    }
}
