<?php

namespace Database\Factories;

use Illuminate\Database\Eloquent\Factories\Factory;
use App\Models\UserModel;
use App\Models\ReportedModel;
use App\Models\NotifyModel;
use App\Models\HobbyModel;
use App\Models\TutoringModel;
use App\Models\LibraryModel;

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
    protected $hobby = HobbyModel::class;
    protected $tutoring = TutoringModel::class;
    protected $library = LibraryModel::class;
    public function definition(): array
    {
        $reportUser = ["สวมรอยเป็นบุคคลอื่น","บัญชีปลอม","ชื่อปลอม","การโพสต์ที่ไม่เหมาะสม","การคุุมคามและกลั่นแกล้ง"];
        $userTitle = ["สวมรอยเป็นบุคคลอื่น ๆ","บัญชีปลอมครับแอดมิน","มีการใช้งานชื่อปลอม","โพสต์นี้ไม่เหมาะสม","มีการคุกคามและกลั่นแกล้ง"];
        $reportGroup = ["Spam","อนาจาร","ความรุนแรง","การล่วงละเมิด","การก่อการร้าย","คำพูดแสดงความเกียจชัง","เกี่ยวกับเด็ก","การทำร้ายตัวเอง","ข้อมูลเท็จ","อื่น ๆ"];
        $groupTitle = ["กลุ่มนี้เป็นกลุ่ม Spam","กลุ่มนี้มีการอนาจาร","กลุ่มนี้มีการล่วงละเมิดสิทธิ์","กลุ่มนี้มีการกระทำการก่อการร้าย","กลุ่มนี้มี Hate speech แสดงความเกลียดชัง","กลุ่มนี้มีเนื้อหาที่ไม่เหมาะสม","กลุ่มนี้มีการทำร้ายตัวเอง","กลุ่มนี้มีการใช้งานข้อมูลเท็จ","กลุ่มนี้มีไอ่จง"];
        $userID = UserModel::pluck('id')->toArray();
        $sender = $this->faker->randomElement($userID);
        $availableUsers = array_diff($userID, [$sender]);
        $rand = rand(0,4);
        
        $reportUser = [
            'reportedID' => $availableUsers[rand(0,4)],
            'reportedBy' => $sender,
            'type' => $reportUser[$rand],
            'title' => $userTitle[$rand],
            'detail' => "detail"
        ];

        $reportGroup = [
            'reportedID' => $availableUsers[rand(0,4)],
            'reportedBy' => $sender,
            'type' => $reportGroup[$rand],
            'title' => $groupTitle[$rand],
            'detail' => "detail"
        ];

        ReportedModel::create([]);
        $notify = [
            'receiverID' => $receiver,
            'senderID' => (int)auth()->user()->id,
            'postID' => $request->input('id'),
            'type' => 'report'
        ];
        
        return $notify;
    }
}
