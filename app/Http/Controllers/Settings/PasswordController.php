<?php

namespace App\Http\Controllers\Settings;

use App\Http\Controllers\Controller;
use Illuminate\Contracts\Auth\MustVerifyEmail;
use Illuminate\Http\RedirectResponse;
use Illuminate\Http\Request;
use Illuminate\Support\Facades\Hash;
use Illuminate\Validation\Rules\Password;
use Inertia\Inertia;
use Inertia\Response;

class PasswordController extends Controller
{
    /**
     * Show the user's password settings page.
     */
    public function edit(Request $request): Response
    {
        try {
            return Inertia::render('settings/password', [
                'mustVerifyEmail' => $request->user() instanceof MustVerifyEmail,
                'status' => $request->session()->get('status'),
            ]);
        } catch (\Exception $e) {
            \Log::error('Error in PasswordController::edit(): ' . $e->getMessage());
            return Inertia::render('Error', [
                'message' => 'An error occurred while loading the password settings page.'
            ]);
        }
    }

    /**
     * Update the user's password.
     */
    public function update(Request $request): RedirectResponse
    {
        try {
            $validated = $request->validate([
                'current_password' => ['required', 'current_password'],
                'password' => ['required', Password::defaults(), 'confirmed'],
            ]);

            $request->user()->update([
                'password' => Hash::make($validated['password']),
            ]);

            return back()->with('status', 'Password updated successfully.');
        } catch (\Exception $e) {
            \Log::error('Error in PasswordController::update(): ' . $e->getMessage());
            return back()->withErrors(['error' => 'Failed to update password. Please try again.']);
        }
    }
}
