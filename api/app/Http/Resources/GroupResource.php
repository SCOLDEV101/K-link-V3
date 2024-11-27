<?php

namespace App\Http\Resources;

use Illuminate\Http\Request;
use Illuminate\Http\Resources\Json\JsonResource;
use Illuminate\Support\Facades\File;

class GroupResource extends JsonResource
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
            if ($this->hobby->memberMax == null || count($members) < $this->hobby->memberMax) {
                $status = 'join';
                if (in_array($uID, $requests)) {
                    $status = 'request'; //ส่งคำขอเข้าร่วมแล้ว
                } else if (in_array($uID, $members)) {
                    $status = 'member'; //เป็นสมาชิกแล้ว
                }
            } else if (count($members) >= $this->hobby->memberMax) {
                $status = 'full'; //กลุ่มเต็ม
            }

            if ($this->hobby->leaderGroup->id == $uID) {
                $role = 'leader';
                $status = 'member';
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
                ];
            } else {
                $role = 'normal';
                return [
                    'groupID' => $this->hobby->id,
                    'type' => $this->type,
                    'image' => $this->hobby->imageOrFile->name ?? 'group-default.jpg',
                    'tag' => $tags,
                    'member' => count($members),
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
                ];
            };

            
        }

        if ($this->type == 'tutoring') {
            if ($this->tutoring->memberMax == null || count($members) < $this->tutoring->memberMax) {
                $status = 'join';
                if (in_array($uID, $requests)) {
                    $status = 'request'; //ส่งคำขอเข้าร่วมแล้ว
                } else if (in_array($uID, $members)) {
                    $status = 'member'; //เป็นสมาชิกแล้ว
                }
            } else if (count($members) >= $this->tutoring->memberMax) {
                $status = 'full'; //กลุ่มเต็ม
            }

            if ($this->tutoring->leaderGroup->id == $uID) {
                $role = 'leader';
                $status = 'member';
                return [
                    'groupID' => $this->tutoring->id,
                    'type' => $this->type,
                    'tag' => $tags,
                    'image' => $this->tutoring->imageOrFile->name ?? 'group-default.jpg',
                    'member' => count($members),
                    'request' => count($requests),
                    'memberMax' => $this->tutoring->memberMax,
                    'activityName' => $this->tutoring->name,
                    'teachBy' => $this->tutoring->leaderGroup->username,
                    'location' => $this->tutoring->location,
                    'detail' => $this->tutoring->detail,
                    'startTime' => $this->tutoring->startTime,
                    'endTime' => $this->tutoring->endTime,
                    'date' => $this->tutoring->date,
                    'faculty' => $this->tutoring->faculty->nameTH ?? $this->tutoring->major->nameEN ?? 'Unknown',
                    'major' => $this->tutoring->major->nameTH ?? $this->tutoring->major->nameEN ?? 'Unknown',
                    'department' => $this->tutoring->department->name ?? 'Unknown',
                    'role' => $role,
                    'userstatus' => $status,
                    'bookmark' => $bookmark ?? false
                ];
            } else {
                $role = 'normal';
                return [
                    'groupID' => $this->tutoring->id,
                    'type' => $this->type,
                    'tag' => $tags,
                    'image' => $this->tutoring->imageOrFile->name ?? 'group-default.jpg',
                    'member' => count($members),
                    'memberMax' => $this->tutoring->memberMax,
                    'activityName' => $this->tutoring->name,
                    'teachBy' => $this->tutoring->leaderGroup->username,
                    'location' => $this->tutoring->location,
                    'detail' => $this->tutoring->detail,
                    'startTime' => $this->tutoring->startTime,
                    'endTime' => $this->tutoring->endTime,
                    'date' => $this->tutoring->date,
                    'faculty' => $this->tutoring->faculty->nameTH ?? $this->tutoring->major->nameEN ?? 'Unknown',
                    'major' => $this->tutoring->major->nameTH ?? $this->tutoring->major->nameEN ?? 'Unknown',
                    'department' => $this->tutoring->department->name ?? 'Unknown',
                    'role' => $role,
                    'userstatus' => $status,
                    'bookmark' => $bookmark ?? false
                ];
            };

            
        }
        if ($this->type == 'library') {
            $filename = basename($this->library->imageOrFile->name, '.pdf');
            $imagePath = public_path("\\pdfImage\\" . $filename);
            $totalpages = 0;
            if (File::exists($imagePath)) {
                $allpages = File::files($imagePath);
                $totalpages = count($allpages);
            }
            if ($this->library->createdBy == $uID) {
                $role = 'leader';
            } else {
                $role = 'normal';
            };

            return [
                'groupID' => $this->library->id,
                'type' => $this->type,
                'image' => '/uploaded/hobbyImage/'.$this->library->imageOrFile->name ?? 'group-default.jpg',//'/pdfImage/' . basename($this->library->imageOrFile->name, '.pdf') . '/output_page_1.jpg' ?? "/uploaded/hobbyImage/library-group-default.png",
                'tag' => $tags,
                'activityName' => $this->library->name,
                'faculty' => $this->library->faculty->nameTH ?? $this->library->major->nameEN ?? 'Unknown',
                'major' => $this->library->major->nameTH ?? $this->library->major->nameEN ?? 'Unknown',
                'department' => $this->library->department->name ?? 'Unknown',
                'leader' => $this->library->leaderGroup->username,
                'detail' => $this->library->detail,
                'totalpages' => $totalpages,
                'downloaded' => $this->library->download,
                'role' => $role,
                'bookmark' => $bookmark ?? false
            ];
        }
    }
}
