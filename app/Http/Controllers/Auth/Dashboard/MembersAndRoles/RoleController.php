<?php

namespace App\Http\Controllers\Auth\Dashboard\MembersAndRoles;

use App\Http\Controllers\Auth\AuthenticatedController;
use App\Http\Controllers\Controller;
use Inertia\Inertia;
use Inertia\Response;
use App\Models\{Role,Permission};

class RoleController extends Controller
{
    /**
     * Display a listing of roles.
     *
     * @return \Inertia\Response
     */
    public function index(): Response
    {
        $roles = Role::with('permissions')->get();

        return Inertia::render('roles/index', compact('roles'));
    }
}
