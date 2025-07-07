<?php
declare(strict_types=1);

namespace App\Models;

use MongoDB\Laravel\Eloquent\Model;
use MongoDB\Laravel\Relations\BelongsTo;

class UserProject extends Model
{
    protected $collection = 'user_project';

    protected $fillable = [
        'user_id',
        'project_id',
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
     * The project that belongs to this association.
     */
    public function project(): BelongsTo
    {
        return $this->belongsTo(Project::class);
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
                ->where('project_id', $model->project_id)
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
        ['key' => ['project_id' => 1]],
        ['key' => ['user_id' => 1, 'project_id' => 1], 'unique' => true],
    ];
}
