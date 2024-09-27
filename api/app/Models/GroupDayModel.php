<?php

namespace App\Models;

use Illuminate\Database\Eloquent\Factories\HasFactory;
use Illuminate\Database\Eloquent\Model;

class GroupDayModel extends Model
{
    protected $fillable = [
        'dayID',
        'groupID',
    ];

    use HasFactory;
}
