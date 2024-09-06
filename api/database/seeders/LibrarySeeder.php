<?php

namespace Database\Seeders;

use Illuminate\Database\Console\Seeds\WithoutModelEvents;
use Illuminate\Database\Seeder;
use App\Models\LibraryModel;
use App\Models\HobbyModel;

class LibrarySeeder extends Seeder
{
    /**
     * Run the database seeds.
     */
    public function run(): void
    {
        $count = HobbyModel::where('type','library')->count();
        LibraryModel::factory()->count($count)->create();
        // foreach (LibraryModel::$LibraryStaticGroup as $LibraryStaticGroupData) {
        //     LibraryModel::create($LibraryStaticGroupData);
        // }
    }
}
