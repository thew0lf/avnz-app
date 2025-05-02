<?php

namespace App\Providers;


use App\Repositories\ACLRepository;
use App\Services\RoleService;
use App\Models\{User,Project,Client,Company};
use App\Services\ProjectService;
use App\Services\UserService;
use Illuminate\Support\ServiceProvider;
use App\Repositories\ProjectRepository;
use App\Repositories\UserRepository;

class AppServiceProvider extends ServiceProvider
{
    /**
     * Register any application services.
     */
    public function register(): void
    {
        $this->app->bind(UserRepository::class, function ($app) {
            return new UserRepository(User::class);
        });

        $this->app->bind(UserService::class, function ($app) {
            return new UserService($app->make(UserRepository::class));
        });

        $this->app->bind(ClientRepository::class, function ($app) {
            return new ClientRepository(Client::class);
        });

        $this->app->bind(ClientService::class, function ($app) {
            return new ClientService($app->make(ClientRepository::class));
        });

        $this->app->bind(CompanyRepository::class, function ($app) {
            return new CompanyRepository(Company::class);
        });

        $this->app->bind(CompanyService::class, function ($app) {
            return new CompanyService($app->make(CompanyRepository::class));
        });

        $this->app->bind(ProjectRepository::class, function ($app) {
            return new ProjectRepository(Project::class);
        });

        $this->app->bind(ProjectService::class, function ($app) {
            return new ProjectService($app->make(ProjectRepository::class));
        });

        $this->app->bind(ACLRepository::class, function ($app) {
            return new ACLRepository(ACL::class);
        });


        $this->app->singleton(\App\Services\RoleService::class);
    }

    /**
     * Bootstrap any application services.
     */
    public function boot(): void
    {
        //
    }
}
