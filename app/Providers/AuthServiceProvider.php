<?php

namespace App\Providers;

use Illuminate\Support\ServiceProvider;
use Illuminate\Support\Facades\Gate;
use App\Models\User;
use App\Services\PermissionService;

class AuthServiceProvider extends ServiceProvider
{
    protected PermissionService $permissionService;

    public function __construct($app)
    {
        parent::__construct($app);
        $this->permissionService = app(PermissionService::class);
    }

    public function register()
    {
        //
    }

    public function boot()
    {

        Gate::define('dashboard', function (User $user) {

            $client     = session('client');
            $project    = session('project');
            $company    = session('company');

            return $this->permissionService->hasPermission($project, $client, $company, $user, 'administrator')
                || $this->permissionService->hasPermission($project, $client, $company, $user, 'dashboard');
        });
//        Gate::define('permissions', function (User $user) {
//
//            $client     = session('client');
//            $project    = session('project');
//            $company    = session('company');
//
//            return $this->permissionService->hasPermission($project, $client, $company, $user, 'administrator')
//                || $this->permissionService->hasPermission($project, $client, $company, $user, 'permissions');
//        });

        Gate::define('members-and-roles.roles.list', function (User $user ) {

            $client     = session('client');
            $project    = session('project');
            $company    = session('company');

            return $this->permissionService->hasPermission($project, $client, $company, $user, 'administrator')
                || $this->permissionService->hasPermission($project, $client,  $company, $user, 'members-and-roles.roles.list');
        });
    }
}
