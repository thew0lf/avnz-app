<?php
declare(strict_types=1);

namespace App\Models;

use MongoDB\Laravel\Eloquent\Model;
use MongoDB\Laravel\Eloquent\SoftDeletes;
use Illuminate\Support\Str;

class Client extends Model
{
    use SoftDeletes;

    protected $collection = 'clients';

    protected $fillable = [
        'name', 'address_book_id', 'key', 'project_id', 'status','short_code'
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

    public function addressBook()
    {
        return $this->belongsTo(AddressBook::class);
    }

    public function project()
    {
        return $this->belongsTo(Project::class);
    }
}
