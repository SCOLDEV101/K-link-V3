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
        Schema::create('hobby_models', function (Blueprint $table) {
            $table->string('id')->primary();
            $table->integer('imageOrFileID')->nullable();
            $table->string('name');
            $table->integer('memberMax')->nullable();
            $table->text('location');
            $table->text('detail')->nullable();
            $table->time('startTime');
            $table->time('endTime');
            $table->string('leader');
            $table->string('createdBy');
            $table->timestamps();
        });
    }

    /**
     * Reverse the migrations.
     */
    public function down(): void
    {
        Schema::dropIfExists('hobby_models');
    }
};
