<?php

namespace App\Models;

use Illuminate\Database\Eloquent\Factories\HasFactory;
use Illuminate\Database\Eloquent\Model;

class DayModel extends Model
{
    public static $Day = [
        ['name' => 'จ.'],
        ['name' => 'อ.'],
        ['name' => 'พ.'],
        ['name' => 'พฤ.'],
        ['name' => 'ศ.'],
        ['name' => 'ส.'],
        ['name' => 'อา.'],
    ];
    
    use HasFactory;
}
