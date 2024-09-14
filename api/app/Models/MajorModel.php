<?php

namespace App\Models;

use Illuminate\Database\Eloquent\Factories\HasFactory;
use Illuminate\Database\Eloquent\Model;
use Illuminate\Database\Eloquent\Relations\BelongsTo;

class MajorModel extends Model
{
    public static $Major = [
        ['id'=>'1','facultyID'=>'1','shortName'=>'ENG01','nameTH' => null,'nameEN' => 'Biomedical Engineer'],
        ['id'=>'2','facultyID'=>'1','shortName'=>'ENG02','nameTH' => null,'nameEN' => 'Computer Engineering'],
        ['id'=>'3','facultyID'=>'1','shortName'=>'ENG03','nameTH' => null,'nameEN' => 'Mechanical Engineering'],
        ['id'=>'4','facultyID'=>'1','shortName'=>'ENG04','nameTH' => null,'nameEN' => 'Chemical Engineering'],
        ['id'=>'5','facultyID'=>'1','shortName'=>'ENG05','nameTH' => null,'nameEN' => 'Civil Engineering'],
        ['id'=>'6','facultyID'=>'1','shortName'=>'ENG06','nameTH' => null,'nameEN' => 'Industrial Engineering'],
        ['id'=>'7','facultyID'=>'1','shortName'=>'ENG07','nameTH' => null,'nameEN' => 'Multidisciplinary Engineering'],
        ['id'=>'8','facultyID'=>'1','shortName'=>'ENG08','nameTH' => 'วิศวกรรมชีวการแพทย์ & แพทยศาสตรบัณฑิต'],
        ['id'=>'9','facultyID'=>'1','shortName'=>'ENG09','nameEN' => 'Bachelor of Engineering in Smart Materials Technology & Bachelor of Engineering in Robotics and AI Engineering'],
        ['id'=>'10','facultyID'=>'1','shortName'=>'ENG10','nameTH' => 'วิศวกรรมศาสตรบัณฑิต สาขาวิชาวิศวกรรมระบบไอโอทีและสารสนเทศ & วิทยาศาสตรบัณฑิต สาขาวิชาฟิสิกส์อุตสาหกรรม','nameEN' =>null],
        ['id'=>'11','facultyID'=>'1','shortName'=>'ENG11','nameTH' => 'วิทยาศาสตรบัณฑิต สาขาวิชาวิศวกรรมแปรรูปอาหาร & วิศวกรรมศาสตรบัณฑิต สาขาวิชาวิศวกรรมอุตสาหการ','nameEN' =>null],
        ['id'=>'12','facultyID'=>'1','shortName'=>'ENG12','nameTH' => 'วิศวกรรมศาสตรบัณฑิต (วิศวกรรมโยธา) & วิทยาศาสตรบัณฑิต(สถาปัตยกรรม)','nameEN' =>null],
        ['id'=>'13','facultyID'=>'1','shortName'=>'ENG13','nameTH' => 'วิศวกรรมการวัดและควบคุม','nameEN' =>null],
        ['id'=>'14','facultyID'=>'1','shortName'=>'ENG14','nameTH' => 'วิศวกรรมคอมพิวเตอร์','nameEN' =>null],
        ['id'=>'15','facultyID'=>'1','shortName'=>'ENG15','nameTH' => 'วิศวกรรมเครื่องกล','nameEN' =>null],
        ['id'=>'16','facultyID'=>'1','shortName'=>'ENG16','nameTH' => 'วิศวกรรมเคมี','nameEN' =>null],
        ['id'=>'17','facultyID'=>'1','shortName'=>'ENG17','nameTH' => 'วิศวกรรมไฟฟ้า','nameEN' =>null],
        ['id'=>'18','facultyID'=>'1','shortName'=>'ENG18','nameTH' => 'วิศวกรรมอุตสาหการ','nameEN' =>null],
        ['id'=>'19','facultyID'=>'1','shortName'=>'ENG19','nameTH' => 'วิศวกรรมอาหาร','nameEN' =>null],
        ['id'=>'20','facultyID'=>'1','shortName'=>'ENG20','nameTH' => 'วิศวกรรมอิเล็กทรอนิกส์','nameEN' =>null],
        ['id'=>'21','facultyID'=>'1','shortName'=>'ENG21','nameTH' => 'วิศวกรรมโทรคมนาคม','nameEN' =>null],
        ['id'=>'22','facultyID'=>'1','shortName'=>'ENG22','nameTH' => 'วิศวกรรมโยธา','nameEN' =>null],
        ['id'=>'23','facultyID'=>'1','shortName'=>'ENG23','nameTH' => 'วิศวกรรมเกษตร','nameEN' =>null],
        ['id'=>'24','facultyID'=>'2','shortName'=>'ARC01','nameTH' => null,'nameEN' =>'Bachelor of Science in Architecture'],
        ['id'=>'25','facultyID'=>'2','shortName'=>'ARC02','nameTH' => null,'nameEN' =>'Bachelor of Fine Arts in Creative Arts and Curatorial Studies'],
        ['id'=>'26','facultyID'=>'2','shortName'=>'ARC03','nameTH' => null,'nameEN' =>'Bachelor of Design Program in Design Intelligence for Creative Economy (International Program)'],
        ['id'=>'27','facultyID'=>'2','shortName'=>'ARC04','nameTH' => 'วิศวกรรมศาสตรบัณฑิต (วิศวกรรมโยธา) & วิทยาศาสตรบัณฑิต(สถาปัตยกรรม)','nameEN' =>null],
        ['id'=>'28','facultyID'=>'2','shortName'=>'ARC05','nameTH' => 'สถาปัตยกรรม','nameEN' =>null],
        ['id'=>'29','facultyID'=>'2','shortName'=>'ARC06','nameTH' => 'สถาปัตยกรรมภายใน','nameEN' =>null],
        ['id'=>'30','facultyID'=>'2','shortName'=>'ARC07','nameTH' => 'ศิลปอุตสาหกรรม','nameEN' =>null],
        ['id'=>'31','facultyID'=>'2','shortName'=>'ARC08','nameTH' => 'นิเทศศิลป์','nameEN' =>null],
        ['id'=>'32','facultyID'=>'2','shortName'=>'ARC09','nameTH' => 'วิจิตรศิลป์','nameEN' =>null],
        ['id'=>'33','facultyID'=>'2','shortName'=>'ARC10','nameTH' => 'ศิลปกรรม','nameEN' =>null],
        ['id'=>'34','facultyID'=>'3','shortName'=>'EDU01','nameTH' => 'ครุศาสตร์สถาปัตยกรรม','nameEN' =>null],
        ['id'=>'35','facultyID'=>'3','shortName'=>'EDU02','nameTH' => 'ครุศาสตร์วิศวกรรม','nameEN' =>null],
        ['id'=>'36','facultyID'=>'3','shortName'=>'EDU03','nameTH' => 'ครุศาสตร์เกษตร','nameEN' =>null],
        ['id'=>'37','facultyID'=>'3','shortName'=>'EDU04','nameTH' => 'ครุศาสตร์ภาษาและสังคม','nameEN' =>null],
        ['id'=>'38','facultyID'=>'4','shortName'=>'AGR01','nameTH' => 'เทคโนโลยีการผลิตพืช','nameEN' =>null],
        ['id'=>'39','facultyID'=>'4','shortName'=>'AGR02','nameTH' => 'เทคโนโลยีการผลิตสัตว์และประมง','nameEN' =>null],
        ['id'=>'40','facultyID'=>'4','shortName'=>'AGR03','nameTH' => 'ปฐพีวิทยา','nameEN' =>null],
        ['id'=>'41','facultyID'=>'4','shortName'=>'AGR04','nameTH' => 'เทคโนโลยีการจัดการศัตรูพืช','nameEN' =>null],
        ['id'=>'42','facultyID'=>'4','shortName'=>'AGR05','nameTH' => 'นวัตกรรมการสื่อสารและพัฒนาการเกษตร','nameEN' =>null],
        ['id'=>'43','facultyID'=>'4','shortName'=>'AGR06','nameTH' => 'สำนักงานบริหารหลักสูตรสหวิทยาการเทคโนโลยีการเกษตร','nameEN' =>null],
        ['id'=>'44','facultyID'=>'5','shortName'=>'SCI01','nameTH' => 'คณิตศาสตร์','nameEN' =>null],
        ['id'=>'45','facultyID'=>'5','shortName'=>'SCI02','nameTH' => 'วิทยาการคอมพิวเตอร์','nameEN' =>null],
        ['id'=>'46','facultyID'=>'5','shortName'=>'SCI03','nameTH' => 'เคมี','nameEN' =>null],
        ['id'=>'47','facultyID'=>'5','shortName'=>'SCI04','nameTH' => 'ชีววิทยา','nameEN' =>null],
        ['id'=>'48','facultyID'=>'5','shortName'=>'SCI05','nameTH' => 'ฟิสิกส์','nameEN' =>null],
        ['id'=>'49','facultyID'=>'5','shortName'=>'SCI06','nameTH' => 'สถิติ','nameEN' =>null],
        ['id'=>'50','facultyID'=>'5','shortName'=>'SCI07','nameTH' => 'ศูนย์วิเคราะห์ข้อมูลดิจิทัลอัจฉริยะพระจอมเกล้าลาดกระบัง','nameEN' =>null],
        ['id'=>'51','facultyID'=>'6','shortName'=>'INF01','nameTH' => 'เทคโนโลยีสารสนเทศ','nameEN' =>null],
        ['id'=>'52','facultyID'=>'7','shortName'=>'FOO01','nameTH' => 'วิทยาศาสตรบัณฑิต สาขาวิชาวิศวกรรมแปรรูปอาหาร & วิศวกรรมศาสตรบัณฑิต สาขาวิชาวิศวกรรมอุตสาหการ','nameEN' =>null],
        ['id'=>'53','facultyID'=>'7','shortName'=>'FOO02','nameTH' => 'อุตสาหกรรมอาหาร','nameEN' =>null],
        ['id'=>'54','facultyID'=>'8','shortName'=>'NAN01','nameTH' => 'นาโนวิทยาและนาโนเทคโนโลยี ','nameEN' =>null],
        ['id'=>'55','facultyID'=>'8','shortName'=>'NAN02','nameTH' =>  null,'nameEN' =>'Multidisciplinary'],
        ['id'=>'56','facultyID'=>'8','shortName'=>'NAN03','nameTH' =>  'วิศวกรรมวัสดุนาโน & Polymer Materials and Engineering','nameEN' =>null],
        ['id'=>'57','facultyID'=>'9','shortName'=>'ADV01','nameTH' =>  'วิศวกรรมระบบการผลิต','nameEN' =>null],
        ['id'=>'58','facultyID'=>'10','shortName'=>'INT01','nameTH' => 'วิศวกรรมซอฟต์แวร์','nameEN' =>null],
        ['id'=>'59','facultyID'=>'10','shortName'=>'INT02','nameTH' => 'การจัดการวิศวกรรมและเทคโนโลยี','nameEN' =>null],
        ['id'=>'60','facultyID'=>'11','shortName'=>'BUS01','nameTH' => 'บริหารธุรกิจเกษตร','nameEN' =>null],
        ['id'=>'61','facultyID'=>'11','shortName'=>'BUS02','nameTH' => 'บริหารธุรกิจ','nameEN' =>null],
        ['id'=>'62','facultyID'=>'11','shortName'=>'BUS03','nameTH' => 'เศรษฐศาสตร์ธุรกิจและการจัดการ','nameEN' =>null],
        ['id'=>'63','facultyID'=>'12','shortName'=>'LIB01','nameTH' => 'ศิลปศาสตร์ประยุกต์','nameEN' =>null],
        ['id'=>'64','facultyID'=>'12','shortName'=>'LIB02','nameTH' => 'ภาษา','nameEN' =>null],
        ['id'=>'65','facultyID'=>'12','shortName'=>'LIB03','nameTH' => 'มนุษยศาสตร์และสังคมศาสตร์','nameEN' =>null],
        ['id'=>'66','facultyID'=>'13','shortName'=>'MED01','nameTH' => 'แพทยศาสตรนานาชาติ','nameEN' =>null],
        ['id'=>'67','facultyID'=>'14','shortName'=>'MUS01','nameTH' => 'วิศวกรรมดนตรีและสื่อประสม','nameEN' =>null],
        ['id'=>'68','facultyID'=>'15','shortName'=>'DEN01','nameTH' => 'ทันตแพทยศาสตร์ ','nameEN' =>'Dentistry'],
        ['id'=>'69','facultyID'=>'16','shortName'=>'AIR01','nameTH' => 'วิศวกรรมเครื่องกล ','nameEN' =>null],
        ['id'=>'70','facultyID'=>'16','shortName'=>'AIR02','nameTH' => 'วิศวกรรมการบิน ','nameEN' =>null],
        ['id'=>'71','facultyID'=>'16','shortName'=>'AIR03','nameTH' => 'นวัตกรรมการจัดการอุตสาหกรรมการบินและการบริการ ','nameEN' =>null],

    ];

    public function faculty(): BelongsTo {
        return $this->belongsTo(FacultyModel::class, 'facultyID', 'id');
    }

    use HasFactory;
}
