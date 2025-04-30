<?php

namespace App\Models;

use Illuminate\Database\Eloquent\Model;
use Illuminate\Database\Eloquent\SoftDeletes;
use Illuminate\Database\Eloquent\Relations\BelongsTo;
use Illuminate\Database\Eloquent\Relations\BelongsToMany;

class Client extends Model
{
    use SoftDeletes;

    protected $fillable = [
        'name', 'address_book_id'
    ];

    public function addressBook(): BelongsTo
    {
        return $this->belongsTo(AddressBook::class);
    }

    public function users(): BelongsToMany
    {
        return $this->belongsToMany(User::class, 'client_user');
    }
}
