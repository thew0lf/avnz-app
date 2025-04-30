<?php
declare(strict_types=1);

namespace App\Models;

use MongoDB\Laravel\Eloquent\Model;
use MongoDB\Laravel\Eloquent\SoftDeletes;
use Carbon\Carbon;

class ShortCode extends Model
{
    use SoftDeletes;

    protected $connection = 'mongodb';
    protected $collection = 'short_codes';

    protected $fillable = [
        'code',
        'address_id',
        'created_at',
        'updated_at'
    ];

    protected $casts = [
        'created_at' => 'datetime',
        'updated_at' => 'datetime',
        'deleted_at' => 'datetime'
    ];

    /**
     * Create a new ShortCode instance.
     *
     * @param array $attributes
     */
    public function __construct(array $attributes = [])
    {
        parent::__construct($attributes);

        if (!isset($this->attributes['created_at'])) {
            $this->attributes['created_at'] = Carbon::now();
        }
        if (!isset($this->attributes['updated_at'])) {
            $this->attributes['updated_at'] = Carbon::now();
        }
    }
}
