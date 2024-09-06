<?php

namespace Database\Factories;

use Illuminate\Database\Eloquent\Factories\Factory;
use App\Models\HobbyModel;
use App\Models\UserModel;

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

        $userIDs = UserModel::pluck('uID')->toArray(); // Get all uID
        $leader = $this->faker->randomElement($userIDs);
        $memberMax = $this->faker->numberBetween(1, 99); // Real Max: 99
        $memberRand = rand(1,$memberMax);
        $members = $this->faker->randomElements(array_diff($userIDs, [$leader]), $memberRand-1);
        $selectedTags = $this->faker->randomElements($tags, $this->faker->numberBetween(1, 5));
        return [
            'hID' => $this->idGeneration(),
            'type' => $this->faker->randomElement(['hobby', 'tutoring', 'library']),
            'tag' => implode(',', $selectedTags),
            'leader' => $leader,
            'member' => implode(',', array_merge([$leader], $members)),
            'memberCount' => count($members) + 1, // +1 for the leader
            'memberMax' => $this->faker->randomElement([$memberMax, null]),
            'activityName' => $this->faker->randomElement($activityNames),
            'weekDate' => $this->randdays(),
            'actTime' => $this->faker->dateTime(),
            'createdBy' => $this->faker->randomElement(array_merge([$leader], $members)),
            'location' => $this->faker->randomElement($locations),
            'detail' => $this->faker->randomElement($details),
        ];
    }

    public function randdays()
    {
        $days = ['จ.', 'อ.', 'พ.', 'พฤ.', 'ศ.', 'ส.', 'อา.'];
        $index = rand(1, 7);
        $array = array();
        for ($each = 7 - $index; $each < 7; $each++) {
            $array[] = $days[$each];
        }
        return implode(',', $array);
    }

    public function randusers($userID, $memberMax)
    {
        $array = array();
        if ($memberMax > 1) {
            for ($each = 0; $each < $memberMax - 1; $each++) {
                $index = rand($each, $memberMax);
                if (!empty($userID[$index]) && $userID[$index] != null) {
                    $array[] = $userID[$index];
                    unset($userID[$index]);
                }
            }
            if (sizeof($array) > 0) {
                return ',' . implode(',', $array);
            }
        }
    }

    public function idGeneration()
    {
        $prefix = 'h-' . now()->format('Ymd') . '-';
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
