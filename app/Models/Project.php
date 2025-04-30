<?php
declare(strict_types=1);

namespace App\Models;

use MongoDB\Laravel\Eloquent\Model;
use MongoDB\Laravel\Eloquent\SoftDeletes;

class Project extends Model
{
    use SoftDeletes;

    protected $collection = 'projects';

    protected $fillable = [
        'name', 'address_id','display_name'
    ];

    public function addressBook()
    {
        return $this->belongsTo(AddressBook::class, 'address_id');
    }
}
