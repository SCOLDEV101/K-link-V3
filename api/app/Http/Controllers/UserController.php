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
use App\Http\Resources\BookmarkResource;
use Illuminate\Pagination\LengthAwarePaginator;
use Illuminate\Support\Collection;

class UserController extends Controller
{
    function viewBookmark()
    { //done *check
        $uID = auth()->user()->id;
        $groupDb = BookmarkModel::where('userID', $uID)
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

    function addOrDeleteBookmark($groupID)
    { // done *check
        $uID = auth()->user()->id;
        if (empty(UserModel::where('id', (int)$uID)->first())) {
            return response()->json([
                'status' => 'failed',
                'message' => 'user can not be found.'
            ], 404);
        }

        $groupDb = GroupModel::where([['groupID', $groupID],['status',1]])->first();
        if (empty($groupDb)) {
            return response()->json([
                'status' => 'failed',
                'message' => 'group not found.'
            ], 404);
        }

        $bookmarkDb = BookmarkModel::where([['userID', $uID], ['groupID', $groupDb->id]])->first();
        if (empty($bookmarkDb)) {
            $created = BookmarkModel::create([
                'userID' => $uID,
                'groupID' => $groupDb->id,
                'created_at' => now(),
                'updated_at' => now(),
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
            $deleted = BookmarkModel::where([['userID', $uID], ['groupID', $groupDb->id]])->delete();
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

    function report(Request $request)
    { // done (north)  *check
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
            $groupDb = GroupModel::where([['groupID', $request->input('id')]])
                ->orwhere([['type', 'hobby'], ['type', 'tutoring'], ['type', 'library']])
                ->with(['hobby', 'tutoring', 'library'])
                ->first();
            if ($groupDb->type == "hobby") {
                $receiver = (int)$groupDb->hobby->leader;
            } else if ($groupDb->type == "tutoring") {
                $receiver = (int)$groupDb->tutoring->leader;
            } else if ($groupDb->type == "library") {
                $receiver = (int)$groupDb->library->createdBy;
            } else {
                return response()->json([
                    'status' => 'failed',
                    'message' => 'failed to indentify issue item.'
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

        if (ReportedModel::insert($reportdata) && NotifyModel::create($notifyData)) {
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

    function memberInfo(string $uID = null)
    {  // done (north) *check
        if (empty($uID)) {
            $uID = auth()->user()->id;
        }
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

    //ใช้ memberInfo() แทน
    // function showAboutUser()
    // { // done (north) *check
    //     $uID = auth()->user()->id;
    //     $userDb = UserModel::where('id', $uID)->get();
    //     $data = UserResource::collection($userDb)->first();

    //     if ($data) {
    //         return response()->json([
    //             'status' => 'ok',
    //             'message' => 'fetch my account success.',
    //             'data' => $data
    //         ], 200);
    //     } else {
    //         return response()->json([
    //             'status' => 'failed',
    //             'message' => 'failed to fetch my account.',
    //         ], 500);
    //     };
    // }

    function updateAboutUser(Request $request)
    { // done (north) *check
        $validationRules = UserModel::$validator[0];
        $validationMessages = UserModel::$validator[1];

        $validator = Validator::make($request->all(), $validationRules, $validationMessages);

        if ($validator->fails()) {
            return response()->json([
                'status' => 'failed',
                'message' => $validator->errors()
            ], 400);
        }

        $uID = auth()->user()->id;
        $userDb = UserModel::where('id', $uID)->with('imageOrFile')->first();
        $path = public_path('uploaded\\profileImage\\');
        $defaultFiles = [];
        foreach (imageOrFileModel::$profileImageStatic as $file) {
            array_push($defaultFiles, $file['name']);
        }
        if (!empty($request->file('image'))) {
            if (imageOrFileModel::where('id', $userDb->imageOrFileID)->first() && !in_array(strval($userDb->imageOrFile->name), $defaultFiles)) {
                imageOrFileModel::where('id', $userDb->imageOrFileID)->delete();
                if (File::exists(($path . $userDb->imageOrFile->name))) {
                    File::delete($path . $userDb->imageOrFile->name);
                }
            }
            $file = $request->file('image');
            $extension = $file->getClientOriginalExtension();
            $filename = 'profile-' . date('YmdHi') . rand(0, 99) . '.' . $extension;
            $file->move($path, $filename);
            $imageOrFileDb = imageOrFileModel::create([
                "name" => $filename
            ]);
        } else if (empty($request->file('image')) && !empty($request->input('image')) && $request->input('image') == $userDb->imageOrFile->name) {
            $imageOrFileDb = imageOrFileModel::where('id', $userDb->imageOrFileID)->first();
        } else {
            if (imageOrFileModel::where('id', $userDb->imageOrFileID)->first() && !in_array(strval($userDb->imageOrFile->name), $defaultFiles)) {
                imageOrFileModel::where('id', $userDb->imageOrFileID)->delete();
                if (File::exists(($path . $userDb->imageOrFile->name))) {
                    File::delete($path . $userDb->imageOrFile->name);
                }
            }
            $imageOrFileDb = imageOrFileModel::where('name', 'profile-default.jpg')->first();
        }

        $data = [
            'username' => $request->input('username') ?? $userDb->username,
            'fullname' => $request->input('fullname') ?? $userDb->fullname,
            'aboutMe' => $request->input('aboutMe') ?? $userDb->aboutMe,
            'telephone' => $request->input('telephone') ?? $userDb->telephone,
            'imageOrFileID' => $imageOrFileDb->id ?? $userDb->imageOrFile->id,
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

    function invitePage($groupID)
    { // done *check
        $uID = auth()->user()->id;
        $groupDb = GroupModel::where('groupID', $groupID)
            ->with(['member', 'request'])
            ->first();

        if (empty($groupDb)) {
            return response()->json([
                'status' => 'failed',
                'message' => 'group not found.',
            ], 404);
        };

        $member = [];
        foreach ($groupDb->member as $eachMember) {
            $member[] = $eachMember->id;
        }

        $request = [];
        foreach ($groupDb->request as $eachRequest) {
            $request[] = $eachRequest->id;
        }

        if (!in_array($uID, $member)) {
            return response()->json([
                'status' => 'failed',
                'message' => 'unauthorize.',
            ], 401);
        }

        $userDb = UserModel::select('username', 'id', 'fullname', 'email')->get();
        $data = [];

        foreach ($userDb as $user) {
            if (in_array($user->id, $member)) {
                // $data[] = [
                //     'username' => $user->username,
                //     'fullname' => $user->fullname,
                //     'email' => $user->email,
                //     'uID' => $user->id,
                //     'status' => 'member'
                // ];
                continue;
            } else if (in_array($user->id, $request)) {
                $data[] = [
                    'username' => $user->username,
                    'fullname' => $user->fullname,
                    'email' => $user->email,
                    'uID' => $user->id,
                    'status' => 'request'
                ];
            } else {
                $data[] = [
                    'username' => $user->username,
                    'fullname' => $user->fullname,
                    'email' => $user->email,
                    'uID' => $user->id,
                    'status' => 'none'
                ];
            }
        }

        return response()->json([
            'status' => 'ok',
            'data' => $data
        ], 200);
    }

    function inviteFriend(Request $request, $groupID)
    { // done *check
        //---- validate input
        $validator = Validator::make($request->all(), [
            'receiver' => ['required', 'regex:/^[0-9]+$/u'],
        ],[
            'receiver.required' => 'userID is required',
            'receiver.regex' => 'userID is invalid'
        ]);
        if ($validator->fails()) {
            return response()->json([
                'status' => 'failed',
                'message' => $validator->errors()
            ], 400);
        }
        //-----------

        $userID = (int)$request->input('receiver');
        if($userID == (int)auth()->user()->id){
            return response()->json([
                'status' => 'failed',
                'message' => 'cannot invite yourself.',
            ], 400);
        }

        $groupDb = GroupModel::where([['groupID', $groupID], ['status', 1]])
            ->with(['member', 'request'])
            ->first();

        if (empty($groupDb)) {
            return response()->json([
                'status' => 'failed',
                'message' => 'group not found.',
            ], 404);
        };

        if (!UserModel::where('id', $userID)->first()) {
            return response()->json([
                'status' => 'failed',
                'message' => 'user not found.',
            ], 404);
        }
        
        $memberArray = [];
        foreach ($groupDb->member as $eachMember) {
            $memberArray[] = $eachMember->id;
        }
        $requestArray = [];
        foreach ($groupDb->request as $eachRequest) {
            $requestArray[] = $eachRequest->id;
        }

        if (in_array($userID, $memberArray)) {
            return response()->json([
                'status' => 'failed',
                'message' => 'already be a member.',
            ], 400);
        }

        if (in_array($userID, $requestArray)) {
            return response()->json([
                'status' => 'failed',
                'message' => 'already have a request.',
            ], 400);
        }

        $notifyDb = NotifyModel::create([
            'type' => 'invite',
            'postID' => $groupDb->groupID,
            'senderID' => auth()->user()->id,
            'receiverID' => $userID,
            'created_at' => now(),
            'updated_at' => now(),
        ]);

        if ($notifyDb) {
            return response()->json([
                'status' => 'ok',
                'message' => 'invite friend success.',
            ], 200);
        } else {
            return response()->json([
                'status' => 'failed',
                'message' => 'failed to invite friend.',
            ], 500);
        }
    }

    function requestToGroup($groupID)
    { // done *check
        $groupDb = GroupModel::where([['groupID', $groupID], ['status', 1]])
            ->orwhere([['type', 'hobby'], ['type', 'tutoring']])
            ->with(['member', 'request', 'hobby.leaderGroup', 'tutoring.leaderGroup'])
            ->first();

        if (empty($groupDb)) {
            return response()->json([
                'status' => 'failed',
                'message' => 'group not found.',
            ], 404);
        }

        $uID = auth()->user()->id;

        if (empty($groupDb->member)) {
            return response()->json([
                'status' => 'failed',
                'message' => 'members not found.',
            ], 404);
        } else {
            $members = $groupDb->member->pluck('id')->toArray();
        }

        if (in_array($uID, $members)) {
            return response()->json([
                'status' => 'failed',
                'message' => 'already be a member.',
            ], 400);
        }

        if (empty($groupDb->request)) {
            return response()->json([
                'status' => 'failed',
                'message' => 'request not found.',
            ], 404);
        } else {
            $requests = $groupDb->request->pluck('id')->toArray();
        }

        if (in_array($uID, $requests)) {
            $deleteRequest = RequestModel::where('userID', $uID)
                ->where('groupID', $groupDb->id)
                ->first();

            if ($deleteRequest->delete()) {
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
        } else if (!in_array($uID, $requests)) {
            $addRequest = RequestModel::create([
                'userID' => $uID,
                'groupID' => $groupDb->id,
                'created_at' => now(),
                'updated_at' => now(),
            ]);

            if ($addRequest) {
                if ($groupDb->type == 'hobby') {
                    $groupLeader = $groupDb->hobby->leaderGroup->id;
                } else if ($groupDb->type == 'tutoring') {
                    $groupLeader = $groupDb->tutoring->leaderGroup->id;
                }
                $notifyDb = NotifyModel::create([
                    'type' => 'request',
                    'postID' => $groupDb->groupID,
                    'senderID' => auth()->user()->id,
                    'receiverID' => $groupLeader,
                    'created_at' => now(),
                    'updated_at' => now(),
                ]);

                if ($addRequest && $notifyDb) {
                    return response()->json([
                        'status' => 'ok',
                        'message' => 'send request success.',
                    ], 200);
                }
            } else {
                return response()->json([
                    'status' => 'failed',
                    'message' => 'failed to add request.',
                ], 500);
            }
        }
    }

    function notification()
    { // done *check
        $notifyDb = NotifyModel::where('receiverID', auth()->user()->id)
            ->with(['receiver', 'sender', 'group.hobby.leaderGroup', 'group.tutoring.leaderGroup', 'group.library.leaderGroup'])
            ->latest()
            ->get();

        $data = NotificationResource::collection($notifyDb);
        return response()->json([
            'status' => 'ok',
            'data' => $data
        ], 200);
    }

    function myPost()
    { // done *check
        $allGroup = GroupModel::with(['member', 'hobby', 'library', 'tutoring'])
            ->orderBy('updated_at', 'DESC')
            ->get();

        $data = MyPostResource::collection($allGroup)->resolve();

        $data = array_filter($data, function($item) {
            return $item !== null;  
        });

        $data = array_values($data);

        $currentPage = LengthAwarePaginator::resolveCurrentPage();
        $perPage = 8;
        $currentPageItems = array_slice($data, ($currentPage - 1) * $perPage, $perPage);

        // Create a paginator instance
        $paginatedData = new LengthAwarePaginator($currentPageItems, count($data), $perPage, $currentPage, [
            'path' => LengthAwarePaginator::resolveCurrentPath(),
        ]);

        return response()->json([
            'prevPageUrl' => $paginatedData->previousPageUrl(),
            'status' => 'ok',
            'message' => 'fetch my posts success',
            'data' => $paginatedData->items(),
            'nextPageUrl' => $paginatedData->nextPageUrl()
        ], 200);
    }

    function leaveGroup($groupID)
    { //done *check
        $uID = auth()->user()->id;
        $groupDb = GroupModel::where(['groupID', $groupID])
            ->with(['hobby.leaderGroup', 'tutoring.leaderGroup'])
            ->first();

        if (empty($groupDb)) {
            return response()->json([
                'status' => 'failed',
                'message' => 'hobby not found.',
            ], 404);
        }

        $memberDb = MemberModel::where([['userID', $uID], ['groupID', $groupDb->id]])
            ->first();

        if (empty($memberDb)) {
            return response()->json([
                'status' => 'failed',
                'message' => 'you are not a member in this group.',
            ], 404);
        }

        if ($groupDb->type == "hobby") {
            if ($uID == $groupDb->hobby->leaderGroup->id) {
                return response()->json([
                    'status' => 'failed',
                    'message' => 'leader can not leave the group.',
                ], 400);
            }
        } else if ($groupDb->type == "tutoring") {
            if ($uID == $groupDb->tutoring->leaderGroup->id) {
                return response()->json([
                    'status' => 'failed',
                    'message' => 'leader can not leave the group.',
                ], 400);
            }
        }

        $deleteMember = MemberModel::where([['userID', $uID], ['groupID', $groupDb->id]])->delete();
        if ($deleteMember) {
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
