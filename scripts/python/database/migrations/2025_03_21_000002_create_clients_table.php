<?php

use Illuminate\Database\Migrations\Migration;
use Illuminate\Database\Schema\Blueprint;
use Illuminate\Support\Facades\Schema;

class CreateClientsTable extends Migration
{
    public function up()
    {
        Schema::create('clients', function (Blueprint $table) {
            $table->id(); // numeric ID
            $table->string('name');
            // Reference to the address book (one-to-one)
            $table->unsignedBigInteger('address_book_id')->unique();
            $table->timestamps();
            $table->softDeletes(); // Soft delete column

            $table->foreign('address_book_id')
                  ->references('id')->on('address_books')
                  ->onDelete('cascade');
        });
    }

    public function down()
    {
        Schema::table('clients', function (Blueprint $table) {
            $table->dropForeign(['address_book_id']);
        });
        Schema::dropIfExists('clients');
    }
}
