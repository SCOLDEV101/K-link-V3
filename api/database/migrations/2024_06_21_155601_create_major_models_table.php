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
        Schema::create('major_models', function (Blueprint $table) {
            $table->string('majorID')->primary();
            $table->unsignedBigInteger('facultyID');
            $table->foreign('facultyID')->references('facultyID')->on('faculty_models');
            $table->string('majorNameTH')->nullable();
            $table->string('majorNameEN')->nullable();
            $table->boolean('status')->default(1);
            $table->timestamps();
        });
    }

    /**
     * Reverse the migrations.
     */
    public function down(): void
    {
        Schema::dropIfExists('major_models');
    }
};
