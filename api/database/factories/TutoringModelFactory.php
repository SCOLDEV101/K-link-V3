<?php

namespace Database\Factories;

use Illuminate\Database\Eloquent\Factories\Factory;
use App\Models\TutoringModel;
use App\Models\UserModel;
use App\Models\TagModel;
use App\Models\GroupTagModel;
use App\Models\GroupModel;
use App\Models\MemberModel;
use App\Models\RequestModel;
use App\Models\DepartmentModel;
use App\Models\MajorModel;
use App\Models\FacultyModel;
use Illuminate\Support\Facades\Log;

/**
 * @extends \Illuminate\Database\Eloquent\Factories\Factory<\App\Models\TutoringModel>
 */
class TutoringModelFactory extends Factory
{
    public static $generatedIds = [];

    public function definition(): array
    {

        $tags = [
            'เทคโนโลยีสารสนเทศ', 'การประชุมเชิงปฏิบัติการ', 'การอบรมความปลอดภัย', 'การสัมมนาเชิงวิจัย', 'การเรียนรู้ดิจิทัล', 'การฝึกอบรมทางวิศวกรรม', 'การประชุมระดับนานาชาติ', 'งานแสดงศิลปะ', 'การพัฒนาองค์กร', 'การจัดการโครงการ',
            'การสัมมนานานาชาติ', 'การฝึกอบรมการตลาด', 'การประชุมสหวิชาชีพ', 'กิจกรรมสร้างสรรค์', 'งานวิจัยและพัฒนา', 'การศึกษาออนไลน์', 'การพัฒนาเทคโนโลยีสารสนเทศ', 'การฝึกอบรมผู้นำ', 'การพัฒนาทักษะทางวิชาชีพ', 'การประชุมสัมมนา',
            'การประชุมวิจัยเชิงลึก', 'การอบรมเชิงปฏิบัติการทางการศึกษา', 'การจัดการข้อมูลเชิงลึก', 'การสัมมนาสำหรับนักวิจัย', 'การประชุมวิชาการระดับโลก', 'การอบรมการจัดการโครงการ', 'การพัฒนาผลิตภัณฑ์', 'การสัมมนาการศึกษา', 'การประชุมทางวิทยาศาสตร์', 'การจัดการความเสี่ยง',
        ];
        
        $activityNames = [
            'การแข่งขันระดับชาติ', 'งานแสดงนวัตกรรม', 'การอบรมวิศวกรรมศาสตร์', 'การประชุมเทคโนโลยีสารสนเทศ', 'งานสัมมนาวิทยาศาสตร์', 'การอบรมด้านการเงิน', 'การประชุมการพัฒนาองค์กร', 'กิจกรรมสร้างเครือข่าย', 'การฝึกอบรมเทคโนโลยี', 'การประชุมการศึกษา',
            'การประชุมเทคนิค', 'การสัมมนาการตลาด', 'งานแสดงงานวิจัย', 'การฝึกอบรมผู้บริหาร', 'การอบรมด้านสุขภาพ', 'การจัดการความรู้', 'การประชุมวิจัยการศึกษา', 'กิจกรรมด้านการฝึกอบรม', 'งานสัมมนานานาชาติ', 'การอบรมด้านวิทยาศาสตร์',
            'งานแสดงนวัตกรรม', 'การฝึกอบรมการจัดการ', 'การประชุมด้านอุตสาหกรรม', 'การอบรมด้านความปลอดภัย', 'การสัมมนาสำหรับนักธุรกิจ', 'การประชุมเทคนิคขั้นสูง', 'การศึกษาเชิงปฏิบัติการ', 'การอบรมระดับโลก', 'การประชุมวิจัยเฉพาะด้าน', 'การสัมมนาวิชาการ',
        ];
        
        $locations = [
            'มหาวิทยาลัยธรรมศาสตร์', 'ศูนย์วิจัยทางวิทยาศาสตร์', 'สถาบันการศึกษานานาชาติ', 'ศูนย์ประชุมแห่งชาติ', 'มหาวิทยาลัยเกษตรศาสตร์', 'ศูนย์การค้าเซ็นทรัลเวิลด์', 'โรงแรมพัทยา', 'หอประชุมมหาวิทยาลัยเชียงใหม่', 'ศูนย์การค้าเมเจอร์', 'โรงแรมแกรนด์รอยัล',
            'ห้องประชุมอาคารเรียน', 'ศูนย์การค้าเดอะมอลล์', 'มหาวิทยาลัยมหิดล', 'ศูนย์การค้าสยามสแควร์', 'โรงแรมหรู', 'ศูนย์การค้าโรบินสัน', 'หอประชุมมหาวิทยาลัยขอนแก่น', 'โรงแรมสตาร์', 'ศูนย์การค้าพารากอน', 'หอประชุมจุฬาฯ',
            'ศูนย์การค้าเอ็มโพเรียม', 'โรงแรมแกรนด์เพรสทีจ', 'ศูนย์การค้าพระรามเก้า', 'มหาวิทยาลัยราชภัฏ', 'ศูนย์ประชุมเซ็นทรัลลาดกระบัง', 'ศูนย์การค้าฟอร์จูน', 'โรงแรมปริ้นซ์', 'ศูนย์การค้าไอทีสแควร์', 'หอประชุมมทร.', 'ศูนย์การค้าแฟชั่นไอส์แลนด์',
        ];
        
        $details = [
            'ข้อมูลการเข้าร่วมงาน', 'รายละเอียดการอบรม', 'ข้อกำหนดการประชุม', 'ข้อมูลการลงทะเบียน', 'รายละเอียดของงาน', 'แผนที่สถานที่', 'ข้อมูลวิทยากร', 'การเตรียมตัวสำหรับงาน', 'รายละเอียดเพิ่มเติม', 'คำแนะนำในการเข้าร่วม',
            'หมายเหตุสำคัญ', 'ข้อมูลการบรรยาย', 'ข้อกำหนดในการเข้าร่วม', 'รายละเอียดการประชุม', 'ข้อมูลการฝึกอบรม', 'ข้อแนะนำในการเตรียมเอกสาร', 'ข้อมูลการลงทะเบียนล่วงหน้า', 'รายละเอียดเกี่ยวกับวิทยากร', 'ข้อกำหนดและเงื่อนไข', 'ข้อมูลติดต่อสำหรับการสอบถาม',
            'ข้อมูลการจัดการด้านโลจิสติกส์', 'รายละเอียดการจัดงาน', 'ข้อมูลเกี่ยวกับการประชุมวิจัย', 'ข้อกำหนดสำหรับการเข้าร่วมประชุม', 'ข้อมูลสำคัญสำหรับผู้เข้าร่วม', 'การจัดการความเสี่ยง', 'รายละเอียดเกี่ยวกับการอบรมพิเศษ', 'ข้อมูลการลงทะเบียนเข้าร่วม', 'ข้อกำหนดการใช้บริการ', 'รายละเอียดกิจกรรมพิเศษ',
        ];
        
        $userID = UserModel::pluck('id')->toArray(); // เอารายชื่อ user ออกมา
        $leader = $this->faker->randomElement($userID); // สุ่มเอา 1 user เป็น leader

        $memberMax = $this->faker->numberBetween(1, 99); // Real Max: 99, จำนวนสมาชิกที่มีได้
        $memberRand = rand(1, $memberMax); // สุ่มจำนวนสมาชิกกลุ่ม

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

        // Fetch random facultyID
        $facultyIDs = FacultyModel::pluck('id')->toArray();
        $facultyID =  $this->faker->randomElement($facultyIDs);

        // Fetch majorIDs associated with the selected facultyID
        $majorIDs = MajorModel::where('facultyID', $facultyID)->pluck('id')->toArray();
        $majorID = $this->faker->randomElement($majorIDs);

        // Fetch departmentIDs associated with the selected majorID
        $departmentIDs = DepartmentModel::where('majorID', $majorID)->pluck('id')->toArray();
        $departmentID = $this->faker->randomElement($departmentIDs);

        $tutoring = [
            'id' => $this->idGeneration(),
            'facultyID' => $facultyID,
            'majorID' => $majorID,
            'departmentID' => $departmentID,
            'imageOrFileID' => $this->faker->randomElement([3,4,5]),
            'name' => $this->faker->randomElement($activityNames),
            'memberMax' => $this->faker->randomElement([$memberMax, null]),
            'location' => $this->faker->randomElement($locations),
            'detail' => $this->faker->randomElement($details),
            'startTime' => $startTime,
            'endTime' => $endTime,
            'date' =>$this->faker->date(),
            'leader' => $leader,
            'createdBy' => $this->faker->randomElement(array_merge([$leader], $members)),
        ];

        // เก็บ id กลุ่มและประเภท ลงใน groupModel โดย groupModel จะเป็นตัวเชื่อมไอดีของกลุ่มและโพสต์ทั้งหมดเพื่อแสดงรายละเอียด
        GroupModel::create([
            'groupID' => $tutoring['id'],
            'type' => 'tutoring',
        ]);

        // สุ่มสมาชิก โดยเก็บ userID เป็น id ใน members Array
        MemberModel::create([
            'groupID' => $tutoring['id'],
            'userID' => $leader,
        ]);
        foreach ($members as $member) {
            MemberModel::create([
                'groupID' => $tutoring['id'],
                'userID' => $member,
            ]);
        }

        // สุ่ม requeset โดยเก็บ userID เป็น id ใน requests Array ซึ่งเป็นส่วนเหลือจากสมาชิกและหัวหน้า
        foreach ($requests as $request) {
            RequestModel::create([
                'groupID' => $tutoring['id'],
                'userID' => $request,
            ]);
        }

        // บันทึก tag ที่ชื่อไม่ซ้ำกัน ลงใน tagModel และเก็บกลุ่มกับแท็กของกลุ่ม ลงใน groupTagModel
        foreach ($selectedTags as $tagName) {
            $tag = TagModel::firstOrCreate(['name' => $tagName]);
            GroupTagModel::create([
                'groupID' => $tutoring['id'],
                'tagID' => $tag->id,
                'type' => 'tutoring'
            ]);
        }

        //**** ตรงนี้ไม่ใช้ ส่ง date ให้หน้าบ้านแปลงเป็นวันแทน เพราะกลุ่มติวเป็นกลุ่มที่จัดวันต่อวัน ไม่ใช่ประจำวันเหมือน hobby ป่ะ?  */
        // // ดึงไอดีของวันจาก DayModel และสุ่มเก็บ id กลุ่มและ id วันเพื่อเชื่อมวันกลับกลุ่มใน GroupDayModel
        // $days = DayModel::pluck('id')->toArray();

        // $selectedDays = array_unique($this->faker->randomElements($days, $this->faker->numberBetween(1, count($days))));

        // foreach ($selectedDays as $day) {
        //     $dayModel = DayModel::find($day);
        //     if ($dayModel) {
        //         GroupDayModel::create([
        //             'groupID' => $tutoring['id'],
        //             'dayID' => $dayModel->id,
        //         ]);
        //     }
        // }

        return $tutoring;

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

    public function idGeneration()
    {
        $prefix = 't-' . now()->format('Ymd') . '-';
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
}
