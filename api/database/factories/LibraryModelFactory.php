<?php

namespace Database\Factories;

use Illuminate\Database\Eloquent\Factories\Factory;
use App\Models\LibraryModel;
use App\Models\HobbyModel;

/**
 * @extends \Illuminate\Database\Eloquent\Factories\Factory<\App\Models\LibraryModel>
 */
class LibraryModelFactory extends Factory
{
    protected $model = LibraryModel::class;

    private static $usedHIDs = [];
    public static $generatedIds = [];
    function between($array)
    {
        $index = count($array);
        $each = rand(0, $index - 1);
        return $array[$each];
    }
    public function definition(): array
    {

        $hID = $this->getUniqueHID();
        $arrayPdf = ['library-Rev1_1.pdf', 'library-LeanStartup.pdf', 'library-Rev1_1.pdf'];
        return [
            'libraryID' => $this->idGeneration(),
            'hID' => $hID,
            'filepath' => $arrayPdf[rand(0,2)],
            'facultyID' => $this->faker->numberBetween(1, 16),
            'created_at' => now(),
            'updated_at' => now(),
        ];
    }

    private function getUniqueHID(): string
    {
        $hIDs = HobbyModel::where('type', 'library')->pluck('hID')->toArray();
        $availableHIDs = array_diff($hIDs, self::$usedHIDs);

        if (empty($availableHIDs)) {
            throw new \Exception('No more unique hID values available');
        }

        $hID = $this->faker->randomElement($availableHIDs);
        self::$usedHIDs[] = $hID;

        return $hID;
    }

    public function idGeneration(): string
    {
        $prefix = 'l-' . now()->format('Ymd') . '-';
        $sets = 3;
        $numbersPerSet = 1000;

        $allNumbers = [];
        for ($i = 0; $i < $sets; $i++) {
            $numbers = range(0, 100);
            shuffle($numbers);
            $allNumbers[] = array_slice($numbers, 0, $numbersPerSet);
        }

        $randomSet = $allNumbers[array_rand($allNumbers)];
        $id = $randomSet[array_rand($randomSet)];

        // Ensure the ID is unique
        while (in_array($id, self::$generatedIds)) {
            $id = $randomSet[array_rand($randomSet)];
        }
        $id = str_pad($id, 3, '0', STR_PAD_LEFT);
        self::$generatedIds[] = $id;
        return $prefix . $id;
    }
}
