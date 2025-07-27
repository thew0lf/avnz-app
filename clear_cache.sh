#!/bin/bash

# Clear Laravel caches
php artisan cache:clear
php artisan config:clear
php artisan route:clear
php artisan view:clear
php artisan optimize:clear

# Rebuild package manifest
php artisan package:discover --ansi

echo "All Laravel caches have been cleared successfully!"
