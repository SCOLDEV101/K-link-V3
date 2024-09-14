<?php

namespace App\Models;

use Illuminate\Database\Eloquent\Factories\HasFactory;
use Illuminate\Database\Eloquent\Model;

class GroupModel extends Model
{
    protected $fillable = [
        'groupID',
        'type',
    ];
    
    use HasFactory;
}
