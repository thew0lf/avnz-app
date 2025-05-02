<?php
namespace App\Models;

use MongoDB\Laravel\Eloquent\Model;

class ResourceAcl extends Model
{

    protected $fillable = [
        'resourceType', // e.g. 'project'
        'resourceId',   // ObjectId of the document
        'grants',       // array of { userId, permissions[] }
    ];

    //protected $casts = ['grants' => 'array'];

    /**
     * Get all grants for this resource
     */
    public function grants()
    {
        return collect($this->grants);
    }
}
