<?php

namespace Database\Seeders;

use Illuminate\Database\Console\Seeds\WithoutModelEvents;
use Illuminate\Database\Seeder;
use App\Models\TutoringModel;
use App\Models\HobbyModel;

class TutoringSeeder extends Seeder
{
    /**
     * Run the database seeds.
     */
    public function run(): void
    {
        $count = HobbyModel::where('type','tutoring')->count();
        TutoringModel::factory()->count($count)->create();
        // foreach (TutoringModel::$TutoringStaticGroup as $TutoringStaticGroupData) {
        //     TutoringModel::create($TutoringStaticGroupData);
        // }
    }
}
