<?php

namespace App\Http\Controllers;

use Illuminate\Http\Request;
use App\Models\HobbyModel; 
use App\Models\UserModel; 
use App\Models\TutoringModel;
use App\Models\NotifyModel; 
use App\Models\GroupModel;
use Illuminate\Support\Facades\File;
use App\Http\Resources\GroupResource;
use App\Http\Resources\HobbyAboutGroupResource;
use App\Http\Resources\TutoringGroupResource;
use Illuminate\Support\Facades\Validator;

class TutoringController extends Controller
{
    function showAllGroup(Request $request) {
        {
            $tutoringDb = GroupModel::where('type', 'tutoring')
                                    ->where('status', 1)
                                    ->orderBy('updated_at', 'DESC')
                                    ->with('tutoring')
                                    ->with('bookmark')
                                    ->with(['tutoring.imageOrFile'])
                                    ->with(['tutoring.leaderGroup'])
                                    ->with(['tutoring.faculty'])
                                    ->with(['tutoring.major'])
                                    ->with(['tutoring.department'])
                                    ->with('member')
                                    ->with('request')
                                    ->with('groupDay') 
                                    ->with('groupTag')
                                    ->get(); 
    
            if (!$tutoringDb) {
                return response()->json([
                    'status' => 'failed',
                    'message' => 'hobby not found.',
                ], 404);
            }
    
            $data = GroupResource::collection($tutoringDb);
            if (sizeof($data) != 0) {
                return response()->json([
                    // 'prevPageUrl' => $tutoringDb->previousPageUrl(),
                    'status' => 'ok',
                    'message' => 'fetch all hobby-group success.',
                    'listItem' => $data,
                    // 'nextPageUrl' => $tutoringDb->nextPageUrl()
                ], 200);
            } else {
                return response()->json([
                    'status' => 'failed',
                    'message' => 'failed to fetch all hobby group.',
                ], 500);
            };
        }
    }

    function createGroup(Request $request) {
        $validationRules = TutoringModel::$validator[0];
        $validationMessages = TutoringModel::$validator[1];

        $validator = Validator::make($request->all(), $validationRules, $validationMessages);

        if ($validator->fails()) {
            return response()->json([
                'status' => 'failed',
                'message' => $validator->errors()
            ],400);
        }

        $uID = auth()->user()->uID;


        $hobbyModel = new HobbyModel();
        $tutoringDb = new TutoringModel();
        $hID = $hobbyModel->idGeneration();
        $tID = $tutoringDb->idGeneration();

        $data = [
            'hID' => $hID,
            'type' => 'tutoring',
            'image' => null,
            'tag' => $request->input('tag') ?? 'tutoring',
            'member' => $uID,
            'memberMax' => $request->input('memberMax') ?? null,
            'activityName' => $request->input('activityName'),
            'leader' => $uID,
            'weekDate' =>  '-',
            'actTime' =>  '00:00:00',
            'location' =>  $request->input('location'),
            'detail' =>  $request->input('detail'),
            'createdBy' => $uID,
            'created_at' => now(),
            'updated_at' => now()
        ];

        $tutoringData = [   
            'tutoringID' => $tID,
            'hID' => $hID,
            'facultyID' => $request->input('facultyID'),
            'majorID' => $request->input('majorID') ?? '',
            'sectionID' => $request->input('sectionID') ?? '',
            'date' => $request->input('date'),
            'startTime' => $request->input('startTime'),
            'endTime' => $request->input('endTime'),
            'created_at' => now(),
            'updated_at' => now()
        ];

        if(HobbyModel::insert($data) && TutoringModel::insert($tutoringData)){
            return response()->json([
                'status' => 'ok',
                'message' => 'create tutoring success.'
            ],200);
        } else {
            return response()->json([
                'status' => 'failed',
                'message' => 'failed to create tutoring group.'
            ],500);
        };
    }

