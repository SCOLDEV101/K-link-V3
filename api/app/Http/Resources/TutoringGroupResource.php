<?php

namespace App\Http\Resources;

use Illuminate\Http\Request;
use Illuminate\Http\Resources\Json\JsonResource;
use App\Models\UserModel;

class TutoringGroupResource extends JsonResource
{
    /**
     * Transform the resource into an array.
     *
     * @return array<string, mixed>
     */
    public function toArray(Request $request): array
    {
        $members = explode(',', $this->member);
        $status = 'join';
        $requestmembers = explode(',', $this->memberRequest);
        $uID = auth()->user()->uID;

        if($this->leader == $uID){
            $role = 'leader';
        }else{
            $role = null;
        };

        $count = 0;
        foreach($requestmembers as $request){
            if($request != null && $request != ""){
                $count++;
            }
        }

        if(in_array($uID,$members)){
            $status = 'member';
        }

        if(in_array($uID,$requestmembers)){
            $status = 'request';
        }
        else if(count($members) >= $this->memberMax && $this->memberMax != null && !in_array($uID,$members)){
            $status = 'full';
        }

        $bookmarkObject = UserModel::bookmark();
        if ($bookmarkObject->contains('hID', $this->hID)) {
            $bookmark = true;
        }
        
        return [
            'hID'=>$this->hID,
            'tutoringID'=>$this->tutoring->tutoringID,
            'type'=>$this->type,
            'tag'=>$this->tag,
            'member'=>count($members),
            'memberMax'=>$this->memberMax,
            'activityName'=>$this->activityName,
            'teachBy'=>$this->leaderGroup->username ?? 'Unknown',
            'date'=>$this->tutoring->date,
            'Starttime'=>$this->tutoring->startTime,
            'Endtime'=>$this->tutoring->endTime,
            'location'=>$this->location,
            'detail'=>$this->detail,
            'faculty'=>$this->tutoring->faculty->facultyNameTH ?? $this->tutoring->faculty->facultyNameEN ?? 'Unknown',
            'major'=>$this->tutoring->major->majorNameTH ?? $this->tutoring->major->majorNameEN ?? 'Unknown',
            'section'=>$this->tutoring->section->sectionName ?? 'Unknown',
            'role'=>$role,
            'request'=>$count,
            'userstatus'=>$status,
            'bookmark'=>$bookmark ?? null
        ];
    }
}
