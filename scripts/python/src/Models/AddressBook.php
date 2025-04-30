<?php

namespace App\Models;

use Illuminate\Database\Eloquent\Model;
use Illuminate\Database\Eloquent\SoftDeletes;

class AddressBook extends Model
{
    use SoftDeletes;

    protected $table = 'address_books';

    protected $fillable = [
        'address', 'address2', 'city', 'state_province', 'zip_code'
    ];
}
