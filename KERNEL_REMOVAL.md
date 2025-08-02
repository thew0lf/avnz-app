# Kernel.php Removal for Laravel 12 Compatibility

## Overview
This document explains the removal of the `app/Http/Kernel.php` file as part of the Laravel 12 upgrade process.

## Background
In previous versions of Laravel (up to Laravel 11), the `app/Http/Kernel.php` file was used to:
1. Define global middleware
2. Configure middleware groups
3. Register route middleware aliases

In Laravel 12, this approach has been replaced with a more streamlined configuration in the `bootstrap/app.php` file.

## Changes Made

### 1. Removed `app/Http/Kernel.php`
The `app/Http/Kernel.php` file has been removed as it's no longer needed in Laravel 12.

### 2. Migrated Middleware Aliases to `bootstrap/app.php`
The middleware aliases that were previously defined in `Kernel.php` have been migrated to `bootstrap/app.php`:

Before (in `app/Http/Kernel.php`):
```php
protected $routeMiddleware = [
    'permission' => \App\Http\Middleware\PermissionMiddleware::class,
    'scoped-permission' => \App\Http\Middleware\CheckScopedPermission::class,
];
```

After (in `bootstrap/app.php`):
```php
$middleware->alias([
    'permission' => PermissionMiddleware::class,
    'scoped-permission' => CheckScopedPermission::class,
]);
```

### 3. Added Necessary Imports
Added the required imports to `bootstrap/app.php`:
```php
use App\Http\Middleware\CheckScopedPermission;
use App\Http\Middleware\PermissionMiddleware;
```

## Rationale
Laravel 12 introduces a new application structure that eliminates the need for the `Kernel.php` file. Instead, middleware configuration is handled directly in the `bootstrap/app.php` file using the `withMiddleware` method.

This change aligns with Laravel 12's goal of simplifying the application structure and making configuration more intuitive.

## Impact
This change has no functional impact on the application. All middleware aliases that were previously defined in `Kernel.php` are now available in `bootstrap/app.php`, ensuring that routes that use these aliases will continue to work as expected.
