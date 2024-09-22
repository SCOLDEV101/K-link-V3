<?php

namespace App\Http\Controllers;

use Illuminate\Http\Request;
use App\Models\UserModel;
use App\Models\HobbyModel;
use App\Models\imageOrFileModel;
use App\Models\GroupModel;
use App\Models\BookmarkModel;
use App\Models\NotifyModel;
use App\Models\ReportedModel;
use App\Models\MemberModel;
use App\Models\RequestModel;
use Illuminate\Support\Facades\File;
use App\Http\Resources\UserResource;
use App\Http\Resources\MyPostResource;
use App\Http\Resources\NotificationResource;
use Illuminate\Support\Facades\Validator;
use App\Models\TutoringModel;
use App\Models\LibraryModel;
use App\Http\Resources\GroupResource;
use App\Http\Resources\BookmarkResource;

class UserController extends Controller
{
    function viewBookmark() { //done *check
        $uID = auth()->user()->id;
        $groupDb = BookmarkModel::where('userID',$uID)
                                    ->with(['group.hobby'])
                                    ->with(['group.library'])
                                    ->with(['group.tutoring'])
                                    ->with(['group.bookmark'])
                                    ->orderBy('updated_at', 'DESC')
                                    ->paginate(8);

        $data = BookmarkResource::collection($groupDb);

        $currentUser = UserModel::where('id', $uID)->first();
        if (empty($currentUser)) {
            return response()->json([
                'status' => 'failed',
                'message' => 'unauthorize.'
            ], 401);
        };

        if ($data) {
            return response()->json([
                'prevPageUrl' => $groupDb->previousPageUrl(),
                'status' => 'ok',
                'message' => 'fetch bookmark success.',
                'data' => $data,
                'nextPageUrl' => $groupDb->nextPageUrl()
            ], 200);
        } else {
            return response()->json([
                'status' => 'failed',
                'message' => 'failed to fetch bookmark.'
            ], 500);
        }
    }

    function addOrDeleteBookmark($id) { // done *check
        $uID = auth()->user()->id;
        $userDb = UserModel::where('id', $uID)->first();
        if (empty($userDb)) {
            return response()->json([
                'status' => 'failed',
                'message' => 'unauthorize.'
            ], 401);
        }

        $selectedGroup = GroupModel::where('groupID', $id)->first();
        if (empty($selectedGroup)) {
            return response()->json([
                'status' => 'failed',
                'message' => 'group not found.'
            ], 404);
        }

        $checkBookmark = BookmarkModel::where('userID',$uID)->where('groupID', $selectedGroup->id)->first();
        if (empty($checkBookmark)) {
            $created = BookmarkModel::create([
                'userID' => $uID,
                'groupID' => $selectedGroup->id
            ]);

            if ($created) {
                return response()->json([
                    'status' => 'ok',
                    'message' => 'add bookmark success.'
                ], 200);
            } else {
                return response()->json([
                    'status' => 'failed',
                    'message' => 'failed to add bookmark.'
                ], 500);
            }
        } else {
            $deleted = $checkBookmark->delete();

            if ($deleted) {
                return response()->json([
                    'status' => 'ok',
                    'message' => 'delete bookmark success.'
                ], 200);
            } else {
                return response()->json([
                    'status' => 'failed',
                    'message' => 'failed to delete bookmark.'
                ], 500);
            }
        }
    }

