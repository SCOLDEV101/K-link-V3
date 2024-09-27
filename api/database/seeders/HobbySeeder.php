<?php

namespace Database\Seeders;

use Illuminate\Database\Console\Seeds\WithoutModelEvents;
use Illuminate\Database\Seeder;
use App\Models\HobbyModel;
use App\Models\GroupModel;
use App\Models\TagModel;
use App\Models\GroupTagModel;
use App\Models\DayModel;
use Illuminate\Support\Facades\DB;

class HobbySeeder extends Seeder
{
    /**
     * Run the database seeds.
     */
    public function run(): void
    {
        HobbyModel::factory(20)->create();
    }
}
