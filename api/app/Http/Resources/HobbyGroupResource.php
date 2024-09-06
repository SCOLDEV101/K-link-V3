<?php

namespace App\Http\Resources;

use Illuminate\Http\Request;
use Illuminate\Http\Resources\Json\JsonResource;
use App\Models\UserModel;

class HobbyGroupResource extends JsonResource
{
    /**
     * Transform the resource into an array.
     *
     * @return array<string, mixed>
     */
    public function toArray($request)
    {
        $status = 'join';
        $members = explode(',', $this->member);
        $requestmembers = explode(',', $this->memberRequest);
        $uID = auth()->user()->uID;

        if ($this->leader == $uID) {
            $role = 'leader';
        } else {
            $role = null;
        };

        $count = 0;
        foreach ($requestmembers as $request) {
            if ($request != null && $request != "") {
                $count++;
            }
        }

        if (count($members) >= $this->memberMax && $this->memberMax != null && !in_array($uID, $members)) {
            $status = 'full';
        }

        if (in_array($uID, $members)) {
            $status = 'member';
        }

        if (in_array($uID, $requestmembers)) {
            $status = 'request';
        }

        $bookmarkObject = UserModel::bookmark();
        if ($bookmarkObject->contains('hID', $this->hID)) {
            $bookmark = true;
        }

        if ($this->type == 'hobby') {
            return [
                'hID' => $this->hID,
                'type' => $this->type,
                'image' => $this->image,
                'tag' => $this->tag,
                'member' => count($members),
                'memberMax' => $this->memberMax,
                'activityName' => $this->activityName,
                'leader' => $this->leaderGroup->username ?? 'Unknown',
                'weekDate' => $this->weekDate,
                'actTime' => $this->actTime,
                'location' => $this->location,
                'detail' => $this->detail,
                'userstatus' => $status,
                'bookmark' => $bookmark ?? null,
            ];
        }
        if ($this->type == 'tutoring') {
            return [
                'hID' => $this->hID,
                'tutoringID' => $this->tutoring->tutoringID,
                'type' => $this->type,
                'tag' => $this->tag,
                'member' => count($members),
                'memberMax' => $this->memberMax,
                'activityName' => $this->activityName,
                'teachBy' => $this->leaderGroup->username ?? 'Unknown',
                'date' => $this->tutoring->date,
                'Starttime' => $this->tutoring->startTime,
                'Endtime' => $this->tutoring->endTime,
                'location' => $this->location,
                'detail' => $this->detail,
                'faculty' => $this->tutoring->faculty->facultyNameTH ?? 'Unknown',
                'major' => $this->tutoring->major->majorNameTH ?? 'Unknown',
                'section' => $this->tutoring->section->sectionName ?? 'Unknown',
                'role' => $role,
                'request' => $count,
                'userstatus' => $status,
                'bookmark' => $bookmark ?? null
            ];
        }
        if ($this->type == 'library') {
            return [
                'lID' => $this->library->libraryID,
                'hID' => $this->hID,
                'type' => $this->type,
                'img' => $this->library->filespath,
                'tag' => $this->tag,
                'activityName' => $this->activityName,
                'Major' => $this->library->faculty->facultyNameTH,
                'leader' => $this->leaderGroup->username ?? 'Unknown',
                'detail' => $this->detail,
                'bookmark' => $bookmark ?? null
            ];
        }
    }
}
