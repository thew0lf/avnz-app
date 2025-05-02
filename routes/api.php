<?php

use Illuminate\Support\Facades\Route;
use App\Http\Controllers\Api\ProjectController;
use App\Http\Controllers\Api\PermissionController;
use Illuminate\Support\Facades\Gate;


Route::prefix('api')
    ->middleware('api')
    ->group(function () {
        Route::get('project', [ProjectController::class, 'index'])
            ->name('project.index');
        Route::apiResource('permissions', PermissionController::class);
});
