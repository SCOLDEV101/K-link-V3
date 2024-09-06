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
            $table->string('hID')->primary();
            $table->string('type');
            $table->text('activityName');
            $table->string('weekDate');
            $table->time('actTime');
            $table->integer('memberCount')->default(1);
            $table->integer('memberMax')->nullable();
            $table->text('member');
            $table->string('memberRequest')->nullable();
            $table->string('location');
            $table->text('image')->nullable();
            $table->text('detail')->nullable();
            $table->string('tag')->nullable();
            $table->integer('createdBy');
            $table->integer('leader');
            $table->boolean('status')->default(1);
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
