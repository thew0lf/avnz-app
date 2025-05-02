<?php
declare(strict_types=1);

namespace App\Models;

use Illuminate\Support\Str;
use MongoDB\Laravel\Auth\User as Authenticatable;
use MongoDB\Laravel\Eloquent\SoftDeletes;
use MongoDB\Laravel\Relations\BelongsToMany;

class User extends Authenticatable
{
    use SoftDeletes;

    protected string $collection = 'users';

    protected $fillable = [
        'name', 'email', 'password', 'key', 'username', 'display_name',
        'first_name', 'last_name', 'address_book_id', 'status',
        'email_verified_at', 'remember_token', 'created_at', 'updated_at', 'deleted_at',

        'project_id',
        'client_id',
        'company_id',
        'roles'
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
    public function addressBook()
    {
        return $this->belongsTo(AddressBook::class);
    }

    public function project(): BelongsToMany
    {
        return $this->belongsToMany(Project::class);
    }

    public function client(): BelongsToMany
    {
        return $this->belongsToMany(Client::class);
    }

    public function company(): BelongsToMany
    {
        return $this->belongsToMany(Company::class);
    }

    /**
     * Global roles
     */
    public function roles()
    {
        return $this->belongsToMany(Role::class, null, 'roles', '_id');
    }

    /**
     * Scoped role assignments
     */
    public function roleAssignments()
    {
        return $this->hasMany(RoleAssignment::class, 'user_id', '_id');
    }

    /**
     * Assign a role to a specific scope
     */
    public function assignRoleScope(Role $role, string $scopeType, $scopeId)
    {
        return RoleAssignment::create([
            'user_id'    => $this->id,
            'role_id'    => $role->id,
            'scope_type' => $scopeType,
            'scope_id'   => $scopeId,
        ]);
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
        return $this->roles
        ->flatMap(fn($role) => $role->permissions)
            ->pluck('name')
        ->contains($permissionName);
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
        return $this->scopedRoles($scopeType, $scopeId)
            ->flatMap(fn($role) => $role->permissions)
            ->pluck('name')
        ->contains($permissionName);
    }

}
