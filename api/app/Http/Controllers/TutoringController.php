<?php

namespace App\Http\Controllers;

use Illuminate\Support\Facades\Log;
use Exception;

use Illuminate\Http\Request;
use App\Models\UserModel;
use App\Models\TutoringModel;
use App\Models\MemberModel;
use App\Models\GroupTagModel;
use App\Models\GroupDayModel;
use App\Models\NotifyModel;
use App\Models\GroupModel;
use Illuminate\Support\Facades\File;
use App\Http\Resources\GroupResource;
use Illuminate\Support\Facades\Validator;
use App\Models\imageOrFileModel;
use App\Models\TagModel;
use App\Models\RequestModel;
use App\Models\MajorModel;

class TutoringController extends Controller
{
    function showAllGroup(Request $request)
    {
        $tutoringDb = GroupModel::where([['type', 'tutoring'], ['status', 1]])
            ->orderBy('updated_at', 'DESC')
            ->with([
                'tutoring',
                'bookmark',
                'tutoring.imageOrFile',
                'tutoring.leaderGroup',
                'tutoring.faculty',
                'tutoring.major',
                'tutoring.department',
                'member',
                'request',
                'groupDay',
                'groupTag'
            ])
            ->paginate(8);

        if (sizeof($tutoringDb) <= 0) { //เช็คจำนวนข้อมูลที่เจอ
            return response()->json([
                'status' => 'failed',
                'message' => 'group not found.',
            ], 404);
        }

        $data = GroupResource::collection($tutoringDb);
        if (sizeof($data) != 0) {
            return response()->json([
                'prevPageUrl' => $tutoringDb->previousPageUrl(),
                'status' => 'ok',
                'message' => 'fetch all tutoring group success.',
                'listItem' => $data,
                'nextPageUrl' => $tutoringDb->nextPageUrl()
            ], 200);
        } else {
            return response()->json([
                'status' => 'failed',
                'message' => 'failed to fetch tutoring group.',
            ], 500);
        };
    }

