<?php
namespace Database\Seeders;

use Illuminate\Database\Seeder;
use App\Models\User;
use App\Models\Role;
use Illuminate\Support\Facades\Hash;

class UserSeeder extends Seeder
{
    public function run()
    {
        $adminRole = Role::where('name', 'administrator')->first();
        User::updateOrCreate(
            ['email' => 'admin@example.com'],
            [
                'username' => 'administrator',
                'password' => Hash::make('password'),
                'roles' => [$adminRole->_id],
            ]
        );
    }
}
