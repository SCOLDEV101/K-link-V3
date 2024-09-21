<?php

namespace App\Http\Controllers;

use Illuminate\Http\Request;
use App\Models\HobbyModel;
use App\Models\UserModel;
use App\Models\FacultyModel;
use App\Models\MajorModel;
use App\Models\SectionModel;
use App\Models\NotifyModel;
use Illuminate\Support\Facades\File;
use App\Http\Resources\HobbyGroupResource;
use App\Http\Resources\HobbyAboutGroupResource;
use App\Models\MemberModel;
use App\Models\GroupModel;
use App\Models\TutoringModel;
use Illuminate\Support\Facades\Validator;

class HobbyController extends Controller
{
    function showAllGroup(Request $request)
    {
        $hobbyDb = HobbyModel::where('type', 'hobby')->orderBy('updated_at', 'DESC')->with('leaderGroup')->paginate($request->get('perPage', 8));
        if (!$hobbyDb) {
            return response()->json([
                'status' => 'failed',
                'message' => 'hobby not found.',
            ], 404);
        }

        $data = HobbyGroupResource::collection($hobbyDb);
        if (sizeof($data) != 0) {
            return response()->json([
                'prevPageUrl' => $hobbyDb->previousPageUrl(),
                'status' => 'ok',
                'message' => 'fetch all hobby-group success.',
                'listItem' => $data,
                'nextPageUrl' => $hobbyDb->nextPageUrl()
            ], 200);
        } else {
            return response()->json([
                'status' => 'failed',
                'message' => 'failed to fetch all hobby group.',
            ], 500);
        };
    }

    function fetchKmitl()
    {
        $faculty = FacultyModel::select('facultyID', 'facultyNameTH', 'facultyNameEN')->where('status', '=', '1')->get();
        $section = SectionModel::select('majorID', 'sectionID', 'sectionName')->where('status', '=', '1')->get();
        $major = MajorModel::select('facultyID', 'majorID', 'majorNameTH', 'majorNameEN')->where('status', '=', '1')->get();
        return response()->json([
            'status' => 'ok',
            'message' => 'fetched faculty, section, major',
            'faculty' => $faculty,
            'section' => $section,
            'major' => $major
        ], 500);
    }

    function createGroup(Request $request)
    {
        $validationRules = HobbyModel::$validator[0];
        $validationMessages = HobbyModel::$validator[1];

        $validator = Validator::make($request->all(), $validationRules, $validationMessages);

        if ($validator->fails()) {
            return response()->json([
                'status' => 'failed',
                'message' => $validator->errors()
            ], 400);
        }

        $uID = auth()->user()->uID;
        $path = public_path('uploaded/hobbyImage/');
        if ($request->file('image') != null) {
            $file = $request->file('image');
            $extension = $file->getClientOriginalExtension();
            $filename = 'hobby-' . date('YmdHi') . '.' . $extension;
            $file->move($path, $filename);
        } else {
            $filename = null;
        }

        $hobbyModel = new HobbyModel();
        $hID = $hobbyModel->idGeneration();
        $data = [
            'hID' => $hID,
            'type' => 'hobby',
            'image' => $filename,
            'tag' => $request->input('tag') ?? 'hobby',
            'member' => $uID,
            'memberMax' => $request->input('memberMax') ?? null,
            'activityName' => $request->input('activityName'),
            'leader' => $uID,
            'weekDate' =>  $request->input('weekDate') ?? 'อา.,ส.,จ.,อ.,พ.,พฤ.,ศ.',
            'actTime' =>  $request->input('actTime'),
            'location' =>  $request->input('location'),
            'detail' =>  $request->input('detail'),
            'createdBy' => $uID,
            'created_at' => now(),
            'updated_at' => now()
        ];

        if (HobbyModel::insert($data)) {
            return response()->json([
                'status' => 'ok',
                'message' => 'create hobby group success.',
                'hID' => $hID
            ], 200);
        } else {
            return response()->json([
                'status' => 'failed',
                'message' => 'failed to create hobby group.'
            ], 500);
        };
    }

    function updateGroup(Request $request, $hID)
    {
        $validationRules = HobbyModel::$validator[0];
        $validationMessages = HobbyModel::$validator[1];

        $validator = Validator::make($request->all(), $validationRules, $validationMessages);

        if ($validator->fails()) {
            return response()->json([
                'status' => 'failed',
                'message' => $validator->errors()
            ], 400);
        }

        $hobbyDb = HobbyModel::where('hID', $hID)->first();
        $path = public_path('uploaded/hobbyImage/');

        if (!empty($request->file('image'))) {
            if (!empty($hobbyDb->image)) {
                File::delete($path . $hobbyDb->image);
            }
            $file = $request->file('image');
            $extension = $file->getClientOriginalExtension();
            if ($hobbyDb->image) {
            }
            $filename = 'hobby-' . now()->format('YmdHis') . '.' . $extension;
            $file->move($path, $filename);
        } else if (!empty($hobbyDb->image) && !empty($request->input('image')) && $hobbyDb->image == $request->input('image')) {
            $filename = $hobbyDb->image;
        } else if ($request->input('image') == "null" && empty($request->file('image'))) {
            File::delete($path . $hobbyDb->image);
            $filename = null;
        }

        $data = [
            'image' => $filename,
            'tag' => $request->input('tag') ?? $hobbyDb->tag,
            'memberMax' => $request->input('memberMax') ?? $hobbyDb->memberMax,
            'activityName' => $request->input('activityName') ?? $hobbyDb->activityName,
            'weekDate' => $request->input('weekDate') ?? $hobbyDb->weekDate,
            'actTime' => $request->input('actTime') ?? $hobbyDb->actTime,
            'location' => $request->input('location') ?? $hobbyDb->location,
            'detail' => $request->input('detail') ?? $hobbyDb->detail,
            'updated_at' => now()
        ];

        if (HobbyModel::where('hID', $hID)->update($data)) {
            return response()->json([
                'status' => 'ok',
                'message' => 'update hobby group success.',
                'update' => $data
            ], 200);
        } else {
            return response()->json([
                'status' => 'failed',
                'message' => 'failed to update hobby group.'
            ], 500);
        };
    }

