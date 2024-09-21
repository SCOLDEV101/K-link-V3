<?php

namespace App\Http\Middleware;

use Closure;
use Illuminate\Http\Request;
use Symfony\Component\HttpFoundation\Response;
use App\Models\GroupModel; 

class LeaderCheck
{
    /**
     * Handle an incoming request.
     *
     * @param  \Closure(\Illuminate\Http\Request): (\Symfony\Component\HttpFoundation\Response)  $next
     */
    public function handle(Request $request, Closure $next): Response
    {
        $groupId = $request->route('hID'); //parameter ที่รับ
        $groupDb = GroupModel::where('groupID',$groupId)->first(); //เอาไปหาอะไร

        if(!$groupDb){
            return response()->json([
                'status' => 'failed',
                'message' => 'group not found.',
            ], 404);
        }
        
        if (($groupDb->hobby && $groupDb->hobby->leaderGroup->id == auth()->user()->id)) { //session ไม่ encode สามารถให้ผู้ไม่หวังดีเปลี่ยนมาเป็น session เดียวกับ leader ได้มั้ย
            return $next($request);
        } else if ($groupDb->library && $groupDb->library->leaderGroup->id == auth()->user()->id) {
            return $next($request);
        } else if ($groupDb->tutoring && $groupDb->tutoring->leaderGroup->id == auth()->user()->id) {
            return $next($request);
        }

        return response()->json([
            'status' => 'failed',
            'message' => 'forbidden.',
        ],403);    
    }
}
