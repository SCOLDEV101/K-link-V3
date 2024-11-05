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
                    'reportID' => $this->id,
                    'createdAt' => $this->created_at
                ];
            } else {
                return [
                    'notiType' => $this->type,
                    'sender' => $this->sender->username,
                    'group' => $this->group->hobby->name ?? null,
                    'groupType' => 'hobby',
                    'groupID' => $this->group->hobby->id,
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
                    'reportID' => $this->id,
                    'createdAt' => $this->created_at
                ];
            } else {
                return [
                    'notiType' => $this->type,
                    'sender' => $this->sender->username,
                    'group' => $this->group->tutoring->name ?? null,
                    'groupType' => 'tutoring',
                    'groupID' => $this->group->tutoring->id,
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
                    'reportID' => $this->id,
                    'createdAt' => $this->created_at
                ];
            } else {
                return [
                    'notiType' => $this->type,
                    'sender' => $this->sender->username,
                    'group' => $this->group->library->name ?? null,
                    'groupType' => 'library',
                    'groupID' => $this->group->library->id,
                    'createdAt' => $this->created_at
                ];
            }
        } else {
            return [
                'notiType' => $this->type,
                'sender' => $this->sender->username,
                'group' => "none",
                'reportID' => $this->id,
                'createdAt' => $this->created_at
            ];
        }
    }
}
