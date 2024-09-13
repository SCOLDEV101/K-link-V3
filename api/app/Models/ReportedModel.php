<?php

namespace App\Models;

use Illuminate\Database\Eloquent\Factories\HasFactory;
use Illuminate\Database\Eloquent\Model;

class ReportedModel extends Model
{
    protected $guard = ['id'];

    protected $fillable = [
        'id','reportedBy','reportedID',
        'type','title','detail',
        'status'
    ];
    
    protected $casts = [
        'id' => 'string',
    ];

    public static $validator = [
        [
            'title' => ['required'],
            'type' => ['required'],
            'detail' => ['nullable'],
            'id' => ['required', 'string'],
        ],
        [
            'title.required' => 'title is required',
            'type.required' => 'type is required',
            'id.required' => 'report ID is required',
            'id.string' => 'report ID is invalid',
        ]
    ];

    use HasFactory;
}
