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
        'id' , 'receiverID' , 'senderID' , 'postID' , 'type'
    ];

    use HasFactory;

    public function sendBy(): BelongsTo {
        return $this->belongsTo(UserModel::class, 'senderID', 'id');
    }

    public function hobby(): BelongsTo {
        return $this->belongsTo(HobbyModel::class, 'id', 'postID');
    }    

    // public function library(): BelongsTo {
    //     return $this->belongsTo(LibraryModel::class, 'id', 'hID');
    // }

    // public function tutoring(): BelongsTo {
    //     return $this->belongsTo(TutoringModel::class, 'id', 'hID');
    // }
}
