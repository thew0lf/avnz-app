<?php

use Illuminate\Support\Facades\Route;
use Inertia\Inertia;
use App\Http\Controllers\RoleController;
use App\Http\Controllers\PermissionController;

Route::get('/', function () {
    return Inertia::render('welcome');
})->name('home');

Route::middleware(['auth', 'verified'])
    ->prefix('teams-and-roles/roles')
    ->name('roles.')
    ->group(function () {
        Route::get('/', [RoleController::class, 'index'])->name('index');
        Route::get('/create', [RoleController::class, 'create'])->name('create');
        Route::post('/', [RoleController::class, 'store'])->name('store');
        Route::get('/{role}/edit', [RoleController::class, 'edit'])->name('edit');
        Route::put('/{role}', [RoleController::class, 'update'])->name('update');
        Route::delete('/{role}', [RoleController::class, 'destroy'])->name('destroy');
    });

use App\Http\Controllers\TeamController;

Route::middleware(['auth', 'verified'])
    ->prefix('teams')
    ->name('teams.')
    ->group(function () {
        Route::get('/', [TeamController::class, 'index'])->name('index');
        Route::get('/create', [TeamController::class, 'create'])->name('create');
        Route::post('/', [TeamController::class, 'store'])->name('store');
        Route::get('/{team}', [TeamController::class, 'show'])->name('show');
        Route::get('/{team}/edit', [TeamController::class, 'edit'])->name('edit');
        Route::put('/{team}', [TeamController::class, 'update'])->name('update');
        Route::delete('/{team}', [TeamController::class, 'destroy'])->name('destroy');

        // Team member management
        Route::post('/{team}/members', [TeamController::class, 'addUser'])->name('members.add');
        Route::delete('/{team}/members', [TeamController::class, 'removeUser'])->name('members.remove');

        // Team role management
        Route::post('/{team}/roles', [TeamController::class, 'assignRole'])->name('roles.assign');
        Route::delete('/{team}/roles', [TeamController::class, 'revokeRole'])->name('roles.revoke');
    });


require __DIR__.'/settings.php';
require __DIR__.'/auth.php';
require __DIR__.'/api.php';
require __DIR__.'/dashboard.php';
