<?php
declare(strict_types=1);

namespace App\Models;

use MongoDB\Laravel\Eloquent\Model;
use MongoDB\Laravel\Eloquent\SoftDeletes;

class AddressBook extends Model
{
    use SoftDeletes;

    protected $collection = 'address_books';

    protected $fillable = [
        'address', 'address2', 'city', 'state_province', 'postal_code'
    ];

    protected static function boot()
    {
        parent::boot();
        static::creating(function ($model) {
            if ($model->address) { $model->address = strtolower($model->address); }
            if ($model->address2) { $model->address2 = strtolower($model->address2); }
            if ($model->city) { $model->city = strtolower($model->city); }
            if ($model->state_province) { $model->state_province = strtolower($model->state_province); }
            if ($model->postal_code) { $model->postal_code = strtolower($model->postal_code); }
        });
        static::updating(function ($model) {
            if ($model->address) { $model->address = strtolower($model->address); }
            if ($model->address2) { $model->address2 = strtolower($model->address2); }
            if ($model->city) { $model->city = strtolower($model->city); }
            if ($model->state_province) { $model->state_province = strtolower($model->state_province); }
            if ($model->postal_code) { $model->postal_code = strtolower($model->postal_code); }
        });
    }
}
