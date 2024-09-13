<?php

namespace App\Models;

use Illuminate\Database\Eloquent\Factories\HasFactory;
use Illuminate\Database\Eloquent\Model;

class imageOrFileModel extends Model
{
    use HasFactory;

    protected $guard = [ 'id' ];
    
    protected $casts = [
        'id' => 'string',
    ];
    protected $fillable = [
        'id' , 'name'
    ];

    public static $groupImageStatic = ['hobby-group1.jpg','hobby-group2.jpg','hobby-group3.jpg','hobby-group4.jpg'];
    public static $profileImageStatic = ['profile-user1.jpg','profile-user2.jpg'];
    public static $fileStatic = ['library-Rev1_1.pdf','library-LeanStartup.pdf'];
}
