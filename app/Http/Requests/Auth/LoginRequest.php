<?php

namespace App\Http\Requests\Auth;

use App\Models\Client;
use App\Models\User;
use App\Services\CompanyService;
use App\Services\ProjectService;
use Illuminate\Auth\Events\Lockout;
use Illuminate\Foundation\Http\FormRequest;
use Illuminate\Support\Facades\Auth;
use Illuminate\Support\Facades\Hash;
use Illuminate\Support\Facades\RateLimiter;
use Illuminate\Support\Str;
use Illuminate\Validation\ValidationException;

class LoginRequest extends FormRequest
{
    /**
     * Create a new LoginRequest instance.
     *
     * @param  \App\Services\ProjectService  $projectService
     * @return void
     */
    protected ProjectService $projectService;
    protected CompanyService $companyService;
    public function __construct(ProjectService $projectService, CompanyService $companyService)
    {
        parent::__construct();
        $this->projectService = $projectService;
        $this->companyService = $companyService;
    }

    /**
     * Determine if the user is authorized to make this request.
     */
    public function authorize(): bool
    {
        return true;
    }

    /**
     * Get the validation rules that apply to the request.
     *
     * @return array<string, mixed>
     */
    public function rules(): array
    {
        return [
            'email'       => ['required', 'string', 'email'],
            'password'    => ['required', 'string'],
            'client_code' => ['required', 'string', 'exists:clients,short_code'],
        ];
    }

    /**
     * Attempt to authenticate the request's credentials using the User model.
     *
     * @throws \Illuminate\Validation\ValidationException
     */
    public function authenticate(): void
    {
        // Ensure the request is not rate limited.
        $this->ensureIsNotRateLimited();
        $throttleKey = $this->throttleKey();


        // Retrieve the client using the provided client code.
        $client = Client::where('short_code', $this->input('client_code'))->first();
        if (!$client) {
            RateLimiter::hit($throttleKey);
            throw ValidationException::withMessages([
                'client_code' => __('Invalid client code.'),
            ]);
        }

        $project = $this->projectService->findByName(config('app.name'));
        // Retrieve the user by email.
        $user = User::where('email', $this->input('email'))
            ->whereIn('client_ids', [$client->_id])
            ->whereIn('project_ids', [$project->_id])
            ->first();
        if (!$user || !Hash::check($this->input('password'), $user->password)) {
            RateLimiter::hit($throttleKey);
            throw ValidationException::withMessages([
                'email' => __('auth.failed'),
            ]);
        }

        // Log in the user.
        Auth::login($user, $this->boolean('remember'));
        Auth::getSession()->put('client', $client);
        Auth::getSession()->put('project', $project);
        Auth::getSession()->put('company', $this->companyService->getModel()->find($user->company_id)->first());
        RateLimiter::clear($throttleKey);
    }

    /**
     * Ensure the login request is not rate limited.
     *
     * @throws \Illuminate\Validation\ValidationException
     */
    public function ensureIsNotRateLimited(): void
    {
        $throttleKey = $this->throttleKey();

        if (!RateLimiter::tooManyAttempts($throttleKey, 5)) {
            return;
        }

        event(new Lockout($this));

        $seconds = RateLimiter::availableIn($throttleKey);

        throw ValidationException::withMessages([
            'email' => __('auth.throttle', [
                'seconds' => $seconds,
                'minutes' => ceil($seconds / 60),
            ]),
        ]);
    }

    /**
     * Get the rate limiting throttle key for the request.
     */
    public function throttleKey(): string
    {
        return Str::transliterate(Str::lower($this->input('email')) . '|' . $this->ip());
    }
}
