<?php

namespace App\Http\Controllers\Auth;

use App\Http\Controllers\Controller;
use App\Models\User;
use App\Services\ProjectService;
use App\Services\RegistrationService;
use Exception;
use Illuminate\Auth\Events\Registered;
use Illuminate\Http\RedirectResponse;
use Illuminate\Http\Request;
use Illuminate\Support\Facades\Auth;
use Illuminate\Validation\Rules;
use Inertia\Inertia;
use Inertia\Response;

class RegisteredUserController extends Controller
{
    public function __construct(
        protected RegistrationService $registrationService,
        protected ProjectService $projectService
    ) {
    }

    /**
     * Display the registration form.
     *
     * @return Response
     */
    public function create(): Response
    {
        return Inertia::render('auth/register');
    }

    /**
     * Handle an incoming registration request.
     *
     * @param Request $request
     *
     * @return RedirectResponse
     *
     * @throws \Illuminate\Validation\ValidationException
     */
    public function store(Request $request): RedirectResponse
    {
        $projectName = config('app.name');

        $validated = $request->validate([
            'name' => ['required', 'string', 'max:255', 'min:2'],
            'email' => [
                'required',
                'string',
                'lowercase',
                'email',
                'max:255',
                'unique:' . User::class,
            ],
            'password' => [
                'required',
                'confirmed',
                Rules\Password::defaults(),
            ],
        ]);

        $project = $this->projectService->findByName($projectName)
            ?? $this->projectService->create(['name' => $projectName]);

        try {
            $user = $this->registrationService
                            ->registerUser($validated, $project);

            if ($user) {
                event(new Registered($user));
                $request->session()->regenerate();

                $request->session()->put('client',
                    $this->registrationService->getClient());;
                $request->session()->put('project',
                    $this->registrationService->getProject());
                $request->session()->put('company',
                    $this->registrationService->getCompany());
                Auth::login($user);

                return redirect(route('dashboard'));
            }
        } catch (Exception $e) {
            \Log::error('User registration failed: ' . $e->getMessage());
        }
        return back()->withErrors([
            'error' => 'Registration failed. Please try again.',
        ]);
    }
}