    function createGroup(Request $request)
    { //done (waitng for checking)
        // validation
        $validationRules = TutoringModel::$validator[0];
        $validationMessages = TutoringModel::$validator[1];

        $validator = Validator::make($request->all(), $validationRules, $validationMessages);

        if ($validator->fails()) {
            return response()->json([
                'status' => 'failed',
                'message' => $validator->errors()
            ], 400);
        }
        // ------------

        try {
            $uID = auth()->user()->id;
            $path = public_path('uploaded\\hobbyImage\\');
            if ($request->file('image') != null) {
                $file = $request->file('image');
                $extension = $file->getClientOriginalExtension();
                $filename = 'tutoring-' . date('YmdHi') . '.' . $extension;
                $file->move($path, $filename);
                $imageOrFileDb = imageOrFileModel::create([
                    'name' => $filename
                ]);
            }

            $TutoringModel = new TutoringModel;
            $groupID = $TutoringModel->idGeneration();

            //-----------group part
            $groupDb = GroupModel::create([
                'groupID' => strval($groupID),
                'type' => "tutoring",
                'status' => (int)1,
                'created_at' => now(),
                'updated_at' => now(),
            ]);
            //-----------

            //----------------------groupday part
            if ($request->has('weekDate')) {
                $days = explode(',', $request->input('weekDate'));
                //loop through array of days input and save to Db
                foreach ($days as $day) {
                    //if array is empty then set day to today of weekday (it will has only one array)
                    if ($day == '' || $day == null) {
                        $day = (int)date('w');
                    }
                    GroupDayModel::create([
                        'dayID' => (int)$day,
                        'groupID' => $groupDb->id,
                    ]);
                }
            }
            //using today of weekday if days input is empty
            else {
                $day = date('w');
                GroupDayModel::create([
                    'dayID' => (int)$day,
                    'groupID' => $groupDb->id,
                ]);
            }
            //----------------------

            //-----------tutoring part
            if(gettype($request->input('majorID'))=="string"){
                $majorDb = MajorModel::where('shortName',$request->input('majorID'))->first();
            }
            $defaultImage = imageOrFileModel::where('name', 'tutoring-group-default.png')->first();
            $tutoringDb = TutoringModel::create([
                'id' => $groupID,
                'facultyID' => (int)$request->input('facultyID'),
                'majorID' => $majorDb->id ?? $request->input('majorID'),
                'departmentID' => $request->input('departmentID') ?? null,
                'imageOrFileID' => $imageOrFileDb->id ?? $defaultImage->id,
                'name' => $request->input('activityName'),
                'memberMax' => $request->input('memberMax') ?? null,
                'location' =>  $request->input('location'),
                'detail' =>  $request->input('detail') ?? null,
                'startTime' =>  date("H:i:s", strtotime($request->input('startTime'))) ?? date_format(now(), "H:i:s"),
                'endTime' => date("H:i:s", strtotime($request->input('endTime'))) ?? date("H:i:s", mktime(0, 0, 0)),
                'date' => date("Y-m-d", strtotime($request->input('date'))) ?? date("Y-m-d"),
                'leader' => $uID,
                'createdBy' => $uID,
                'created_at' => now(),
                'updated_at' => now(),
            ]);
            //-----------

            //----------------------tag part
            $tags = explode(',', $request->input('tag'));
            foreach ($tags as $tag) {
                if ($tag == '' || $tag == null) {
                    $tag = "tutoring";
                }
                $querytag = TagModel::where('name', $tag)->first();
                if ($querytag) {
                    //Tag id if tag is exists
                    $tagID = $querytag->id;
                } else {
                    $tagDb = TagModel::create([
                        'name' => $tag
                    ]);
                    //Tag id if tag is new
                    $tagID = $tagDb->id;
                }
                GroupTagModel::create([
                    'tagID' => $tagID,
                    'groupID' => $groupDb->id,
                    'type' => 'tutoring',
                ]);
            }
            //-----------------------

            //----------------member part
            $memberDb = MemberModel::create([
                'userID' => $uID,
                'groupID' => $groupDb->id,
                'created_at' => now(),
                'updated_at' => now(),
            ]);
            //----------------

            if ($groupDb && $tutoringDb && $memberDb) {
                return response()->json([
                    'status' => 'ok',
                    'message' => 'create tutoring group success.',
                    'groupID' => $groupID
                ], 200);
            }
        } catch (Exception $e) {
            //save error message to laravel log
            Log::error('Error occurred: ' . $e->getMessage(), [
                'exception' => $e,
                'trace' => $e->getTraceAsString()
            ]);
            //delete group with all its related model when failed
            if (GroupTagModel::where('groupID', $groupDb->id)->first()) {
                GroupTagModel::where('groupID', $groupDb->id)->delete();
            }
            if (MemberModel::where('groupID', $groupDb->id)->first()) {
                MemberModel::where('groupID', $groupDb->id)->delete();
            }
            if (TutoringModel::where('id', $groupID)->first()) {
                TutoringModel::where('id', $groupID)->delete();
            }
            if (GroupModel::where('groupID', $groupID)->first()) {
                GroupModel::where('groupID', $groupID)->delete();
            }
            return response()->json([
                'status' => 'failed',
                'message' => 'failed to create tutoring group.'
            ], 500);
        }
    }

