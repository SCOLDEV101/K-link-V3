<?php

namespace Database\Seeders;

use Illuminate\Database\Console\Seeds\WithoutModelEvents;
use Illuminate\Database\Seeder;
use App\Models\HobbyModel;

class HobbySeeder extends Seeder
{
    /**
     * Run the database seeds.
     */
    public function run(): void
    {
        HobbyModel::factory()->count(30)->create(); 
        // foreach (HobbyModel::$HobbyStaticGroup as $HobbyStaticGroupData) {
        //     HobbyModel::create($HobbyStaticGroupData);
        // }
    }
}
