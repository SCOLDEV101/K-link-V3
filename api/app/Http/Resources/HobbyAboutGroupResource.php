<?php

namespace App\Http\Resources;

use Illuminate\Http\Request;
use Illuminate\Http\Resources\Json\JsonResource;

class HobbyAboutGroupResource extends JsonResource
{
    /**
     * Transform the resource into an array.
     *
     * @return array<string, mixed>
     */
    public function toArray($request)
    {
        $members = explode(',', $this->member);
        
        if($this->leader == auth()->user()->uID){
            $role = 'leader';
        }else{
            $role = null;
        };

        $requestmembers = explode(',', $this->memberRequest);
        $count = 0;
        foreach($requestmembers as $request){
            if($request != null && $request != ""){
                $count++;
            }
        }

        return [
            'hID'=>$this->hID,
            'image'=>$this->image,
            'tag'=>$this->tag,
            'member'=>count($members),
            'memberMax'=>$this->memberMax,
            'activityName'=>$this->activityName,
            'weekDate'=>$this->weekDate,
            'actTime'=>$this->actTime,
            'location'=>$this->location,
            'detail'=>$this->detail,
            'role'=>$role,
            'request'=>$count,
        ];
    }
}