    function updateGroup(Request $request, $groupID)
    {
        //done (waitng for checking) **noti to everymem
        $uID = auth()->user()->id;

        $validationRules = TutoringModel::$validator[0];
        $validationMessages = TutoringModel::$validator[1];

        $validator = Validator::make($request->all(), $validationRules, $validationMessages);

        if ($validator->fails()) {
            return response()->json([
                'status' => 'failed',
                'message' => $validator->errors()
            ], 400);
        }

        //----- เรียกใช้ relation
        $groupDb = GroupModel::where('groupID', $groupID)
            ->where([['type', 'tutoring'], ['status', 1]])
            ->with(['tutoring', 'tutoring.imageOrFile', 'groupDay', 'groupTag', 'member'])
            ->orderBy('updated_at', 'DESC')
            ->first();

        if (empty($groupDb)) {
            return response()->json([
                'status' => 'failed',
                'message' => 'Group not found.'
            ], 404);
        }
        //---------------

        //----------------- ถ้ามีการใส่รูป
        $path = public_path('uploaded\\hobbyImage\\');
        //--- ชื่อไฟล์ที่ใช้ seed
        $defaultFiles = [];
        foreach (imageOrFileModel::$groupImageStatic as $file) {
            array_push($defaultFiles, $file['name']);
        }
        //---
        if (!empty($request->file('image'))) {
            $file = $request->file('image');
            if (imageOrFileModel::where('id', $groupDb->tutoring->imageOrFile->id)->first() && !in_array(strval($groupDb->tutoring->imageOrFile->name), $defaultFiles)) {
                imageOrFileModel::where('id', $groupDb->tutoring->imageOrFile->id)->delete(); // ลบชื่อไฟล์บน database
                if (File::exists($path . $groupDb->tutoring->imageOrFile->name)) {
                    File::delete($path . $groupDb->tutoring->imageOrFile->name); //ลบไฟล์รูปเก่าทิ้ง
                }
            }
            $extension = $file->getClientOriginalExtension();
            $filename = 'tutoring-' . now()->format('YmdHis') . '.' . $extension;
            $move = $file->move($path, $filename);
            if (!$move) {
                return response()->json([
                    'status' => 'failed',
                    'message' => 'Can not upload image.'
                ], 500);
            } else {
                $imageOrFileDb = imageOrFileModel::create([
                    'name' => $filename
                ]);
            }
        } else if (empty($request->file('image')) && !$request->has('deleteimage')) {
            $imageOrFileDb = imageOrFileModel::where('id', $groupDb->tutoring->imageOrFile->id)->first();
        } else if ($request->has('deleteimage')) {
            if (imageOrFileModel::where('id', $groupDb->tutoring->imageOrFile->id)->first() && !in_array(strval($groupDb->tutoring->imageOrFile->name), $defaultFiles, true)) {
                imageOrFileModel::where('id', $groupDb->tutoring->imageOrFile->id)->delete(); // ลบชื่อไฟล์บน database
                if (File::exists($path . $groupDb->tutoring->imageOrFile->name)) {
                    File::delete($path . $groupDb->tutoring->imageOrFile->name); //ลบไฟล์รูปเก่าทิ้ง
                }
                $imageOrFileDb = imageOrFileModel::where('name', 'group-default.jpg')->first();
            }
        }
        //----------------------

        //----------------- tag part
        if ($request->input('tag')) {
            $deleteOldTag = GroupTagModel::where('groupID', $groupDb->id)->where('type', 'tutoring')->delete();
            $newTags = explode(',', $request->input('tag'));

            foreach ($newTags as $tag) {
                if ($tag != '' || $tag != null) {
                    $tag = ['tutoring'];
                }
                $querytag = TagModel::where('name', $tag)->first();
                if (empty($querytag)) {
                    $newTag = TagModel::create([
                        'name' => $tag
                    ]);
                    $tagGroup = $newTag->id;
                } else {
                    $tagGroup = $querytag->id;
                }

                GroupTagModel::create([
                    'groupID' => $groupDb->id,
                    'tagID' => $tagGroup,
                    'type' => 'tutoring'
                ]);
            };
        }
        // -----------------------------

        //-------- แตก array เหมือน tag และลบอันเก่าทิ้งเพื่อสร้างใหม่ เผื่อกรณีเพิ่มวัน
        if ($request->has('weekDate')) {
            $deleteOldDay = GroupDayModel::where('groupID', $groupDb->id)->delete();
            $days = explode(',', $request->input('weekDate'));
            //loop through array of days input and save to Db
            foreach ($days as $day) {
                //if array is empty then set day to today of weekday (it will has only one array)
                if ($day == '' || $day == null) {
                    $day = (int)date('w');
                }
                if (empty(GroupDayModel::where([['groupID', $groupDb->id], ['dayID', $day]])->first())) {
                    GroupDayModel::create([
                        'dayID' => (int)$day,
                        'groupID' => $groupDb->id,
                    ]);
                }
            }
        } else {
            $day = (int)date('w');
            if (empty(GroupDayModel::where([['groupID', $groupDb->id], ['dayID', $day]])->first())) {
                GroupDayModel::create([
                    'dayID' => (int)$day,
                    'groupID' => $groupDb->id,
                ]);
            }
        }
        //------------------------------

        //----------------- tutoring data
        if(gettype($request->input('majorID'))=="string"){
            $majorDb = MajorModel::where('shortName',$request->input('majorID'))->first();
        }
        $data = [
            'facultyID' => $request->input('facultyID') ?? $groupDb->tutoring->facultyID,
            'majorID' => $majorDb->id ?? $request->input('majorID'),
            'departmentID' => $request->input('departmentID') ?? $groupDb->tutoring->departmentID,
            'imageOrFileID' => $imageOrFileDb->id ?? $groupDb->tutoring->imageOrFile->id,
            'name' => $request->input('activityName') ?? $groupDb->tutoring->activityName,
            'memberMax' => $request->input('memberMax') ?? $groupDb->tutoring->memberMax,
            'location' => $request->input('location') ?? $groupDb->tutoring->location,
            'detail' => $request->input('detail') ?? $groupDb->tutoring->detail ?? null,
            'startTime' => date("H:i:s", strtotime($request->input('startTime'))) ?? $groupDb->tutoring->startTime,
            'endTime' => date("H:i:s", strtotime($request->input('endTime'))) ?? $groupDb->tutoring->endTime,
            'date' => date("Y-m-d", strtotime($request->input('date'))) ?? date("Y-m-d"),
            'leader' => $uID,
            'updated_at' => now()
        ];
        //-----------------------

        // อัพเดตข้อมูลทั่วไปของ tutoring และส่งแจ้งเตือนอัพเดต
        if (TutoringModel::where('id', $groupID)->update($data) && GroupModel::where('groupID', $groupID)->update(['updated_at' => now()])) {
            foreach ($groupDb->member as $member) {
                if ($member->id != $uID) {
                    NotifyModel::insert([
                        'receiverID' => $member->id,
                        'senderID' => $groupDb->tutoring->leader,
                        'postID' => $groupID,
                        'type' => 'updateGroup'
                    ]);
                }
            }
            return response()->json([
                'status' => 'ok',
                'message' => 'update tutoring group success.',
            ], 200);
        } else {
            return response()->json([
                'status' => 'failed',
                'message' => 'can not update group'
            ], 500);
        };
    }

