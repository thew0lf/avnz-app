<?php

use Illuminate\Database\Migrations\Migration;
use Illuminate\Database\Schema\Blueprint;
use Illuminate\Support\Facades\Schema;

class CreateAddressBooksTable extends Migration
{
    public function up()
    {
        Schema::create('address_books', function (Blueprint $table) {
            $table->id(); // numeric ID
            $table->string('address', 255);
            $table->string('address2', 255)->nullable();
            $table->string('city', 255);
            $table->string('state_province', 255);
            $table->string('zip_code', 255);
            $table->timestamps();
            $table->softDeletes(); // Soft delete column
        });
    }

    public function down()
    {
        Schema::dropIfExists('address_books');
    }
}