    function report(Request $request) { // done (north)  *check
        $validationRules = ReportedModel::$validator[0];
        $validationMessages = ReportedModel::$validator[1];
        $validator = Validator::make($request->all(), $validationRules, $validationMessages);

        if ($validator->fails()) {
            return response()->json([
                'status' => 'failed',
                'message' => $validator->errors()
            ], 400);
        }
        if (sizeof(GroupModel::where('groupID', $request->input('id'))->get()) == 0 and sizeof(UserModel::where('id', $request->input('id'))->get()) == 0) {
            return response()->json([
                'status' => 'failed',
                'message' => 'not found.',
            ], 403);
        }
        //filter group or user report
        if (UserModel::where('id', $request->input('id'))->first()) {
            $receiver = (int)$request->input('id');
        } else {
            $groupDb = GroupModel::where('groupID', $request->input('id'))->first();
            if($groupDb->type=="hobby"){
                $hobbyDb = HobbyModel::where('id', $request->input('id'))->first();
                $receiver = (int)$hobbyDb->leader;
            }
            else if($groupDb->type=="tutoring"){
                $tutorDb = TutoringModel::where('id', $request->input('id'))->first();
                $receiver = (int)$tutorDb->leader;
            }
            else if($groupDb->type=="library"){
                $libraryDb = LibraryModel::where('id', $request->input('id'))->first();
                $receiver = (int)$libraryDb->createdBy;
            }
            else {
                return response()->json([
                    'status' => 'failed',
                    'message' => 'failed to indentify group type.'
                ], 500);
            }
        }

        $reportdata = [
            'reportedID' => $request->input('id'),
            'reportedBy' => (int)auth()->user()->id,
            'type' => $request->input('type'),
            'title' => $request->input('title'),
            'detail' => $request->input('detail'),    
            'created_at' => now(),
            'updated_at' => now(),
        ];

        $notifyData = [
            'receiverID' => $receiver,
            'senderID' => (int)auth()->user()->id,
            'postID' => $request->input('id'),
            'type' => 'report',
            'created_at' => now(),
            'updated_at' => now(),
        ];

        if (ReportedModel::insert($reportdata)) {
            NotifyModel::create($notifyData);
            return response()->json([
                'status' => 'ok',
                'message' => 'create report success.',
            ], 200);
        } else {
            return response()->json([
                'status' => 'failed',
                'message' => 'failed to create report.',
            ], 500);
        }
    }

    function memberInfo($uID) {  // done (north) *check
        $userDb = UserModel::where('id', $uID)->get();
        $data = UserResource::collection($userDb)->first();

        if ($data) {
            return response()->json([
                'status' => 'ok',
                'message' => 'get user info success.',
                'data' => $data
            ], 200);
        } else {
            return response()->json([
                'status' => 'failed',
                'message' => 'failed to get user info report.',
            ], 500);
        }
    }

    function showAboutUser() { // done (north) *check
        $uID = auth()->user()->id;
        $userDb = UserModel::where('id', $uID)->get();
        $data = UserResource::collection($userDb)->first();

        if ($data) {
            return response()->json([
                'status' => 'ok',
                'message' => 'fetch my account success.',
                'data' => $data
            ], 200);
        } else {
            return response()->json([
                'status' => 'failed',
                'message' => 'failed to fetch my account.',
            ], 500);
        };
    }

    function updateAboutUser(Request $request) { // done (north) *check
        
        $validationRules = UserModel::$validator[0];
        $validationMessages = UserModel::$validator[1];

        $validator = Validator::make($request->all(), $validationRules, $validationMessages);

        if ($validator->fails()) {
            return response()->json([
                'status' => 'failed',
                'message' => $validator->errors()
            ],400);
        }

        $uID = auth()->user()->id;
        $userDb = UserModel::where('id', $uID)->first();
        $path = public_path('uploaded/profileImage/');

        if (!empty($userDb->imageOrFileID)) {
            // echo ('have imageOrFileID/');
            $imageOrFileDb = imageOrFileModel::where('id', $userDb->imageOrFileID)->first();
        } else {
            // echo ('not have imageOrFileID/');
            $imageOrFileDb = new imageOrFileModel;
            $imageOrFileDb->id = null;
            $imageOrFileDb->name = null;
        };

        if ($userDb->imageOrFileID != null && $imageOrFileDb->name != $request->input('profileImage')) {
            // echo ("delete image/");
            File::delete($path . $imageOrFileDb->name);
            imageOrFileModel::where('id', $userDb->imageOrFileID)->delete();
            $imageOrFileDb->id = null;
        };

        if ($request->file('profileImage')) {
            // echo ("new image/");
            $file = $request->file('profileImage');
            $extension = $file->getClientOriginalExtension();
            $filename = 'profile-' . date('YmdHi') . rand(0, 99) . '.' . $extension;
            $file->move($path, $filename);
            $imageOrFileDb->name = $filename;
            $imageOrFileDb->save();
        } else {
            $filename = null;
        }
        $data = [
            'username' => $request->input('username') ?? $userDb->username,
            'fullname' => $request->input('fullname') ?? $userDb->fullname,
            'aboutMe' => $request->input('aboutMe') ?? $userDb->aboutMe,
            'telephone' => $request->input('telephone') ?? $userDb->telephone,
            'imageOrFileID' => $imageOrFileDb->id,
        ];

        if (UserModel::where('id', $uID)->update($data)) {
            return response()->json([
                'status' => 'ok',
                'message' => 'update account success.',
            ], 200);
        } else {
            return response()->json([
                'status' => 'failed',
                'message' => 'failed to update account.'
            ], 500);
        };
    }

