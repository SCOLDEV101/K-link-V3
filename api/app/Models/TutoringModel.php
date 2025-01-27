<?php

namespace App\Models;

use Illuminate\Database\Eloquent\Factories\HasFactory;
use Illuminate\Database\Eloquent\Model;
use Illuminate\Database\Eloquent\Relations\BelongsTo;
use Illuminate\Database\Eloquent\Relations\HasOne;

class TutoringModel extends Model
{
    public static $TutoringStaticGroup = [
        ['tutoringID'=>'t-20240801-001','hID' => 'h-20240801-013', 'facultyID' => '1', 'majorID' => 'ENG05', 'sectionID' => '1', 'date'=> '2024-08-01', 'startTime'=> '20:00:00', 'endTime'=> '22:00:00'],
        ['tutoringID'=>'t-20240801-002','hID' => 'h-20240802-014', 'facultyID' => '2', 'majorID' => 'ENG07', 'sectionID' => '2', 'date'=> '2024-08-01', 'startTime'=> '20:00:00', 'endTime'=> '22:00:00'],
        ['tutoringID'=>'t-20240801-003','hID' => 'h-20240803-015', 'facultyID' => '3', 'majorID' => 'ENG06', 'sectionID' => '3', 'date'=> '2024-08-01', 'startTime'=> '20:00:00', 'endTime'=> '22:00:00'],
        ['tutoringID'=>'t-20240801-004','hID' => 'h-20240804-016', 'facultyID' => '4', 'majorID' => 'ENG08', 'sectionID' => '4', 'date'=> '2024-08-01', 'startTime'=> '20:00:00', 'endTime'=> '22:00:00'],
        ['tutoringID'=>'t-20240801-005','hID' => 'h-20240805-017', 'facultyID' => '5', 'majorID' => 'ENG09', 'sectionID' => '5', 'date'=> '2024-08-01', 'startTime'=> '20:00:00', 'endTime'=> '22:00:00'],
        ['tutoringID'=>'t-20240801-006','hID' => 'h-20240806-018', 'facultyID' => '6', 'majorID' => 'ENG10', 'sectionID' => '6', 'date'=> '2024-08-01', 'startTime'=> '20:00:00', 'endTime'=> '22:00:00'],
        ['tutoringID'=>'t-20240801-007','hID' => 'h-20240807-019', 'facultyID' => '7', 'majorID' => 'ENG11', 'sectionID' => '7', 'date'=> '2024-08-01', 'startTime'=> '20:00:00', 'endTime'=> '22:00:00'],
        ['tutoringID'=>'t-20240801-008','hID' => 'h-20240808-020', 'facultyID' => '8', 'majorID' => 'ENG12', 'sectionID' => '8', 'date'=> '2024-08-01', 'startTime'=> '20:00:00', 'endTime'=> '22:00:00'],
        ['tutoringID'=>'t-20240801-009','hID' => 'h-20240809-021', 'facultyID' => '9', 'majorID' => 'ENG13', 'sectionID' => '9', 'date'=> '2024-08-01', 'startTime'=> '20:00:00', 'endTime'=> '22:00:00'],
        ['tutoringID'=>'t-20240801-010','hID' => 'h-20240810-022', 'facultyID' => '10', 'majorID' => 'ENG14', 'sectionID' => '10', 'date'=> '2024-08-01', 'startTime'=> '20:00:00', 'endTime'=> '22:00:00'],
        ['tutoringID'=>'t-20240801-011','hID' => 'h-20240811-023', 'facultyID' => '11', 'majorID' => 'ENG15', 'sectionID' => '11', 'date'=> '2024-08-01', 'startTime'=> '20:00:00', 'endTime'=> '22:00:00'],
        ['tutoringID'=>'t-20240801-012','hID' => 'h-20240812-024', 'facultyID' => '12', 'majorID' => 'ENG16', 'sectionID' => '12', 'date'=> '2024-08-01', 'startTime'=> '20:00:00', 'endTime'=> '22:00:00'],
    ]; 

    use HasFactory;
    
    protected $primaryKey = 'id';
    public $incrementing = false;
    protected $keyType = 'string';

    protected $fillable = [
        'id',
        'facultyID',
        'majorID',
        'sectionID',
        'imageOrFileID',
        'name',
        'memberMax',
        'location',
        'detail',
        'startTime',
        'endTime',
        'date',
        'leader',
        'createdBy'
    ];

    public static $validator = [
        [
            'facultyID' => ['required'],
            'date' => ['required'],
            'startTime' => ['required','regex:/^[0-9:]+$/u'],
            'endTime' => ['required','regex:/^[0-9:]+$/u'],
            // 'image'=> ['sometimes','mimes:png,jpg,jpeg,gif'],
            'deleteimage'=> ['sometimes','nullable'],
            'activityName' => ['required', 'regex:/^[a-zA-Z0-9ก-๙\s]+$/u'],
            'memberMax' => ['nullable', 'regex:/\b([0-9]|[1-9][0-9])\b/'],
            'location' => ['required', 'string'],
            'detail' => ['nullable', 'string'],
        ],
        [
            'facultyID.required' => 'faculty is required',
            'date.required' => 'date required',
            'startTime.required' => 'startTime required',
            'startTime.regex' => 'start time type invalid',
            'endTime.required' => 'endTime required',
            'endTime.regex' => 'end time type invalid',
            'activityName.required' => 'tutoring name required',
            'activityName.string' => 'tutoring name string invalid',
            // 'image.mimes'=>"group image only allow png,jpg,jpeg,gif",
            'memberMax.numeric' => 'max member numeric invalid',
            'memberMax.regex' => 'max member type invalid',
            'location.required' => 'location required',
            'location.string' => 'location string invalid',
            'detail.string' => 'detail string invalid',
        ]
    ];

    public function faculty(): HasOne {
        return $this->hasOne(FacultyModel::class, 'id', 'facultyID');
    }

    public function major(): HasOne {
        return $this->hasOne(MajorModel::class, 'id', 'majorID');
    }

    public function department(): HasOne {
        return $this->hasOne(DepartmentModel::class, 'id', 'departmentID');
    }

    public function leaderGroup(): BelongsTo {
        return $this->belongsTo(UserModel::class, 'leader', 'id')->select('id','username'); //ใช้คอลัมน์ id ของ UserModel เป็นคีย์ 
    }
    
    public function imageOrFile(): HasOne {
        return $this->hasOne(imageOrFileModel::class, 'id', 'imageOrFileID')->select('id','name');
    }

    public function idGeneration(){
        $prefix = 't-' . now()->format('Ymd') . '-';
        $lastGroup = GroupModel::where([['type', "tutoring"], ['groupID', 'LIKE', $prefix . '%']])->orderBy('groupID', 'desc')->first();

        if (!$lastGroup) {
            $number = '001';
        } else {
            $lastNumber = (int) substr($lastGroup->groupID, -3);
            $number = str_pad($lastNumber + 1, 3, '0', STR_PAD_LEFT);
        }

        return $prefix . $number;
    }
}
