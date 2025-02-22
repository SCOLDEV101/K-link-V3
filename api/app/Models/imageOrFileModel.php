<?php

namespace App\Models;

use Illuminate\Database\Eloquent\Factories\HasFactory;
use Illuminate\Database\Eloquent\Model;

class imageOrFileModel extends Model
{
    use HasFactory;

    protected $guard = [ 'id' ];
    
    // protected $casts = [
    //     'id' => 'string',
    // ];
    protected $fillable = [
        'id' , 'name'
    ];

    public static $groupImageStatic = [
        ['name' => 'hobby-group-default.png'], 
        ['name' => 'tutoring-group-default.png'],
        ['name' => 'library-group-default.png'],
        // ['name' => 'hobby-group1.jpg'],
        // ['name' => 'hobby-group2.jpg'],
        // ['name' => 'hobby-group3.png'],
        // ['name' => 'hobby-group4.jpg'],
        // ['name' => 'tutoring-group1.jpg'],
        // ['name' => 'tutoring-group2.jpg'],
        // ['name' => 'tutoring-group3.png'],
        // ['name' => 'tutoring-group4.jpg']
    ];

    public static $profileImageStatic = [
        // ['name' => 'profile-user1.jpg'], 
        // ['name' => 'profile-user2.jpg'],
        ['name' => 'profile-default.svg'],
    ];

    public static $fileStatic = [
        ['name' => 'library-Rev1_1.pdf'], 
        ['name' => 'library-LeanStartup.pdf'],
    ];
}
