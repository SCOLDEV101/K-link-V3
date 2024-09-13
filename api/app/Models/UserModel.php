<?php

namespace App\Models;

use Illuminate\Database\Eloquent\Factories\HasFactory;
use Illuminate\Database\Eloquent\Model;
use Illuminate\Database\Eloquent\Relations\BelongsTo;
use App\Models\FacultyModel;
use Illuminate\Notifications\Notifiable;
use Laravel\Sanctum\HasApiTokens;

class UserModel extends Model
{
    use HasFactory, HasApiTokens, Notifiable;

    protected $guard = [ 'id' ];

    protected $primaryKey = 'id';

    protected $fillable = [
        'facultyID','majorID','imageOrFileID',
        'roleID','username','fullname',
        'aboutMe','telephone','email',
        'status'
    ];

    protected $hidden = [
        'password',
    ];

    public static $defaultUser = [
        ['id'=>'65010111','username'=>'สบายดี','fullname'=>'นายไอโอที-1','aboutMe'=>'ชอบเล่นฟุตบอล วันหยุดมักจะไปเที่ยวกับเพื่อน เก่งแคลคูลัส',
        'telephone'=>'065-0650111','email'=>'65010111@kmitl.ac.th','facultyID'=>'1','majorID'=>'ENG11',
        'roleID'=>'100'],
        ['id'=>'65010222','username'=>'พิชัย','fullname'=>'นายไอโอที-2','aboutMe'=>'เป็นประธานชมรมยิงปืน ตัวแทนนักกีฬา',
        'telephone'=>'065-0650222','email'=>'65010222@kmitl.ac.th','facultyID'=>'1','majorID'=>'ENG12',
        'roleID'=>'100'],
        ['id'=>'65010333','username'=>'หวาน','fullname'=>'นางสาวไอโอที-1','aboutMe'=>'ประธานรุ่นปี 2565 ปัจจุบันเรียนอยู่ปี 3 เคลไปแลกเปลี่ยนที่ฝรั่งเศษ เรียนเก่งมาก',
        'telephone'=>'065-0650333','email'=>'65010333@kmitl.ac.th','facultyID'=>'1','majorID'=>'ENG13',
        'roleID'=>'100'],
        ['id'=>'65010444','username'=>'โจน','fullname'=>'นายไอโอที-3','aboutMe'=>'ลูกครึ่งไทย-แคนนาดา รับงานแสดงเป็นบางครั้ง ไม่ชอบกินเผ็ด',
        'telephone'=>'065-0650444','email'=>'65010444@kmitl.ac.th','facultyID'=>'1','majorID'=>'ENG14',
        'roleID'=>'100'],
        ['id'=>'65010555','username'=>'ซินดี้','fullname'=>'นางสาวไอโอที-2','aboutMe'=>'เป็นคนใต้ที่ไม่กินเผ็ด กลัวผีแต่ก็ชอบดูหนังผี',
        'telephone'=>'065-0650555','email'=>'65010555@kmitl.ac.th','facultyID'=>'1','majorID'=>'ENG15',
        'roleID'=>'100']
    ];

    public function faculty(): BelongsTo {
        return $this->belongsTo(FacultyModel::class, 'facultyID', 'facultyID'); //ใช้คอลัมน์ uID ของ UserModel เป็นคีย์
    }

    public static function bookmark() {
        $userDb = UserModel::where('id',auth()->user()->id)->first();
        $bookmark = explode(',', $userDb->bookmark);
        return HobbyModel::whereIn('hID', $bookmark)->get();
    }

    public function searchUser($keyword)
    {
        if (!empty($keyword)) {
            $query = UserModel::Select('*')
            ->leftJoin('faculty_models', 'faculty_models.facultyID', '=', 'user_models.facultyID')
            ->where(function ($query) use ($keyword) {
                return $query->where('user_models.status', '=', 1)
                    ->where('user_models.id', 'like', "%$keyword%")
                    ->orwhere('user_models.id', 'like', "%$keyword")
                    ->orwhere('user_models.id', 'like', "$keyword%")
                    ->orwhere('user_models.fullname', 'like', "%$keyword%")
                    ->orwhere('user_models.fullname', 'like', "%$keyword")
                    ->orwhere('user_models.fullname', 'like', "$keyword%")
                    ->orwhere('user_models.username', 'like', "%$keyword%")
                    ->orwhere('user_models.username', 'like', "%$keyword")
                    ->orwhere('user_models.username', 'like', "$keyword%")
                    ->orwhere('faculty_models.facultyNameTH', 'like', "%$keyword%")
                    ->orwhere('faculty_models.facultyNameTH', 'like', "%$keyword")
                    ->orwhere('faculty_models.facultyNameTH', 'like', "$keyword%")
                    ->orwhere('faculty_models.facultyNameEN', 'like', "%$keyword%")
                    ->orwhere('faculty_models.facultyNameEN', 'like', "%$keyword")
                    ->orwhere('faculty_models.facultyNameEN', 'like', "$keyword%");
            });
        } else {
            $query = UserModel::select('*');
        }
        $query->orderBy('user_models.updated_at', 'DESC');
        $result = $query->get();
        return $result;
    }

    public static $validator = [
        [
            'username' => ['required','string'],
            'fullname' => ['required','string'],
            'aboutMe' => ['nullable','string'],
            'telephone' => ['required','string'],
        ],
        [
            'username.required' => 'username required',
            'username.string' => 'username string invalid',
            'fullname.required' => 'fullname required',
            'fullname.string' => 'fullname string invalid',
            'aboutMe.string' => 'aboutMe string invalid',
            'telephone.required' => 'telephone required',
            'telephone.string' => 'telephone string invalid',
        ]
    ];
}
