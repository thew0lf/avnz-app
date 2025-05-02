<?php
namespace Database\Seeders;

use Illuminate\Database\Seeder;
use App\Models\Permission;

class PermissionSeeder extends Seeder
{
    public function run()
    {
        $actions = ['list', 'view', 'create', 'modify', 'delete'];
        foreach ($actions as $action) {
            Permission::firstOrCreate(
                ['name' => $action, 'guard_name' => 'web'],
                ['description' => ucfirst($action) . ' permission']
            );
        }
    }
}
