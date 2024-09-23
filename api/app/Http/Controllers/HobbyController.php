<?php

namespace App\Http\Controllers;

use Illuminate\Support\Facades\Log;
use Exception;

use Illuminate\Http\Request;
use App\Models\HobbyModel;
use App\Models\UserModel;
use App\Models\FacultyModel;
use App\Models\MajorModel;
use App\Models\SectionModel;
use App\Models\NotifyModel;
use Illuminate\Support\Facades\File;
use App\Http\Resources\GroupResource;
use App\Http\Resources\HobbyAboutGroupResource;
use App\Models\MemberModel;
use App\Models\GroupModel;
use Illuminate\Support\Facades\Validator;
use App\Models\DayModel;
use App\Models\GroupDayModel;
use App\Models\TagModel;
use App\Models\GroupTagModel;
use App\Models\RequestModel;
use App\Models\imageOrFileModel;
use App\Models\BookmarkModel;

class HobbyController extends Controller
{
    function showAllGroup(Request $request)
    { //done
        //เรียก relatoin มาใช้
        $hobbyDb = GroupModel::where('type', 'hobby')
            ->where('status', 1)
            ->orderBy('updated_at', 'DESC')
            // ->with('hobby')
            // ->with('bookmark')
            // ->with(['hobby.imageOrFile'])
            // ->with(['hobby.leaderGroup'])
            // ->with('member')
            // ->with('request')
            // ->with('groupDay') 
            // ->with('groupTag')
            ->paginate(8);

        if (sizeof($hobbyDb) <= 0) { //เช็คจำนวนข้อมูลที่เจอ
            return response()->json([
                'status' => 'failed',
                'message' => 'hobby not found.',
            ], 404);
        }

        $data = GroupResource::collection($hobbyDb); //เอาไปกรองผ่าน resource
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
    { //ยังไม่แตะ
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
            $path = public_path('uploaded/hobbyImage/');
            if ($request->file('image') != null) {
                $file = $request->file('image');
                $extension = $file->getClientOriginalExtension();
                $filename = 'hobby-' . date('YmdHi') . '.' . $extension;
                $file->move($path, $filename);
                $imageOrFileDb = new imageOrFileModel;
                $imageOrFileDb->name = $filename;
                $imageOrFileDb->save();
            }

            $hobbyModel = new HobbyModel;
            $hID = $hobbyModel->idGeneration();

            //-----------group part
            $groupDb = new GroupModel;
            $groupDb->groupID = strval($hID);
            $groupDb->type = "hobby";
            $groupDb->status = (int)1;
            $groupDb->created_at = now();
            $groupDb->updated_at = now();
            $groupDb->save();
            //-----------

            //-----------hobby part
            $hobbydata = [
                'id' => $hID,
                'imageOrFileID' => $imageOrFileDb->id ?? null,
                'name' => $request->input('activityName'),
                'memberMax' => $request->input('memberMax') ?? null,
                'location' =>  $request->input('location'),
                'detail' =>  $request->input('detail'),
                'startTime' =>  $request->input('actTime') ?? date_format(now(), "H:i:s"),
                'endTime' => $request->input('actTime') ?? date("H:i:s", mktime(0, 0, 0)),
                'leader' => $uID,
                'createdBy' => $uID,
                'created_at' => now(),
                'updated_at' => now(),
            ];
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
            $memberdata = [
                'userID' => $uID,
                'groupID' => $groupDb->id,
                'created_at' => now(),
                'updated_at' => now(),
            ];
            //----------------

            if (HobbyModel::insert($hobbydata) && MemberModel::insert($memberdata)) {
                return response()->json([
                    'status' => 'ok',
                    'message' => 'create hobby group success.',
                    'hID' => $hID
                ], 200);
            }
        } catch (Exception $e) {
            //save error message to laravel log
            Log::error('Error occurred: ' . $e->getMessage(), [
                'exception' => $e,
                'trace' => $e->getTraceAsString()
            ]);
            //delete group with all its related model when failed
            $groupDb->delete();
            return response()->json([
                'status' => 'failed',
                'message' => 'failed to create hobby group.'
            ], 500);
        }
    }

    function updateGroup(Request $request, $hID)
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

        //เรียกใช้ relation
        $groupDb = GroupModel::where('groupID', $hID)
            ->where([['type', 'hobby'], ['status', 1]])
            ->with(['hobby', 'hobby.imageOrFile', 'hobby.leaderGroup', 'groupDay', 'groupTag', 'member'])
            ->orderBy('updated_at', 'DESC')
            ->first();

