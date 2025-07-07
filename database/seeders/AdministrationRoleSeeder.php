<?php

namespace Database\Seeders;

use App\Models\Permission;
use App\Models\Role;
use App\Models\RoleAssignment;
use App\Models\User;
use Illuminate\Database\Seeder;
use Illuminate\Support\Facades\Log;

class AdministrationRoleSeeder extends Seeder
{
    /**
     * Run the database seeds.
     *
     * @return void
     */
    public function run()
    {
        Log::info('Starting Administration Role Seeder');

        // Create or get the administrator role
        $adminRole = $this->createAdministratorRole();

        // Assign the administrator role to superusers
        $this->assignRoleToSuperusers($adminRole);

        Log::info('Completed Administration Role Seeder');
    }

    /**
     * Create or get the administrator role
     *
     * @return Role
     */
    private function createAdministratorRole(): Role
    {
        $adminRole = Role::firstOrCreate(
            ['name' => 'administrator'],
            [
                'display_name' => 'Administrator',
                'description' => 'Global administrator with full access to all resources',
                'permissions' => [], // Will be populated below
            ]
        );

        // Get all permissions
        $allPermissions = Permission::all()->pluck('_id')->toArray();

        // Update the role with all permissions
        $adminRole->update(['permissions' => $allPermissions]);

        Log::info('Administrator role created or updated', [
            'role_id' => $adminRole->id,
            'permissions_count' => count($allPermissions),
        ]);

        return $adminRole;
    }

    /**
     * Assign the administrator role to superusers
     *
     * @param Role $adminRole
     * @return void
     */
    private function assignRoleToSuperusers(Role $adminRole): void
    {
        // Define criteria for superusers (e.g., specific email domains or existing flags)
        // This is just an example, adjust according to your actual criteria
        $superusers = User::where('email', 'like', '%@admin.com')
            ->orWhere('is_superuser', true)
            ->get();

        $count = 0;
        foreach ($superusers as $user) {
            // Create a global role assignment (no specific scope)
            RoleAssignment::firstOrCreate(
                [
                    'user_id' => $user->id,
                    'role_id' => $adminRole->id,
                    'scope_type' => 'global',
                    'scope_id' => null,
                ]
            );
            $count++;
        }

        Log::info('Administrator role assigned to superusers', [
            'superusers_count' => $count,
        ]);
    }
}
