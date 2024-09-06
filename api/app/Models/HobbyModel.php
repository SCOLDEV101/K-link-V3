<?php

namespace App\Models;

use Illuminate\Database\Eloquent\Factories\HasFactory;
use Illuminate\Database\Eloquent\Model;
use Illuminate\Database\Eloquent\Relations\BelongsTo;
use Illuminate\Database\Eloquent\Relations\HasMany;
use Illuminate\Database\Eloquent\Relations\HasOne;
class HobbyModel extends Model
{
    public static $HobbyStaticGroup = [
        ['hID'=>'h-20240801-001','type' => 'hobby', 'activityName' => 'เปตองหรรษา', 'weekDate' => 'พฤ.,ศ.', 'actTime' => '16:30:00', 'memberCount' => 3, 'memberMax' => 10, 'member'=> '65010111,65010222,65010555', 'memberRequest'=> '65010333', 'location'=>'ยิมเนเซียม 1 วิศวะ', 'image'=> null, 'detail'=> 'มาเล่นเปตองกัน', 'tag'=> 'เปตอง,ตอนเย็น,ยิมเนเซียม1,วิศวะ', 'createdBy' => '65010111', 'leader' => '65010111'],
        ['hID'=>'h-20240802-002','type' => 'hobby', 'activityName' => 'กะเพราถาด', 'weekDate' => 'จ.,อ.,พ.,พฤ.,ศ.', 'actTime' => '20:00:00', 'memberCount' => 2, 'memberMax' => 25, 'member'=> '65010222,65010333', 'memberRequest'=> '65010111,65010444', 'location'=>'หน้า Tops', 'image'=> null, 'detail'=> 'หลังเลิกเรียนไปแวะกะเพราถาดกัน', 'tag'=> 'มื้อเย็น,กินข้าว', 'createdBy' => '65010222', 'leader' => '65010222'],
        ['hID'=>'h-20240803-003','type' => 'hobby', 'activityName' => 'เที่ยววันหยุด', 'weekDate' => 'ส.,อา.', 'actTime' => '13:00:00', 'memberCount' => 1, 'memberMax' => 5, 'member'=> '65010555', 'memberRequest'=> null, 'location'=>'หน้าป้ายคณะวิศวะ', 'image'=> null, 'detail'=> 'ไปเดินห้างกันดีกว่า', 'tag'=> 'วันหยุด,เที่ยว,วิศวะ', 'createdBy' => '65010555', 'leader' => '65010555'],
        ['hID'=>'h-20240804-004','type' => 'hobby', 'activityName' => 'ถ่ายรูปสวยๆ', 'weekDate' => 'จ.,พ.,ศ.', 'actTime' => '17:00:00', 'memberCount' => 4, 'memberMax' => 10, 'member'=> '65010111,65010222,65010444,65010555', 'memberRequest'=> '65010333', 'location'=>'หน้า Lawson', 'image'=> null, 'detail'=> 'หาวิวถ่ายรูปสวยๆ และศึกษาเทคนิคการถ่ายรูป', 'tag'=> 'ถ่ายรูป,คณะวิทย์', 'createdBy' => '65010444', 'leader' => '65010444'],
        ['hID'=>'h-20240805-005','type' => 'hobby', 'activityName' => 'บอร์ดเกมวุ่นวาย', 'weekDate' => 'จ.,พ.,ศ.,ส.,อา.', 'actTime' => '16:00:00', 'memberCount' => 3, 'memberMax' => null, 'member'=> '65010444,65010222,65010555', 'memberRequest'=> '65010111,65010333', 'location'=>'อาคาร 12 ชั้น ห้อง 1214', 'image'=> null, 'detail'=> 'เล่นบอร์ดเกมคลายเครียด', 'tag'=> 'ตอนเย็น,ตึกโหล,วิศวะ', 'createdBy' => '65010333', 'leader' => '65010333'],
        ['hID'=>'h-20240806-006','type' => 'hobby', 'activityName' => 'เซียน DIY', 'weekDate' => 'อา.', 'actTime' => '19:00:00', 'memberCount' => 5, 'memberMax' => null, 'member'=> '65010111,65010222,65010333,65010444,65010555', 'memberRequest'=> null, 'location'=>'ตึกโหล 404', 'image'=> null, 'detail'=> 'มาทำงาน DIY ในวันว่างๆ พูดคุยแลกเปลี่ยนไอเดีย', 'tag'=> 'ตึกโหล,วันหยุด,วิศวะ', 'createdBy' => '65010555', 'leader' => '65010555'],
        ['hID'=>'h-20240807-007','type' => 'hobby', 'activityName' => 'เทพเจ้า Coding', 'weekDate' => 'ศ.,สา.', 'actTime' => '18:30:00', 'memberCount' => 4, 'memberMax' => 5, 'member'=> '65010222,65010333,65010444,65010555', 'memberRequest'=> '65010333', 'location'=>'หน้าตึกพระเทพฯ', 'image'=> null, 'detail'=> 'ศึกษาการเขียนโค้ดกับเพื่อนๆที่สนใจ', 'tag'=> 'พระเทพฯ,ตอนเย็น,coding', 'createdBy' => '65010444', 'leader' => '65010444'],
        ['hID'=>'h-20240808-008','type' => 'hobby', 'activityName' => 'หางาน หาเงิน', 'weekDate' => 'สา.', 'actTime' => '08:30:00', 'memberCount' => 5, 'memberMax' => 5, 'member'=> '65010111,65010222,65010333,65010444,65010555', 'memberRequest'=> null, 'location'=>'เรื่อนพักคอยที่หอใน', 'image'=> null, 'detail'=> 'มาคุยกัน หารายได้เพิ่มเติม', 'tag'=> 'หอใน,part-time', 'createdBy' => '65010333', 'leader' => '65010333'],
        ['hID'=>'h-20240809-009','type' => 'hobby', 'activityName' => 'ฟุตบอลทีมชาติ', 'weekDate' => 'จ.,พ.,ศ.', 'actTime' => '16:30:00', 'memberCount' => 1, 'memberMax' => null, 'member'=> '65010555', 'memberRequest'=> '65010111,65010222,65010333', 'location'=>'สนามกีฬา', 'image'=> null, 'detail'=> 'เล่นบอล เป้าหมายไปทีมชาติ', 'tag'=> 'ฟุตบอบ,กีฬา,สนามกีฬา,วิศวะ', 'createdBy' => '65010555', 'leader' => '65010555'],
        ['hID'=>'h-20240810-010','type' => 'hobby', 'activityName' => 'แบดมินตันกลางแจ้ง', 'weekDate' => 'จ.,พ.,ศ.', 'actTime' => '17:00:00', 'memberCount' => 1, 'memberMax' => 30, 'member'=> '65010333', 'memberRequest'=> '65010222,65010555', 'location'=>'สนามกีฬา', 'image'=> null, 'detail'=> 'เล่นแบดเพื่อคลายเครียด', 'tag'=> 'แบดมินตัน,สนามกีฬา,ออกกำลังกาย,ตอนเย็น', 'createdBy' => '65010333', 'leader' => '65010333'],
        ['hID'=>'h-20240811-011','type' => 'hobby', 'activityName' => 'นักพฤกษศาสตร์ฝึกหัด', 'weekDate' => 'จ.,อ.,พ.,พฤ.,ศ.', 'actTime' => '15:30:00', 'memberCount' => 5, 'memberMax' => 5, 'member'=> '65010111,65010222,65010333,65010444,65010555', 'memberRequest'=> null, 'location'=>'คณะวิทย์', 'image'=> null, 'detail'=> 'ศึกษา ปลูก และดูแลพันธ์ุไม้ที่น่าสนใจ', 'tag'=> 'คณะวิทย์,ชีวะ', 'createdBy' => '65010111', 'leader' => '65010111'],
        ['hID'=>'h-20240812-012','type' => 'hobby', 'activityName' => 'วิเคราะห์มังงะ อนิเมะ', 'weekDate' => 'ส.,อา.', 'actTime' => '19:00:00', 'memberCount' => 3, 'memberMax' => 5, 'member'=> '65010111,65010444,65010555', 'memberRequest'=> '65010333', 'location'=>'ตึกโหล 1006', 'image'=> null, 'detail'=> 'คุยมากเรื่องมังงะ อนิเมะ', 'tag'=> 'อนิเมะ,วันหยุด', 'createdBy' => '65010111', 'leader' => '65010111'],
        ['hID'=>'h-20240801-013','type' => 'tutoring', 'activityName' => 'ติวเปตอง', 'weekDate' => 'พฤ.,ศ.', 'actTime' => '16:30:00', 'memberCount' => 3, 'memberMax' => 10, 'member'=> '65010111,65010222,65010555', 'memberRequest'=> '65010333', 'location'=>'ยิมเนเซียม 1 วิศวะ', 'image'=> null, 'detail'=> 'มาฝึกเล่นเปตองกัน', 'tag'=> 'เปตอง,ตอนเย็น,ยิมเนเซียม1,วิศวะ', 'createdBy' => '65010111', 'leader' => '65010111'],
        ['hID'=>'h-20240802-014','type' => 'tutoring', 'activityName' => 'ติวทำอาหาร', 'weekDate' => 'จ.,อ.,พ.,พฤ.,ศ.', 'actTime' => '20:00:00', 'memberCount' => 2, 'memberMax' => 25, 'member'=> '65010222,65010333', 'memberRequest'=> '65010111,65010444', 'location'=>'หน้า Tops', 'image'=> null, 'detail'=> 'เรียนรู้การทำอาหารจานเด็ดหลังเลิกเรียน', 'tag'=> 'ทำอาหาร,มื้อเย็น,หน้า Tops', 'createdBy' => '65010222', 'leader' => '65010222'],
        ['hID'=>'h-20240803-015','type' => 'tutoring', 'activityName' => 'ติวเที่ยววันหยุด', 'weekDate' => 'ส.,อา.', 'actTime' => '13:00:00', 'memberCount' => 1, 'memberMax' => 5, 'member'=> '65010555', 'memberRequest'=> null, 'location'=>'หน้าป้ายคณะวิศวะ', 'image'=> null, 'detail'=> 'ไปศึกษาสถานที่ท่องเที่ยวกันดีกว่า', 'tag'=> 'วันหยุด,เที่ยว,วิศวะ', 'createdBy' => '65010555', 'leader' => '65010555'],
        ['hID'=>'h-20240804-016','type' => 'tutoring', 'activityName' => 'ติวถ่ายรูป', 'weekDate' => 'จ.,พ.,ศ.', 'actTime' => '17:00:00', 'memberCount' => 4, 'memberMax' => 10, 'member'=> '65010111,65010222,65010444,65010555', 'memberRequest'=> '65010333', 'location'=>'หน้า Lawson', 'image'=> null, 'detail'=> 'เรียนรู้เทคนิคการถ่ายรูปสวยๆ', 'tag'=> 'ถ่ายรูป,คณะวิทย์', 'createdBy' => '65010444', 'leader' => '65010444'],
        ['hID'=>'h-20240805-017','type' => 'tutoring', 'activityName' => 'ติวบอร์ดเกม', 'weekDate' => 'จ.,พ.,ศ.,ส.,อา.', 'actTime' => '16:00:00', 'memberCount' => 3, 'memberMax' => null, 'member'=> '65010444,65010222,65010555', 'memberRequest'=> '65010111,65010333', 'location'=>'อาคาร 12 ชั้น ห้อง 1214', 'image'=> null, 'detail'=> 'เรียนรู้วิธีการเล่นบอร์ดเกม', 'tag'=> 'บอร์ดเกม,ตึกโหล,วิศวะ', 'createdBy' => '65010333', 'leader' => '65010333'],
        ['hID'=>'h-20240806-018','type' => 'tutoring', 'activityName' => 'ติว DIY', 'weekDate' => 'อา.', 'actTime' => '19:00:00', 'memberCount' => 5, 'memberMax' => null, 'member'=> '65010111,65010222,65010333,65010444,65010555', 'memberRequest'=> null, 'location'=>'ตึกโหล 404', 'image'=> null, 'detail'=> 'มาทำงาน DIY และแลกเปลี่ยนไอเดียกัน', 'tag'=> 'DIY,วันหยุด,วิศวะ', 'createdBy' => '65010555', 'leader' => '65010555'],
        ['hID'=>'h-20240807-019','type' => 'tutoring', 'activityName' => 'ติว Coding', 'weekDate' => 'ศ.,ส.', 'actTime' => '18:30:00', 'memberCount' => 4, 'memberMax' => 5, 'member'=> '65010222,65010333,65010444,65010555', 'memberRequest'=> '65010333', 'location'=>'หน้าตึกพระเทพฯ', 'image'=> null, 'detail'=> 'ศึกษาการเขียนโค้ดกับเพื่อนๆที่สนใจ', 'tag'=> 'Coding,พระเทพฯ,ตอนเย็น', 'createdBy' => '65010444', 'leader' => '65010444'],
        ['hID'=>'h-20240808-020','type' => 'tutoring', 'activityName' => 'ติวหางาน', 'weekDate' => 'ส.', 'actTime' => '08:30:00', 'memberCount' => 5, 'memberMax' => 5, 'member'=> '65010111,65010222,65010333,65010444,65010555', 'memberRequest'=> null, 'location'=>'เรือนพักคอยที่หอใน', 'image'=> null, 'detail'=> 'เรียนรู้วิธีหางานพิเศษ', 'tag'=> 'หางาน,part-time,หอใน', 'createdBy' => '65010333', 'leader' => '65010333'],
        ['hID'=>'h-20240809-021','type' => 'tutoring', 'activityName' => 'ติวฟุตบอล', 'weekDate' => 'จ.,พ.,ศ.', 'actTime' => '16:30:00', 'memberCount' => 1, 'memberMax' => null, 'member'=> '65010555', 'memberRequest'=> '65010111,65010222,65010333', 'location'=>'สนามกีฬา', 'image'=> null, 'detail'=> 'ฝึกซ้อมฟุตบอลเพื่อเป้าหมายทีมชาติ', 'tag'=> 'ฟุตบอล,กีฬา,สนามกีฬา,วิศวะ', 'createdBy' => '65010555', 'leader' => '65010555'],
        ['hID'=>'h-20240810-022','type' => 'tutoring', 'activityName' => 'ติวแบดมินตัน', 'weekDate' => 'จ.,พ.,ศ.', 'actTime' => '17:00:00', 'memberCount' => 1, 'memberMax' => 30, 'member'=> '65010333', 'memberRequest'=> '65010222,65010555', 'location'=>'สนามกีฬา', 'image'=> null, 'detail'=> 'เล่นแบดมินตันเพื่อออกกำลังกาย', 'tag'=> 'แบดมินตัน,ออกกำลังกาย,สนามกีฬา', 'createdBy' => '65010333', 'leader' => '65010333'],
        ['hID'=>'h-20240811-023','type' => 'tutoring', 'activityName' => 'ติวพฤกษศาสตร์', 'weekDate' => 'จ.,อ.,พ.,พฤ.,ศ.', 'actTime' => '15:30:00', 'memberCount' => 5, 'memberMax' => 5, 'member'=> '65010111,65010222,65010333,65010444,65010555', 'memberRequest'=> null, 'location'=>'คณะวิทย์', 'image'=> null, 'detail'=> 'ศึกษา ปลูก และดูแลพันธุ์ไม้', 'tag'=> 'พฤกษศาสตร์,คณะวิทย์,ชีวะ', 'createdBy' => '65010111', 'leader' => '65010111'],
        ['hID'=>'h-20240812-024','type' => 'tutoring', 'activityName' => 'ติวมังงะและอนิเมะ', 'weekDate' => 'ส.,อา.', 'actTime' => '19:00:00', 'memberCount' => 3, 'memberMax' => 5, 'member'=> '65010111,65010444,65010555', 'memberRequest'=> '65010333', 'location'=>'ตึกโหล 1006', 'image'=> null, 'detail'=> 'วิเคราะห์และสนทนาเกี่ยวกับมังงะและอนิเมะ', 'tag'=> 'มังงะ,อนิเมะ,วันหยุด,ตึกโหล', 'createdBy' => '65010111', 'leader' => '65010111'],
        ['hID'=>'h-20240801-025','type' => 'library', 'activityName' => 'ห้องสมุดเปตอง', 'weekDate' => 'พฤ.,ศ.', 'actTime' => '16:30:00', 'memberCount' => 3, 'memberMax' => 10, 'member'=> '65010111,65010222,65010555', 'memberRequest'=> '65010333', 'location'=>'ห้องสมุด ยิมเนเซียม 1 วิศวะ', 'image'=> null, 'detail'=> 'อ่านหนังสือเกี่ยวกับเปตอง', 'tag'=> 'เปตอง,ห้องสมุด,ยิมเนเซียม1,วิศวะ', 'createdBy' => '65010111', 'leader' => '65010111'],
        ['hID'=>'h-20240802-026','type' => 'library', 'activityName' => 'ห้องสมุดอาหาร', 'weekDate' => 'จ.,อ.,พ.,พฤ.,ศ.', 'actTime' => '20:00:00', 'memberCount' => 2, 'memberMax' => 25, 'member'=> '65010222,65010333', 'memberRequest'=> '65010111,65010444', 'location'=>'ห้องสมุด หน้า Tops', 'image'=> null, 'detail'=> 'ศึกษาและแลกเปลี่ยนสูตรอาหาร', 'tag'=> 'ทำอาหาร,ห้องสมุด,หน้า Tops', 'createdBy' => '65010222', 'leader' => '65010222'],
        ['hID'=>'h-20240803-027','type' => 'library', 'activityName' => 'ห้องสมุดการท่องเที่ยว', 'weekDate' => 'ส.,อา.', 'actTime' => '13:00:00', 'memberCount' => 1, 'memberMax' => 5, 'member'=> '65010555', 'memberRequest'=> null, 'location'=>'ห้องสมุด หน้าป้ายคณะวิศวะ', 'image'=> null, 'detail'=> 'อ่านหนังสือเกี่ยวกับสถานที่ท่องเที่ยว', 'tag'=> 'การท่องเที่ยว,ห้องสมุด,วิศวะ', 'createdBy' => '65010555', 'leader' => '65010555'],
        ['hID'=>'h-20240804-028','type' => 'library', 'activityName' => 'ห้องสมุดการถ่ายรูป', 'weekDate' => 'จ.,พ.,ศ.', 'actTime' => '17:00:00', 'memberCount' => 4, 'memberMax' => 10, 'member'=> '65010111,65010222,65010444,65010555', 'memberRequest'=> '65010333', 'location'=>'ห้องสมุด หน้า Lawson', 'image'=> null, 'detail'=> 'ศึกษาเทคนิคการถ่ายรูป', 'tag'=> 'ถ่ายรูป,ห้องสมุด,คณะวิทย์', 'createdBy' => '65010444', 'leader' => '65010444'],
        ['hID'=>'h-20240805-029','type' => 'library', 'activityName' => 'ห้องสมุดบอร์ดเกม', 'weekDate' => 'จ.,พ.,ศ.,ส.,อา.', 'actTime' => '16:00:00', 'memberCount' => 3, 'memberMax' => null, 'member'=> '65010444,65010222,65010555', 'memberRequest'=> '65010111,65010333', 'location'=>'ห้องสมุด อาคาร 12 ชั้น ห้อง 1214', 'image'=> null, 'detail'=> 'ศึกษาและเล่นบอร์ดเกม', 'tag'=> 'บอร์ดเกม,ห้องสมุด,ตึกโหล,วิศวะ', 'createdBy' => '65010333', 'leader' => '65010333'],
        ['hID'=>'h-20240806-030','type' => 'library', 'activityName' => 'ห้องสมุด DIY', 'weekDate' => 'อา.', 'actTime' => '19:00:00', 'memberCount' => 5, 'memberMax' => null, 'member'=> '65010111,65010222,65010333,65010444,65010555', 'memberRequest'=> null, 'location'=>'ห้องสมุด ตึกโหล 404', 'image'=> null, 'detail'=> 'แลกเปลี่ยนความรู้เกี่ยวกับงาน DIY', 'tag'=> 'DIY,ห้องสมุด,ตึกโหล,วันหยุด', 'createdBy' => '65010555', 'leader' => '65010555'],
        ['hID'=>'h-20240807-031','type' => 'library', 'activityName' => 'ห้องสมุด Coding', 'weekDate' => 'ศ.,ส.', 'actTime' => '18:30:00', 'memberCount' => 4, 'memberMax' => 5, 'member'=> '65010222,65010333,65010444,65010555', 'memberRequest'=> '65010333', 'location'=>'ห้องสมุด หน้าตึกพระเทพฯ', 'image'=> null, 'detail'=> 'ศึกษาและแลกเปลี่ยนความรู้เกี่ยวกับการเขียนโค้ด', 'tag'=> 'Coding,ห้องสมุด,พระเทพฯ', 'createdBy' => '65010444', 'leader' => '65010444'],
        ['hID'=>'h-20240808-032','type' => 'library', 'activityName' => 'ห้องสมุดการหางาน', 'weekDate' => 'ส.', 'actTime' => '08:30:00', 'memberCount' => 5, 'memberMax' => 5, 'member'=> '65010111,65010222,65010333,65010444,65010555', 'memberRequest'=> null, 'location'=>'ห้องสมุด เรือนพักคอยที่หอใน', 'image'=> null, 'detail'=> 'ศึกษาและแลกเปลี่ยนความรู้เกี่ยวกับการหางาน', 'tag'=> 'หางาน,ห้องสมุด,part-time,หอใน', 'createdBy' => '65010333', 'leader' => '65010333'],
        ['hID'=>'h-20240809-033','type' => 'library', 'activityName' => 'ห้องสมุดฟุตบอล', 'weekDate' => 'จ.,พ.,ศ.', 'actTime' => '16:30:00', 'memberCount' => 1, 'memberMax' => null, 'member'=> '65010555', 'memberRequest'=> '65010111,65010222,65010333', 'location'=>'ห้องสมุด สนามกีฬา', 'image'=> null, 'detail'=> 'ศึกษาและฝึกซ้อมฟุตบอล', 'tag'=> 'ฟุตบอล,ห้องสมุด,สนามกีฬา,วิศวะ', 'createdBy' => '65010555', 'leader' => '65010555'],
        ['hID'=>'h-20240810-034','type' => 'library', 'activityName' => 'ห้องสมุดแบดมินตัน', 'weekDate' => 'จ.,พ.,ศ.', 'actTime' => '17:00:00', 'memberCount' => 1, 'memberMax' => 30, 'member'=> '65010333', 'memberRequest'=> '65010222,65010555', 'location'=>'ห้องสมุด สนามกีฬา', 'image'=> null, 'detail'=> 'ศึกษาและฝึกเล่นแบดมินตัน', 'tag'=> 'แบดมินตัน,ห้องสมุด,ออกกำลังกาย,สนามกีฬา', 'createdBy' => '65010333', 'leader' => '65010333'],
        ['hID'=>'h-20240811-035','type' => 'library', 'activityName' => 'ห้องสมุดพฤกษศาสตร์', 'weekDate' => 'จ.,อ.,พ.,พฤ.,ศ.', 'actTime' => '15:30:00', 'memberCount' => 5, 'memberMax' => 5, 'member'=> '65010111,65010222,65010333,65010444,65010555', 'memberRequest'=> null, 'location'=>'ห้องสมุด คณะวิทย์', 'image'=> null, 'detail'=> 'ศึกษาและแลกเปลี่ยนความรู้เกี่ยวกับพฤกษศาสตร์', 'tag'=> 'พฤกษศาสตร์,ห้องสมุด,คณะวิทย์', 'createdBy' => '65010111', 'leader' => '65010111'],
        ['hID'=>'h-20240812-036','type' => 'library', 'activityName' => 'ห้องสมุดมังงะและอนิเมะ', 'weekDate' => 'ส.,อา.', 'actTime' => '19:00:00', 'memberCount' => 3, 'memberMax' => 5, 'member'=> '65010111,65010444,65010555', 'memberRequest'=> '65010333', 'location'=>'ห้องสมุด ตึกโหล 1006', 'image'=> null, 'detail'=> 'ศึกษาและพูดคุยเกี่ยวกับมังงะและอนิเมะ', 'tag'=> 'มังงะ,อนิเมะ,ห้องสมุด,ตึกโหล', 'createdBy' => '65010111', 'leader' => '65010111'],
    ]; 

