<?php

use Illuminate\Database\Migrations\Migration;
use Illuminate\Database\Schema\Blueprint;
use Illuminate\Support\Facades\Schema;

class CreateClientUserTable extends Migration
{
    public function up()
    {
        Schema::create('client_user', function (Blueprint $table) {
            $table->unsignedBigInteger('client_id');
            $table->unsignedBigInteger('user_id');

            $table->foreign('client_id')->references('id')->on('clients')->onDelete('cascade');
            $table->foreign('user_id')->references('id')->on('users')->onDelete('cascade');

            $table->primary(['client_id', 'user_id']);
        });
    }

    public function down()
    {
        Schema::dropIfExists('client_user');
    }
}
