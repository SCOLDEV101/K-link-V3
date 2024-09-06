<?php

namespace App\Models;

use Illuminate\Database\Eloquent\Factories\HasFactory;
use Illuminate\Database\Eloquent\Model;

class FacultyModel extends Model
{
    public static $Faculty = [
        ['facultyID'=>'1','facultyNameTH' => 'วิศวกรรมศาสตร์', 'facultyNameEN' => 'Engineer'],
        ['facultyID'=>'2','facultyNameTH' => 'สถาปัตยกรรมศาสตร์', 'facultyNameEN' => 'Architecture'],
        ['facultyID'=>'3','facultyNameTH' => 'ครุศาสตร์อุตสาหกรรมและเทคโนโลยี', 'facultyNameEN' => 'Education Industial Technology'],
        ['facultyID'=>'4','facultyNameTH' => 'เทคโนโลยีการเกษตร', 'facultyNameEN' => 'Agricultural Technology'],
        ['facultyID'=>'5','facultyNameTH' => 'วิทยาศาสตร์', 'facultyNameEN' => 'Science'],
        ['facultyID'=>'6','facultyNameTH' => 'เทคโนโลยีสารสนเทศ', 'facultyNameEN' => 'Information Technology'],
        ['facultyID'=>'7','facultyNameTH' => 'อุตสาหกรรมอาหาร', 'facultyNameEN' => 'Food Industry'],
        ['facultyID'=>'8','facultyNameTH' => 'วิทยาลัยเทคโนโลยีและนวัตกรรมวัสดุ', 'facultyNameEN' => 'Innovative Materials Technology'],
        ['facultyID'=>'9','facultyNameTH' => 'วิทยาลัยนวัตกรรมการผลิตขั้นสูง', 'facultyNameEN' => 'College of Advanced Manufacturing Innovation'],
        ['facultyID'=>'10','facultyNameTH' => 'วิทยาลัยนานาชาติ', 'facultyNameEN' => 'International College'],
        ['facultyID'=>'11','facultyNameTH' => 'บริหารธุรกิจ', 'facultyNameEN' => 'Business Administration'],
        ['facultyID'=>'12','facultyNameTH' => 'ศิลปศาสตร์', 'facultyNameEN' => 'Liberal Arts'],
        ['facultyID'=>'13','facultyNameTH' => 'แพทยศาสตร์', 'facultyNameEN' => 'Medicine'],
        ['facultyID'=>'14','facultyNameTH' => 'วิทยาลัยวิศวกรรมสังคีต', 'facultyNameEN' => 'Institute of Music Science and Engineering'],
        ['facultyID'=>'15','facultyNameTH' => 'ทันตแพทยศาสตร์ ', 'facultyNameEN' => 'Dentistry'],
        ['facultyID'=>'16','facultyNameTH' => 'วิทยาลัยอุตสาหกรรมการบินนานาชาติ', 'facultyNameEN' => 'International Academy of Aviation Industry'],
    ]; 
    use HasFactory;
}
