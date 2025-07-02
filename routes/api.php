<?php

use App\Http\Controllers\Api\ProjectController;
use Illuminate\Support\Facades\Route;

Route::prefix('api')
    ->middleware(['api','auth'])  // 'auth:sanctum', 'throttle:api' Added auth:sanctum and throttle for security
    ->group(function () {
        Route::get('project', [ProjectController::class, 'index'])
            ->name('project.index');
    });