    function memberGroup($groupID)
    {
        $groupDb = GroupModel::where([['groupID', $groupID], ['type', 'tutoring'], ['status', 1]])
            ->with(['tutoring', 'tutoring.imageOrFile', 'groupDay', 'groupTag', 'member', 'request'])
            ->first();

        if ($groupDb) {
            //-------------------- Prepare members data
            $member = [];
            $leader = [];
            $leaderDb = UserModel::where([['id', $groupDb->tutoring->leader], ['status', 1]])->first();

            foreach ($groupDb->member as $eachMember) {
                $member[] = [
                    'username' => $eachMember->username,
                    'uID' => $eachMember->id,
                    'isMe' => boolval($eachMember->id == auth()->user()->id)
                ];
            }

            $leader[] = [
                'username' => $leaderDb->username,
                'uID' => $leaderDb->id,
                'isMe' => boolval($leaderDb->id == auth()->user()->id)
            ];

            $members = $leader + $member;
            //--------------------

            //-------------------- If user is leader
            if ($groupDb->tutoring->leader == auth()->user()->id) {
                $role = 'leader';

                $requestCount = 0;
                foreach ($groupDb->request as $request) {
                    if ($request != null && $request != "") {
                        $requestCount++;
                    }
                }
                $data = [
                    'groupName' => $groupDb->tutoring->name,
                    'members' => $members,
                    'requestCount' => $requestCount
                ];
            }
            //------------------- If user is member 
            else {
                $role = 'normal';
                $data = [
                    'groupName' => $groupDb->tutoring->name,
                    'members' => $members
                ];
            }
            //--------------------

            if ($data) {
                return response()->json([
                    'status' => 'ok',
                    'message' => 'fetch member tutoring group success.',
                    'groupID' => $groupID,
                    'data' => $data,
                    'role' => $role,
                    'this' => auth()->user()->id
                ], 200);
            } else {
                return response()->json([
                    'status' => 'failed',
                    'message' => 'failed to fetch member tutoring group.'
                ], 500);
            };
        } else {
            return response()->json([
                'status' => 'failed',
                'message' => 'group not found.',
            ], 404);
        };
    }

    function aboutGroup($groupID)
    {
        $groupDb = GroupModel::where([['groupID', $groupID], ['type', 'tutoring'], ['status', 1]])
            ->with(['tutoring', 'bookmark', 'member', 'request', 'groupDay', 'groupTag', 'tutoring.imageOrFile', 'tutoring.leaderGroup'])
            ->orderBy('updated_at', 'DESC')
            ->first();

        if (empty($groupDb)) {
            return response()->json([
                'status' => 'failed',
                'message' => 'tutoring not found.',
            ], 404);
        }

        $data = new GroupResource($groupDb);

        if ($data) {
            return response()->json([
                'status' => 'ok',
                'message' => 'fetch tutoring about group success.',
                'data' => $data
            ], 200);
        } else {
            return response()->json([
                'status' => 'failed',
                'message' => 'failed to fetch about tutoring group.',
            ], 500);
        };
    }

