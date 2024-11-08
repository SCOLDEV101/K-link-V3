<?php

namespace Database\Factories;

use Illuminate\Database\Eloquent\Factories\Factory;
use App\Models\UserModel;
use App\Models\NotificationModel;
use App\Models\ReportedModel;

/**
 * @extends \Illuminate\Database\Eloquent\Factories\Factory<\App\Models\Model>
 */
class NotificationModelFactory extends Factory
{
    /**
     * Define the model's default state.
     *
     * @return array<string, mixed>
     */
    public function definition(): array
    {
        $reportUser = ["สวมรอยเป็นบุคคลอื่น","บัญชีปลอม","ชื่อปลอม","การโพสต์ที่ไม่เหมาะสม","การคุุมคามและกลั่นแกล้ง"];
        $reportGroup = ["Spam","อนาจาร","ความรุนแรง","การล่วงละเมิด","การก่อการร้าย","คำพูดแสดงความเกียจชัง","เกี่ยวกับเด็ก","การทำร้ายตัวเอง","ข้อมูลเท็จ","อื่น ๆ"];
        $userID = UserModel::pluck('id')->toArray();
        $sender = $this->faker->randomElement($userID);
        $availableUsers = array_diff($userID, [$sender]);
        $remainingUsers = array_diff($availableUsers, $sender);
        $reportUser = [
            'reportedID' => $remainingUsers,
            'reportedBy' => $sender,
            'type' => $request->input('type'),
            'title' => $request->input('title'),
            'detail' => $request->input('detail')
        ];
        
        return [
            
        ];
    }
}
