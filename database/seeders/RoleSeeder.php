<?php
namespace Database\Seeders;

use Illuminate\Database\Seeder;
use App\Models\Role;
use App\Models\Permission;

class RoleSeeder extends Seeder
{
    public function run()
    {
        $allPermissions = Permission::pluck('_id')->toArray();
        Role::updateOrCreate(
            ['name' => 'administrator'],
            [
                'description' => 'Administrator with full access',
                'permissions' => $allPermissions,
            ]
        );
    }
}