    function checkRequestGroup($groupID)
    {
        $groupDb = GroupModel::where([['groupID', $groupID], ['type', 'tutoring'], ['status', 1]])
            ->with(['tutoring', 'tutoring.leaderGroup', 'request'])
            ->orderBy('updated_at', 'DESC')
            ->first();

        if (empty($groupDb)) {
            return response()->json([
                'status' => 'failed',
                'message' => 'group not found.',
            ], 404);
        }

        if (sizeof($groupDb->request) <= 0) {
            return response()->json([
                'status' => 'ok',
                'message' => 'no request.',
            ], 200);
        }

        // เอา request มาเก็บเป็น array
        $requestArray = [];
        foreach ($groupDb->request as $request) {
            $image = UserModel::where('id',$request->id)
                                        ->with('imageOrFile')
                                        ->first();
            if ($request != null && $request != "") {
                $requestArray[] = [
                    "image" => '/uploaded/profileImage/' . $image->imageOrFile->name,
                    'username' => $request->username,
                    'uID' => (int)$request->id,
                    'timestamps' => date($request->created_at)
                ];
            }
        }

        return response()->json([
            'status' => 'ok',
            'message' => 'fetch all request success.',
            'data' => $requestArray
        ], 200);
    }

    function rejectOrAcceptRequest(Request $request, $groupID)
    {
        $validationRules = RequestModel::$validator[0];
        $validationMessages = RequestModel::$validator[1];

        $validator = Validator::make($request->all(), $validationRules, $validationMessages);

        if ($validator->fails()) {
            return response()->json([
                'status' => 'failed',
                'message' => $validator->errors()
            ], 400);
        }

        $groupDb = GroupModel::where([['groupID', $groupID], ['type', 'tutoring']])
            ->with(['tutoring', 'member', 'request'])
            ->first();

        if (!UserModel::where('id', (int)$request->input('uID'))->first()) {
            return response()->json([
                'status' => 'failed',
                'message' => 'user not found.',
            ], 404);
        } else $userID = strval($request->input('uID'));

        if (empty($groupDb->request)) {
            return response()->json([
                'status' => 'failed',
                'message' => 'request not found.',
            ], 404);
        } else {
            $requestArray = $groupDb->request->pluck('id')->toArray();
        }

        if (empty($groupDb->member)) {
            return response()->json([
                'status' => 'failed',
                'message' => 'members not found.',
            ]);
        } else {
            $memberArray = $groupDb->member->pluck('id')->toArray();
        }

        if (in_array($userID, $memberArray)) {
            return response()->json([
                'status' => 'failed',
                'message' => 'This user already is a member.',
            ], 400);
        }

        if (!in_array($userID, $requestArray)) {
            return response()->json([
                'status' => 'failed',
                'message' => 'This user not found in request.',
            ], 400);
        }

        if ($request->input('method') == 'accept') {
            MemberModel::create([
                'userID' => $userID,
                'groupID' => $groupDb->id
            ]);
            $requestDb = RequestModel::where([['userID', $userID], ['groupID', $groupDb->id]])->delete();
            $notifyDb = NotifyModel::create([
                'receiverID' => $userID,
                'senderID' => $groupDb->tutoring->leader,
                'postID' => $groupDb->groupID,
                'type' => "acceptRequest",
                'created_at' => now(),
                'updated_at' => now(),
            ]);
        } else if ($request->input('method') == 'reject') {
            $requestDb = RequestModel::where([['userID', $userID], ['groupID', $groupDb->id]])->delete();
            $notifyDb = NotifyModel::create([
                'receiverID' => $userID,
                'senderID' => $groupDb->tutoring->leader,
                'postID' => $groupDb->groupID,
                'type' => "rejectRequest",
                'created_at' => now(),
                'updated_at' => now(),
            ]);
        }

        if ($requestDb && $notifyDb) {
            return response()->json([
                'status' => 'ok',
                'message' => 'manage member and request success.',
            ], 200);
        } else {
            return response()->json([
                'status' => 'failed',
                'message' => 'failed to manage member and request.',
            ], 500);
        }
    }

