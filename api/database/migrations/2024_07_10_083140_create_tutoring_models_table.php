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
        Schema::create('tutoring_models', function (Blueprint $table) {
            $table->string('tutoringID')->primary();
            $table->string('hID');
            $table->string('facultyID');
            $table->string('majorID')->nullable();
            $table->string('sectionID')->nullable();
            $table->date('date');
            $table->time('startTime');
            $table->time('endTime');
            $table->boolean('status')->default(1);
            $table->timestamps();
        });
    }

    /**
     * Reverse the migrations.
     */
    public function down(): void
    {
        Schema::dropIfExists('tutoring_models');
    }
};
