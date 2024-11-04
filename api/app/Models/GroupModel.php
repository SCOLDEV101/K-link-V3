<?php

namespace App\Models;

use Illuminate\Database\Eloquent\Factories\HasFactory;
use Illuminate\Database\Eloquent\Model;
use Illuminate\Database\Eloquent\Relations\BelongsTo;
use Illuminate\Database\Eloquent\Relations\HasMany;
use Illuminate\Database\Eloquent\Relations\HasOne;
use Illuminate\Database\Eloquent\Relations\BelongsToMany;

class GroupModel extends Model
{
    protected $fillable = [
        'groupID',
        'type',
    ];

    // public function leaderGroup(): BelongsTo {
    //     return $this->belongsTo(UserModel::class, 'leader', 'id'); //ใช้คอลัมน์ id ของ UserModel เป็นคีย์ 
    // }

    public function groupDay(): BelongsToMany
    {
        return $this->belongsToMany(DayModel::class, 'group_day_models', 'groupID', 'dayID')->orderBy('id')->select('day_models.id', 'day_models.name'); // group_day_models เป็นตารางเชื่อม โดยเก็บ groupID และ dayID 
    }

    public function groupTag(): BelongsToMany
    {
        return $this->belongsToMany(TagModel::class, 'group_tag_models', 'groupID', 'tagID')->orderBy('name')->select('tag_models.id', 'tag_models.name'); // group_tag_models เป็นตารางเชื่อม โดยเก็บ groupID และ tagID 
    }

    public function member(): BelongsToMany
    {
        return $this->belongsToMany(UserModel::class, 'member_models', 'groupID', 'userID')->select('user_models.id', 'user_models.username');
    }

    public function request(): BelongsToMany
    {
        return $this->belongsToMany(UserModel::class, 'request_models', 'groupID', 'userID')->select('user_models.id', 'user_models.username');
    }

    public function bookmark(): BelongsToMany
    {
        return $this->belongsToMany(UserModel::class, 'bookmark_models', 'groupID', 'userID')->select('user_models.id');
    }

    public function hobby(): HasOne
    {
        return $this->hasOne(HobbyModel::class, 'id', 'groupID');
    }

    public function library(): HasOne
    {
        return $this->hasOne(LibraryModel::class, 'id', 'groupID');
    }

    public function tutoring(): HasOne
    {
        return $this->hasOne(TutoringModel::class, 'id', 'groupID');
    }

    use HasFactory;

    public static $searchValidator = [
        ['keyword' => ['nullable', 'regex:/^[a-zA-Z0-9ก-๙\s]+$/u']],
        ['keyword.regex' => 'keyword can only contain letters, numbers and whitespaces.']
    ];
}