    function kickMember($groupID, $uID)
    {
        $groupDb = GroupModel::where('groupID', $groupID)
            ->with(['tutoring', 'member', 'tutoring.leaderGroup'])
            ->first();

        if (empty($groupDb)) { //เช็คว่ามี group ในระบบมั้ย
            return response()->json([
                'status' => 'failed',
                'message' => 'group not found.',
            ], 404);
        }

        if (!Usermodel::where('id', (int)$uID)->first()) { //เช็คว่ามี user ในระบบมั้ย
            return response()->json([
                'status' => 'failed',
                'message' => 'user not found.',
            ], 404);
        }
        // การเช็ค leader ว่า uID == leader จริง จะอยู่ที่ middleware checkLeader
        // หากไม่ใช่ จะส่ง 403
        if ($groupDb->tutoring->leader == $uID) { //เช็คกรณี leader เตะตัวเอง
            return response()->json([
                'status' => 'failed',
                'message' => 'can not kick yourself, You are the leader.',
            ], 400);
        }

        if (!MemberModel::where([['groupID', $groupDb->id], ['userID', $uID]])->first()) { //เช็คว่ามี user ในกลุ่มที่จะลบมั้ย
            return response()->json([
                'status' => 'failed',
                'message' => 'this user is not in the group.',
            ], 404);
        }

        $deleteUser = MemberModel::where([['groupID', $groupDb->id], ['userID', $uID]])->delete();
        $notifyDb = NotifyModel::create([ //หากลบสำเร็จ จะส่งแจ้งเตือนไปยังคนที่ถูกลบ
            'receiverID' => $uID,
            'senderID' => $groupDb->tutoring->leader,
            'postID' => $groupID,
            'type' => 'kick'
        ]);

        if ($deleteUser && $notifyDb) {
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
    }

    function deleteGroup($groupID)
    {
        $groupDb = GroupModel::where([['groupID', $groupID], ['type', 'tutoring'], ['status', 1]])
            ->with(['tutoring', 'tutoring.imageOrFile', 'groupDay', 'groupTag', 'member'])
            ->orderBy('updated_at', 'DESC')
            ->first();
        if ($groupDb) {
            if (
                MemberModel::where('groupID', $groupDb->id)->delete() && GroupTagModel::where('groupID', $groupDb->id)->delete()
                && GroupDayModel::where('groupID', $groupDb->id)->delete() && GroupModel::where('groupID', $groupID)->delete()
                && TutoringModel::where('id', $groupID)->delete()
            ) {
                foreach ($groupDb->member as $member) {
                    NotifyModel::create([
                        'receiverID' => $member->id,
                        'senderID' => $groupDb->tutoring->leader,
                        'postID' => $groupDb->id,
                        'type' => "delete",
                    ]);
                }
                return response()->json([
                    'status' => 'ok',
                    'message' => 'delete group success.',
                ], 200);
            } else {
                return response()->json([
                    'status' => 'failed',
                    'message' => 'failed to delete group.',
                ], 500);
            }
        } else {
            return response()->json([
                'status' => 'failed',
                'message' => 'group not found.',
            ], 500);
        }
    }

    function changeLeaderGroup($groupID, $uID)
    {
        $groupDb = GroupModel::where([['groupID', $groupID], ['type', 'tutoring'], ['status', 1]])
            ->with(['tutoring', 'member'])
            ->first();

        if (empty($groupDb)) {
            return response()->json([
                'status' => 'failed',
                'message' => 'group not found.',
            ], 404);
        }

        if (!UserModel::where('id', $uID)->first()) {
            return response()->json([
                'status' => 'failed',
                'message' => 'user not found.',
            ], 404);
        }

        if (empty($groupDb->member)) {
            return response()->json([
                'status' => 'failed',
                'message' => 'members not found.',
            ], 404);
        } else {
            foreach ($groupDb->member as $index => $member) {
                $memberArray = array($index => $member->pivot->userID);
            }
        }

        if (!in_array($uID, $memberArray)) {
            return response()->json([
                'status' => 'failed',
                'message' => 'this member is not in the group.',
            ], 400);
        }

        if ((int)$uID == (int)$groupDb->tutoring->leader) {
            return response()->json([
                'status' => 'failed',
                'message' => 'this user already is leader.',
            ], 400);
        } else {
            $tutoringDb = TutoringModel::where([['id', $groupID]])->update([
                'leader' => $uID,
                'updated_at' => now()
            ]);
            if ($tutoringDb) {
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
