<?php

use Illuminate\Support\Facades\Gate;
use Inertia\Inertia;
use Illuminate\Support\Facades\Route;
use App\Http\Controllers\Auth\Dashboard\MembersAndRoles\RoleController;

Route::middleware(['auth'])->group(function () {

    Route::get('dashboard', function () {
        return Inertia::render('dashboard');
    })->name('dashboard');

    Route::get('members-and-roles/roles', [RoleController::class, 'index'])
    ->name('members-and-roles.roles.list')
    ->middleware('auth');

    Route::get('members-and-roles/permissions', function () {
        // This should correspond to the React component path without the extension
        return Inertia::render('permissions/permissions');
    })->name('permissions.index');


});