    function memberGroup($hID)
    {
        $groupDb = GroupModel::where('groupID', $hID)->first();
        if ($groupDb->type == 'hobby') {
            $groupDb = HobbyModel::where('id', $hID)->with('leaderGroup')->first();
        }
        else if ($groupDb->type == 'tutoring') {
            $groupDb = TutoringModel::where('id', $hID)->with('leaderGroup')->first();
        }
        else {
            return response()->json([
                'status' => 'failed',
                'message' => 'hobby not found.',
            ], 404);
        }

        //-------------------- Prepare members data
        $member = [];
        $membersDb = (GroupModel::where('groupID', $hID)->with('member')->first())->member;

        foreach ($membersDb as $user) {
            if ($groupDb->leaderGroup->leader == (int)auth()->user()->id) {
                $leaderData = [
                    'username' => $groupDb->leaderGroup->username,
                    'uID' => $groupDb->leaderGroup->id,
                    'isMe' => true
                ];
            }
            else if ((int)$groupDb->leaderGroup->id == (int)$user->id) {
                $leaderData = [
                    'username' => strval($user->username),
                    'uID' => (int)$user->id,
                    'isMe' => false
                ];
            } else if ((int)$user->id == (int)auth()->user()->id && (int)$user->id != (int)$groupDb->leaderGroup->id) {
                $member[] = [
                    'username' => $user->username,
                    'uID' => (int)$user->id,
                    'isMe' => true
                ];
            } else if ((int)$user->id != (int)auth()->user()->id && (int)$user->id != (int)$groupDb->leaderGroup->id) {
                $member[] = [
                    'username' => $user->username,
                    'uID' => (int)$user->id,
                    'isMe' => false
                ];
            }
        }
        //--------------------

        //-------------------- If user is leader
        if ($groupDb->leaderGroup->id == auth()->user()->id) {
            $role = 'leader';

            $requestmembers = explode(',', $groupDb->memberRequest);
            $requestCount = 0;
            foreach ($requestmembers as $request) {
                if ($request != null && $request != "") {
                    $requestCount++;
                }
            }
            $data = [
                'groupName' => $groupDb->name,
                'leader' => $leaderData,
                'members' => $member,
                'requestCount' => $requestCount
            ];
        }
        //------------------- If user is member 
        else {
            $role = 'normal';
            $data = [
                'groupName' => $groupDb->name,
                'leader' => $leaderData,
                'members' => $member
            ];
        }
        //--------------------

        if ($data) {
            return response()->json([
                'status' => 'ok',
                'message' => 'fetch member hobby group success.',
                'hID' => $hID,
                'data' => $data,
                'role' => $role,
            ], 200);
        } else {
            return response()->json([
                'status' => 'failed',
                'message' => 'failed to fetch member hobby group.'
            ], 500);
        };
    }

    function aboutGroup($hID)
    {
        $hobbyDb = HobbyModel::where('hID', $hID)->first();
        if (empty($hobbyDb)) {
            return response()->json([
                'status' => 'failed',
                'message' => 'hobby not found.',
            ], 404);
        }

        $data = new HobbyAboutGroupResource($hobbyDb);

        if ($data) {
            return response()->json([
                'status' => 'ok',
                'message' => 'fetch hobby about group success.',
                'data' => $data
            ], 200);
        } else {
            return response()->json([
                'status' => 'failed',
                'message' => 'failed to fetch about hobby group.',
            ], 500);
        };
    }

    function checkRequestGroup($hID)
    {
        $hobbyDb = HobbyModel::where('hID', $hID)->first();
        $requestUid = $hobbyDb->request();
        $data = [];
        foreach ($requestUid as $username) {
            $data[] = [
                'username' => $username->username,
                'uID' => (int)$username->uID,
            ];
        }
        if ($hobbyDb) {
            return response()->json([
                'status' => 'ok',
                'message' => 'fetch all request success.',
                'data' => $data
            ], 200);
        } else {
            return response()->json([
                'status' => 'failed',
                'message' => 'failed to fetch all request.',
            ], 500);
        };
    }

