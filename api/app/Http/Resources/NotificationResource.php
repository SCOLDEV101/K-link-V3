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
        return [
            'notiType'=>$this->notiType,
            'sender'=>$this->sendBy->username ?? 'Unknown',
            'group'=>$this->hobby->activityName ?? null,
            'createdAt'=>$this->created_at
        ];
    }
}
