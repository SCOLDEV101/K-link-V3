<?php

namespace App\Http\Resources;

use Illuminate\Http\Request;
use Illuminate\Http\Resources\Json\JsonResource;
use App\Models\FacultyModel;
use App\Models\MajorModel;
use App\Models\imageOrFileModel;

class UserResource extends JsonResource
{
    /**
     * Transform the resource into an array.
     *
     * @return array<string, mixed>
     */
    public function toArray($request)
    {
        $faculty = FacultyModel::select('id','nameTH','nameEN')->where('id', $this->facultyID)->first();
        $major = MajorModel::select('id','nameTH','nameEN')->where('id', $this->majorID)->first();
        $image = imageOrFileModel::select('id','name')->where('id',$this->imageOrFileID)->first();
        return [
            'uID' => strval($this->id),
            'type' => 'user',
            'profileImage' => $image->name ?? null,
            'username' => $this->username,
            'fullname' => $this->fullname,
            'email' => $this->email,
            'telephone' => $this->telephone,
            'faculty' => $faculty->nameTH ?? $faculty->nameEN,
            'major' => $major->nameTH ?? $major->nameEN,
            'aboutMe' => $this->aboutMe,
        ];
    }
}