    function rejectOrAcceptRequest(Request $request, $hID)
    {
        $groupDb = HobbyModel::where('hID', $hID)->first();
        if (!UserModel::where('uID', (int)$request->input('uID'))->first()) {
            return response()->json([
                'status' => 'failed',
                'message' => 'user not found.',
            ], 404);
        }

        $requestArray = explode(',', $groupDb->memberRequest);
        $memberArray = explode(',', $groupDb->member);

        if ($request->input('method') == 'accept') {
            if (!in_array((int)$request->input('uID'), $requestArray) || $requestArray == '') {
                return response()->json([
                    'status' => 'failed',
                    'message' => 'request not found.',
                ], 404);
            } else if (in_array((int)$request->input('uID'), $memberArray)) {
                return response()->json([
                    'status' => 'failed',
                    'message' => 'user already be a member.',
                ], 400);
            } else {
                $action = 'acceptRequest';
                $memberArray[] = (int)$request->input('uID');
                $requestArray = array_diff($requestArray, [(int)$request->input('uID')]);
            }
        } else if ($request->input('method') == 'reject') {
            if (!in_array((int)$request->input('uID'), $requestArray) || $requestArray == '') {
                return response()->json([
                    'status' => 'failed',
                    'message' => 'request not found.',
                ], 404);
            } else {
                $action = 'rejectRequest';
                $requestArray = array_diff($requestArray, [(int)$request->input('uID')]);
            }
        } else {
            return response()->json([
                'status' => 'failed',
                'message' => 'method not found.',
            ], 400);
        }

        $notifyData = [
            'notiType' => $action,
            'id' => (int)$request->input('uID'),
            'sender' => (int)$groupDb->leader,
            'receiver' => (int)$request->input('uID'),
            'created_at' => now(),
            'updated_at' => now(),
        ];

        $countMember = 0;
        foreach ($memberArray as $member) {
            if ($member != null && $member != "") {
                $countMember++;
            }
        }

        $data = [
            'memberCount' =>  $countMember,
            'member' => implode(',', $memberArray),
            'memberRequest' => implode(',', $requestArray)
        ];

        if (HobbyModel::where('hID', $hID)->update($data)) {
            $sendRequestNotify = NotifyModel::create($notifyData);
            if (!$sendRequestNotify) {
                return response()->json([
                    'status' => 'failed',
                    'message' => 'failed to accept request.',
                ], 500);
            }
            return response()->json([
                'status' => 'ok',
                'message' => 'update member and request success.',
            ], 200);
        } else {
            return response()->json([
                'status' => 'failed',
                'message' => 'failed to update member and request.',
            ], 500);
        }
    }

    function kickMember($hID, $uID)
    {
        $hobbyDb = HobbyModel::where('hID', $hID)->first();

        if (!UserModel::where('uID', $uID)->first()) {
            return response()->json([
                'status' => 'failed',
                'message' => 'user not found.',
            ], 404);
        }
        $memberArray = explode(',', $hobbyDb->member);
        if (in_array($uID, $memberArray)) {
            $memberArray = array_diff($memberArray, [$uID]);
            if (HobbyModel::where('hID', $hID)->update(['member' => implode(',', $memberArray)])) {
                return response()->json([
                    'status' => 'ok',
                    'message' => 'kick member success.',
                ], 200);
            } else {
                return response()->json([
                    'status' => 'failed',
                    'message' => 'failed to kick member.',
                ], 500);
            }
        } else {
            return response()->json([
                'status' => 'failed',
                'message' => 'member not found.',
            ], 404);
        }
    }

    function deleteGroup($hID)
    {
        $hobbyDb = HobbyModel::where('hID', $hID)->first();
        if ($hobbyDb->leader == auth()->user()->uID) {
            if (HobbyModel::where('hID', $hID)->delete()) {
                return response()->json([
                    'status' => 'ok',
                    'message' => 'delete hobby success.',
                ], 200);
            } else {
                return response()->json([
                    'status' => 'failed',
                    'message' => 'failed to delete hobby.',
                ], 500);
            }
        } else {
            return response()->json([
                'status' => 'failed',
                'message' => 'unauthorize.',
            ], 401);
        }
    }

    function changeLeaderGroup($hID, $uID)
    {
        $hobbyDb = HobbyModel::where('hID', $hID)->first();

        if (!UserModel::where('uID', $uID)->first()) {
            return response()->json([
                'status' => 'failed',
                'message' => 'user not found.',
            ], 404);
        }

        if (!in_array($uID, explode(',', $hobbyDb->member))) {
            return response()->json([
                'status' => 'failed',
                'message' => 'member not found.',
            ], 404);
        }

        if ($uID == $hobbyDb->leader) {
            return response()->json([
                'status' => 'failed',
                'message' => 'already be.',
            ], 400);
        } else {
            if ($hobbyDb->where('hID', $hID)->update(['leader' => $uID])) {
                return response()->json([
                    'status' => 'ok',
                    'message' => 'change leader group success.',
                ], 200);
            } else {
                return response()->json([
                    'status' => 'failed',
                    'message' => 'failed to change leader group.',
                ], 500);
            }
        }
    }
}
