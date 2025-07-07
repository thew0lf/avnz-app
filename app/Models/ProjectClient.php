<?php
declare(strict_types=1);

namespace App\Models;

use MongoDB\Laravel\Eloquent\Model;
use MongoDB\Laravel\Relations\BelongsTo;

class ProjectClient extends Model
{
    protected $collection = 'project_client';

    protected $fillable = [
        'project_id',
        'client_id',
    ];

    /**
     * Indicates if the model should be timestamped.
     *
     * @var bool
     */
    public $timestamps = true;

    /**
     * The project that belongs to this association.
     */
    public function project(): BelongsTo
    {
        return $this->belongsTo(Project::class);
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
            if (self::where('project_id', $model->project_id)
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
        ['key' => ['project_id' => 1]],
        ['key' => ['client_id' => 1]],
        ['key' => ['project_id' => 1, 'client_id' => 1], 'unique' => true],
    ];
}