    use HasFactory;

    protected $fillable = [ 'hID',
        'type', 'activityName', 'weekDate',
        'actTime', 'memberCount', 'memberMax', 'member',
        'memberRequest', 'location', 'image', 'detail',
        'tag', 'createdBy', 'leader'
    ];

    public function leaderGroup(): BelongsTo
    {
        return $this->belongsTo(UserModel::class, 'leader', 'uID'); //ใช้คอลัมน์ uID ของ UserModel เป็นคีย์ 
    }

    public function library(): HasOne {
        return $this->hasOne(LibraryModel::class,'hID','hID');
    }

    public function tutoring(): HasOne {
        return $this->hasOne(TutoringModel::class,'hID','hID');
    }

    public function member() {
        $memberArray = explode(',', $this->member);
        return UserModel::whereIn('uID', $memberArray)->get();
    } 

    public function request() {
        $requestArray = explode(',', $this->memberRequest);
        return UserModel::whereIn('uID', $requestArray)->get();
    } 

    public function searchHobby($keyword,$type)
    {
        if (!empty($keyword)) {
            $query = HobbyModel::Select('*')
            ->LeftJoin('user_models','hobby_models.leader','=','user_models.uID')
            ->where('hobby_models.type','=',"$type")
            ->where(function ($query) use ($keyword,$type) {
                return $query->where('hobby_models.status', '=', 1)
                    ->where('hobby_models.activityName', 'like', "%$keyword%")
                    ->orwhere('hobby_models.activityName', 'like', "%$keyword")
                    ->orwhere('hobby_models.activityName', 'like', "$keyword%")
                    ->orwhere('hobby_models.tag', 'like', "%$keyword%")
                    ->orwhere('hobby_models.tag', 'like', "%$keyword")
                    ->orwhere('hobby_models.tag', 'like', "$keyword%")
                    ->orwhere('user_models.username', 'like', "%$keyword%")
                    ->orwhere('user_models.username', 'like', "%$keyword")
                    ->orwhere('user_models.username', 'like', "$keyword%");
            });
        } else {
            $query = HobbyModel::select('*');
        }
        $query->orderBy('hobby_models.updated_at', 'DESC');
        $result = $query->get();
        return $result;
    }

