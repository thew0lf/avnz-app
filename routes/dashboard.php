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
        Route::post('/', [App\Http\Controllers\TeamController::class, 'store'])->name('store');
        Route::get('/create', [App\Http\Controllers\TeamController::class, 'create'])->name('create');
        Route::get('/{team}', [App\Http\Controllers\TeamController::class, 'show'])->name('show');
        Route::get('/{team}/edit', [App\Http\Controllers\TeamController::class, 'edit'])->name('edit');
        Route::put('/{team}', [App\Http\Controllers\TeamController::class, 'update'])->name('update');
        Route::delete('/{team}', [App\Http\Controllers\TeamController::class, 'destroy'])->name('destroy');

        // Team member management routes
        Route::post('/{team}/members', [App\Http\Controllers\TeamController::class, 'addMember'])->name('members.add');
        Route::delete('/{team}/members', [App\Http\Controllers\TeamController::class, 'removeMember'])->name('members.remove');

        // Team role assignment routes
        Route::post('/{team}/roles', [App\Http\Controllers\TeamController::class, 'assignRole'])->name('roles.assign');
        Route::delete('/{team}/roles', [App\Http\Controllers\TeamController::class, 'revokeRole'])->name('roles.revoke');
    });

    // Projects routes
    Route::prefix('security/projects')->name('security.projects.')->group(function () {
        Route::get('/', [App\Http\Controllers\ProjectController::class, 'index'])->name('index');
        Route::post('/', [App\Http\Controllers\ProjectController::class, 'store'])->name('store');
        Route::put('/{project}', [App\Http\Controllers\ProjectController::class, 'update'])->name('update');
        Route::delete('/{project}', [App\Http\Controllers\ProjectController::class, 'destroy'])->name('destroy');
    });

    // Clients routes
    Route::prefix('security/clients')->name('security.clients.')->group(function () {
        Route::get('/', [App\Http\Controllers\ClientController::class, 'index'])->name('index');
        Route::post('/', [App\Http\Controllers\ClientController::class, 'store'])->name('store');
        Route::put('/{client}', [App\Http\Controllers\ClientController::class, 'update'])->name('update');
        Route::delete('/{client}', [App\Http\Controllers\ClientController::class, 'destroy'])->name('destroy');
    });

    // Companies routes
    Route::prefix('security/companies')->name('security.companies.')->group(function () {
        Route::get('/', [App\Http\Controllers\CompanyController::class, 'index'])->name('index');
        Route::post('/', [App\Http\Controllers\CompanyController::class, 'store'])->name('store');
        Route::put('/{company}', [App\Http\Controllers\CompanyController::class, 'update'])->name('update');
        Route::delete('/{company}', [App\Http\Controllers\CompanyController::class, 'destroy'])->name('destroy');
    });


});
