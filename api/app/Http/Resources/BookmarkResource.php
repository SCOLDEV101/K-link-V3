<?php

namespace App\Http\Resources;

use Illuminate\Http\Request;
use Illuminate\Http\Resources\Json\JsonResource;
use App\Models\UserModel;

class BookmarkResource extends JsonResource
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
        if ($this->group->groupDay) {
            foreach ($this->group->groupDay as $day) {
                $days[] = $day->name ?? null;
            }
        }
    
        $tags = [];
        if ($this->group->groupTag) {
            foreach ($this->group->groupTag as $tag) {
                $tags[] = $tag->name ?? null;  
            }
        }

        $status = 'join'; //กลุ่มไม่เต็ม เข้าได้
        $members = [];
        if ($this->group->member) {
            foreach ($this->group->member as $eachMember) {
                $members[] = $eachMember->id;  
            }
        }

        $requests = [];
        if ($this->group->request) {
            foreach ($this->group->request as $eachRequest) {
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
        if ($this->group->bookmark) {
            foreach ($this->group->bookmark as $eachBookmark) {
                $bookmarkArray[] = $eachBookmark->id;  
            }
        }

        if (in_array($uID, $bookmarkArray)) {
            $bookmark = true; //บันทึกกลุ่มแล้ว
        } 

        if ($this->group->type == 'hobby') {

            if (count($members) >= $this->group->hobby->memberMax && $this->group->hobby->memberMax != null && !in_array($uID, $members)) {
                $status = 'full'; //กลุ่มเต็ม
            }

            if ($this->group->hobby->leaderGroup->id == $uID) {
                $role = 'leader';
                $isLeader = true;
            } else {
                $role = 'normal';
            };
    
            return [
                'groupID' => $this->group->hobby->id,
                'type' => $this->group->type,
                'image' => $this->group->hobby->imageOrFile->name ?? 'group-default.jpg',
                'tag' => $tags,
                'member' => count($members),
                'request' => count($requests),
                'memberMax' => $this->group->hobby->memberMax,
                'activityName' => $this->group->hobby->name,
                'leader' => $this->group->hobby->leaderGroup->username,
                'weekDate' => $days,
                'startTime' => $this->group->hobby->startTime,
                'endTime' => $this->group->hobby->endTime,
                'location' => $this->group->hobby->location,
                'detail' => $this->group->hobby->detail,
                'userstatus' => $status,
                'role' => $role,
                'bookmark' => $bookmark ?? false,
                'FilterTag' => array(
                    'isMember'=>$isMember ?? false,
                    'isRequest'=>$isRequest ?? false,
                    'isLeader'=>$isLeader ?? false,
                    'isHobby'=> true,
                ),
            ];
        }
        
        if ($this->group->type == 'tutoring') {

            if (count($members) >= $this->group->tutoring->memberMax && $this->group->tutoring->memberMax != null && !in_array($uID, $members)) {
                $status = 'full'; //กลุ่มเต็ม
            }
            
            if ($this->group->tutoring->leaderGroup->id == $uID) {
                $role = 'leader';
                $isLeader = true;
            } else {
                $role = 'normal';
            };

            return [
                'groupID' => $this->group->tutoring->id,
                'type' => $this->group->type,
                'tag' => $tags,
                'image' => $this->group->tutoring->imageOrFile->name ?? 'group-default.jpg',
                'member' => count($members),
                'request' => count($requests),
                'memberMax' => $this->group->tutoring->memberMax,
                'activityName' => $this->group->tutoring->name,
                'leader' => $this->group->tutoring->leaderGroup->username,
                'location' => $this->group->tutoring->location,
                'detail' => $this->group->tutoring->detail,
                'Starttime' => $this->group->tutoring->startTime,
                'Endtime' => $this->group->tutoring->endTime,
                'date' => $this->group->tutoring->date,
                'faculty' => $this->group->tutoring->faculty->nameTH ?? $this->group->tutoring->major->nameEN ?? 'Unknown',
                'major' => $this->group->tutoring->major->nameTH ?? $this->group->tutoring->major->nameEN ?? 'Unknown',
                'section' => $this->group->tutoring->department->name ?? 'Unknown',
                'role' => $role,
                'userstatus' => $status,
                'bookmark' => $bookmark ?? false,
                'FilterTag' => array(
                    'isMember'=>$isMember ?? false,
                    'isRequest'=>$isRequest ?? false,
                    'isLeader'=>$isLeader ?? false,
                    'isTutoring'=> true,
                ),
            ];
        }
        if ($this->group->type == 'library') {

            if ($this->group->library->leaderGroup->id == $uID) {
                $role = 'leader';
                $isLeader = true;
            } else {
                $role = 'normal';
            };

            return [
                'groupID' => $this->group->library->id,
                'type' => $this->group->type,
                'image' => '/uploaded/hobbyImage/'.$this->library->imageOrFile->name,
                'tag' => $tags,
                'activityName' => $this->group->library->name,
                'faculty' => $this->group->library->faculty->nameTH ?? $this->group->library->major->nameEN ?? 'Unknown',
                'major' => $this->group->library->major->nameTH ?? $this->group->library->major->nameEN ?? 'Unknown',
                'section' => $this->group->library->department->name ?? 'Unknown',
                'leader' => $this->group->library->leaderGroup->username,
                'detail' => $this->group->library->detail,
                'downloaded' => $this->group->library->download,
                'role' => $role,
                'bookmark' => $bookmark ?? false,
                'FilterTag' => array(
                    'isMember'=>$isMember ?? false,
                    'isRequest'=>$isRequest ?? false,
                    'isLeader'=>$isLeader ?? false,
                    'isLibrary'=>$isLibrary ?? true,
                ),
            ];
        }
    }
}
