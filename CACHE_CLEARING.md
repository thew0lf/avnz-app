# Laravel Cache Clearing Guide

## Overview

This document explains how to clear Laravel's cache, particularly when dealing with middleware-related issues like "Target class [scoped.permission] does not exist".

## When to Clear Cache

You should clear Laravel's cache in the following situations:

1. After making changes to middleware registrations in `app/Http/Kernel.php`
2. After creating or modifying middleware classes
3. When encountering "Target class [x] does not exist" errors
4. After updating route definitions
5. After changing configuration files
6. When experiencing unexpected behavior after code changes

## Why Cache Clearing is Necessary

Laravel caches various aspects of your application to improve performance:

- **Route Cache**: Laravel caches route definitions for faster routing
- **Config Cache**: Configuration files are cached to avoid parsing them on each request
- **View Cache**: Blade templates are compiled and cached
- **Bootstrap Cache**: Core application components are cached during bootstrapping

When you make changes to middleware, routes, or other core components, these caches may contain outdated information, leading to errors like "Target class [scoped.permission] does not exist" even when the class exists in your codebase.

## How to Clear Cache

We've provided a convenient script to clear all Laravel caches:

```bash
./clear_cache.sh
```

This script runs the following commands:

- `php artisan cache:clear`: Clears the application cache
- `php artisan config:clear`: Clears the configuration cache
- `php artisan route:clear`: Clears the route cache
- `php artisan view:clear`: Clears the compiled view files
- `php artisan optimize:clear`: Clears the bootstrap cache files
- `php artisan package:discover --ansi`: Rebuilds the package manifest

## Specific to Middleware Issues

For middleware-specific issues like "Target class [scoped.permission] does not exist", the most important commands are:

```bash
php artisan route:clear
php artisan optimize:clear
```

These commands clear the caches that store information about middleware registrations and class mappings.

## After Clearing Cache

After clearing the cache, your application will rebuild its caches as needed. The first request after clearing the cache might be slower than usual as Laravel rebuilds these caches.

If you're in a production environment, you might want to warm up the cache after clearing it:

```bash
php artisan route:cache
php artisan config:cache
php artisan view:cache
```

However, only do this if you're sure your application is working correctly after the cache clear.
