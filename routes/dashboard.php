<?php

use Illuminate\Support\Facades\Gate;
use Inertia\Inertia;
use Illuminate\Support\Facades\Route;
use App\Http\Controllers\Auth\Dashboard\TeamsAndRoles\RoleController;
use App\Http\Controllers\PermissionController;

Route::middleware(['auth'])->group(function () {

    Route::get('dashboard', function () {
        return Inertia::render('dashboard');
    })->name('dashboard');

    Route::get('security/roles', [RoleController::class, 'index'])
        ->name('security.roles.index')
        ->middleware('auth');


    Route::get('security/roles/show/{role}', [RoleController::class, 'show'])
        ->name('security.roles.show')
        ->middleware('auth');

    Route::get('security/roles/edit/{role}', [RoleController::class, 'edit'])
        ->name('security.roles.edit')
        ->middleware('auth');

    Route::prefix('security/permissions')->name('security.permissions.')->group(function () {
        Route::get('/', [PermissionController::class, 'index'])->name('index');
        Route::post('/', [PermissionController::class, 'store'])->name('store');
        Route::get('/{permission}', [PermissionController::class, 'show'])->name('show');
        Route::put('/{permission}', [PermissionController::class, 'update'])->name('update');
        Route::delete('/{permission}', [PermissionController::class, 'destroy'])->name('destroy');
    });

    // Teams routes
    Route::prefix('security/teams')->name('security.teams.')->group(function () {
        Route::get('/', [App\Http\Controllers\TeamController::class, 'index'])->name('index');
        Route::post('/', [App\Http\Controllers\TeamController::class, 'store'])
            ->middleware('scoped-permission:create,team')
            ->name('store');
        Route::get('/create', [App\Http\Controllers\TeamController::class, 'create'])
            ->middleware('scoped-permission:create,team')
            ->name('create');
        Route::get('/{team}', [App\Http\Controllers\TeamController::class, 'show'])
            ->middleware('scoped-permission:view,team')
            ->name('show');
        Route::get('/{team}/edit', [App\Http\Controllers\TeamController::class, 'edit'])
            ->middleware('scoped-permission:modify,team')
            ->name('edit');
        Route::put('/{team}', [App\Http\Controllers\TeamController::class, 'update'])
            ->middleware('scoped-permission:modify,team')
            ->name('update');
        Route::delete('/{team}', [App\Http\Controllers\TeamController::class, 'destroy'])
            ->middleware('scoped-permission:delete,team')
            ->name('destroy');

        // Team member management routes
        Route::post('/{team}/members', [App\Http\Controllers\TeamController::class, 'addMember'])
            ->middleware('scoped-permission:modify,team')
            ->name('members.add');
        Route::delete('/{team}/members', [App\Http\Controllers\TeamController::class, 'removeMember'])
            ->middleware('scoped-permission:modify,team')
            ->name('members.remove');

        // Team role assignment routes
        Route::post('/{team}/roles', [App\Http\Controllers\TeamController::class, 'assignRole'])
            ->middleware('scoped-permission:modify,team')
            ->name('roles.assign');
        Route::delete('/{team}/roles', [App\Http\Controllers\TeamController::class, 'revokeRole'])
            ->middleware('scoped-permission:modify,team')
            ->name('roles.revoke');
    });

    // Projects routes
    Route::prefix('security/projects')->name('security.projects.')->group(function () {
        Route::get('/', [App\Http\Controllers\ProjectController::class, 'index'])
            ->name('index');
        Route::post('/', [App\Http\Controllers\ProjectController::class, 'store'])
            ->middleware('scoped-permission:create,project')
            ->name('store');
        Route::put('/{project}', [App\Http\Controllers\ProjectController::class, 'update'])
            ->middleware('scoped-permission:modify,project')
            ->name('update');
        Route::delete('/{project}', [App\Http\Controllers\ProjectController::class, 'destroy'])
            ->middleware('scoped-permission:delete,project')
            ->name('destroy');

    });

    // Clients routes
    Route::prefix('security/clients')->name('security.clients.')->group(function () {
        Route::get('/', [App\Http\Controllers\ClientController::class, 'index'])->name('index');
        Route::post('/', [App\Http\Controllers\ClientController::class, 'store'])
            ->middleware('scoped-permission:create,client')
            ->name('store');
        Route::put('/{client}', [App\Http\Controllers\ClientController::class, 'update'])
            ->middleware('scoped-permission:modify,client')
            ->name('update');
        Route::delete('/{client}', [App\Http\Controllers\ClientController::class, 'destroy'])
            ->middleware('scoped-permission:delete,client')
            ->name('destroy');
    });

    // Companies routes
    Route::prefix('security/companies')->name('security.companies.')->group(function () {
        Route::get('/', [App\Http\Controllers\CompanyController::class, 'index'])->name('index');
        Route::post('/', [App\Http\Controllers\CompanyController::class, 'store'])
            ->middleware('scoped-permission:create,company')
            ->name('store');
        Route::put('/{company}', [App\Http\Controllers\CompanyController::class, 'update'])
            ->middleware('scoped-permission:modify,company')
            ->name('update');
        Route::delete('/{company}', [App\Http\Controllers\CompanyController::class, 'destroy'])
            ->middleware('scoped-permission:delete,company')
            ->name('destroy');
    });

    // Users routes
    Route::prefix('security/users')->name('security.users.')->group(function () {
        Route::get('/', [App\Http\Controllers\UserController::class, 'index'])->name('index');
        Route::post('/', [App\Http\Controllers\UserController::class, 'store'])
            ->middleware('scoped-permission:create,user')
            ->name('store');
        Route::put('/{user}', [App\Http\Controllers\UserController::class, 'update'])
            ->middleware('scoped-permission:modify,user')
            ->name('update');
        Route::delete('/{user}', [App\Http\Controllers\UserController::class, 'destroy'])
            ->middleware('scoped-permission:delete,user')
            ->name('destroy');
    });


});
