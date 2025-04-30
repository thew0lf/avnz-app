import os
import zipfile

# Define the base directory three levels up.
base_dir = os.path.join("..", "..", "..")

# Define the target directory for models.
models_dir = os.path.join(base_dir, "app", "Models")

# Create the models directory if it doesn't exist.
os.makedirs(models_dir, exist_ok=True)

###################################
# 1. Laravel Eloquent Model Files  #
###################################

laravel_models = {
    "AddressBook.php": r"""<?php

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
""",
    "Project.php": r"""<?php

namespace App\Models;

use MongoDB\Laravel\Eloquent\Model;
use MongoDB\Laravel\Eloquent\SoftDeletes;

class Project extends Model
{
    use SoftDeletes;

    protected $collection = 'projects';

    protected $fillable = [
        'name', 'address_id'
    ];

    public function addressBook()
    {
        return $this->belongsTo(AddressBook::class, 'address_id');
    }
}
""",
    "Company.php": r"""<?php

namespace App\Models;

use MongoDB\Laravel\Eloquent\Model;
use MongoDB\Laravel\Eloquent\SoftDeletes;
use Illuminate\Support\Str;

class Company extends Model
{
    use SoftDeletes;

    protected $collection = 'companies';

    protected $fillable = [
        'name', 'address_book_id', 'key', 'project_id', 'status'
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
""",
    "Client.php": r"""<?php

namespace App\Models;

use MongoDB\Laravel\Eloquent\Model;
use MongoDB\Laravel\Eloquent\SoftDeletes;
use Illuminate\Support\Str;

class Client extends Model
{
    use SoftDeletes;

    protected $collection = 'clients';

    protected $fillable = [
        'name', 'address_book_id', 'key', 'project_id', 'status'
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
""",
    "User.php": r"""<?php

namespace App\Models;

use MongoDB\Laravel\Auth\User as Authenticatable;
use MongoDB\Laravel\Eloquent\SoftDeletes;
use Illuminate\Support\Str;

class User extends Authenticatable
{
    use SoftDeletes;

    protected $collection = 'users';

    protected $fillable = [
        'name', 'email', 'password', 'key', 'username', 'display_name', 'first_name', 'last_name', 'address_book_id', 'status'
    ];

    protected static function boot()
    {
        parent::boot();

        static::creating(function ($model) {
            if (empty($model->key)) {
                $model->key = (string) Str::uuid();
            }
            if ($model->first_name) { $model->first_name = strtolower($model->first_name); }
            if ($model->last_name) { $model->last_name = strtolower($model->last_name); }
            if ($model->name) { $model->name = strtolower($model->name); }
            if ($model->email) { $model->email = strtolower($model->email); }
        });

        static::updating(function ($model) {
            if ($model->first_name) { $model->first_name = strtolower($model->first_name); }
            if ($model->last_name) { $model->last_name = strtolower($model->last_name); }
            if ($model->name) { $model->name = strtolower($model->name); }
            if ($model->email) { $model->email = strtolower($model->email); }
        });
    }

    public function addressBook()
    {
        return $this->belongsTo(AddressBook::class);
    }
}
"""
}

###################################
# 2. Write Model Files to Disk    #
###################################

for filename, content in laravel_models.items():
    filepath = os.path.join(models_dir, filename)
    with open(filepath, "w") as f:
        f.write(content)

###################################
# 3. Create a ZIP File of Models  #
###################################

zip_filename = "project_files_eloquent_laravel.zip"
zip_filepath = os.path.join(os.getcwd(), zip_filename)

with zipfile.ZipFile(zip_filepath, "w", zipfile.ZIP_DEFLATED) as zipf:
    # Only include the models folder (excluding migrations)
    folders = [os.path.join(base_dir, "app", "Models")]
    for folder in folders:
        for root, dirs, files in os.walk(folder):
            for file in files:
                file_path = os.path.join(root, file)
                arcname = os.path.relpath(file_path, base_dir)
                zipf.write(file_path, arcname)

print("Zip file created:", zip_filepath)
