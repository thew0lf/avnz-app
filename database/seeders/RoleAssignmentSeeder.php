<?php

namespace Database\Seeders;

use App\Models\User;
use Illuminate\Database\Seeder;
use App\Models\RoleAssignment;
use MongoDB\BSON\ObjectId;

class RoleAssignmentSeeder extends Seeder
{
    public function run()
    {
        $admin = User::where('username', 'administrator')->first();
        // Example role assignments with some placeholders for ObjectId values
        RoleAssignment::create([
            'user_id' => new ObjectId($admin->_id),
            'role_id' => new ObjectId('ROLE_OBJECT_ID_1'),
            'scope_type' => 'company',
            'scope_id' => new ObjectId('COMPANY_OBJECT_ID_1'),
        ]);

        RoleAssignment::create([
            'user_id' => new ObjectId($admin->_id),
            'role_id' => new ObjectId('ROLE_OBJECT_ID_2'),
            'scope_type' => 'client',
            'scope_id' => new ObjectId('CLIENT_OBJECT_ID_1'),
        ]);

        RoleAssignment::create([
            'user_id' => new ObjectId($admin->_id),
            'role_id' => new ObjectId('ROLE_OBJECT_ID_3'),
            'scope_type' => 'project',
            'scope_id' => new ObjectId('PROJECT_OBJECT_ID_1'),
        ]);
    }
}
