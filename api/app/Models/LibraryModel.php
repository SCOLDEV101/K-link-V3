<?php

namespace App\Models;

use Illuminate\Database\Eloquent\Factories\HasFactory;
use Illuminate\Database\Eloquent\Model;
use Illuminate\Database\Eloquent\Relations\BelongsTo;
use App\Models\FacultyModel;

class LibraryModel extends Model
{
    public static $LibraryStaticGroup = [
        ['libraryID'=>'l-20240801-001','hID' => 'h-20240801-025', 'filepath' => 'library-Rev1_1.pdf', 'facultyID' => '1',],
        ['libraryID'=>'l-20240801-002','hID' => 'h-20240802-026', 'filepath' => 'library-th-2.pdf', 'facultyID' => '2',],
        ['libraryID'=>'l-20240801-003','hID' => 'h-20240803-027', 'filepath' => 'library-Rev1_1.pdf', 'facultyID' => '3',],
        ['libraryID'=>'l-20240801-004','hID' => 'h-20240804-028', 'filepath' => 'library-th-2.pdf', 'facultyID' => '4',],
        ['libraryID'=>'l-20240801-005','hID' => 'h-20240805-029', 'filepath' => 'library-Rev1_1.pdf', 'facultyID' => '5',],
        ['libraryID'=>'l-20240801-006','hID' => 'h-20240806-030', 'filepath' => 'library-th-2.pdf', 'facultyID' => '6',],
        ['libraryID'=>'l-20240801-007','hID' => 'h-20240807-031', 'filepath' => 'library-Rev1_1.pdf', 'facultyID' => '7',],
        ['libraryID'=>'l-20240801-008','hID' => 'h-20240808-032', 'filepath' => 'library-th-2.pdf', 'facultyID' => '8',],
        ['libraryID'=>'l-20240801-009','hID' => 'h-20240809-033', 'filepath' => 'library-Rev1_1.pdf', 'facultyID' => '9',],
        ['libraryID'=>'l-20240801-010','hID' => 'h-20240810-034', 'filepath' => 'library-th-2.pdf', 'facultyID' => '10',],
        ['libraryID'=>'l-20240801-011','hID' => 'h-20240811-035', 'filepath' => 'library-Rev1_1.pdf', 'facultyID' => '11',],
        ['libraryID'=>'l-20240801-012','hID' => 'h-20240812-036', 'filepath' => 'library-th-2.pdf', 'facultyID' => '12',],
    ]; 

    use HasFactory;
    
    protected $primaryKey = 'libraryID'; 
    public $incrementing = false;
    protected $keyType = 'string';
    protected $filepath;

    public static $validator = [
        [
            'files' => ['required'],
            'activityName' => ['required', 'string'],
            'detail' => ['nullable', 'string'],
            'facultyID' => ['required'],
        ],
        [
            'facultyID.required' => 'faculty is required',
            'files.required' => 'file is required',
            'activityName.required' => 'hobby name required',
            'activityName.string' => 'hobby name string invalid',
            'detail.string' => 'detail string invalid',
        ]
    ];

    public static $updatevalidator = [
        [
            'files' => ['required'],
            'detail' => ['nullable', 'string'],
            'facultyID' => ['required', 'integer'],
        ],
        [
            'files.required' => 'file is required',
            'detail.string' => 'detail string invalid',
            'facultyID.required' => 'facultyID is required',
            'facultyID.integer' => 'facultyID is invalid',
        ]
    ];
    
    public function faculty(): BelongsTo {
        return $this->belongsTo(FacultyModel::class, 'facultyID', 'facultyID');
    }

    public function idGeneration(){
        $prefix = 'l-' . now()->format('Ymd') . '-';
        $lastGroup = LibraryModel::where('libraryID', 'LIKE', $prefix . '%')->orderBy('libraryID', 'desc')->first();

        if (!$lastGroup) {
            $number = '001';
        } else {
            $lastNumber = (int) substr($lastGroup->libraryID, -3);
            $number = str_pad($lastNumber + 1, 3, '0', STR_PAD_LEFT);
        }

        return $prefix . $number;
    }
}
