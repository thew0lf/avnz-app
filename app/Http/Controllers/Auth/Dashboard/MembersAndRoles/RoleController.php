<?php

namespace App\Http\Controllers\Auth\Dashboard\MembersAndRoles;

use App\Http\Controllers\Auth\AuthenticatedController;
use Inertia\Inertia;
use Inertia\Response;

class RoleController extends AuthenticatedController
{
    /**
     * Display a listing of roles.
     *
     * @return \Inertia\Response
     */
    public function index(): Response
    {
        // For demonstration, using static roles.
        // Replace this with your actual ACL roles retrieval logic.
        $roles = [
            ['id' => 1, 'name' => 'Admin'],
        ];

        return Inertia::render('MembersAndRoles/Roles', [
            'roles' => $roles,
        ]);
    }
}
