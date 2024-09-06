<?php

namespace Database\Seeders;

use Illuminate\Database\Console\Seeds\WithoutModelEvents;
use Illuminate\Database\Seeder;
use App\Models\UserModel;

class UserSeeder extends Seeder
{
    /**
     * Run the database seeds.
     */
    public function run(): void
    {
        // foreach(UserModel::$defaultUser as $User){
        //     UserModel::create($User);
        // }
        UserModel::factory(100)->create();
    }
}
