<?php

namespace App\Http\Resources;

use Illuminate\Http\Request;
use Illuminate\Http\Resources\Json\JsonResource;
use App\Models\UserModel;
use setasign\Fpdi\Fpdi;

class MyPostResource extends JsonResource
{
    /**
     * Transform the resource into an array.
     *
     * @return array<string, mixed>
     */
    public function toArray($request)
    {
        $uID = auth()->user()->id;
        $days = [];

        $isMember = false;
        $isRequest = false;
        $isLeader = false;

        if ($this->groupDay) {
            foreach ($this->groupDay as $day) {
                $days[] = $day->name ?? null;
            }
        }
    
        $tags = [];
        if ($this->groupTag) {
            foreach ($this->groupTag as $tag) {
                $tags[] = $tag->name ?? null;  
            }
        }

        $status = 'join'; //กลุ่มไม่เต็ม เข้าได้
        $members = [];
        if ($this->member) {
            foreach ($this->member as $eachMember) {
                $members[] = $eachMember->id;  
            }
        }

        $requests = [];
        if ($this->request) {
            foreach ($this->request as $eachRequest) {
                $requests[] = $eachRequest->id;  
            }
        }

        if (in_array($uID, $members)) {
            $status = 'member'; //เป็นสมาชิกแล้ว
            $isMember = true;
        }

        if (in_array($uID, $requests)) {
            $status = 'request'; //ส่งคำขอเข้าร่วมแล้ว
            $isRequest = true;
        }

        $bookmarkArray = [];
        if ($this->bookmark) {
            foreach ($this->bookmark as $eachBookmark) {
                $bookmarkArray[] = $eachBookmark->id;  
            }
        }

        if (in_array($uID, $bookmarkArray)) {
            $bookmark = true; //บันทึกกลุ่มแล้ว
        } 

        if ($this->type == 'hobby') {

            if($isMember == false && $isRequest == false){
                return null;
            }

            if (count($members) >= $this->hobby->memberMax && $this->hobby->memberMax != null && !in_array($uID, $members)) {
                $status = 'full'; //กลุ่มเต็ม
            }

            if ($this->hobby->leaderGroup->id == $uID) {
                $role = 'leader';
                $isLeader = true;
            } else {
                $role = 'normal';
            };
            
            return [
                'groupID' => $this->hobby->id,
                'type' => $this->type,
                'image' => $this->hobby->imageOrFile->name ?? 'group-default.jpg',
                'tag' => $tags,
                'member' => count($members),
                'request' => count($requests),
                'memberMax' => $this->hobby->memberMax,
                'activityName' => $this->hobby->name,
                'leader' => $this->hobby->leaderGroup->username,
                'weekDate' => $days,
                'startTime' => $this->hobby->startTime,
                'endTime' => $this->hobby->endTime,
                'location' => $this->hobby->location,
                'detail' => $this->hobby->detail,
                'userstatus' => $status,
                'role' => $role,
                'bookmark' => $bookmark ?? false,
                'FilterTag' => array(
                    'isMember'=>$isMember ?? false,
                    'isRequest'=>$isRequest ?? false,
                    'isLeader'=>$isLeader ?? false,
                    // 'isHobby'=> true,
                ),
            ];
        }
        
        if ($this->type == 'tutoring') {

            if($isMember == false && $isRequest == false){
                return null;
            }

            if (count($members) >= $this->tutoring->memberMax && $this->tutoring->memberMax != null && !in_array($uID, $members)) {
                $status = 'full'; //กลุ่มเต็ม
            }
            
            if ($this->tutoring->leaderGroup->id == $uID) {
                $role = 'leader';
                $isLeader = true;
            } else {
                $role = 'normal';
            };

            return [
                'groupID' => $this->tutoring->id,
                'type' => $this->type,
                'tag' => $tags,
                'image' => $this->tutoring->imageOrFile->name ?? 'group-default.jpg',
                'member' => count($members),
                'request' => count($requests),
                'memberMax' => $this->tutoring->memberMax,
                'activityName' => $this->tutoring->name,
                'leader' => $this->tutoring->leaderGroup->username,
                'location' => $this->tutoring->location,
                'detail' => $this->tutoring->detail,
                'Starttime' => $this->tutoring->startTime,
                'Endtime' => $this->tutoring->endTime,
                'date' => $this->tutoring->date,
                'faculty' => $this->tutoring->faculty->nameTH ?? $this->tutoring->major->nameEN ?? 'Unknown',
                'major' => $this->tutoring->major->nameTH ?? $this->tutoring->major->nameEN ?? 'Unknown',
                'section' => $this->tutoring->department->name ?? 'Unknown',
                'role' => $role,
                'userstatus' => $status,
                'bookmark' => $bookmark ?? false,
                'FilterTag' => array(
                    'isMember'=>$isMember ?? false,
                    'isRequest'=>$isRequest ?? false,
                    'isLeader'=>$isLeader ?? false,
                    // 'isTutoring'=> true,
                ),
            ];
        }

        if ($this->type == 'library') {

            if ($this->library->leaderGroup->id == $uID) {
                $role = 'leader';
                $isLeader = true;
            } else {
                $role = 'normal';
            };

            if($isLeader == false){
                return null;
            }

            return [
                'groupID' => $this->library->id,
                'type' => $this->type,
                'img' => $this->library->imageOrFile->name ?? 'group-default.jpg',
                'tag' => $tags,
                'activityName' => $this->library->name,
                'faculty' => $this->library->faculty->nameTH ?? $this->library->major->nameEN ?? 'Unknown',
                'major' => $this->library->major->nameTH ?? $this->library->major->nameEN ?? 'Unknown',
                'section' => $this->library->department->name ?? 'Unknown',
                'leader' => $this->library->leaderGroup->username,
                'detail' => $this->library->detail,
                'downloaded' => $this->library->download,
                'role' => $role,
                'bookmark' => $bookmark ?? false,
                'FilterTag' => array(
                    'isMember'=>$isMember ?? false,
                    'isRequest'=>$isRequest ?? false,
                    'isLeader'=>$isLeader ?? false,
                    // 'isLibrary'=> true,
                ),
            ];
        }
    }
}