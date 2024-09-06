<?php

namespace App\Http\Resources;

use Illuminate\Http\Request;
use Illuminate\Http\Resources\Json\JsonResource;
use App\Models\FacultyModel;
use App\Models\MajorModel;

class UserResource extends JsonResource
{
    /**
     * Transform the resource into an array.
     *
     * @return array<string, mixed>
     */
    public function toArray($request)
    {
        $facultyName = FacultyModel::select('facultyID','facultyNameTH','facultyNameEN')->where('facultyID', $this->facultyID)->first();
        $majorName = MajorModel::select('majorID','majorNameTH','majorNameEN')->where('majorID', $this->majorID)->first();
        return [
            'uID' => $this->uID,
            'type' => 'user',
            'profileImage' => $this->profileImage,
            'username' => $this->username,
            'fullname' => $this->fullname,
            'email' => $this->email,
            'telephone' => $this->telephone,
            'faculty' => $facultyName->facultyNameTH ?? $facultyName->facultyNameEN,
            'major' => $majorName->majorNameTH ?? $majorName->majorNameEN,
            'aboutMe' => $this->aboutMe,
        ];
    }
}
