<?php

namespace App\Http\Middleware;

use Closure;
use Illuminate\Http\Request;
use Illuminate\Support\Facades\Auth;
use Symfony\Component\HttpFoundation\Response;

class CheckScopedPermission
{
    /**
     * Handle an incoming request.
     *
     * @param  \Illuminate\Http\Request  $request
     * @param  \Closure  $next
     * @param  string  $permission
     * @param  string  $scopeType
     * @return mixed
     */
    public function handle(Request $request, Closure $next, string $permission, string $scopeType): Response
    {
        $user = Auth::user();

        if (!$user) {
            return response()->json(['error' => 'Unauthorized'], 401);
        }

        // Check if user has global admin permission
        if ($user->hasGlobalPermission('administrator')) {
            return $next($request);
        }

        // Get the scope ID from the route parameters
        $scopeId = null;
        switch ($scopeType) {
            case 'project':
                $scopeId = $request->route('project')->id ?? $request->input('project_id');
                break;
            case 'client':
                $scopeId = $request->route('client')->id ?? $request->input('client_id');
                break;
            case 'company':
                $scopeId = $request->route('company')->id ?? $request->input('company_id');
                break;
            case 'team':
                $scopeId = $request->route('team')->id ?? $request->input('team_id');
                break;

        }

        if (!$scopeId) {
            return response()->json(['error' => 'Missing scope ID'], 400);
        }

        // Check if user has the required permission in the given scope
        #echo "Permission:" . $permission . " ST:" .  $scopeType . " Scope:" . $scopeId;
        if (!$user->hasPermissionInScope($permission, $scopeType, $scopeId)) {
            return response()->json(['error' => 'Forbidden'], 403);
        }

        return $next($request);
    }
}
