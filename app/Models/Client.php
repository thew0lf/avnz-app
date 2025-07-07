<?php
declare(strict_types=1);

namespace App\Models;

use MongoDB\Laravel\Eloquent\Model;
use MongoDB\Laravel\Eloquent\SoftDeletes;
use MongoDB\Laravel\Relations\BelongsTo;
use MongoDB\Laravel\Relations\BelongsToMany;
use MongoDB\Laravel\Relations\HasMany;
use Illuminate\Support\Str;

class Client extends Model
{
    use SoftDeletes;

    protected $collection = 'clients';

    protected $fillable = [
        'name', 'address_book_id', 'key', 'status', 'short_code'
    ];

    protected static function boot()
    {
        parent::boot();
        static::creating(function ($model) {
            if (empty($model->key)) {
                $model->key = (string) Str::uuid();
            }
        });
    }

    public function addressBook(): BelongsTo
    {
        return $this->belongsTo(AddressBook::class);
    }

    /**
     * The projects that this client belongs to.
     */
    public function projects(): BelongsToMany
    {
        return $this->belongsToMany(Project::class);
    }

    /**
     * The client-project associations.
     */
    public function projectClients(): HasMany
    {
        return $this->hasMany(ProjectClient::class);
    }

    /**
     * The companies that belong to this client.
     */
    public function companies(): HasMany
    {
        return $this->hasMany(Company::class);
    }

    /**
     * The users that belong to this client.
     */
    public function users(): BelongsToMany
    {
        return $this->belongsToMany(User::class);
    }

    /**
     * The client-user associations.
     */
    public function userClients(): HasMany
    {
        return $this->hasMany(UserClient::class);
    }

    /**
     * The role assignments for this client.
     */
    public function roleAssignments(): HasMany
    {
        return $this->hasMany(RoleAssignment::class, 'scope_id', '_id')
            ->where('scope_type', 'client');
    }
}
