<?php

namespace Database\Factories;

use Illuminate\Database\Eloquent\Factories\Factory;
use App\Models\HobbyModel;
use App\Models\UserModel;
use App\Models\DayModel;
use App\Models\TagModel;
use App\Models\GroupTagModel;
use App\Models\GroupModel;
use App\Models\GroupDayModel;
use App\Models\MemberModel;
use App\Models\RequestModel;
use App\Models\BookmarkModel;
use App\Models\NotifyModel;

use Illuminate\Support\Facades\Log;
// use Illuminate\Support\Facades\DB;

/**
 * @extends \Illuminate\Database\Eloquent\Factories\Factory<\App\Models\HobbyModel>
 */
class HobbyModelFactory extends Factory
{
    public static $generatedIds = [];
    /**
     * Define the model's default state.
     *
     * @return array<string, mixed>
     */
    public function definition(): array
    {   
        $tags = [
            'กิจกรรมวิจัย', 'การประชุมวิชาการ', 'การสัมมนา', 'กิจกรรมการศึกษา', 'งานเสวนา', 'กิจกรรมสันทนาการ', 'การแข่งขันกีฬา', 'นิทรรศการ', 'งานแสดงผลงาน', 'เวิร์กช็อป',
            'สัมมนาวิชาการ', 'ค่ายนักศึกษา', 'กิจกรรมอาสา', 'งานเชื่อมโยงวิจัย', 'กิจกรรมเครือข่าย', 'การศึกษาเชิงวิจัย', 'การพัฒนาสมรรถนะ', 'การเรียนรู้ตลอดชีวิต', 'โครงการนวัตกรรม', 'การบรรยายพิเศษ',
            'การอบรมเชิงปฏิบัติการ', 'การพัฒนาศักยภาพ', 'การฝึกอบรมบุคลากร', 'การศึกษาออนไลน์', 'การจัดการความรู้', 'การพัฒนาองค์กร', 'การวิจัยและพัฒนา', 'กิจกรรมวิทยาศาสตร์', 'การตลาดและการประชาสัมพันธ์', 'การพัฒนาเทคโนโลยี',
            'การส่งเสริมการศึกษา', 'กิจกรรมเชิงพาณิชย์', 'การพัฒนาทักษะทางวิชาชีพ', 'การอบรมเทคโนโลยี', 'การจัดการข้อมูล', 'การศึกษาเชิงลึก', 'การประชุมภายในองค์กร', 'การพัฒนาเครื่องมือวิจัย', 'การแสดงผลงานวิจัย', 'การฝึกอบรมระดับชาติ',
            ];
        $activityNames = [
            'การแข่งขันวิชาการ', 'งานสัมมนาวิทยาศาสตร์', 'การฝึกอบรมวิจัย', 'การประชุมเทคโนโลยี', 'การท่องเที่ยวเชิงวิทยาศาสตร์', 'งานแสดงนวัตกรรม', 'กิจกรรมสันทนาการนักศึกษา', 'การประชุมเชิงปฏิบัติการ', 'การฝึกอบรมอาจารย์', 'การศึกษาเชิงปฏิบัติ',
            'การสอนเชิงวิจัย', 'การสัมมนานักวิจัย', 'การประชุมวิจัยระดับชาติ', 'กิจกรรมการศึกษาต่อ', 'งานวิจัยและพัฒนา', 'การเรียนรู้ด้านวิศวกรรม', 'การอบรมการใช้เครื่องมือวิจัย', 'งานสอนและการเรียนรู้', 'การพัฒนาทักษะนักศึกษา', 'การประชุมวิทยาศาสตร์และเทคโนโลยี',
            'การจัดการโครงการวิจัย', 'การฝึกอบรมสถิติ', 'งานประชุมด้านการศึกษา', 'การฝึกอบรมการพัฒนาองค์กร', 'กิจกรรมการวิจัยระดับสากล', 'การอบรมความปลอดภัย', 'การประชุมการศึกษาเชิงปฏิบัติการ', 'การฝึกอบรมด้านเทคโนโลยีสารสนเทศ', 'การสัมมนาเชิงวิจัย', 'การจัดการเทคโนโลยีการศึกษา',
        ];
        $locations = [
            'สถาบันเทคโนโลยีพระจอมเกล้าลาดกระบัง', 'กรุงเทพมหานคร', 'ลาดกระบัง', 'คลองหลวง', 'พระนคร', 'ปทุมธานี', 'รามคำแหง', 'บางกะปิ', 'วังทองหลาง', 'สยาม',
            'ม.เกษตรศาสตร์', 'ม.มหิดล', 'ม.ธรรมศาสตร์', 'ม.จุฬาฯ', 'ม.เชียงใหม่', 'ม.ขอนแก่น', 'ม.สุรนารี', 'ม.นครราชสีมา', 'ม.บูรพา', 'ม.สงขลา',
            'ศูนย์การค้าเซ็นทรัลลาดกระบัง', 'มหาวิทยาลัยเทคโนโลยีราชมงคล', 'ศูนย์การค้าแพลตตินัม', 'ตลาดนัดจตุจักร', 'สวนลุมพินี', 'หอประชุมจุฬาลงกรณ์มหาวิทยาลัย', 'ศูนย์การค้าเอ็มโพเรียม', 'โรงแรมแกรนด์เมอริเดียน', 'ศูนย์การค้าสยามพารากอน', 'หอประชุมสมเด็จพระเทพฯ',
        ];
        $details = [
            'รายละเอียดการประชุมวิจัย', 'ข้อมูลเกี่ยวกับงานแสดงนวัตกรรม', 'คำแนะนำการเข้าร่วมกิจกรรม', 'ข้อมูลการลงทะเบียน', 'รายละเอียดของเวิร์กช็อป', 'แผนที่สถานที่จัดงาน', 'รายละเอียดการฝึกอบรม', 'ข้อกำหนดและเงื่อนไขการเข้าร่วม', 'ข้อมูลติดต่อสำหรับสอบถาม', 'ข้อมูลเพิ่มเติมเกี่ยวกับการประชุม',
            'หมายเหตุสำคัญสำหรับผู้เข้าร่วม', 'ข้อแนะนำในการเตรียมตัว', 'รายละเอียดกิจกรรมการศึกษาต่อ', 'แผนที่และวิธีการเดินทาง', 'ข้อมูลเกี่ยวกับวิทยากร', 'การลงทะเบียนล่วงหน้า', 'การจัดการและข้อบังคับ', 'รายละเอียดเกี่ยวกับการพัฒนาอาชีพ', 'ข้อมูลเกี่ยวกับการสอนเชิงวิจัย', 'รายละเอียดเพิ่มเติมเกี่ยวกับกิจกรรม',
            'ข้อควรระวังในการเข้าร่วม', 'รายละเอียดการบรรยายพิเศษ', 'ข้อมูลสำหรับการลงทะเบียนเข้าร่วมกิจกรรม', 'ข้อกำหนดการใช้บริการ', 'ข้อมูลสำคัญสำหรับผู้เข้าร่วมประชุม', 'การจัดการด้านโลจิสติกส์', 'คำแนะนำในการเตรียมเอกสาร', 'รายละเอียดการประชุมงานวิจัย', 'ข้อกำหนดสำหรับการเข้าร่วมงาน', 'ข้อมูลการตรวจสอบผลการประชุม',
        ];

        $userID = UserModel::pluck('id')->toArray(); // เอารายชื่อ user ออกมา
        $leader = $this->faker->randomElement($userID); // สุ่มเอา 1 user เป็น leader

        $memberMax = $this->faker->numberBetween(1, 99); // Real Max: 99, จำนวนสมาชิกที่มีได้
        $memberRand = rand(1, 5); // สุ่มจำนวนสมาชิกกลุ่ม

        $availableUsers = array_diff($userID, [$leader]); // เอาสมาชิกที่ไม่ใช่ leader
        $members = $this->faker->randomElements($availableUsers, $memberRand - 1); // สุ่มเอา id ใน userArray ที่ไม่มี leader

        $remainingUsers = array_diff($availableUsers, $members); // จำนวน user ที่เหลือ ที่ไม่ใช่ member และ leader
        $requests = $this->faker->randomElements($remainingUsers, $this->faker->numberBetween(0, count($remainingUsers))); // สุ่มเอาสามชิกที่เหลือ ที่ไม่ใช่ member และ leader มาลงใน request

        $selectedTags = $this->faker->randomElements($tags, $this->faker->numberBetween(1, 5)); // สุ่มให้จำนวนแท็กมี 1-5 แท็ก
        
        $startTime = $this->faker->time(); // สุ่มเวลา
        $endTime = $this->faker->time(); // สุ่มเวลา
        
        $startTimestamp = strtotime($startTime);
        $endTimestamp = $startTimestamp + rand(3600, 10800); // สุ่มให้เวลา endTime ห่างจาก startTime อยู่ 1-3 ชม.
    
        $startTime = date('H:i:s', $startTimestamp); // format เวลา
        $endTime = date('H:i:s', $endTimestamp); // format เวลา

        $hobby = [
            'id' => $this->idGeneration(),
            'imageOrFileID' => $this->faker->randomElement([1,4,5,6,7]),
            'name' => $this->faker->randomElement($activityNames),
            'memberMax' => $this->faker->randomElement([$memberMax, null]),
            'location' => $this->faker->randomElement($locations),
            'detail' => $this->faker->randomElement($details),
            'startTime' => $startTime,
            'endTime' => $endTime,
            'leader' => $leader,
            'createdBy' => $this->faker->randomElement(array_merge([$leader], $members)),
        ];

        // เก็บ id กลุ่มและประเภท ลงใน groupModel โดย groupModel จะเป็นตัวเชื่อมไอดีของกลุ่มและโพสต์ทั้งหมดเพื่อแสดงรายละเอียด
        $createGroup = GroupModel::create([
            // 'id' => $this->groupIdGenerator(),
            'groupID' => $hobby['id'],
            'type' => 'hobby',
        ]);

        // สุ่มสมาชิก โดยเก็บ userID เป็น id ใน members Array
        MemberModel::create([
            'groupID' => $createGroup['id'],
            'userID' => $leader,
        ]);
        foreach ($members as $member) {
            MemberModel::create([
                'groupID' => $createGroup['id'],
                'userID' => $member,
            ]);
        }

        // สุ่ม requeset โดยเก็บ userID เป็น id ใน requests Array ซึ่งเป็นส่วนเหลือจากสมาชิกและหัวหน้า
        foreach ($requests as $request) {
            RequestModel::create([
                'groupID' => $createGroup['id'],
                'userID' => $request,
            ]);

            NotifyModel::create([
                'receiverID' => $leader,
                'senderID' => $request,
                'postID' => $createGroup['groupID'],
                'type' => 'request',
            ]);
        }

        // บันทึก tag ที่ชื่อไม่ซ้ำกัน ลงใน tagModel และเก็บกลุ่มกับแท็กของกลุ่ม ลงใน groupTagModel
        foreach ($selectedTags as $tagName) {
            $tag = TagModel::firstOrCreate(['name' => $tagName]);
            GroupTagModel::create([
                'groupID' => $createGroup['id'],
                'tagID' => $tag->id,
                'type' => 'hobby'
            ]);
        }

        // ดึงไอดีของวันจาก DayModel และสุ่มเก็บ id กลุ่มและ id วันเพื่อเชื่อมวันกลับกลุ่มใน GroupDayModel
        $days = DayModel::pluck('id')->toArray();

        $selectedDays = array_unique($this->faker->randomElements($days, $this->faker->numberBetween(1, count($days))));

        foreach ($selectedDays as $day) {
            $dayModel = DayModel::find($day);
            if ($dayModel) {
                GroupDayModel::create([
                    'groupID' => $createGroup['id'],
                    'dayID' => $dayModel->id,
                ]);
            }
        }

        return $hobby;

    }

