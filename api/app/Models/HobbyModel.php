<?php

namespace App\Models;

use Illuminate\Database\Eloquent\Factories\HasFactory;
use Illuminate\Database\Eloquent\Model;
use Illuminate\Database\Eloquent\Relations\BelongsToMany;
use Illuminate\Database\Eloquent\Relations\BelongsTo;
use Illuminate\Database\Eloquent\Relations\HasMany;
use Illuminate\Database\Eloquent\Relations\HasOne;

class HobbyModel extends Model
{

    use HasFactory;

    protected $primaryKey = 'id';
    public $incrementing = false;
    protected $keyType = 'string';

    protected $fillable = [
        'id',
        'imageOrFileID',
        'name',
        'memberMax',
        'location',
        'detail',
        'startTime',
        'endTime',
        'leader',
        'createdBy'
    ];



    public function leaderGroup(): BelongsTo
    {
        return $this->belongsTo(UserModel::class, 'leader', 'id')->select('id', 'username'); //ใช้คอลัมน์ id ของ UserModel เป็นคีย์ 
    }

    public function imageOrFile(): HasOne
    {
        return $this->hasOne(imageOrFileModel::class, 'id', 'imageOrFileID')->select('id', 'name');
    }

    // public function groupDay(): BelongsToMany {
    //     return $this->belongsToMany(DayModel::class, 'group_day_models', 'id', 'id'); //
    // }

    // public function groupTag(): BelongsToMany {
    //     return $this->belongsToMany(GroupTagModel::class,'hID','hID');
    // }

    // public function imageOrFile(): HasOne {
    //     return $this->hasOne(imageOrFileModel::class,'hID','hID');
    // }

    // public function member() {
    //     $memberArray = explode(',', $this->member);
    //     return UserModel::whereIn('id', $memberArray)->get();
    // } 

    // public function request() {
    //     $requestArray = explode(',', $this->memberRequest);
    //     return UserModel::whereIn('id', $requestArray)->get();
    // } 

    public static $validator = [
        [
            'activityName' => ['required', 'regex:/^[a-zA-Z0-9ก-๙\s]+$/u'],
            'tag' => ['sometimes', 'regex:/^[a-zA-Z0-9ก-๙,\s]+$/u'],
            'startTime' => ['required', 'regex:/^[0-9:]+$/u'],
            'endTime' => ['required', 'regex:/^[0-9:]+$/u'],
            'image'=> ['sometimes','mimes:png,jpg,jpeg,gif'],
            'deleteimage'=> ['sometimes','nullable'],
            'memberMax' => ['nullable', 'regex:/\b([0-9]|[1-9][0-9])\b/'],
            'location' => ['required', 'regex:/^[a-zA-Z0-9ก-๙\s]+$/u'],
            'weekDate' => ['nullable', 'regex:/^[ก-๙.,]+$/u'],
            'detail' => ['nullable', 'regex:/^[a-zA-Z0-9ก-๙\s]+$/u'],
        ],
        [
            'activityName.required' => 'hobby name required',
            'activityName.regex' => 'hobby name can only contain letters, numbers and whitespaces',
            'image.mimes'=>"group image only allow png,jpg,jpeg,gif",
            'tag.regex' => 'tag have invalid characters',
            'startTime.required' => 'activity start time is required',
            'startTime.regex' => 'start time type invalid',
            'endTime.required' => 'end time is required',
            'endTime.regex' => 'end time type invalid',
            'memberMax.regex' => 'max member type invalid',
            'location.required' => 'location required',
            'location.regex' => 'location can only contain letters, numbers and whitespaces',
            'weekDate.regex' => 'week date type invalid',
            'detail.regex' => 'detail can only contain letters, numbers and whitespaces.',
        ]
    ];

    public function idGeneration()
    {
        $prefix = 'h-' . now()->format('Ymd') . '-';
        $lastGroup = GroupModel::where([['type', "hobby"], ['groupID', 'LIKE', $prefix . '%']])->orderBy('groupID', 'desc')->first();
        if (!$lastGroup) {
            $number = '001';
        } else {
            $lastNumber = (int)substr($lastGroup->groupID, -3);
            $number = str_pad($lastNumber + 1, 3, '0', STR_PAD_LEFT);
        }

        return $prefix . $number;
    }
}
