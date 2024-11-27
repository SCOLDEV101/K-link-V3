<?php

namespace Database\Factories;

use Illuminate\Database\Eloquent\Factories\Factory;
use Illuminate\Support\Str;

/**
 * @extends \Illuminate\Database\Eloquent\Factories\Factory<\App\Models\User>
 */
class UserModelFactory extends Factory
{
    /**
     * Define the model's default state.
     *
     * @return array<string, mixed>
     */
    public function definition(): array
    {
        // return [
        //     'name' => fake()->name(),
        //     'email' => fake()->unique()->safeEmail(),
        //     'email_verified_at' => now(),
        //     'password' => '$2y$10$92IXUNpkjO0rOQ5byMi.Ye4oKoEa3Ro9llC/.og/at2.uheWG/igi', // password
        //     'remember_token' => Str::random(10),
        // ];
        $index = $this->faker->unique()->numberBetween(1, 999);
        $prefix = $this->faker->randomElement(['นาย', 'นางสาว']);
        return [
            'id' => '65010' . str_pad($index, 3, '0', STR_PAD_LEFT),
            'facultyID' => str_pad(($index % 16) + 1, 2, '0', STR_PAD_LEFT),
            'majorID' => $this->faker->numberBetween(1,71),//'ENG' . str_pad(($index % 15) + 1, 2, '0', STR_PAD_LEFT),
            'imageOrFileID' => $this->faker->randomElement([4]),
            'roleID' => '100',
            'username' => 'IoT-' . $index,
            'fullname' => $prefix . 'ไอโอที-' . $index,
            'aboutMe' => 'ขอกราบสวัสดีทุกๆคน! ข้าพเจ้าคือ IoT หมายเลข ' . $index,
            'telephone' => '065-065' . str_pad($index, 4, '0', STR_PAD_LEFT),
            'email' => '65010' . str_pad($index, 3, '0', STR_PAD_LEFT) . '@kmitl.ac.th',
            'created_at' => now(),
            'updated_at' => now(),
        ];
    }

    /**
     * Indicate that the model's email address should be unverified.
     *
     * @return $this
     */
    public function unverified(): static
    {
        return $this->state(fn (array $attributes) => [
            'email_verified_at' => null,
        ]);
    }
}
