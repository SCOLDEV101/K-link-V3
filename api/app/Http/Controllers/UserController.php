<?php

namespace App\Http\Controllers;

use Illuminate\Http\Request;
use App\Models\UserModel;
use App\Models\HobbyModel;
use App\Models\imageOrFileModel;
use App\Models\GroupModel;
use App\Models\NotifyModel;
use App\Models\ReportedModel;
use Illuminate\Support\Facades\File;
use App\Http\Resources\UserResource;
use App\Http\Resources\MyPostResource;
use App\Http\Resources\BookmarkResource;
use App\Http\Resources\NotificationResource;
use Illuminate\Support\Facades\Validator;
use App\Models\TutoringModel;
use App\Models\LibraryModel;

class UserController extends Controller
{
    function viewBookmark()
    {
        $currentUser = UserModel::where('id', auth()->user()->id)->first();
        if (!$currentUser) {
            return response()->json([
                'status' => 'failed',
                'message' => 'unauthorize.'
            ], 401);
        };

        $bookmarkArray = explode(",", $currentUser->bookmark);
        $group = HobbyModel::whereIn('hID', $bookmarkArray)->get();

        $data = BookmarkResource::collection($group);
        if ($data) {
            return response()->json([
                'status' => 'ok',
                'message' => 'fetch bookmark success.',
                'data' => $data
            ], 200);
        } else {
            return response()->json([
                'status' => 'failed',
                'message' => 'failed to fetch bookmark.'
            ], 500);
        }
    }

    function addOrDeleteBookmark($id)
    {
        $userDb = UserModel::where('id', auth()->user()->id)->first();
        if (!$userDb) {
            return response()->json([
                'status' => 'failed',
                'message' => 'unauthorize.'
            ], 401);
        }

        if (HobbyModel::where('hID', $id)->first()) {
            $database = HobbyModel::where('hID', $id)->first();
        } else {
            return response()->json([
                'status' => 'failed',
                'message' => 'post not found.'
            ], 404);
        }

        $bookmarkArray = explode(",", $userDb->bookmark);
        if (!in_array($id, $bookmarkArray)) {
            $bookmarkArray[] = $id;
            $bookmark = implode(",", $bookmarkArray);
        } else if (in_array($id, $bookmarkArray)) {
            $bookmarkArray = array_diff($bookmarkArray, [$id]);
            $bookmark = implode(",", $bookmarkArray);
        } else {
            return response()->json([
                'status' => 'failed',
                'message' => 'bookmark not found.'
            ], 500);
        }

        if (UserModel::where('id', auth()->user()->id)->update(['bookmark' => $bookmark])) {
            return response()->json([
                'status' => 'ok',
                'message' => 'update bookmark success.'
            ], 200);
        } else {
            return response()->json([
                'status' => 'failed',
                'message' => 'failed to update bookmark.'
            ], 500);
        }
    }

    function report(Request $request)
    {
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

    function memberInfo($uID)
    {
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

    function showAboutUser()
    {
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

    function updateAboutUser(Request $request)
    {
        
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
                'message' => 'update hobby group success.',
            ], 200);
        } else {
            return response()->json([
                'status' => 'failed',
                'message' => 'failed to update hobby group.'
            ], 500);
        };
    }

    function invitePage($id)
    {
        $groupDb = HobbyModel::where('hID', $id)->first();
        if (empty($groupDb)) {
            return response()->json([
                'status' => 'failed',
                'message' => 'hobby not found.',
            ], 404);
        };

        $memberArray = explode(',', $groupDb->member);
        $requestArray = explode(',', $groupDb->memberRequest);
        $userDb = UserModel::all();
        $data = [];

        if (!in_array(auth()->user()->uID, $memberArray)) {
            return response()->json([
                'status' => 'failed',
                'message' => 'unauthorize.',
            ], 401);
        }

        foreach ($userDb as $user) {
            if (in_array($user->uID, $memberArray)) {
                $data[] = [
                    'username' => $user->username,
                    'uID' => (int)$user->uID,
                    'status' => 'member'
                ];
            } else if (in_array($user->uID, $requestArray)) {
                $data[] = [
                    'username' => $user->username,
                    'uID' => (int)$user->uID,
                    'status' => 'request'
                ];
            } else {
                $data[] = [
                    'username' => $user->username,
                    'uID' => (int)$user->uID,
                    'status' => null
                ];
            }
        }

        return response()->json([
            'status' => 'ok',
            'data' => $data
        ], 200);
    }