    function invitePage($id) { // done *check
        $uID = auth()->user()->id;
        $groupDb = GroupModel::where('groupID', $id)
                                ->with('member')
                                ->with('request')
                                ->first();
        if (empty($groupDb)) {
            return response()->json([
                'status' => 'failed',
                'message' => 'group not found.',
            ], 404);
        };

        $memberArray = [];
        foreach ($groupDb->member as $eachMember){
            $memberArray[] = $eachMember->id;
        }

        $requestArray = [];
        foreach ($groupDb->request as $eachRequest){
            $requestArray[] = $eachRequest->id;
        }

        if (!in_array($uID, $memberArray)) {
            return response()->json([
                'status' => 'failed',
                'message' => 'unauthorize.',
            ], 401);
        }

        $userDb = UserModel::select('username', 'id')->get();
        $data = [];

        foreach ($userDb as $user) {
            if (in_array($user->id, $memberArray)) {
                $data[] = [
                    'username' => $user->username,
                    'uID' => $user->id,
                    'status' => 'member'
                ];
            } else if (in_array($user->id, $requestArray)) {
                $data[] = [
                    'username' => $user->username,
                    'uID' => $user->id,
                    'status' => 'request'
                ];
            } else {
                $data[] = [
                    'username' => $user->username,
                    'uID' => $user->id,
                    'status' => null
                ];
            }
        }

        return response()->json([
            'status' => 'ok',
            'data' => $data
        ], 200);
    }

    function inviteFriend(Request $request, $hID) { // done *check
        $groupDb = GroupModel::where('groupID', $hID)
                                ->with('member')
                                ->with('request')
                                ->first();
        if (empty($groupDb)) {
            return response()->json([
                'status' => 'failed',
                'message' => 'group not found.',
            ], 404);
        };

        $memberArray = [];
        foreach ($groupDb->member as $eachMember){
            $memberArray[] = $eachMember->id;
        }
        $requestArray = [];
        foreach ($groupDb->request as $eachRequest){
            $requestArray[] = $eachRequest->id;
        }

        if (in_array($request->input('receiver'), $memberArray)) {
            return response()->json([
                'status' => 'failed',
                'message' => 'already be a member.',
            ], 400);
        }

        if (in_array($request->input('receiver'), $requestArray)) {
            return response()->json([
                'status' => 'failed',
                'message' => 'already be a request.',
            ], 400);
        }

        $data = [
            'type' => 'invite',
            'postID' => $groupDb->groupID,
            'senderID' => auth()->user()->id,
            'receiverID' => $request->input('receiver'),
            'created_at' => now(),
            'updated_at' => now(),
        ];

        if (NotifyModel::insert($data)) {
            return response()->json([
                'status' => 'ok',
                'message' => 'invite friend success.',
                'data' => $data
            ], 200);
        } else {
            return response()->json([
                'status' => 'failed',
                'message' => 'failed to invite friend.',
            ], 500);
        }
    }

