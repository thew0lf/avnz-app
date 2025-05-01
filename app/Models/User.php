<?php
declare(strict_types=1);

namespace App\Models;

use Illuminate\Support\Str;
use Illuminate\Support\Collection;
use MongoDB\Laravel\Auth\User as Authenticatable;
use MongoDB\Laravel\Eloquent\SoftDeletes;
use MongoDB\Laravel\Relations\BelongsToMany;
use MongoDB\Laravel\Relations\HasMany;
use App\Models\AddressBook;

class User extends Authenticatable
{
    use SoftDeletes;

    protected string $collection = 'users';

    protected $fillable = [
        'name', 'email', 'password', 'key', 'username', 'display_name',
        'first_name', 'last_name', 'address_book_id', 'status',
        'email_verified_at', 'remember_token', 'created_at', 'updated_at', 'deleted_at',
        'project_id', 'client_id', 'company_id','role'
    ];

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

    public function permissions(): HasMany
    {
        return $this->hasMany(Permission::class);
    }
}
