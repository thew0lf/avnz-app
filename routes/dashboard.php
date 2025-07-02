<?php

use Illuminate\Support\Facades\Gate;
use Inertia\Inertia;
use Illuminate\Support\Facades\Route;
use App\Http\Controllers\Auth\Dashboard\MembersAndRoles\RoleController;
use App\Http\Controllers\PermissionController;

Route::middleware(['auth'])->group(function () {

    Route::get('dashboard', function () {
        return Inertia::render('dashboard');
    })->name('dashboard');

    Route::get('members-and-roles/roles', [RoleController::class, 'index'])
        ->name('members-and-roles.roles.index')
        ->middleware('auth');

    Route::get('members-and-roles/roles/create', [RoleController::class, 'create'])
        ->name('members-and-roles.roles.create')
        ->middleware('auth');

    Route::get('members-and-roles/roles/show/{role}', [RoleController::class, 'show'])
        ->name('members-and-roles.roles.show')
        ->middleware('auth');

    Route::get('members-and-roles/roles/edit/{role}', [RoleController::class, 'edit'])
        ->name('members-and-roles.roles.edit')
        ->middleware('auth');

    Route::prefix('members-and-roles/permissions')->name('members-and-roles.permissions.')->group(function () {
        Route::get('/', [PermissionController::class, 'index'])->name('index');
        Route::post('/', [PermissionController::class, 'store'])->name('store');
        Route::get('/{permission}', [PermissionController::class, 'show'])->name('show');
        Route::put('/{permission}', [PermissionController::class, 'update'])->name('update');
        Route::delete('/{permission}', [PermissionController::class, 'destroy'])->name('destroy');
    });


});
