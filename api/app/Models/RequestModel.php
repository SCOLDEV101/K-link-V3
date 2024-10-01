<?php

namespace App\Models;

use Illuminate\Database\Eloquent\Factories\HasFactory;
use Illuminate\Database\Eloquent\Model;

class RequestModel extends Model
{
    use HasFactory;

    protected $fillable = [
        'userID',
        'groupID'
    ];

    public static $validator = [
        [
            'userID' => ['required', 'regex:/^[0-9]+$/u'],
            'method' => ['required', 'regex:/accept|reject/u'],
        ],
        [
            'userID.required' => 'userID is required for this action',
            'userID.regex' => 'invalid input for userID',
            'method.required' => 'method is required for this action',
            'method.regex' => 'invalid input for method'
        ]
    ];
}
