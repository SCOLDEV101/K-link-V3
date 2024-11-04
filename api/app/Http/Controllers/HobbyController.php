<?php

namespace App\Http\Controllers;

use Illuminate\Support\Facades\Log;
use Exception;

use Illuminate\Http\Request;
use App\Models\HobbyModel;
use App\Models\UserModel;
use App\Models\FacultyModel;
use App\Models\MajorModel;
use App\Models\NotifyModel;
use Illuminate\Support\Facades\File;
use App\Http\Resources\GroupResource;
use App\Models\DepartmentModel;
use App\Models\MemberModel;
use App\Models\GroupModel;
use Illuminate\Support\Facades\Validator;
use App\Models\GroupDayModel;
use App\Models\TagModel;
use App\Models\GroupTagModel;
use App\Models\imageOrFileModel;
use App\Models\RequestModel;

class HobbyController extends Controller
{
    function showAllGroup(Request $request) // done
    { //done
        //เรียก relatoin มาใช้
        $hobbyDb = GroupModel::where('type', 'hobby')
            ->where('status', 1)
            ->orderBy('updated_at', 'DESC')
            ->with(['hobby', 'hobby.imageOrFile', 'hobby.leaderGroup', 'member', 'request', 'groupDay', 'groupTag', 'bookmark'])
            ->paginate(8);
        // return $hobbyDb[0]->hobby->id;
        if (sizeof($hobbyDb) <= 0) { //เช็คจำนวนข้อมูลที่เจอ
            return response()->json([
                'status' => 'failed',
                'message' => 'hobby not found.',
            ], 404);
        }

        $data = GroupResource::collection($hobbyDb); //เอาไปกรองผ่าน resource
        if (sizeof($data) > 0) {
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
    { //ยังไม่แตะ
        $faculty = FacultyModel::where('status', '=', '1')->get();
        $department = DepartmentModel::where('status', '=', '1')->get();
        $major = MajorModel::where('status', '=', '1')->get();
        return response()->json([
            'status' => 'ok',
            'message' => 'fetched faculty, section, major',
            'faculty' => $faculty,
            'section' => $department,
            'major' => $major
        ], 500);
    }

    function createGroup(Request $request) // done
    { //done (waitng for checking)
        // validation
        $validationRules = HobbyModel::$validator[0];
        $validationMessages = HobbyModel::$validator[1];

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
                $filename = 'hobby-' . date('YmdHi') . '.' . $extension;
                $file->move($path, $filename);
                $imageOrFileDb = imageOrFileModel::create([
                    'name' => $filename
                ]);
            }

            $hobbyModel = new HobbyModel;
            $groupID = $hobbyModel->idGeneration();

            //-----------group part
            $groupDb = GroupModel::create([
                'groupID' => strval($groupID),
                'type' => "hobby",
                'status' => (int)1,
                'created_at' => now(),
                'updated_at' => now(),
            ]);
            //-----------

            //-----------hobby part
            $hobbyDb = HobbyModel::create([
                'id' => $groupID,
                'imageOrFileID' => $imageOrFileDb->id ?? null,
                'name' => $request->input('activityName'),
                'memberMax' => $request->input('memberMax') ?? null,
                'location' =>  $request->input('location'),
                'detail' =>  $request->input('detail') ?? null,
                'startTime' =>  $request->input('startTime') ?? date_format(now(), "H:i:s"),
                'endTime' => $request->input('endTime') ?? date("H:i:s", mktime(0, 0, 0)),
                'leader' => $uID,
                'createdBy' => $uID,
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

            //----------------------tag part
            $tags = explode(',', $request->input('tag'));
            foreach ($tags as $tag) {
                if ($tag == '' || $tag == null) {
                    $tag = "hobby";
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
                    'type' => 'hobby',
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

            if ($groupDb && $hobbyDb && $memberDb) {
                return response()->json([
                    'status' => 'ok',
                    'message' => 'create hobby group success.',
                    'hID' => $groupID
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
            } else if (GroupDayModel::where('groupID', $groupDb->id)->first()) {
                GroupDayModel::where('groupID', $groupDb->id)->delete();
            } else if (MemberModel::where('groupID', $groupDb->id)->first()) {
                MemberModel::where('groupID', $groupDb->id)->delete();
            } else if (HobbyModel::where('id', $groupID)->first()) {
                HobbyModel::where('id', $groupID)->delete();
            } else if (GroupModel::where('groupID', $groupID)->first()) {
                GroupModel::where('groupID', $groupID)->delete();
            }
            return response()->json([
                'status' => 'failed',
                'message' => 'failed to create hobby group.'
            ], 500);
        }
    }

    function updateGroup(Request $request, $groupID) // done
    { //done (waitng for checking) **noti to everymem
        $uID = auth()->user()->id;

        //ปิด validate หากต้องการเทสเอง
        //ถ้าเปิด ต้องให้ frontend ส่งค่าเก่าติดมาด้วย
        $validationRules = HobbyModel::$validator[0];
        $validationMessages = HobbyModel::$validator[1];

        $validator = Validator::make($request->all(), $validationRules, $validationMessages);

        if ($validator->fails()) {
            return response()->json([
                'status' => 'failed',
                'message' => $validator->errors()
            ], 400);
        }

        //----- เรียกใช้ relation
        $groupDb = GroupModel::where([['groupID', $groupID], ['type', 'hobby'], ['status', 1]])
            ->with(['hobby', 'hobby.imageOrFile', 'groupDay', 'groupTag', 'member'])
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
        $defaultFiles = [];
        foreach (imageOrFileModel::$groupImageStatic as $file) {
            array_push($defaultFiles, $file['name']);
        }
        if (!empty($request->file('image'))) {
            $file = $request->file('image');
            if (imageOrFileModel::where('id', $groupDb->hobby->imageOrFile->id)->first() && !in_array(strval($groupDb->hobby->imageOrFile->name), $defaultFiles)) {
                if (File::exists($path . $groupDb->hobby->imageOrFile->name)) {
                    File::delete($path . $groupDb->hobby->imageOrFile->name); //ลบไฟล์รูปเก่าทิ้ง
                }
                imageOrFileModel::where('id', $groupDb->hobby->imageOrFile->id)->delete(); // ลบชื่อไฟล์บน database
            }
            $extension = $file->getClientOriginalExtension();
            $filename = 'hobby-' . now()->format('YmdHis') . '.' . $extension;
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
            $imageOrFileDb = imageOrFileModel::where('id', $groupDb->hobby->imageOrFile->id)->first();
        } else if ($request->has('deleteimage')) {
            if (imageOrFileModel::where('id', $groupDb->hobby->imageOrFile->id)->first() && !in_array(strval($groupDb->hobby->imageOrFile->name), $defaultFiles)) {
                imageOrFileModel::where('id', $groupDb->hobby->imageOrFile->id)->delete(); // ลบชื่อไฟล์บน database
                if (File::exists($path . $groupDb->hobby->imageOrFile->name)) {
                    File::delete($path . $groupDb->hobby->imageOrFile->name); //ลบไฟล์รูปเก่าทิ้ง
                }
            }
        }
        //----------------------

        //----------------------tag part
        if ($request->input('tag')) {
            $deleteOldTag = GroupTagModel::where('groupID', $groupDb->id)->where('type', 'hobby')->delete();
            $newTags = explode(',', $request->input('tag'));

            foreach ($newTags as $tag) {
                if ($tag != '' || $tag != null) {
                    $tag = ['hobby'];
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
                    'type' => 'hobby'
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

        //---------- hobby data
        $data = [
            'imageOrFileID' => $imageOrFileDb->id ??  imageOrFileModel::where('name', 'group-default.jpg')->first()->id,
            'name' => $request->input('activityName') ?? $groupDb->hobby->activityName,
            'memberMax' => $request->input('memberMax') ?? $groupDb->hobby->memberMax,
            'location' => $request->input('location') ?? $groupDb->hobby->location,
            'detail' => $request->input('detail') ?? $groupDb->hobby->detail,
            'startTime' => $request->input('startTime') ?? $groupDb->hobby->startTime,
            'endTime' => $request->input('endTime') ?? $groupDb->hobby->endTime,
            'updated_at' => now()
        ];

        //-------- อัพเดตข้อมูลของ hobby และส่งแจ้งเตือนอัพเดต
        if (HobbyModel::where('id', $groupID)->update($data) && GroupModel::where('groupID', $groupID)->update(['updated_at' => now()])) {
            foreach ($groupDb->member as $member) {
                if ($member->id != $uID) {
                    NotifyModel::insert([
                        'receiverID' => $member->id,
                        'senderID' => $groupDb->hobby->leader,
                        'postID' => $groupID,
                        'type' => 'updateGroup'
                    ]);
                }
            }
            return response()->json([
                'status' => 'ok',
                'message' => 'update hobby group success.',
            ], 200);
        } else {
            return response()->json([
                'status' => 'failed',
                'message' => 'can not update group'
            ], 500);
        };
    }

    function memberGroup($groupID)
    { //done north (mj ขออนุญาตแก้ไข)
        $groupDb = GroupModel::where([['groupID', $groupID], ['type', 'hobby'], ['status', 1]])
            ->with(['hobby', 'hobby.imageOrFile', 'groupDay', 'groupTag', 'member', 'request'])
            ->first();

        if ($groupDb) {
            $member = [];
            $leader = [];
            //-------------------- Prepare members data
            $leaderDb = UserModel::where([['id', $groupDb->hobby->leader], ['status', 1]])->first();

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
            if ($groupDb->hobby->leader == auth()->user()->id) {
                $role = 'leader';

                $requestCount = 0;
                foreach ($groupDb->request as $request) {
                    if ($request != null && $request != "") {
                        $requestCount++;
                    }
                }
                $data = [
                    'groupName' => $groupDb->hobby->name,
                    'members' => $members,
                    'requestCount' => $requestCount
                ];
            }
            //------------------- If user is member 
            else {
                $role = 'normal';
                $data = [
                    'groupName' => $groupDb->hobby->name,
                    'members' => $members
                ];
            }
            //--------------------

            if ($data) {
                return response()->json([
                    'status' => 'ok',
                    'message' => 'fetch member hobby group success.',
                    'hID' => $groupID,
                    'data' => $data,
                    'role' => $role,
                    'this' => auth()->user()->id
                ], 200);
            } else {
                return response()->json([
                    'status' => 'failed',
                    'message' => 'failed to fetch member hobby group.'
                ], 500);
            };
        } else {
            return response()->json([
                'status' => 'failed',
                'message' => 'group not found.',
            ], 404);
        }
    }

    function aboutGroup($groupID)
    { //done
        $groupDb = GroupModel::where([['groupID', $groupID], ['type', 'hobby'], ['status', 1]])
            ->with(['hobby', 'bookmark', 'member', 'request', 'groupDay', 'groupTag', 'hobby.imageOrFile', 'hobby.leaderGroup'])
            ->orderBy('updated_at', 'DESC')
            ->first();
        if (empty($groupDb)) {
            return response()->json([
                'status' => 'failed',
                'message' => 'hobby not found.',
            ], 404);
        }

        // กรองข้อมูลด้วย resource
        $data = new GroupResource($groupDb);

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

    function checkRequestGroup($groupID)
    { //done
        $hobbyDb = GroupModel::where([['groupID', $groupID], ['type', 'hobby'], ['status', 1]])
            ->with(['hobby', 'hobby.leaderGroup', 'request'])
            ->orderBy('updated_at', 'DESC')
            ->first();

        if (empty($hobbyDb)) {
            return response()->json([
                'status' => 'failed',
                'message' => 'hobby not found.',
            ], 404);
        }

        if (sizeof($hobbyDb->request) <= 0) {
            return response()->json([
                'status' => 'ok',
                'message' => 'no request.',
            ], 200);
        }

        // เอา request มาเก็บเป็น array
        $requestArray = [];
        foreach ($hobbyDb->request as $request) {
            if ($request != null && $request != "") {
                $requestArray[] = [
                    'username' => $request->username,
                    'uID' => (int)$request->id,
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

        $userID = (int)$request->input('userID');
        $groupDb = GroupModel::where([['groupID', $groupID], ['type', 'hobby'], ['status', 1]])
            ->with(['hobby', 'member', 'request'])
            ->first();

        if (!UserModel::where('id', $userID)->first()) {
            return response()->json([
                'status' => 'failed',
                'message' => 'user not found.',
            ], 404);
        }

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
            ], 404);
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
                'groupID' => $groupDb->id,
                'created_at' => now(),
                'updated_at' => now(),
            ]);
            $requestDb = RequestModel::where([['userID', $userID], ['groupID', $groupDb->id]])->delete();
            $notifyDb = NotifyModel::create([
                'receiverID' => $userID,
                'senderID' => $groupDb->hobby->leader,
                'postID' => $groupDb->groupID,
                'type' => "acceptRequest",
                'created_at' => now(),
                'updated_at' => now(),
            ]);
        } else if ($request->input('method') == 'reject') {
            $requestDb = RequestModel::where([['userID', $userID], ['groupID', $groupDb->id]])->delete();
            $notifyDb = NotifyModel::create([
                'receiverID' => $userID,
                'senderID' => $groupDb->hobby->leader,
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
    {  //done noti to kicked mem
        $groupDb = GroupModel::where('groupID', $groupID)
            ->with(['hobby', 'member', 'hobby.leaderGroup'])
            ->first();

        if (empty($groupDb)) { //เช็คว่ามี group ในระบบมั้ย
            return response()->json([
                'status' => 'failed',
                'message' => 'hobby not found.',
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
        if ($groupDb->hobby->leader == $uID) { //เช็คกรณี leader เตะตัวเอง
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
            'senderID' => $groupDb->hobby->leader,
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
        $groupDb = GroupModel::where([['groupID', $groupID], ['type', 'hobby'], ['status', 1]])
            ->with(['hobby', 'hobby.imageOrFile', 'groupDay', 'groupTag', 'member'])
            ->orderBy('updated_at', 'DESC')
            ->first();
        if ($groupDb) {
            if (
                MemberModel::where('groupID', $groupDb->id)->delete() && GroupTagModel::where('groupID', $groupDb->id)->delete()
                && GroupDayModel::where('groupID', $groupDb->id)->delete() && GroupModel::where('groupID', $groupID)->delete()
                && HobbyModel::where('id', $groupID)->delete()
            ) {
                foreach ($groupDb->member as $member) {
                    NotifyModel::create([
                        'receiverID' => $member->id,
                        'senderID' => $groupDb->hobby->leader,
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
            ], 404);
        }
    }

    function changeLeaderGroup($groupID, $uID)
    {
        $groupDb = GroupModel::where([['groupID', $groupID], ['type', 'hobby'], ['status', 1]])
            ->with(['hobby', 'member'])
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
            $memberArray = $groupDb->member->pluck('id')->toArray();
        }

        if (!in_array($uID, $memberArray)) {
            return response()->json([
                'status' => 'failed',
                'message' => 'this user is not in the group.',
            ], 400);
        }

        if ((int)$uID == (int)$groupDb->hobby->leader) {
            return response()->json([
                'status' => 'failed',
                'message' => 'this user already is leader.',
            ], 400);
        } else {
            $hobbyDb = HobbyModel::where([['id', $groupID]])->update([
                'leader' => $uID,
                'updated_at' => now()
            ]);
            if ($hobbyDb) {
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
