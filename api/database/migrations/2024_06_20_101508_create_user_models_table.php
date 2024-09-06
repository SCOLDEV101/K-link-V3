<?php

use Illuminate\Database\Migrations\Migration;
use Illuminate\Database\Schema\Blueprint;
use Illuminate\Support\Facades\Schema;

return new class extends Migration
{
    /**
     * Run the migrations.
     */
    public function up(): void
    {
        Schema::create('user_models', function (Blueprint $table) {
            $table->id('uID');
            $table->string('username');
            $table->string('fullname');
            $table->text('aboutMe')->nullable();
            $table->string('telephone')->nullable();
            $table->string('email');
            $table->string('facultyID');
            $table->string('majorID');
            $table->text('profileImage')->nullable();
            $table->string('roleID')->default('100');
            $table->string('bookmark')->nullable();
            $table->string('key')->nullable();
            $table->boolean('status')->default(1);
            $table->timestamps();
        });
    }

    /**
     * Reverse the migrations.
     */
    public function down(): void
    {
        Schema::dropIfExists('user_models');
    }
};
