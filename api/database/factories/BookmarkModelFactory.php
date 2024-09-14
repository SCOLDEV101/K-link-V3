<?php

namespace Database\Factories;

use Illuminate\Database\Eloquent\Factories\Factory;
use App\Models\GroupModel;
use App\Models\UserModel;
use App\Models\BookmarkModel;
/**
 * @extends \Illuminate\Database\Eloquent\Factories\Factory<\App\Models\Model>
 */
class BookmarkModelFactory extends Factory
{
    /**
     * Define the model's default state.
     *
     * @return array<string, mixed>
     */
    public function definition(): array
    {
        $userID = UserModel::pluck('id')->random();
        $groupID = GroupModel::pluck('groupID')->random();

        if (BookmarkModel::where('userID', $userID)->where('groupID', $groupID)->exists()) {
            $userID = UserModel::pluck('id')->random();
            $groupID = GroupModel::pluck('groupID')->random();
        }

        return [
            'userID' => $userID,
            'groupID' => $groupID,
        ];
    }
}