    public static $validator = [
        [
            'activityName' => ['required', 'string'],
            'actTime' => 'required',
            'memberMax' => ['nullable', 'numeric', 'integer', 'max:99'],
            'location' => ['required', 'string'],
            'weekDate' => ['nullable', 'string'],
            'detail' => ['nullable', 'string'],
        ],
        [
            'activityName.required' => 'hobby name required',
            'activityName.string' => 'hobby name string invalid',
            'actTime.required' => 'activity time required',
            'memberMax.numeric' => 'max member numeric invalid',
            'memberMax.integer' => 'max member integer invalid',
            'memberMax.max' => 'max member exceed 99',
            'location.required' => 'location required',
            'location.string' => 'location string invalid',
            'weekDate.string' => 'week date string invalid',
            'detail.string' => 'detail string invalid',
        ]
    ];

    public function idGeneration(){
        $prefix = 'h-' . now()->format('Ymd') . '-';
        $lastGroup = HobbyModel::where('hID', 'LIKE', $prefix . '%')->orderBy('hID', 'desc')->first();

        if (!$lastGroup) {
            $number = '001';
        } else {
            $lastNumber = (int)substr($lastGroup->hID, -3);
            $number = str_pad($lastNumber + 1, 3, '0', STR_PAD_LEFT);
        }

        return $prefix . $number;
    }
}
