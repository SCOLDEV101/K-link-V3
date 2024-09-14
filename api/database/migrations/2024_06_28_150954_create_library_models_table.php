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
            $table->string('id')->primary();
            $table->integer('facultyID');
            $table->integer('majorID');
            $table->integer('departmentID');
            $table->integer('imageOrFileID')->nullable();
            $table->string('name');
            $table->text('detail')->nullable();
            $table->integer('memberMax')->nullable();
            $table->string('createdBy');
            $table->integer('download')->default(1);
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