    function updateGroup(Request $request , $hID){
        $validationRules = TutoringModel::$validator[0];
        $validationMessages = TutoringModel::$validator[1];
        
        $validator = Validator::make($request->all(), $validationRules, $validationMessages);

        if ($validator->fails()) {
            return response()->json([
                'status' => 'failed',
                'message' => $validator->errors()
            ],400);
        }

        $hobbyDb = HobbyModel::where('hID',$hID)->first();
        $tutoringDb = TutoringModel::where('hID',$hID)->first();

        $data = [
            'tag' => $request->input('tag') ?? $hobbyDb->tag,
            'memberMax' => $request->input('memberMax') ?? $hobbyDb->memberMax,
            'activityName' => $request->input('activityName') ?? $hobbyDb->activityName,
            'location' => $request->input('location') ?? $hobbyDb->location,
            'detail' => $request->input('detail') ?? $hobbyDb->detail,
            'updated_at' => now()
        ];

        $tutoringData = [
            'facultyID' => $request->input('facultyID') ?? $tutoringDb->facultyID,
            'majorID' => $request->input('majorID') ?? $tutoringDb->majorID,
            'sectionID' => $request->input('sectionID') ?? $tutoringDb->section,
            'date' => $request->input('date') ?? $tutoringDb->date,
            'startTime' => $request->input('startTime') ?? $tutoringDb->startTime,
            'endTime' => $request->input('endTime') ?? $tutoringDb->endTime,
            'updated_at' => now()
        ];

        if(HobbyModel::where('hID',$hID)->update($data) && TutoringModel::where('hID', $hID)->update($tutoringData)){
            return response()->json([
                'status' => 'ok',
                'message' => 'update tutoring group success.'
            ],200);
        } else {
            return response()->json([
                'status' => 'failed',
                'message' => 'failed to update tutoring group.'
            ],500);
        };
    }

    function memberGroup($hID) {
        $hobbyDb = HobbyModel::where('hID', $hID)->with('leaderGroup')->first();
        if(!$hobbyDb){
            return response()->json([
                'status' => 'failed',
                'message' => 'hobby not found.',
            ], 404);
        }

        $leaderData = [
            'username' => $hobbyDb->leaderGroup->username,
            'uID' => $hobbyDb->leaderGroup->uID
        ];
        $member[] = $leaderData;
        $memberUid = $hobbyDb->member();

        foreach ($memberUid as $username) {
            if ((int)$username->uID != $hobbyDb->leaderGroup->uID) {
                $member[] = [  
                    'username' => $username->username,
                    'uID' => (int)$username->uID
                ];
            }
        }

        $data = [
            'groupName' => $hobbyDb->activityName,
            'members' => $member,
        ];

        if($hobbyDb->leaderGroup->uID == auth()->user()->uID){
            $role = 'leader';
        }else{
            $role = null;
        }
        
        if($data){
            return response()->json([
                'status' => 'ok',
                'message' => 'fetch member hobby group success.',
                'data' => $data,
                'role' => $role
            ], 200);
        } else {
            return response()->json([
                'status' => 'failed',
                'message' => 'failed to fetch member hobby group.'
            ], 500);
        };
    }

    function aboutGroup($hID) {
        $hobbyDb = HobbyModel::where('hID',$hID)->first();
        if(empty($hobbyDb)){
            return response()->json([
                'status' => 'failed',
                'message' => 'hobby not found.',
            ], 404);
        }

        $data = new TutoringGroupResource($hobbyDb);

        if($data){
            return response()->json([
                'status' => 'ok',
                'message' => 'fetch tutoring about group success.',
                'data' => $data
            ],200);
        } else {
            return response()->json([
                'status' => 'failed',
                'message' => 'failed to fetch about tutoring group.',
            ],500);
        };
    }

    function checkRequestGroup($hID) {
        $hobbyDb = HobbyModel::where('hID', $hID)->first();
        $requestUid = $hobbyDb->request();
        $data = [];
        foreach ($requestUid as $username) {
            $data[] = [
                'username' => $username->username,
                'uID' => (int)$username->uID,
            ];
        }
        if($hobbyDb){
            return response()->json([
                'status' => 'ok',
                'message' => 'fetch all request success.',
                'data' => $data
            ],200);
        } else {
            return response()->json([
                'status' => 'failed',
                'message' => 'failed to fetch all request.',
            ],500);
        };
    }

