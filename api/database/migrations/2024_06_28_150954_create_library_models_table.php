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
        Schema::create('library_models', function (Blueprint $table) {
            $table->string('libraryID')->primary();
            $table->string('hID');
            $table->string('filepath');
            $table->integer('facultyID');
            $table->string('subject')->nullable();
            $table->boolean('status')->default(1);
            $table->integer('downloaded')->default(0);
            $table->integer('shared')->default(0);
            $table->timestamps();
        });
    }

    /**
     * Reverse the migrations.
     */
    public function down(): void
    {
        Schema::dropIfExists('library_models');
    }
};
