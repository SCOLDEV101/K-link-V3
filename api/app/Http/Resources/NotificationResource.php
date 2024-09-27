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
        if($this->group && $this->group->type == 'hobby') {
            return [
                'notiType'=>$this->type,
                'sender'=>$this->sender->username,
                'group'=>$this->group->hobby->name ?? null,
                'hID'=>$this->group->hobby->id,
                'createdAt'=>$this->created_at
            ];
        }else if($this->group && $this->group->type == 'tutoring') {
            return [
                'notiType'=>$this->type,
                'sender'=>$this->sender->username,
                'group'=>$this->group->tutoring->name ?? null,
                'tid'=>$this->group->tutoring->id,
                'createdAt'=>$this->created_at
            ];
        }else if($this->group && $this->group->type == 'library') {
            return [
                'notiType'=>$this->type,
                'sender'=>$this->sender->username,
                'group'=>$this->group->library->name ?? null,
                'lID'=>$this->group->library->id,
                'createdAt'=>$this->created_at
            ];
        }else {
            return [
                'notiType'=>$this->type,
                'sender'=>$this->sender->username,
                'group'=>null,
                'createdAt'=>$this->created_at
            ];
        }
    }
}
