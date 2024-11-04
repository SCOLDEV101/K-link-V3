<?php

namespace App\Models;

use Illuminate\Database\Eloquent\Factories\HasFactory;
use Illuminate\Database\Eloquent\Model;
use Illuminate\Database\Eloquent\Relations\BelongsTo;
use Illuminate\Database\Eloquent\Relations\HasOne;
use App\Models\FacultyModel;
use Illuminate\Notifications\Notifiable;
use Laravel\Sanctum\HasApiTokens;

class UserModel extends Model
{
    use HasFactory, HasApiTokens, Notifiable;

    protected $guard = ['id'];

    protected $primaryKey = 'id';

    protected $fillable = [
        'facultyID',
        'majorID',
        'imageOrFileID',
        'roleID',
        'username',
        'fullname',
        'aboutMe',
        'telephone',
        'email',
        'status'
    ];

    protected $hidden = [
        'password',
    ];

    public static $defaultUser = [
        [
            'id' => '65010111',
            'username' => 'Mr.IoT-1',
            'fullname' => 'นายไอโอที หนึ่ง',
            'aboutMe' => 'ชอบเล่นฟุตบอล วันหยุดมักจะไปเที่ยวกับเพื่อน เก่งแคลคูลัส',
            'telephone' => '0650650111',
            'email' => '65010111@kmitl.ac.th',
            'imageOrFileID' => '8',
            'facultyID' => '1',
            'majorID' => '1',
            'roleID' => '100'
        ],
        [
            'id' => '65010222',
            'username' => 'Mr.IoT-2',
            'fullname' => 'นายไอโอที สอง',
            'aboutMe' => 'เป็นประธานชมรมยิงปืน ตัวแทนนักกีฬา',
            'telephone' => '0650650222',
            'email' => '65010222@kmitl.ac.th',
            'imageOrFileID' => '8',
            'facultyID' => '1',
            'majorID' => '3',
            'roleID' => '100'
        ],
        [
            'id' => '65010333',
            'username' => 'Ms.IoT-1',
            'fullname' => 'นางสาวไอโอที หนึ่ง',
            'aboutMe' => 'ประธานรุ่นปี 2565 ปัจจุบันเรียนอยู่ปี 3 เคลไปแลกเปลี่ยนที่ฝรั่งเศษ เรียนเก่งมาก',
            'telephone' => '0650650333',
            'email' => '65010333@kmitl.ac.th',
            'imageOrFileID' => '8',
            'facultyID' => '2',
            'majorID' => '24',
            'roleID' => '100'
        ],
        [
            'id' => '65010444',
            'username' => 'Mr.IoT-3',
            'fullname' => 'นายไอโอที สาม',
            'aboutMe' => 'ลูกครึ่งไทย-แคนนาดา รับงานแสดงเป็นบางครั้ง ไม่ชอบกินเผ็ด',
            'telephone' => '0650650444',
            'email' => '65010444@kmitl.ac.th',
            'imageOrFileID' => '8',
            'facultyID' => '3',
            'majorID' => '34',
            'roleID' => '100'
        ],
        [
            'id' => '65010555',
            'username' => 'Ms.IoT-2',
            'fullname' => 'นางสาวไอโอที สอง',
            'aboutMe' => 'เป็นคนใต้ที่ไม่กินเผ็ด กลัวผีแต่ก็ชอบดูหนังผี',
            'telephone' => '0650650555',
            'email' => '65010555@kmitl.ac.th',
            'imageOrFileID' => '8',
            'facultyID' => '4',
            'majorID' => '38',
            'roleID' => '100'
        ],
        [
            'id' => '65010666',
            'username' => 'Ms.IoT-3',
            'fullname' => 'นางสาวไอโอที สาม',
            'aboutMe' => 'เป็นคนสวย มั่นใจ เล่นกีฬาเก่ง พูดเก่ง รักการเดินทาง',
            'telephone' => '0650650666',
            'email' => '65010666@kmitl.ac.th',
            'imageOrFileID' => '8',
            'facultyID' => '4',
            'majorID' => '43',
            'roleID' => '100'
        ]
    ];

    public function faculty(): BelongsTo
    {
        return $this->belongsTo(FacultyModel::class, 'id', 'facultyID'); //facultyModel key , user key
    }

    public function major(): BelongsTo
    {
        return $this->belongsTo(MajorModel::class, 'id', 'majorID'); // majorModel key , user key
    }

    public static function bookmark()
    {
        $userDb = UserModel::where('id', auth()->user()->id)->first();
        $bookmark = explode(',', $userDb->bookmark);
        return HobbyModel::whereIn('hID', $bookmark)->get();
    }

    public function imageOrFile(): HasOne
    {
        return $this->hasOne(imageOrFileModel::class, 'id', 'imageOrFileID')->select('id', 'name');
    }

    public static $validator = [
        [
            'image'=> ['sometimes','mimes:png,jpg,jpeg,gif'],
            'username' => ['sometimes', 'regex:/^[a-zA-Z0-9ก-๙-_.\s]+$/u', 'max:50'],
            'fullname' => ['sometimes', 'regex:/^[a-zA-Zก-๙\s]+$/u', 'max:100'],
            'aboutMe' => ['nullable', 'regex:/^[a-zA-Z0-9ก-๙\s]+$/u', 'max:1000'],
            'telephone' => ['sometimes', 'regex:/^[0-9]+$/', 'min:10', 'max:10'],
        ],
        [
            'username.regex' => 'username can only contain letters, numbers, dashes, and underscores.',
            'username.max' => 'username characters exceed limit',
            'fullname.regex' => 'fullname can only contain letters, and whitespaces.',
            'fullname.max' => 'fullname characters exceed limit',
            'aboutMe.regex' => 'aboutMe can only contain letters, numbers and whitespaces.',
            'aboutMe.max' => 'about me characters exceed limit',
            'telephone.regex' => 'telephone type invalid',
            'telephone.max' => 'telephone should have only 10 numbers',
            'telephone.min' => 'telephone should have only 10 numbers',
        ]
    ];
}
