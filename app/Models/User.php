<?php
declare(strict_types=1);

namespace App\Models;

use Illuminate\Support\Str;
use MongoDB\Laravel\Auth\User as Authenticatable;
use MongoDB\Laravel\Eloquent\SoftDeletes;
use MongoDB\Laravel\Relations\BelongsToMany;
use MongoDB\Laravel\Relations\BelongsTo;
use MongoDB\Laravel\Relations\HasMany;
use Illuminate\Notifications\Notifiable;

class User extends Authenticatable
{
    use SoftDeletes, Notifiable;

    protected string $collection = 'users';

    protected $fillable = [
        'name', 'email', 'password', 'key', 'username', 'display_name',
        'first_name', 'last_name', 'address_book_id', 'status',
        'email_verified_at', 'remember_token', 'created_at', 'updated_at', 'deleted_at',
        'timezone',
    ];

    protected $attributes = [
        'timezone' => 'Europe/London',
    ];
    protected $hidden = ['password'];

    protected static function boot(): void
    {
        parent::boot();

        static::creating(function (User $model): void {
            if (empty($model->key)) {
                $model->key = (string) Str::uuid();
            }
        });

        static::saving(function (User $model): void {
            $model->transformAttributesToLowercase();
        });
    }

    /**
     * Transforms specific attributes to lowercase.
     *
     * @return void
     */
    protected function transformAttributesToLowercase(): void
    {
        $attributes = ['first_name', 'last_name', 'name', 'email'];

        foreach ($attributes as $attribute) {
            if (!empty($this->{$attribute})) {
                $this->{$attribute} = trim(strtolower($this->{$attribute}));
            }
        }
    }

    public function addressBook(): BelongsTo
    {
        return $this->belongsTo(AddressBook::class);
    }

    /**
     * The projects that the user belongs to.
     */
    public function projects(): BelongsToMany
    {
        return $this->belongsToMany(Project::class);
    }

    /**
     * The user-project associations.
     */
    public function userProjects(): HasMany
    {
        return $this->hasMany(UserProject::class);
    }

    /**
     * The clients that the user belongs to.
     */
    public function clients(): BelongsToMany
    {
        return $this->belongsToMany(Client::class);
    }

    /**
     * The user-client associations.
     */
    public function userClients(): HasMany
    {
        return $this->hasMany(UserClient::class);
    }

    /**
     * The companies that the user belongs to.
     */
    public function companies(): BelongsToMany
    {
        return $this->belongsToMany(Company::class);
    }

    /**
     * The user-company associations.
     */
    public function userCompanies(): HasMany
    {
        return $this->hasMany(UserCompany::class);
    }

    /**
     * The teams that the user belongs to.
     */
    public function teams(): BelongsToMany
    {
        return $this->belongsToMany(Team::class);
    }

    /**
     * The user-team associations.
     */
    public function userTeams(): HasMany
    {
        return $this->hasMany(UserTeam::class);
    }

    /**
     * Scoped role assignments
     */
    public function roleAssignments(): HasMany
    {
        return $this->hasMany(RoleAssignment::class, 'user_id', '_id');
    }

    /**
     * Assign a role to a specific scope
     */
    public function assignRoleScope(Role $role, string $scopeType, $scopeId)
    {
        return RoleAssignment::createAssignment($this, $role, $scopeType, $scopeId);
    }

    /**
     * Get roles for a given scope
     */
    public function scopedRoles(string $scopeType, $scopeId)
    {
        return $this->roleAssignments()
            ->where('scope_type', $scopeType)
            ->where('scope_id', $scopeId)
            ->with('role.permissions')
            ->get()
            ->pluck('role');
    }

    /**
     * Check if a user has a permission globally
     */
    public function hasGlobalPermission(string $permissionName): bool
    {

        // Check if user has an admin role
        $isAdmin = $this->roleAssignments()
            ->whereHas('role', function ($query) {
                $query->where('name', 'administrator');
            })
            ->exists();
        if ($isAdmin) {
            return true;
        }

        foreach ($this->roleAssignments()->get() as $assignment) {
            if ($assignment->role->name === $permissionName ) {
                return true;
            }
        }
        return false;
    }

    /**
     * Check if a user has a permission within a given scope
     *
     * @param string $permissionName
     * @param string $scopeType
     * @param mixed $scopeId
     * @return bool
     */
    public function hasPermissionInScope(string $permissionName, string $scopeType, $scopeId): bool
    {

        // Check if user has global admin access
        if ($this->hasGlobalPermission('administrator')) {
            return true;
        }

        return $this->scopedRoles($scopeType, $scopeId)
            ->flatMap(fn($role) => $role->permissions)
            ->pluck('name')
            ->contains($permissionName);
    }

    /**
     * Check if user has access to a project
     */
    public function hasProjectAccess($projectId): bool
    {
        if ($this->hasGlobalPermission('administrator')) {
            return true;
        }

        return $this->projects()->where('_id', $projectId)->exists() ||
               $this->hasPermissionInScope('view', 'project', $projectId);
    }

    /**
     * Check if user has access to a client
     */
    public function hasClientAccess($clientId): bool
    {
        if ($this->hasGlobalPermission('administrator')) {
            return true;
        }

        return $this->clients()->where('_id', $clientId)->exists() ||
               $this->hasPermissionInScope('view', 'client', $clientId);
    }

    /**
     * Check if user has access to a company
     */
    public function hasCompanyAccess($companyId): bool
    {
        if ($this->hasGlobalPermission('administrator')) {
            return true;
        }

        return $this->companies()->where('_id', $companyId)->exists() ||
               $this->hasPermissionInScope('view', 'company', $companyId);
    }

    /**
     * Check if user has access to a team
     */
    public function hasTeamAccess($teamId): bool
    {
        if ($this->hasGlobalPermission('administrator')) {
            return true;
        }

        return $this->teams()->where('_id', $teamId)->exists() ||
               $this->hasPermissionInScope('view', 'team', $teamId);
    }

    /**
     * Check if a user has a specific permission
     *
     * This method is used by the PermissionMiddleware
     *
     * @param string $permission The permission name to check
     * @return bool Whether the user has the permission
     */
    public function hasPermissionTo(string $permission): bool
    {
        // Check if user has global admin access or the specific permission
        return $this->hasGlobalPermission('administrator') || $this->hasGlobalPermission($permission);
    }
}
