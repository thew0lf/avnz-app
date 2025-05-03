<?php
namespace Database\Seeders;

use Illuminate\Database\Seeder;
use App\Models\ResourceAcl;
use App\Models\User;
use App\Models\Permission;
use MongoDB\BSON\ObjectId;

class ResourceAclSeeder extends Seeder
{
    public function run()
    {
        $admin = User::where('username', 'administrator')->first();
        $allPermissions = Permission::pluck('_id')->toArray();
        ResourceAcl::updateOrCreate(
            [
                'resourceType' => 'user',//documents, clients, projects, etc.
                'resourceId'   => new ObjectId($admin->_id),
            ],
            [
                'grants' => [
                    [
                        'userId'      => $admin->_id,
                        'permissions' => $allPermissions,
                    ],
                ],
            ]
        );
    }
}
