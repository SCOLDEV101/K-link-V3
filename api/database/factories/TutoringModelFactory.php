<?php

namespace Database\Factories;

use Illuminate\Database\Eloquent\Factories\Factory;
use App\Models\TutoringModel;
use App\Models\HobbyModel;

/**
 * @extends \Illuminate\Database\Eloquent\Factories\Factory<\App\Models\TutoringModel>
 */
class TutoringModelFactory extends Factory
{
    protected $model = TutoringModel::class;

    private static $usedHIDs = [];
    public static $generatedIds = [];

    public function definition(): array
    {
        try {
            $hID = $this->getUniqueHID();
        } catch (\Exception $e) {
            // Skip creating this record if no unique hID is available
            return [];
        }

        return [
            'tutoringID' => $this->idGeneration(),
            'hID' => $hID,
            'facultyID' => $this->faker->numberBetween(1, 16),
            'majorID' => $this->faker->randomElement(['ENG01', 'ENG02', 'ENG03', 'ENG04', 'ENG05', 'ENG06', 'ENG07', 'ENG08', 'ENG09', 'ENG10']),
            'sectionID' => $this->faker->numberBetween(1, 145),
            'date' => $this->faker->date(),
            'startTime' => $this->faker->time(),
            'endTime' => $this->faker->time(),
            'created_at' => now(),
            'updated_at' => now(),
        ];
    }

    private function getUniqueHID(): string
    {
        $hIDs = HobbyModel::where('type', 'tutoring')->pluck('hID')->toArray();
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
        $prefix = 't-' . now()->format('Ymd') . '-';
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
        return $prefix.$id;
    }
}