    function inviteFriend(Request $request, $hID)
    {
        if (HobbyModel::where('hID', $hID)->first()) {
            $groupDb = HobbyModel::where('hID', $hID)->first();
            // }else if(!empty(HobbyModel::where('hID',$id)->get())){

        } else {
            return response()->json([
                'status' => 'failed',
                'message' => 'group not found.',
            ], 404);
        }

        $memberArray = explode(',', $groupDb->member);
        $requestArray = explode(',', $groupDb->memberRequest);

        if (in_array((int)$request->input('receiver'), $memberArray)) {
            return response()->json([
                'status' => 'failed',
                'message' => 'already be a member.',
            ], 400);
        }

        if (in_array((int)$request->input('receiver'), $requestArray)) {
            return response()->json([
                'status' => 'failed',
                'message' => 'already be a request.',
            ], 400);
        }

        // if(NotifyModel::where('notiType','invite')->where('id',$id)->exists()){
        //     return response()->json([
        //         'status' => 'failed',
        //         'message' => 'already invited.',
        //     ],400);
        // }

        $data = [
            'notiType' => 'invite',
            'id' => $hID,
            'sender' => auth()->user()->uID,
            'receiver' => (int)$request->input('receiver'),
            'created_at' => now(),
            'updated_at' => now(),
        ];

        if (NotifyModel::create($data)) {
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

    function requestToGroup(Request $request, $id)
    {
        $groupDb = HobbyModel::where('hID', $id)->first();
        if (empty($groupDb)) {
            return response()->json([
                'status' => 'failed',
                'message' => 'hobby not found.',
            ], 404);
        }
        $uID = auth()->user()->uID;
        $memberArray = explode(',', $groupDb->member);
        $requestArray = explode(',', $groupDb->memberRequest);

        if (empty($requestArray[0])) {
            $requestArray = [];
        }

        if (in_array($uID, $memberArray)) {
            return response()->json([
                'status' => 'failed',
                'message' => 'already be a member.',
            ], 400);
        }

        $notifyData = [
            'notiType' => 'request',
            'id' => $id,
            'sender' => $uID,
            'receiver' => (int)$groupDb->leader,
            'created_at' => now(),
            'updated_at' => now(),
        ];

        if (in_array($uID, $requestArray)) {
            $newRequestMember = array_diff($requestArray, [$uID]);
        } else if (!in_array($uID, $requestArray)) {
            $newRequestMember = array_merge($requestArray, [$uID]);
            $sendRequestNotify = NotifyModel::create($notifyData);
            if (!$sendRequestNotify) {
                return response()->json([
                    'status' => 'failed',
                    'message' => 'failed to send request.',
                ], 500);
            }
        }

        $data = [
            'memberRequest' => implode(',', $newRequestMember)
        ];

        if (HobbyModel::where('hID', $id)->update($data)) {
            return response()->json([
                'status' => 'ok',
                'message' => 'update request to group success.',
                'data' => $data
            ], 200);
        } else {
            return response()->json([
                'status' => 'failed',
                'message' => 'failed to update request to group.',
            ], 500);
        }
    }

    function notification()
    {
        $notifyDb = NotifyModel::where('receiver', auth()->user()->uID)->latest()->get();

        $data = NotificationResource::collection($notifyDb);
        return response()->json([
            'status' => 'ok',
            'data' => $data
        ], 200);
    }

    function myPost()
    {
        $allGroup = HobbyModel::get();
        $data = MyPostResource::collection($allGroup)->resolve();

        // $data = array_map(function($item) {
        //     return $item ? (array) $item : null;
        // }, $data);

        $data = array_filter($data, function ($item) {
            return $item !== null;
        });

        $data = array_values($data);

        // $itemsPerPage = 8;
        // $currentPage = request()->input('page', 1);
        // $offset = ($currentPage - 1) * $itemsPerPage;
        // $paginatedData = array_slice($data, $offset, $itemsPerPage);

        // $paginator = new \Illuminate\Pagination\LengthAwarePaginator(
        //     $paginatedData,
        //     count($data),
        //     $itemsPerPage,
        //     $currentPage,
        //     [
        //         'path' => \Illuminate\Pagination\Paginator::resolveCurrentPath(),
        //         'pageName' => 'page',
        //     ]
        // );

        return response()->json([
            // 'prevPageUrl' => $paginator->previousPageUrl(),
            'status' => 'ok',
            'message' => 'fetch my posts success',
            'data' => $data
            // 'data' => $paginator->items(),
            // 'nextPageUrl' => $paginator->nextPageUrl()
        ], 200);
    }

    function leaveGroup($hID)
    {
        $groupDb = HobbyModel::where('hID', $hID)->first();
        if (empty($groupDb)) {
            return response()->json([
                'status' => 'failed',
                'message' => 'hobby not found.',
            ], 404);
        }
        $uID = auth()->user()->uID;
        $memberArray = explode(',', $groupDb->member);
        if (!in_array($uID, $memberArray)) {
            return response()->json([
                'status' => 'failed',
                'message' => 'you are not a member in this group.',
            ], 400);
        } else {

            if ($uID === $groupDb->leader) {
                return response()->json([
                    'status' => 'failed',
                    'message' => 'leader can not leave the group.',
                ], 400);
            }

            $memberArray = array_diff($memberArray, [$uID]);
            if (HobbyModel::where('hID', $hID)->update(['member' => implode(',', $memberArray)])) {
                return response()->json([
                    'status' => 'ok',
                    'message' => 'leave group success.',
                ], 200);
            } else {
                return response()->json([
                    'status' => 'failed',
                    'message' => 'failed to leave group.',
                ], 500);
            }
        }
    }
}
