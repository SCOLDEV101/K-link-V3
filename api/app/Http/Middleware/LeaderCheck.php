<?php

namespace App\Http\Middleware;

use Closure;
use Illuminate\Http\Request;
use Symfony\Component\HttpFoundation\Response;
use App\Models\HobbyModel; 

class LeaderCheck
{
    /**
     * Handle an incoming request.
     *
     * @param  \Closure(\Illuminate\Http\Request): (\Symfony\Component\HttpFoundation\Response)  $next
     */
    public function handle(Request $request, Closure $next): Response
    {
        $hobbyId = $request->route('hID');
        $hobbyGroup = HobbyModel::where('hID',$hobbyId)->first();

        if(!$hobbyGroup){
            return response()->json([
                'status' => 'failed',
                'message' => 'hobby not found.',
            ], 404);
        }
        
        if (($hobbyGroup->leader == auth()->user()->uID)) { //session ไม่ encode สามารถให้ผู้ไม่หวังดีเปลี่ยนมาเป็น session เดียวกับ leader ได้มั้ย
            return $next($request);
        }

        return response()->json([
            'status' => 'failed',
            'message' => 'forbidden.',
        ],403);    
    }
}
