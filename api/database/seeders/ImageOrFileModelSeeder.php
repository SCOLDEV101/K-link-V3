<?php

namespace Database\Seeders;

use Illuminate\Database\Console\Seeds\WithoutModelEvents;
use Illuminate\Database\Seeder;
use App\Models\imageOrFileModel;

class ImageOrFileModelSeeder extends Seeder
{
    /**
     * Run the database seeds.
     */
    public function run(): void
    {
        foreach (imageOrFileModel::$groupImageStatic as $image) {
            imageOrFileModel::create($image);
        }
        foreach (imageOrFileModel::$profileImageStatic as $image) {
            imageOrFileModel::create($image);
        }
        foreach (imageOrFileModel::$fileStatic as $file) {
            imageOrFileModel::create($file);
        }
    }
}
