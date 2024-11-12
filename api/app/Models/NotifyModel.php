<?php

namespace App\Models;

use Illuminate\Database\Eloquent\Factories\HasFactory;
use Illuminate\Database\Eloquent\Model;
use Illuminate\Database\Eloquent\Relations\BelongsTo;

class NotifyModel extends Model
{
    protected $guard = [ 'id' ];
    protected $casts = [
        'id' => 'string',
    ];
    protected $fillable = [
        'id' , 'receiverID' , 'senderID' , 'postID' , 'type' , 'reportID'
    ];

    use HasFactory;

    public function group(): BelongsTo {
        return $this->belongsTo(GroupModel::class, 'postID', 'groupID');
    }

    public function receiver(): BelongsTo {
        return $this->belongsTo(UserModel::class, 'receiverID', 'id')->select('user_models.username', 'user_models.id');
    }    

    public function sender(): BelongsTo {
        return $this->belongsTo(UserModel::class, 'senderID', 'id')->select('user_models.username', 'user_models.id', 'user_models.imageOrFileID');
    }    

    public function report(): BelongsTo {
        return $this->belongsTo(ReportedModel::class, 'reportID', 'id')->select('reported_models.title', 'reported_models.id');
    }    

    // public function library(): BelongsTo {
    //     return $this->belongsTo(LibraryModel::class, 'id', 'hID');
    // }

    // public function tutoring(): BelongsTo {
    //     return $this->belongsTo(TutoringModel::class, 'id', 'hID');
    // }
}
