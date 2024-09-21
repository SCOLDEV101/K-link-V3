<?php

namespace App\Models;

use Illuminate\Database\Eloquent\Factories\HasFactory;
use Illuminate\Database\Eloquent\Model;

class GroupTagModel extends Model
{
    protected $fillable = [
        'tagID' , 'groupID' , 'type'
    ];

    use HasFactory;
}
