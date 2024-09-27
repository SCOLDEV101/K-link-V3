<?php

namespace App\Models;

use Illuminate\Database\Eloquent\Factories\HasFactory;
use Illuminate\Database\Eloquent\Model;

class FacultyModel extends Model
{
    public static $Faculty = [
        ['id'=>'1','nameTH' => 'วิศวกรรมศาสตร์', 'nameEN' => 'Engineer'],
        ['id'=>'2','nameTH' => 'สถาปัตยกรรมศาสตร์', 'nameEN' => 'Architecture'],
        ['id'=>'3','nameTH' => 'ครุศาสตร์อุตสาหกรรมและเทคโนโลยี', 'nameEN' => 'Education Industial Technology'],
        ['id'=>'4','nameTH' => 'เทคโนโลยีการเกษตร', 'nameEN' => 'Agricultural Technology'],
        ['id'=>'5','nameTH' => 'วิทยาศาสตร์', 'nameEN' => 'Science'],
        ['id'=>'6','nameTH' => 'เทคโนโลยีสารสนเทศ', 'nameEN' => 'Information Technology'],
        ['id'=>'7','nameTH' => 'อุตสาหกรรมอาหาร', 'nameEN' => 'Food Industry'],
        ['id'=>'8','nameTH' => 'วิทยาลัยเทคโนโลยีและนวัตกรรมวัสดุ', 'nameEN' => 'Innovative Materials Technology'],
        ['id'=>'9','nameTH' => 'วิทยาลัยนวัตกรรมการผลิตขั้นสูง', 'nameEN' => 'College of Advanced Manufacturing Innovation'],
        ['id'=>'10','nameTH' => 'วิทยาลัยนานาชาติ', 'nameEN' => 'International College'],
        ['id'=>'11','nameTH' => 'บริหารธุรกิจ', 'nameEN' => 'Business Administration'],
        ['id'=>'12','nameTH' => 'ศิลปศาสตร์', 'nameEN' => 'Liberal Arts'],
        ['id'=>'13','nameTH' => 'แพทยศาสตร์', 'nameEN' => 'Medicine'],
        ['id'=>'14','nameTH' => 'วิทยาลัยวิศวกรรมสังคีต', 'nameEN' => 'Institute of Music Science and Engineering'],
        ['id'=>'15','nameTH' => 'ทันตแพทยศาสตร์ ', 'nameEN' => 'Dentistry'],
        ['id'=>'16','nameTH' => 'วิทยาลัยอุตสาหกรรมการบินนานาชาติ', 'nameEN' => 'International Academy of Aviation Industry'],
    ]; 
    use HasFactory;
}
