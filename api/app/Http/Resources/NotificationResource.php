<?php

namespace App\Http\Resources;

use Illuminate\Http\Request;
use Illuminate\Http\Resources\Json\JsonResource;

class NotificationResource extends JsonResource
{
    /**
     * Transform the resource into an array.
     *
     * @return array<string, mixed>
     */
    public function toArray($request)
    {
        if ($this->group && $this->group->type == 'hobby') {
            if ($this->type == "report") {
                return [
                    'notiType' => $this->type,
                    'sender' => $this->sender->username,
                    'group' => $this->group->hobby->name ?? null,
                    'groupType' => 'hobby',
                    'groupID' => $this->group->hobby->id,
                    'reportID' => $this->report->title,
                    'createdAt' => $this->created_at
                ];
            } else if ($this->type == "delete") {
                return [
                    'notiType' => $this->type,
                    'sender' => $this->sender->username,
                    'group' => $this->postID ?? null,
                    'groupType' => 'hobby',
                    'groupID' => null,
                    'reportID' => null,
                    'createdAt' => $this->created_at
                ];
            } else {
                return [
                    'notiType' => $this->type,
                    'sender' => $this->sender->username,
                    'group' => $this->group->hobby->name ?? null,
                    'groupType' => 'hobby',
                    'groupID' => $this->group->hobby->id,
                    'reportID' => null,
                    'createdAt' => $this->created_at
                ];
            }
        } else if ($this->group && $this->group->type == 'tutoring') {
            if ($this->type == "report") {
                return [
                    'notiType' => $this->type,
                    'sender' => $this->sender->username,
                    'group' => $this->group->tutoring->name ?? null,
                    'groupType' => 'tutoring',
                    'groupID' => $this->group->tutoring->id,
                    'reportID' => $this->report->title,
                    'createdAt' => $this->created_at
                ];
            } else if ($this->type == "delete") {
                return [
                    'notiType' => $this->type,
                    'sender' => $this->sender->username,
                    'group' => $this->postID ?? null,
                    'groupType' => 'tutoring',
                    'groupID' => null,
                    'reportID' => null,
                    'createdAt' => $this->created_at
                ];
            } else {
                return [
                    'notiType' => $this->type,
                    'sender' => $this->sender->username,
                    'group' => $this->group->tutoring->name ?? null,
                    'groupType' => 'tutoring',
                    'groupID' => $this->group->tutoring->id,
                    'reportID' => null,
                    'createdAt' => $this->created_at
                ];
            }
        } else if ($this->group && $this->group->type == 'library') {
            if ($this->type == "report") {
                return [
                    'notiType' => $this->type,
                    'sender' => $this->sender->username,
                    'group' => $this->group->library->name ?? null,
                    'groupType' => 'library',
                    'groupID' => $this->group->library->id,
                    'reportID' => $this->report->title,
                    'createdAt' => $this->created_at
                ];
            } else {
                return [
                    'notiType' => $this->type,
                    'sender' => $this->sender->username,
                    'group' => $this->group->library->name ?? null,
                    'groupType' => 'library',
                    'groupID' => $this->group->library->id,
                    'reportID' => null,
                    'createdAt' => $this->created_at
                ];
            }
        } else if ($this->type == "delete") {
            return [
                'notiType' => $this->type,
                'sender' => $this->sender->username,
                'group' => $this->postID ?? null,
                'groupType' => 'library',
                'groupID' => null,
                'reportID' => null,
                'createdAt' => $this->created_at
            ];
        } else {
            return [
                'notiType' => $this->type,
                'sender' => $this->sender->username,
                'group' => null,
                'groupType' => 'user', 
                'groupID' => null,
                'reportID' => $this->report->title,
                'createdAt' => $this->created_at
            ];
        }
    }
}