    function rejectOrAcceptRequest(Request $request , $hID) {
        $groupDb = HobbyModel::where('hID', $hID)->first();
        if(!UserModel::where('uID', (int)$request->input('uID'))->first()){
            return response()->json([
                'status' => 'failed',
                'message' => 'user not found.',
            ], 404);
        }

        $requestArray = explode(',',$groupDb->memberRequest);
        $memberArray = explode(',',$groupDb->member);

        if($request->input('method') == 'accept'){
            if(!in_array((int)$request->input('uID'),$requestArray) || $requestArray == ''){
                return response()->json([
                    'status' => 'failed',
                    'message' => 'request not found.',
                ],404);
            } else if(in_array((int)$request->input('uID'),$memberArray)){
                return response()->json([
                    'status' => 'failed',
                    'message' => 'user already be a member.',
                ],400);
            }else{
                $action = 'acceptRequest';
                $memberArray[] = (int)$request->input('uID');
                $requestArray = array_diff($requestArray,[(int)$request->input('uID')]);
            }
        } else if($request->input('method') =='reject'){
            if(!in_array((int)$request->input('uID'),$requestArray) || $requestArray == ''){
                return response()->json([
                    'status' => 'failed',
                    'message' => 'request not found.',
                ],404);
            } else{
                $action = 'rejectRequest';
                $requestArray = array_diff($requestArray,[(int)$request->input('uID')]);
            }
        } else {
            return response()->json([
                'status' => 'failed',
                'message' =>'method not found.',
            ],400);
        }

        $notifyData = [
            'notiType' => $action,
            'id' => (int)$request->input('uID'),
            'sender' => (int)$groupDb->leader,
            'receiver' => (int)$request->input('uID'),
            'created_at' => now(),
            'updated_at' => now(),
        ];

        $data = [
            'member' => implode(',',$memberArray),
            'memberRequest' => implode(',',$requestArray)
        ];

        if(HobbyModel::where('hID',$hID)->update($data)){
            $sendRequestNotify = NotifyModel::create($notifyData);
                if(!$sendRequestNotify){
                    return response()->json([
                        'status' => 'failed',
                        'message' => 'failed to accept request.',
                    ],500);
                }
            return response()->json([
                'status' => 'ok',
                'message' => 'update member and request success.',
            ],200);
        }else{
            return response()->json([
                'status' => 'failed',
                'message' => 'failed to update member and request.',
            ],500);
        }
    }

    function kickMember($hID , $uID) {
        $hobbyDb = HobbyModel::where('hID', $hID)->first();
        
        if(!UserModel::where('uID', $uID)->first()){
            return response()->json([
                'status' => 'failed',
                'message' => 'user not found.',
            ], 404);
        }

        if($hobbyDb->leader == $uID){
            return response()->json([
                'status' => 'failed',
                'message' => 'can not kick yourself.',
            ], 404);
        }

        $memberArray = explode(',',$hobbyDb->member);
        if(in_array($uID,$memberArray)){
            $memberArray = array_diff($memberArray,[$uID]);
            if(HobbyModel::where('hID',$hID)->update(['member' => implode(',',$memberArray)])){
                return response()->json([
                    'status' => 'ok',
                    'message' => 'kick member success.',
                ],200);
            }else{
                return response()->json([
                    'status' => 'failed',
                    'message' => 'failed to kick member.',
                ],500);
            }
        } else {
            return response()->json([
                'status' => 'failed',
                'message' => 'member not found.',
            ],404);
        }
    }

    function deleteGroup($hID) {
        $hobbyDb = HobbyModel::where('hID', $hID)->first();
        if($hobbyDb->leader == auth()->user()->uID){
            $hobbyDeleted = HobbyModel::where('hID', $hID)->delete();
            $tutoringDeleted = TutoringModel::where('hID', $hID)->delete();
            if($hobbyDeleted && $tutoringDeleted){
                return response()->json([
                    'status' => 'ok',
                    'message' => 'delete tutoring success.',
                ],200);
            }else{
                return response()->json([
                    'status' => 'failed',
                    'message' => 'failed to delete tutoring.',
                ],500);
            }
        } else {
            return response()->json([
                'status' => 'failed',
                'message' => 'unauthorize.',
            ],401);
        }
    }

    function changeLeaderGroup($hID , $uID) {
        $hobbyDb = HobbyModel::where('hID', $hID)->first();
        
        if(!UserModel::where('uID', $uID)->first()){
            return response()->json([
                'status' => 'failed',
                'message' => 'user not found.',
            ], 404);
        } 
        
        if(!in_array($uID,explode(',',$hobbyDb->member))){
            return response()->json([
                'status' => 'failed',
                'message' => 'member not found.',
            ],404);
        } 
        
        if($uID == $hobbyDb->leader){
            return response()->json([
                'status' => 'failed',
                'message' => 'already be.',
            ],400);
        } else {
            if($hobbyDb->where('hID',$hID)->update(['leader' => $uID])){
                return response()->json([
                    'status' => 'ok',
                    'message' => 'change leader group success.',
                ],200);
            }else{
                return response()->json([
                    'status' => 'failed',
                    'message' => 'failed to change leader group.',
                ],500);
            }
        }
    }
}