    function requestToGroup(Request $request, $id) { // done *check
        $groupDb = GroupModel::where('groupID', $id)
                                ->with('member')
                                ->with('request')
                                ->with(['hobby.leaderGroup'])
                                ->first();
        if (empty($groupDb)) {
            return response()->json([
                'status' => 'failed',
                'message' => 'group not found.',
            ], 404);
        }

        $uID = auth()->user()->id;
        $memberArray = [];
        foreach ($groupDb->member as $eachMember){
            $memberArray[] = $eachMember->id;
        }
        $requestArray = [];
        foreach ($groupDb->request as $eachRequest){
            $requestArray[] = $eachRequest->id;
        }

        if (in_array($uID, $memberArray)) {
            return response()->json([
                'status' => 'failed',
                'message' => 'already be a member.',
            ], 400);
        }

        if (in_array($uID, $requestArray)) {
            $deleteRequest = RequestModel::where('userID', $uID)
                                            ->where('groupID', $groupDb->id)
                                            ->first();

            if($deleteRequest->delete()){
                return response()->json([
                    'status' => 'ok',
                    'message' => 'cancel request success.',
                ], 200);
            } else {
                return response()->json([
                    'status' => 'failed',
                    'message' => 'failed to cancel request.',
                ], 500);
            }
        } else {
            $addRequest = RequestModel::insert([
                'userID' => $uID,
                'groupID' => $groupDb->id,
                'created_at' => now(),
                'updated_at' => now(),
            ]);

            if($addRequest) {
                $notifyData = [
                    'type' => 'request',
                    'postID' => $groupDb->groupID,
                    'senderID' => auth()->user()->id,
                    'receiverID' => $groupDb->hobby->leaderGroup->id,
                    'created_at' => now(),
                    'updated_at' => now(),
                ];
                $sendRequestNotify = NotifyModel::insert($notifyData);
                if($sendRequestNotify) {
                    return response()->json([
                        'status' => 'ok',
                        'message' =>'send request success.',
                        'data' => $notifyData
                    ], 200);
                }else{
                    return response()->json([
                        'status' => 'failed',
                        'message' => 'failed to send request notify.',
                    ], 500);
                }
            }else{
                return response()->json([
                    'status' => 'failed',
                    'message' => 'failed to add request.',
                ], 500);
            }
        }
    }

    function notification() { // done *check
        $notifyDb = NotifyModel::where('receiverID', auth()->user()->id)
                                ->with('receiver')
                                ->with('sender')
                                ->with(['group.hobby.leaderGroup'])
                                ->with(['group.tutoring.leaderGroup'])
                                ->with(['group.library.leaderGroup'])
                                ->latest()
                                ->get();

        $data = NotificationResource::collection($notifyDb);
        return response()->json([
            'status' => 'ok',
            'data' => $data
        ], 200);
    }

    function myPost() { // done *check
        $uID =  auth()->user()->id;
        $allGroup = GroupModel::with('member')
                                ->with('hobby')
                                ->with('library')
                                ->with('tutoring')
                                ->orderBy('updated_at', 'DESC')
                                ->paginate(8);


        $data = MyPostResource::collection($allGroup);

        return response()->json([
            'prevPageUrl' => $allGroup->previousPageUrl(),
            'status' => 'ok',
            'message' => 'fetch my posts success',
            'data' => $data,
            'nextPageUrl' => $allGroup->nextPageUrl()
        ], 200);
    }

    function leaveGroup($hID) { //done *check
        $uID = auth()->user()->id;
        $groupDb = GroupModel::where('groupID', $hID)
                                ->with(['hobby.leaderGroup'])
                                ->first();

        if (empty($groupDb)) {
            return response()->json([
                'status' => 'failed',
                'message' => 'hobby not found.',
            ], 404);
        }

        $deleteMember = MemberModel::where('userID',$uID)
                                    ->where('groupID',$groupDb->id)
                                    ->first();

        if (empty($deleteMember)) {
            return response()->json([
                'status' => 'failed',
                'message' => 'you are not a member in this group.',
            ], 404);
        }

        if ($uID == $groupDb->hobby->leaderGroup->id) {
            return response()->json([
                'status' => 'failed',
                'message' => 'leader can not leave the group.',
            ], 400);
        }

        if($deleteMember->delete()) {
            return response()->json([
                'status' => 'ok',
                'message' => 'leave group success.',
            ], 200);
        }else{
            return response()->json([
                'status' => 'failed',
                'message' => 'failed to leave group.',
            ], 500);
        }

    }
}
