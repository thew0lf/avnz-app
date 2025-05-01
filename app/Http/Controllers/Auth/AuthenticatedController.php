<?php
namespace App\Http\Controllers\Auth;

use App\Http\Controllers\Controller;

abstract class AuthenticatedController extends Controller
{
    public function __construct()
    {
        $this->middleware('auth');
    }
}
