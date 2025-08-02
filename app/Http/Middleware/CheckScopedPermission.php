<?php

namespace App\Http\Middleware;

use Closure;
use Illuminate\Http\Request;
use Illuminate\Support\Facades\Auth;
use Illuminate\Support\Facades\Config;
use Symfony\Component\HttpFoundation\Response;

class CheckScopedPermission
{
    /**
     * Handle an incoming request.
     *
     * @param Request $request
     * @param Closure $next
     * @param  string  $permission
     * @param  string  $scopeType
     * @return Response
     */
    public function handle(Request $request, Closure $next, string $permission, string $scopeType): Response
    {
        $user = Auth::user();

        if (!$user) {
            return response()->json(['error' => 'Unauthorized'], 401);
        }

        // Check if user has global admin permission
        if ($user->hasGlobalPermission(Config::get('auth.permissions.global_roles.administrator', 'administrator'))) {
            return $next($request);
        }

        // Get the scope ID from the route parameters or request input
        // Using a more efficient approach with array mapping instead of switch statement
        $scopeId = $this->getScopeId($request, $scopeType);

        if (!$scopeId) {
            return response()->json(['error' => 'Missing scope ID'], 400);
        }

        // Check if user has the required permission in the given scope
        if (!$user->hasPermissionInScope($permission, $scopeType, $scopeId)) {
            return response()->json(['error' => 'Forbidden'], 403);
        }

        return $next($request);
    }

    /**
     * Get the scope ID based on the scope type
     *
     * @param Request $request
     * @param string $scopeType
     * @return mixed
     */
    private function getScopeId(Request $request, string $scopeType): mixed
    {
        // Get scope map from config
        $scopeMap = Config::get('auth.permissions.scope_map', []);

        // Check if the scope type exists in our map
        if (!isset($scopeMap[$scopeType])) {
            return null;
        }

        $routeParam = $scopeMap[$scopeType]['route'];
        $inputField = $scopeMap[$scopeType]['input'];

        // Try to get the ID from route parameter first, then from input
        $routeObject = $request->route($routeParam);
        return $routeObject?->id ?? $request->input($inputField);
    }
}
