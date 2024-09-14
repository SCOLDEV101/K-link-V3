<?php

namespace Database\Factories;

use Illuminate\Database\Eloquent\Factories\Factory;
use App\Models\LibraryModel;
use App\Models\UserModel;
use App\Models\FacultyModel;
use App\Models\MajorModel;
use App\Models\DepartmentModel;
use App\Models\GroupModel;
use App\Models\TagModel;
use App\Models\GroupTagModel;
use App\Models\BookmarkModel;

/**
 * @extends \Illuminate\Database\Eloquent\Factories\Factory<\App\Models\LibraryModel>
 */
class LibraryModelFactory extends Factory
{
    public static $generatedIds = [];

    public function definition(): array
    {

        $tags = [
            'Computer Science (วิทยาการคอมพิวเตอร์)', 'Data Science (วิทยาศาสตร์ข้อมูล)', 'Cybersecurity (ความมั่นคงปลอดภัยไซเบอร์)', 'Software Engineering (วิศวกรรมซอฟต์แวร์)', 'Artificial Intelligence (ปัญญาประดิษฐ์)',
            'Machine Learning (การเรียนรู้ของเครื่อง)', 'Network Systems (ระบบเครือข่าย)', 'Database Management (การจัดการฐานข้อมูล)', 'Web Development (การพัฒนาเว็บ)', 'Human-Computer Interaction (การมีปฏิสัมพันธ์ระหว่างมนุษย์และคอมพิวเตอร์)',
            'Project Management (การจัดการโครงการ)', 'Digital Systems (ระบบดิจิทัล)', 'Embedded Systems (ระบบฝังตัว)', 'Information Systems (ระบบสารสนเทศ)', 'Software Development (การพัฒนาซอฟต์แวร์)', 'Computer Graphics (กราฟิกคอมพิวเตอร์)',
            'Operating Systems (ระบบปฏิบัติการ)', 'Algorithms (อัลกอริธึม)', 'Computer Networks (เครือข่ายคอมพิวเตอร์)', 'Data Analysis (การวิเคราะห์ข้อมูล)', 'Software Architecture (สถาปัตยกรรมซอฟต์แวร์)', 'Information Security (ความปลอดภัยของข้อมูล)',
        ];
        
        $activityNames = [
            'Introduction to Computer Science (การแนะนำวิทยาการคอมพิวเตอร์)', 'Advanced Data Analytics (การวิเคราะห์ข้อมูลขั้นสูง)', 'Network Security Fundamentals (พื้นฐานความมั่นคงปลอดภัยเครือข่าย)', 'Software Design Patterns (รูปแบบการออกแบบซอฟต์แวร์)', 'AI and Machine Learning (ปัญญาประดิษฐ์และการเรียนรู้ของเครื่อง)',
            'Web Programming (การเขียนโปรแกรมเว็บ)', 'Database Theory (ทฤษฎีฐานข้อมูล)', 'Embedded Systems Design (การออกแบบระบบฝังตัว)', 'Human-Computer Interaction Principles (หลักการมีปฏิสัมพันธ์ระหว่างมนุษย์และคอมพิวเตอร์)', 'Project Management in IT (การจัดการโครงการในเทคโนโลยีสารสนเทศ)',
            'Digital Signal Processing (การประมวลผลสัญญาณดิจิทัล)', 'Systems Programming (การเขียนโปรแกรมระบบ)', 'Computer Vision (การมองเห็นของคอมพิวเตอร์)', 'Cloud Computing (การประมวลผลคลาวด์)', 'Software Testing and Quality Assurance (การทดสอบซอฟต์แวร์และการรับรองคุณภาพ)',
            'Big Data Technologies (เทคโนโลยีบิ๊กดาต้า)', 'Information Retrieval (การดึงข้อมูล)', 'Cybersecurity Techniques (เทคนิคการรักษาความปลอดภัยไซเบอร์)', 'Advanced Software Engineering (วิศวกรรมซอฟต์แวร์ขั้นสูง)', 'Ethical Hacking (การแฮกอย่างมีจริยธรรม)',
        ];
        
        
        $locations = [
            'คณะวิทยาการคอมพิวเตอร์ มหาวิทยาลัยธรรมศาสตร์', 'สถาบันวิทยาศาสตร์ข้อมูล มหาวิทยาลัยเชียงใหม่', 'ศูนย์การศึกษาเทคโนโลยีสารสนเทศ มหาวิทยาลัยมหิดล', 'สถาบันวิจัยความมั่นคงไซเบอร์ มหาวิทยาลัยเกษตรศาสตร์', 'คณะวิศวกรรมศาสตร์ มหาวิทยาลัยขอนแก่น',
            'ศูนย์การเรียนรู้เทคโนโลยี มหาวิทยาลัยธรรมศาสตร์', 'โรงเรียนวิทยาการคอมพิวเตอร์ มหาวิทยาลัยสยาม', 'คณะเทคโนโลยีสารสนเทศ มหาวิทยาลัยราชภัฏ', 'ศูนย์วิจัยปัญญาประดิษฐ์ มหาวิทยาลัยกรุงเทพ', 'สถาบันการพัฒนาซอฟต์แวร์ มหาวิทยาลัยศิลปากร',
            'โรงเรียนซอฟต์แวร์ มหาวิทยาลัยรังสิต', 'ศูนย์การศึกษาเทคโนโลยีคลาวด์ มหาวิทยาลัยกรุงเทพธนบุรี', 'คณะเทคโนโลยีสารสนเทศ มหาวิทยาลัยพายัพ', 'สถาบันวิจัยและพัฒนาระบบดิจิทัล มหาวิทยาลัยราชภัฏพระนคร', 'ศูนย์การเรียนรู้ข้อมูลใหญ่ มหาวิทยาลัยพะเยา',
            'คณะวิศวกรรมซอฟต์แวร์ มหาวิทยาลัยกรุงเทพ', 'โรงเรียนวิศวกรรมคอมพิวเตอร์ มหาวิทยาลัยหอการค้าไทย', 'ศูนย์การเรียนรู้เทคโนโลยีสารสนเทศ มหาวิทยาลัยเทคโนโลยีพระจอมเกล้าธนบุรี', 'สถาบันวิจัยและพัฒนาซอฟต์แวร์ มหาวิทยาลัยบูรพา', 'คณะวิทยาการคอมพิวเตอร์ มหาวิทยาลัยราชภัฏเชียงใหม่',
        ];
        
        $details = [
            'Course Enrollment Information (ข้อมูลการลงทะเบียนวิชา)', 'Training Details (รายละเอียดการอบรม)', 'Course Prerequisites (ข้อกำหนดของวิชา)', 'Registration Information (ข้อมูลการลงทะเบียน)', 'Course Outline (รายละเอียดของวิชา)',
            'Classroom Location (สถานที่เรียน)', 'Instructor Information (ข้อมูลผู้สอน)', 'Preparation for Class (การเตรียมตัวสำหรับวิชา)', 'Additional Information (ข้อมูลเพิ่มเติม)', 'Participation Guidelines (คำแนะนำในการเข้าร่วม)',
            'Important Notes (หมายเหตุสำคัญ)', 'Lecture Information (ข้อมูลการบรรยาย)', 'Participation Requirements (ข้อกำหนดในการเข้าร่วม)', 'Class Details (รายละเอียดวิชา)', 'Training Information (ข้อมูลการฝึกอบรม)', 'Document Preparation Guidelines (ข้อแนะนำในการเตรียมเอกสาร)',
            'Advance Registration Details (ข้อมูลการลงทะเบียนล่วงหน้า)', 'Instructor Details (รายละเอียดเกี่ยวกับผู้สอน)', 'Terms and Conditions (ข้อกำหนดและเงื่อนไข)', 'Contact Information for Inquiries (ข้อมูลติดต่อสำหรับการสอบถาม)', 'Logistics Management (ข้อมูลการจัดการด้านโลจิสติกส์)',
            'Event Details (รายละเอียดการจัดงาน)', 'Research Conference Information (ข้อมูลเกี่ยวกับการประชุมวิจัย)', 'Participation Requirements for Conference (ข้อกำหนดสำหรับการเข้าร่วมประชุม)', 'Important Information for Students (ข้อมูลสำคัญสำหรับนักศึกษา)', 'Special Training Details (รายละเอียดเกี่ยวกับการอบรมพิเศษ)',
            'Registration Information (ข้อมูลการลงทะเบียนเข้าร่วม)', 'Service Terms and Conditions (ข้อกำหนดการใช้บริการ)', 'Special Activity Details (รายละเอียดกิจกรรมพิเศษ)',
        ];
        
        $userID = UserModel::pluck('id')->toArray(); // เอารายชื่อ user ออกมา
        $createdBy = $this->faker->randomElement($userID); // สุ่มเอา 1 user เป็น leader

        $selectedTags = $this->faker->randomElements($tags, $this->faker->numberBetween(1, 5)); // สุ่มให้จำนวนแท็กมี 1-5 แท็ก

        // Fetch random facultyID
        $facultyIDs = FacultyModel::pluck('id')->toArray();
        $facultyID =  $this->faker->randomElement($facultyIDs);

        // Fetch majorIDs associated with the selected facultyID
        $majorIDs = MajorModel::where('facultyID', $facultyID)->pluck('id')->toArray();
        $majorID = $this->faker->randomElement($majorIDs);

        // Fetch departmentIDs associated with the selected majorID
        $departmentIDs = DepartmentModel::where('majorID', $majorID)->pluck('id')->toArray();
        $departmentID = $this->faker->randomElement($departmentIDs);

        $library = [
            'id' => $this->idGeneration(),
            'facultyID' => $facultyID,
            'majorID' => $majorID,
            'departmentID' => $departmentID,
            'imageOrFileID' => $this->faker->randomElement([9,10]),
            'name' => $this->faker->randomElement($activityNames),
            'detail' => $this->faker->randomElement($details),
            'createdBy' => $createdBy,
            'download' => $this->faker->numberBetween(0,9999)
        ];

        // เก็บ id กลุ่มและประเภท ลงใน groupModel โดย groupModel จะเป็นตัวเชื่อมไอดีของกลุ่มและโพสต์ทั้งหมดเพื่อแสดงรายละเอียด
        GroupModel::create([
            'groupID' => $library['id'],
            'type' => 'library',
        ]);

        // บันทึก tag ที่ชื่อไม่ซ้ำกัน ลงใน tagModel และเก็บกลุ่มกับแท็กของกลุ่ม ลงใน groupTagModel
        foreach ($selectedTags as $tagName) {
            $tag = TagModel::firstOrCreate(['name' => $tagName]);
            GroupTagModel::create([
                'groupID' => $library['id'],
                'tagID' => $tag->id,
                'type' => 'library'
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
        //             'groupID' => $library['id'],
        //             'dayID' => $dayModel->id,
        //         ]);
        //     }
        // }

        return $library;

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
        $prefix = 'l-' . now()->format('Ymd') . '-';
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