    // public function randdays()
    // {
    //     $days = ['จ.', 'อ.', 'พ.', 'พฤ.', 'ศ.', 'ส.', 'อา.'];
    //     $index = rand(1, 7);
    //     $array = array();
    //     for ($each = 7 - $index; $each < 7; $each++) {
    //         $array[] = $days[$each];
    //     }
    //     return implode(',', $array);
    // }

    // public function randusers($userID, $memberMax)
    // {
    //     $array = array();
    //     if ($memberMax > 1) {
    //         for ($each = 0; $each < $memberMax - 1; $each++) {
    //             $index = rand($each, $memberMax);
    //             if (!empty($userID[$index]) && $userID[$index] != null) {
    //                 $array[] = $userID[$index];
    //                 unset($userID[$index]);
    //             }
    //         }
    //         if (sizeof($array) > 0) {
    //             return ',' . implode(',', $array);
    //         }
    //     }
    // }

    public function idGeneration() {
        $prefix = 'h-' . now()->format('Ymd') . '-';
        $sets = 3; 
        $numbersPerSet = 1000; 

        $allNumbers = [];
        for ($i = 0; $i < $sets; $i++) {
            $numbers = range(1, 100);
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

    // public static function groupIdGenerator() {
    //     $prefix = 'g-' . now()->format('Ymd') . '-';
    //     $sets = 5; 
    //     $numbersPerSet = 1000; 

    //     $allNumbers = [];
    //     for ($i = 0; $i < $sets; $i++) {
    //         $numbers = range(1, 10000);
    //         shuffle($numbers);
    //         $allNumbers[] = array_slice($numbers, 0, $numbersPerSet);
    //     }

    //     $randomSet = $allNumbers[array_rand($allNumbers)];
    //     $id = $randomSet[array_rand($randomSet)];

    //     // Ensure the ID is unique
    //     while (in_array($id, self::$generatedIds)) {
    //         $id = $randomSet[array_rand($randomSet)];
    //     }
    //     $id = str_pad($id, 5, '0', STR_PAD_LEFT);
    //     self::$generatedIds[] = $id;
    //     return $prefix.$id;
    // }
}
