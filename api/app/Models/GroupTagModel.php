<?php

namespace App\Models;

use Illuminate\Database\Eloquent\Factories\HasFactory;
use Illuminate\Database\Eloquent\Model;
use Illuminate\Database\Eloquent\Relations\belongsTo;

class GroupTagModel extends Model
{
    protected $fillable = [
        'tagID' , 'groupID' , 'type'
    ];

    use HasFactory;

    public function tagName(): BelongsTo
    {
        return $this->belongsTo(TagModel::class, 'tagID', 'id');
    }
}
