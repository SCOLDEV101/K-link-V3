<?php

namespace Database\Factories;

use Illuminate\Database\Eloquent\Factories\Factory;
use App\Models\UserModel;
use App\Models\GroupModel;
use App\Models\NotifyModel;
use App\Models\ReportedModel;
/**
 * @extends \Illuminate\Database\Eloquent\Factories\Factory<\App\Models\ReportedModel>
 */
class ReportedModelFactory extends Factory
{
    /**
     * Define the model's default state.
     *
     * @return array<string, mixed>
     */
    public function definition(): array
    {
        $userID = UserModel::pluck('id')->toArray();
        $groups = GroupModel::with(['hobby.leaderGroup','tutoring.leaderGroup','library.leaderGroup'])->get();

        // $reportUser = ["สวมรอยเป็นบุคคลอื่น","บัญชีปลอม","ชื่อปลอม","การโพสต์ที่ไม่เหมาะสม","การคุุมคามและกลั่นแกล้ง"];
        $userTitle = ["สวมรอยเป็นบุคคลอื่น ๆ","บัญชีปลอมครับแอดมิน","มีการใช้งานชื่อปลอม","โพสต์นี้ไม่เหมาะสม","มีการคุกคามและกลั่นแกล้ง"];

        // $reportGroup = ["Spam","อนาจาร","ความรุนแรง","การล่วงละเมิด","การก่อการร้าย","คำพูดแสดงความเกียจชัง","เกี่ยวกับเด็ก","การทำร้ายตัวเอง","ข้อมูลเท็จ","อื่น ๆ"];
        $groupTitle = ["กลุ่มนี้เป็นกลุ่ม Spam","กลุ่มนี้มีการอนาจาร","กลุ่มนี้มีการล่วงละเมิดสิทธิ์","กลุ่มนี้มีการกระทำการก่อการร้าย","กลุ่มนี้มี Hate speech แสดงความเกลียดชัง","กลุ่มนี้มีเนื้อหาที่ไม่เหมาะสม","กลุ่มนี้มีการทำร้ายตัวเอง","กลุ่มนี้มีการใช้งานข้อมูลเท็จ","กลุ่มนี้มีไอ่จง"];
        
        $sender = $this->faker->randomElement($userID);
        $availableUsers = array_diff($userID, [$sender]);

        // $groupAndUser = array_merge($availableUsers,$groupID['groupID']);
        // $reportedID = $this->faker->randomElement($groupAndUser);

         // Randomly select a group and extract ID and type
        $group = $this->faker->randomElement($groups->toArray());
        $groupID = $group['groupID'];
        $groupType = $group['type'];
        // $groupLeader = $group['hobby.username'];

        $groupLeader = null;
        if (!empty($group['hobby']['leader_group']['id'])) {
            $groupLeader = $group['hobby']['leader_group']['id'];
        } elseif (!empty($group['tutoring']['leader_group']['id'])) {
            $groupLeader = $group['tutoring']['leader_group']['id'];
        } elseif (!empty($group['library']['leader_group']['id'])) {
            $groupLeader = $group['library']['leader_group']['id'];
        }

        // Create a combined list of available users and the group ID
        $groupAndUser = array_merge($availableUsers, [$groupID]);

        $reportedID = $this->faker->randomElement($groupAndUser);
        
        // Create the report
        if (in_array($reportedID, $availableUsers)) {
            // For user report
            $report = ReportedModel::create([
                'reportedID' => $reportedID,
                'reportedBy' => $sender,
                'type' => 'user',
                'title' => $this->faker->randomElement($userTitle),
                'detail' => "reported user's detail",
                'created_at' => now(),
                'updated_at' => now(),
            ]);

            // Create notification for user report
            NotifyModel::create([
                'receiverID' => $reportedID,
                'senderID' => $sender,
                'reportID' => $report->id,
                'postID' => $reportedID,
                'type' => 'report',
                'created_at' => now(),
                'updated_at' => now(),
            ]);

        } else {
            // For group report
            $report = ReportedModel::create([
                'reportedID' => $reportedID,
                'reportedBy' => $sender,
                'type' => $groupType,
                'title' => $this->faker->randomElement($groupTitle),
                'detail' => "reported group's detail",
                'created_at' => now(),
                'updated_at' => now(),
            ]);

            // Create notification for group report
            NotifyModel::create([
                'receiverID' => $groupLeader,
                'senderID' => $sender,
                'reportID' => $report->id,
                'postID' => $groupID,
                'type' => 'report',
                'created_at' => now(),
                'updated_at' => now(),
            ]);
        }

        return $report->toArray();
        }
}
