<?php

namespace App\Providers;

use App\Services\RoleService;
use Illuminate\Support\ServiceProvider;
use Illuminate\Support\Facades\Gate;
use App\Models\User;

class AuthServiceProvider extends ServiceProvider
{
    protected RoleService $roleService;

    public function __construct($app)
    {
        parent::__construct($app);
        $this->roleService = app(RoleService::class);

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

            return $this->roleService->has($user,'administrator','project',$project->_id)
                || $this->roleService->has( $user, 'dashboard','client', $client->_id);
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

            return $this->roleService->has($user,'administrator','project',$project->_id)
                || $this->roleService->has($user,'members-and-roles.roles','project',$project->_id);
        });
    }
}
