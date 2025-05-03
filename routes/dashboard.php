<?php

use Illuminate\Support\Facades\Gate;
use Inertia\Inertia;
use Illuminate\Support\Facades\Route;

Route::middleware(['auth'])->group(function () {

    Route::get('dashboard', function () {
        return Inertia::render('dashboard');
    })->name('dashboard');

    Route::get('members-and-roles/roles',function(){
        Gate::authorize('members-and-roles.roles.list');
        return Inertia::render('members-and-roles/roles');
    })->name('members-and-roles.roles');

    Route::get('members-and-roles/permissions', function () {
        // This should correspond to the React component path without the extension
        return Inertia::render('permissions/permissions');
    })->name('permissions.index');
});
