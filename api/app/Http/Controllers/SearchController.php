<?php

namespace App\Http\Controllers;

use Illuminate\Http\Request;
use App\Models\HobbyModel;
use App\Models\UserModel;
use Illuminate\Foundation\Http\FormRequest;
use App\Http\Resources\HobbyGroupResource;
use App\Http\Resources\UserResource;
use Illuminate\Support\Facades\Validator;

class SearchController extends Controller
{

    function searchKeyword(Request $request,string $type=null)
    {
        $keyword = trim($request->input('keyword'));
        // if (empty($keyword)) {
        //     return response()->json([
        //         'status' => 'failed',
        //         'message' => 'search hobby not found',
        //         'listItem' => null
        //     ], 200);
        // }
        $HobbyModel = new HobbyModel();
        $result = $HobbyModel->searchHobby($keyword,$type);
        if (sizeof($result) > 0) {
            $data = HobbyGroupResource::collection($result);
            return response()->json([
                'status' => 'ok',
                'message' => 'search hobby success',
                'listItem' => $data
            ], 200);
        } else {
            return response()->json([
                'status' => 'failed',
                'message' => 'not found',
            ], 200);
        }
    }

    function searchInvite(Request $request ,$hID)
    {
        $groupDb = HobbyModel::where('hID',$hID)->first();
        if(empty($groupDb)){
            return response()->json([
                'status' => 'failed',
                'message' => 'hobby not found.',
            ],404);
        };

        $data = [];
        $memberArray = explode(',',$groupDb->member);
        $requestArray = explode(',',$groupDb->memberRequest);
        if (!in_array(auth()->user()->uID, $memberArray)) {
            return response()->json([
                'status' => 'failed',
                'message' => 'unauthorize.',
            ],401);
        }

        $keyword = trim($request->input('keyword'));
        $UserModel = new UserModel();
        $result = $UserModel->searchUser($keyword);

        foreach($result as $user){
            if(in_array($user->uID, $memberArray)){
                $data[] = [
                    'username' => $user->username,
                    'uID' => (int)$user->uID,
                    'status' =>'member'
                ];
            }else if(in_array($user->uID, $requestArray)){
                $data[] = [
                    'username' => $user->username,
                    'uID' => (int)$user->uID,
                    'status' =>'request'
                ];
            }else {
                $data[] = [
                    'username' => $user->username,
                    'uID' => (int)$user->uID,
                    'status' => null
                ];
            }
        }

        if (sizeof($result) > 0) {
            return response()->json([
                'status' => 'ok',
                'message' => 'search User success',
                'data' => $data
            ], 200);
        } else {
            return response()->json([
                'status' => 'failed',
                'message' => 'not found',
            ], 200);
        }
    }
}