        if (empty($groupDb)) {
            return response()->json([
                'status' => 'failed',
                'message' => 'Group not found.'
            ], 404);
        }

        //path รูปภาพ
        $path = public_path('uploaded/hobbyImage/');

        //ถ้ามีการใส่รูป
        if (!empty($request->file('image'))) {
            //เมื่อไม่ใช่รูปเก่า หรือรูป default (มีการอัพรูปใหม่)
            if ($groupDb->hobby->imageOrFile->name !== 'group-default.jpg' && $groupDb->hobby->imageOrFile->name !== $request->file('image')) {
                File::delete($path . $groupDb->hobby->imageOrFile->name); //ลบรูปเก่าทิ้ง

                $file = $request->file('image');
                $extension = $file->getClientOriginalExtension();
                $filename = 'hobby-' . now()->format('YmdHis') . '.' . $extension;
                $file->move($path, $filename);

                if (!$filename) {
                    return response()->json([
                        'status' => 'failed',
                        'message' => 'Can not upload image.'
                    ], 500);
                } else {
                    imageOrFileModel::where('id', $groupDb->hobby->imageOrFile->id)->update([
                        'name' => $filename
                    ]);
                }
            }
        }

        //แตก array นั้นลบ tag เก่าทั้งหมดออก แต่จะไม่ลบตัว static
        //จากนั้นสร้างใหม่ใน GroupTagModel โดยเก็บ tag ใหม่ใน TagModel
        //----------------------tag part

        //-----------------------

        $newTags = explode(',', $request->input('tag'));
        $deleteOldTag = GroupTagModel::where('groupID', $groupDb->id)->where('type', 'hobby')->delete();

        if ($request->input('tag') == '' || $request->input('tag') == null) {
            $newTags = ['hobby'];
        }

        foreach ($newTags as $tag) {
            $tagInTagModel = TagModel::where('name', $tag)->first();
            if (empty($tagInTagModel) && $tag != '') {
                $newTag = TagModel::create([
                    'name' => $tag
                ]);
                $tagGroup = $newTag->id;
            } else {
                $tagGroup = $tagInTagModel->id;
            }

            GroupTagModel::create([
                'groupID' => $groupDb->id,
                'tagID' => $tagGroup,
                'type' => 'hobby'
            ]);
        };
        // -----------------------------

