<?php

namespace Database\Seeders;

use Illuminate\Database\Seeder;
use App\Models\User;
use App\Models\UserPermission;

class UserPermissionsSeeder extends Seeder
{
    public function run(): void
    {
        // Get admin user by email (or ID)
        $admin = User::where('email', 'admin@example.com')->first();

        if (!$admin) {
            $this->command->error('Admin user not found.');
            return;
        }

        // Set default permissions
        $permissions = [
            'view-dashboard',
            'manage-users',
            'edit-content',
            'delete-projects',
            'access-admin-panel',
        ];

        UserPermission::updateOrCreate(
            ['user_id' => (string) $admin->id],
            ['permissions' => $permissions]
        );

        $this->command->info('Admin permissions seeded.');
    }
}
