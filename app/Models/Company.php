<?php
declare(strict_types=1);

namespace App\Models;

use MongoDB\Laravel\Eloquent\Model;
use MongoDB\Laravel\Eloquent\SoftDeletes;
use MongoDB\Laravel\Relations\BelongsTo;
use MongoDB\Laravel\Relations\BelongsToMany;
use MongoDB\Laravel\Relations\HasMany;
use Illuminate\Support\Str;

class Company extends Model
{
    use SoftDeletes;

    protected $collection = 'companies';

    protected $fillable = [
        'name', 'address_book_id', 'key', 'client_id', 'status'
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
     * The client that this company belongs to.
     */
    public function client(): BelongsTo
    {
        return $this->belongsTo(Client::class);
    }

    /**
     * The teams that belong to this company.
     */
    public function teams(): HasMany
    {
        return $this->hasMany(Team::class);
    }

    /**
     * The users that belong to this company.
     */
    public function users(): BelongsToMany
    {
        return $this->belongsToMany(User::class);
    }

    /**
     * The company-user associations.
     */
    public function userCompanies(): HasMany
    {
        return $this->hasMany(UserCompany::class);
    }

    /**
     * The role assignments for this company.
     */
    public function roleAssignments(): HasMany
    {
        return $this->hasMany(RoleAssignment::class, 'scope_id', '_id')
            ->where('scope_type', 'company');
    }
}