        // แตก array เหมือน tag และลบอันเก่าทิ้งเพื่อสร้างใหม่ เผื่อกรณีเพิ่มวัน
        $deleteOldDay = GroupDayModel::where('groupID', $groupDb->id)->delete();

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
        } else {
            $day = (int)date('w');
            GroupDayModel::create([
                'dayID' => (int)$day,
                'groupID' => $groupDb->id,
            ]);
        }

        //------------------------------ 

        $data = [
            // 'imageOrFileID' => $filename ?? $hobbyDb->hobby->imageOrFile->name ?? 'group-default.jpg', 
            'name' => $request->input('activityName') ?? $groupDb->hobby->activityName,
            'memberMax' => $request->input('memberMax') ?? $groupDb->hobby->memberMax,
            'location' => $request->input('location') ?? $groupDb->hobby->location,
            'detail' => $request->input('detail') ?? $groupDb->hobby->detail,
            'startTime' => $request->input('startTime') ?? $groupDb->hobby->startTime,
            'endTime' => $request->input('endTime') ?? $groupDb->hobby->endTime,
            'updated_at' => now()
        ];

        // อัพเดตข้อมูลทั่วไปของ hobby และส่งแจ้งเตือนอัพเดต
        if (HobbyModel::where('id', $hID)->update($data)) {
            foreach ($groupDb->member as $member) {
                if ($member->id != $uID) {
                    NotifyModel::insert([
                        'receiverID' => $member->id,
                        'senderID' => $groupDb->hobby->leaderGroup->id,
                        'postID' => $hID,
                        'type' => 'updateGroup'
                    ]);
                }
            }
            return response()->json([
                'status' => 'ok',
                'message' => 'update hobby group success.',
                'update' => $data
            ], 200);
        } else {
            return response()->json([
                'status' => 'failed',
                'message' => 'can not update'
            ], 500);
        };
    }

    function memberGroup($hID)
    { //done north (mj ขออนุญาตแก้ไข)
        $groupDb = GroupModel::where('groupID', $hID)
            ->where([['type', 'hobby'], ['status', 1]])
            ->with(['hobby', 'hobby.imageOrFile', 'groupDay', 'groupTag', 'member', 'request'])
            ->first();

        if ($groupDb && $groupDb->type == 'hobby') {

            //-------------------- Prepare members data
            $member = [];
            $leader = [];

            foreach ($groupDb->member as $eachMember) {
                if ($eachMember->id != $groupDb->hobby->leader) {
                    $member[] = [
                        'username' => $eachMember->username,
                        'uID' => $eachMember->id,
                        'isMe' => ($eachMember->id == auth()->user()->id)
                    ];
                } else {
                    $leader[] = [
                        'username' => $eachMember->username,
                        'uID' => $eachMember->id,
                        'isMe' => ($eachMember->id == auth()->user()->id)
                    ];
                }
            }
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
                    'leader' => $leader,
                    'members' => $member,
                    'requestCount' => $requestCount
                ];
            }
            //------------------- If user is member 
            else {
                $role = 'normal';
                $data = [
                    'groupName' => $groupDb->hobby->name,
                    'leader' => $leader,
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
                'message' => 'hobby not found.',
            ], 404);
        }
    }

    function aboutGroup($hID)
    { //done
        $groupDb = GroupModel::where([['groupID', $hID],['type', 'hobby'],['status', 1]])
            ->with(['hobby','bookmark','member','request','groupDay','groupTag','hobby.imageOrFile','hobby.leaderGroup'])
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

    function checkRequestGroup($hID)
    { //done
        $hobbyDb = GroupModel::where('groupID', $hID)
            ->where('type', 'hobby')
            ->where('status', 1)
            ->orderBy('updated_at', 'DESC')
            ->with('hobby')
            ->with(['hobby.leaderGroup'])
            ->with('request')
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
    {  //done noti to kicked mem
        $hobbyDb = GroupModel::where('groupID', $hID)->with(['hobby.leaderGroup'])->first();
        $memberToDelete = Usermodel::where('id', $uID)->first();

        // การเช็ค leader ว่า uID == leader จริง จะอยู่ที่ middleware checkLeader
        // หากไม่ใช่ จะส่ง 403

        if (empty($hobbyDb)) { //เช็คว่ามี group ในระบบมั้ย
            return response()->json([
                'status' => 'failed',
                'message' => 'hobby not found.',
            ], 404);
        }

        if ($hobbyDb->hobby->leaderGroup->id == $uID) { //เช็คกรณี leader เตะตัวเอง
            return response()->json([
                'status' => 'failed',
                'message' => 'can not kick yourself, You are the leader.',
            ], 400);
        }

        if (empty($memberToDelete)) { //เช็คว่ามี user ในระบบมั้ย
            return response()->json([
                'status' => 'failed',
                'message' => 'member not found.',
            ], 404);
        }

        $checkDeleteUser = MemberModel::where('groupID', $hobbyDb->id)->where('userID', $uID)->first();

        if (empty($checkDeleteUser)) { //เช็คว่ามี user ในกลุ่มที่จะลบมั้ย
            return response()->json([
                'status' => 'failed',
                'message' => 'user not found in this group.',
            ], 404);
        }

        $deleteUser = $checkDeleteUser->delete();

        if ($deleteUser) {
            NotifyModel::insert([ //หากลบสำเร็จ จะส่งแจ้งเตือนไปยังคนที่ถูกลบ
                'receiverID' => $uID,
                'senderID' => $hobbyDb->hobby->leaderGroup->id,
                'postID' => $hID,
                'type' => 'kick'
            ]);
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

    function deleteGroup($hID)
    {
        $groupDb = GroupModel::where([['groupID', $hID], ['type', 'hobby'], ['status', 1]])
            ->with(['hobby', 'hobby.imageOrFile', 'groupDay', 'groupTag', 'member'])
            ->orderBy('updated_at', 'DESC')
            ->first();
        if ($groupDb) {
            if (
                GroupModel::where('groupID', $hID)->delete() && HobbyModel::where('id', $hID)->delete()
                && MemberModel::where('groupID', $groupDb->id)->delete() && GroupTagModel::where('groupID', $groupDb->id)->delete()
                && GroupDayModel::where('groupID', $groupDb->id)->delete()
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
}
