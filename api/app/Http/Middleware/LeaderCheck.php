<?php

namespace App\Http\Middleware;

use Closure;
use Illuminate\Http\Request;
use Symfony\Component\HttpFoundation\Response;
use App\Models\GroupModel;
use App\Models\HobbyModel;
use App\Models\TutoringModel;
use App\Models\LibraryModel;

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
        $groupDb = GroupModel::where('groupID', $groupId)->first(); //เอาไปหาอะไร
        if ($groupDb) {
            if ($groupDb->type == 'hobby') {
                $groupDb = HobbyModel::where('id', $groupId)->first();
                $leader = (bool)($groupDb->leader == auth()->user()->id);
            }
            if ($groupDb->type == 'tutoring') {
                $groupDb = TutoringModel::where('id', $groupId)->first();
                $leader = (bool)($groupDb->leader == auth()->user()->id);
            }
            if ($groupDb->type == 'library') {
                $groupDb = LibraryModel::where('id', $groupId)->first();
                $leader = (bool)($groupDb->createdBy == auth()->user()->id);
            }

            if ($leader) { //session ไม่ encode สามารถให้ผู้ไม่หวังดีเปลี่ยนมาเป็น session เดียวกับ leader ได้มั้ย
                return $next($request);
            }
            if (!$leader) {
                return response()->json([
                    'status' => 'failed',
                    'message' => 'forbidden.',
                ], 403);
            }
        } else if (!$groupDb) {
            return response()->json([
                'status' => 'failed',
                'message' => 'group not found.',
            ], 404);
        }
    }
}
