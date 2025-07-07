<?php
declare(strict_types=1);

namespace App\Models;

use MongoDB\Laravel\Eloquent\Model;
use MongoDB\Laravel\Relations\BelongsTo;

class UserClient extends Model
{
    protected $collection = 'user_client';

    protected $fillable = [
        'user_id',
        'client_id',
    ];

    /**
     * Indicates if the model should be timestamped.
     *
     * @var bool
     */
    public $timestamps = true;

    /**
     * The user that belongs to this association.
     */
    public function user(): BelongsTo
    {
        return $this->belongsTo(User::class);
    }

    /**
     * The client that belongs to this association.
     */
    public function client(): BelongsTo
    {
        return $this->belongsTo(Client::class);
    }

    /**
     * Create indexes for better performance.
     */
    public static function boot()
    {
        parent::boot();

        static::creating(function ($model) {
            // Ensure we don't create duplicate associations
            if (self::where('user_id', $model->user_id)
                ->where('client_id', $model->client_id)
                ->exists()) {
                return false;
            }
        });
    }

    /**
     * The indexes that should be created on the collection.
     *
     * @var array
     */
    protected $indexes = [
        ['key' => ['user_id' => 1]],
        ['key' => ['client_id' => 1]],
        ['key' => ['user_id' => 1, 'client_id' => 1], 'unique' => true],
    ];
}
