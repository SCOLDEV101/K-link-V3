<?php

namespace App\Models;

use Illuminate\Database\Eloquent\Factories\HasFactory;
use Illuminate\Database\Eloquent\Model;
use Illuminate\Database\Eloquent\Relations\BelongsTo;
use Illuminate\Database\Eloquent\Relations\HasMany;
use Illuminate\Database\Eloquent\Relations\HasOne;
class HobbyModel extends Model
{
    
    use HasFactory;

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
        return $this->belongsTo(UserModel::class, 'leader', 'id'); //ใช้คอลัมน์ id ของ UserModel เป็นคีย์ 
    }

    public function library(): HasOne {
        return $this->hasOne(LibraryModel::class,'hID','hID');
    }

    public function tutoring(): HasOne {
        return $this->hasOne(TutoringModel::class,'hID','hID');
    }

    public function member() {
        $memberArray = explode(',', $this->member);
        return UserModel::whereIn('id', $memberArray)->get();
    } 

    public function request() {
        $requestArray = explode(',', $this->memberRequest);
        return UserModel::whereIn('id', $requestArray)->get();
    } 

    public function searchHobby($keyword,$type) {
        if (!empty($keyword)) {
            $query = HobbyModel::Select('*')
            ->LeftJoin('user_models','hobby_models.leader','=','user_models.id')
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
