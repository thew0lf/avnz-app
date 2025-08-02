<?php

use Illuminate\Support\Facades\Gate;
use Inertia\Inertia;
use Illuminate\Support\Facades\Route;
use App\Http\Controllers\Auth\Dashboard\TeamsAndRoles\RoleController;
use App\Http\Controllers\PermissionController;
use App\Http\Controllers\TeamController;
use App\Http\Controllers\ProjectController;
use App\Http\Controllers\ClientController;
use App\Http\Controllers\CompanyController;
use App\Http\Controllers\UserController;

Route::middleware(['auth'])->group(function () {
    // Dashboard
    Route::get('dashboard', function () {
        return Inertia::render('dashboard');
    })->name('dashboard');

    // Security routes group
    Route::prefix('security')->name('security.')->group(function () {
        // Roles routes
        Route::prefix('roles')->name('roles.')->group(function () {
            Route::get('/', [RoleController::class, 'index'])->name('index');
            Route::get('/show/{role}', [RoleController::class, 'show'])->name('show');
            Route::get('/edit/{role}', [RoleController::class, 'edit'])->name('edit');
        });

        // Projects routes
        Route::prefix('projects')->name('projects.')->group(function () {
            Route::get('/', [ProjectController::class, 'index'])
                ->middleware('scoped-permission:view,project')
                ->name('index');

            Route::post('/', [ProjectController::class, 'store'])
                ->middleware('scoped-permission:create,project')
                ->name('store');

            Route::put('/{project}', [ProjectController::class, 'update'])
                ->middleware('scoped-permission:modify,project')
                ->name('update');

            Route::delete('/{project}', [ProjectController::class, 'destroy'])
                ->middleware('scoped-permission:delete,project')
                ->name('destroy');
        });

        // Clients routes
        Route::prefix('clients')->name('clients.')->group(function () {
            Route::get('/', [ClientController::class, 'index'])->name('index');

            Route::post('/', [ClientController::class, 'store'])
                ->middleware('scoped-permission:create,client')
                ->name('store');

            Route::put('/{client}', [ClientController::class, 'update'])
                ->middleware('scoped-permission:modify,client')
                ->name('update');

            Route::delete('/{client}', [ClientController::class, 'destroy'])
                ->middleware('scoped-permission:delete,client')
                ->name('destroy');
        });

        // Companies routes
        Route::prefix('companies')->name('companies.')->group(function () {
            Route::get('/', [CompanyController::class, 'index'])->name('index');

            Route::post('/', [CompanyController::class, 'store'])
                ->middleware('scoped-permission:create,company')
                ->name('store');

            Route::put('/{company}', [CompanyController::class, 'update'])
                ->middleware('scoped-permission:modify,company')
                ->name('update');

            Route::delete('/{company}', [CompanyController::class, 'destroy'])
                ->middleware('scoped-permission:delete,company')
                ->name('destroy');
        });

        // Users routes
        Route::prefix('users')->name('users.')->group(function () {
            Route::get('/', [UserController::class, 'index'])->name('index');

            Route::post('/', [UserController::class, 'store'])
                ->middleware('scoped-permission:create,user')
                ->name('store');

            Route::put('/{user}', [UserController::class, 'update'])
                ->middleware('scoped-permission:modify,user')
                ->name('update');

            Route::delete('/{user}', [UserController::class, 'destroy'])
                ->middleware('scoped-permission:delete,user')
                ->name('destroy');
        });

        // Teams routes
        Route::prefix('teams')->name('teams.')->group(function () {
            Route::get('/', [TeamController::class, 'index'])->name('index');

            Route::middleware('scoped-permission:create,team')->group(function () {
                Route::post('/', [TeamController::class, 'store'])->name('store');
                Route::get('/create', [TeamController::class, 'create'])->name('create');
            });

            Route::get('/{team}', [TeamController::class, 'show'])
                ->middleware('scoped-permission:view,team')
                ->name('show');

            Route::middleware('scoped-permission:modify,team')->group(function () {
                Route::get('/{team}/edit', [TeamController::class, 'edit'])->name('edit');
                Route::put('/{team}', [TeamController::class, 'update'])->name('update');

                // Team member management routes
                Route::post('/{team}/members', [TeamController::class, 'addMember'])->name('members.add');
                Route::delete('/{team}/members', [TeamController::class, 'removeMember'])->name('members.remove');

                // Team role assignment routes
                Route::post('/{team}/roles', [TeamController::class, 'assignRole'])->name('roles.assign');
                Route::delete('/{team}/roles', [TeamController::class, 'revokeRole'])->name('roles.revoke');
            });

            Route::delete('/{team}', [TeamController::class, 'destroy'])
                ->middleware('scoped-permission:delete,team')
                ->name('destroy');
        });

        // Permissions routes
        Route::prefix('permissions')->name('permissions.')->group(function () {
            Route::get('/', [PermissionController::class, 'index'])->name('index');
            Route::post('/', [PermissionController::class, 'store'])->name('store');
            Route::get('/{permission}', [PermissionController::class, 'show'])->name('show');
            Route::put('/{permission}', [PermissionController::class, 'update'])->name('update');
            Route::delete('/{permission}', [PermissionController::class, 'destroy'])->name('destroy');
        });


    });
});
