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
use App\Http\Resources\GroupResource;
use App\Http\Resources\HobbyAboutGroupResource;
use App\Models\MemberModel;
use App\Models\GroupModel;
use App\Models\TutoringModel;
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
    function showAllGroup(Request $request) { //done
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

    function fetchKmitl() { //ยังไม่แตะ
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

    function createGroup(Request $request) { //done (waitng for checking)
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

        // เริ่มกำหนดชื่อรูปหรือไฟล์ที่จะเก็บ ตามเงื่อนไขต่างๆ
        $uID = auth()->user()->id;
        $path = public_path('uploaded/hobbyImage/');
        if ($request->file('image') != null) { //มีรูปเข้ามา
            $file = $request->file('image');
            $extension = $file->getClientOriginalExtension();
            $filename = 'hobby-' . date('YmdHi') . '.' . $extension;
            $file->move($path, $filename);
        } else {
            $filename = 'group-default.jpg'; //ถ้าไม่มีรูป จะ fix ชื่อนี้
        }

        $existImage = imageOrFileModel::where('name', $filename)->first(); //เช็คเมื่อกรณีมีหรือไม่มีรูป (เผื่ออัพเดตแล้วยังใช้รูปเดิม)
        if (empty($existImage)) { //ไม่มีชื่อรูปนี้ใน db
            $newImage = imageOrFileModel::create([ //รูปใหม่จะถูกบันทึก
                'name' => $filename
            ]);
            $hobbyImage = $newImage->id; //เอา id มาใช้ตอนเก็บข้อมูลลง imageOrFileModel
        } else {
            $hobbyImage = $existImage->id; //เป็นชื่อรูปเก่า เช่น group-default.jpg
        }

        //กำหนดข้อมูล
        $hobbyModel = new HobbyModel();
        $hID = $hobbyModel->idGeneration();
        $data = [
            'id' => $hID,
            'imageOrFileID' => $hobbyImage,
            'name' => $request->input('activityName'),
            'memberMax' => $request->input('memberMax') ?? null,
            'location' =>  $request->input('location'),
            'detail' =>  $request->input('detail'),
            'startTime' => $request->input('startTime'),
            'endTime' => $request->input('endTime'),
            'leader' => $uID,
            'createdBy' => $uID,
            'created_at' => now(),
            'updated_at' => now()
        ];
        // ---------------- 

        // เพิ่มข้อมูลลงใน hobby
        $createdHobby = HobbyModel::create($data);

        if ($createdHobby) {

            // เมื่อเพิ่มข้อมูลลงใน HobbyModel จะเก็บค่าที่จำเป็นลงตารางต่างๆ
            $createdGroup = GroupModel::create([
                'groupID' => $createdHobby->id,
                'type' => 'hobby'
            ]);

            MemberModel::create([
                'userID' => $uID,
                'groupID' => $createdGroup->id
            ]);

            //เช็คเพื่อป้องกันการไม่เลือกวัน
            if($request->input('weekDate')){
                $inputDay = $request->input('weekDate');
            } else { //ถ้าไม่เลือกวัน จะกำหนดให้ทุกวันเป็นวันทำกิจกรรม
                $inputDay = 'จ.,อ.,พ.,พฤ.,ศ.,ส.,อา.';
            }

            //แตก array (รับ array มาไม่ได้)
            $days = explode(',', $inputDay);
            foreach($days as $day) {
                //มี day static ใน DayModel, แสดงผลโดยการเชื่อมผ่าน id ของ DayModel 
                //โดยเก็บ groupID กับ dayID ใน GroupDayModel
                $dayInDayModel = DayModel::where('name', $day)->first();
                GroupDayModel::create([
                    'dayID' => $dayInDayModel->id,
                    'groupID' => $createdGroup->id
                ]);
            };

            //เหมือนกับ day
            $tags = explode(',', $request->input('tag'));
            if($request->input('tag') == '' || $request->input('tag') == null){
                $newTags = ['hobby'];
            }

            //แต่เมื่อมี tag ใหม่ที่ไม่มีใน tag static ที่ TagModel 
            //จะเก็บ tag นั้นไว้ แล้วเชื่อมด้วย groupID กับ tagID ผ่าน GroupTagModel
            foreach($tags as $tag) {
                $tagInTagModel = TagModel::where('name', $tag)->first();
                if(empty($tagInTagModel)) {
                    $newTag = TagModel::create([
                        'name' => $tag
                    ]);
                    $tagGroup = $newTag->id;
                }else{
                    $tagGroup = $tagInTagModel->id;
                }

                GroupTagModel::create([
                    'groupID' => $createdGroup->id,
                    'tagID' => $tagGroup,
                    'type' => 'hobby'
                ]);
            };

            return response()->json([
                'status' => 'ok',
                'message' => 'create hobby group success.',
                // 'hID' => $hID
            ], 200);
        } else {
            return response()->json([
                'status' => 'failed',
                'message' => 'failed to create hobby group.'
            ], 500);
        };
    }

    function updateGroup(Request $request ,$hID) { //done (waitng for checking) **noti to everymem
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
        $hobbyDb = GroupModel::where('groupID', $hID)
                                ->where('type', 'hobby')
                                ->where('status', 1)
                                ->orderBy('updated_at', 'DESC')
                                ->with('hobby')
                                ->with(['hobby.imageOrFile'])
                                ->with(['hobby.leaderGroup'])
                                ->with('groupDay') 
                                ->with('groupTag')
                                ->with('member')
                                ->first(); 
        
        if(empty($hobbyDb)){
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
            if($hobbyDb->hobby->imageOrFile->name !== 'group-default.jpg' && $hobbyDb->hobby->imageOrFile->name !== $request->file('image')){
                File::delete($path . $hobbyDb->hobby->imageOrFile->name); //ลบรูปเก่าทิ้ง
            
                $file = $request->file('image');
                $extension = $file->getClientOriginalExtension();
                $filename = 'hobby-' . now()->format('YmdHis') . '.' . $extension;
                $file->move($path, $filename);

                if(!$filename) {
                    return response()->json([
                        'status' => 'failed',
                        'message' => 'Can not upload image.'
                    ], 500);
                }else{
                    imageOrFileModel::where('id', $hobbyDb->hobby->imageOrFile->id)->update([
                        'name' => $filename
                    ]);
                }
            }
        }

        //แตก array นั้นลบ tag เก่าทั้งหมดออก แต่จะไม่ลบตัว static
        //จากนั้นสร้างใหม่ใน GroupTagModel โดยเก็บ tag ใหม่ใน TagModel
        $newTags = explode(',', $request->input('tag'));
        $deleteOldTag = GroupTagModel::where('groupID', $hobbyDb->id)->where('type', 'hobby')->delete();

        if($request->input('tag') == '' || $request->input('tag') == null){
            $newTags = ['hobby'];
        }

        foreach($newTags as $tag) {
            $tagInTagModel = TagModel::where('name', $tag)->first();
            if(empty($tagInTagModel) && $tag != '') {
                $newTag = TagModel::create([
                    'name' => $tag
                ]);
                $tagGroup = $newTag->id;
            }else{
                $tagGroup = $tagInTagModel->id;
            }

            GroupTagModel::create([
                'groupID' => $hobbyDb->id,
                'tagID' => $tagGroup,
                'type' => 'hobby'
            ]);
        };
        // -----------------------------

        // แตก array เหมือน tag และลบอันเก่าทิ้งเพื่อสร้างใหม่ เผื่อกรณีเพิ่มวัน
        $newDays = explode(',', $request->input('weekDate'));
        $deleteOldDay = GroupDayModel::where('groupID', $hobbyDb->id)->delete();

        if($request->input('tag') == '' || $request->input('weekDate') == null){
            $newDays = ['จ.','อ.','พ.','พฤ.','ศ.','ส.','อา.'];
        }

        foreach($newDays as $day) {
            $dayInDayModel = DayModel::where('name', $day)->first();
            GroupDayModel::create([
                'groupID' => $hobbyDb->id,
                'dayID' => $dayInDayModel->id,
                'type' => 'hobby'
            ]);
        };
        //------------------------------ 
        $data = [
            // 'imageOrFileID' => $filename ?? $hobbyDb->hobby->imageOrFile->name ?? 'group-default.jpg', 
            'name' => $request->input('activityName') ?? $hobbyDb->hobby->activityName,
            'memberMax' => $request->input('memberMax') ?? $hobbyDb->hobby->memberMax ?? null,
            'location' => $request->input('location') ?? $hobbyDb->hobby->location,
            'detail' => $request->input('detail') ?? $hobbyDb->hobby->detail ?? null,
            'startTime' => $request->input('startTime') ?? $hobbyDb->hobby->startTime,
            'endTime' => $request->input('endTime') ?? $hobbyDb->hobby->endTime,
            // 'weekDate' => $request->input('weekDate') ?? $hobbyDb->weekDate,
            'updated_at' => now()
        ];
        // อัพเดตข้อมูลทั่วไปของ hobby และส่งแจ้งเตือนอัพเดต
        if (HobbyModel::where('id', $hID)->update($data)) {
            foreach ($hobbyDb->member as $member) {
                if($member->id != $uID) {
                    NotifyModel::insert([
                        'receiverID' => $member->id,
                        'senderID' => $hobbyDb->hobby->leaderGroup->id,
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

    function memberGroup($hID) { //done north (mj ขออนุญาตแก้ไข)
        $groupDb = GroupModel::where('groupID',$hID)->first();
        if($groupDb->type == 'hobby'){
            $groupDb = HobbyModel::where('id',$hID)->with('leaderGroup')->first();
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
        $leader = [];
        $membersDb = (GroupModel::where('groupID', $hID)->with('member')->first())->member;
        foreach ($membersDb as $eachMember) {
            if($eachMember->id != $groupDb->leaderGroup->id) {
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
        return response()->json([
            'member' => $member,
            'leader' => $leader
        ], 500);
        // foreach ($membersDb as $user) {
        //     if ((int)$groupDb->leaderGroup->id == (int)auth()->user()->id) {
        //         $leaderData = [
        //             'username' => $groupDb->leaderGroup->username,
        //             'uID' => $groupDb->leaderGroup->id,
        //             'isMe' => true
        //         ];
        //     }
        //     else if ((int)$groupDb->leaderGroup->id == (int)$user->id && (int)$groupDb->leaderGroup->id != (int)auth()->user()->id) {
        //         $leaderData = [
        //             'username' => strval($user->username),
        //             'uID' => (int)$user->id,
        //             'isMe' => false
        //         ];
        //     } else if ((int)$user->id == (int)auth()->user()->id && (int)$user->id != (int)$groupDb->leaderGroup->id) {
        //         $member[] = [
        //             'username' => $user->username,
        //             'uID' => (int)$user->id,
        //             'isMe' => true
        //         ];
        //     } else if ((int)$user->id != (int)auth()->user()->id && (int)$user->id != (int)$groupDb->leaderGroup->id) {
        //         $member[] = [
        //             'username' => $user->username,
        //             'uID' => (int)$user->id,
        //             'isMe' => false
        //         ];
        //     }
        // }
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
                'this'=> auth()->user()->id
            ], 200);
        } else {
            return response()->json([
                'status' => 'failed',
                'message' => 'failed to fetch member hobby group.'
            ], 500);
        };
    }

    function aboutGroup($hID) { //done
        $hobbyDb = GroupModel::where('type', 'hobby')
                                ->where('status', 1)
                                ->orderBy('updated_at', 'DESC')
                                ->with('hobby')
                                ->with('bookmark')
                                ->with(['hobby.imageOrFile'])
                                ->with(['hobby.leaderGroup'])
                                ->with('member')
                                ->with('request')
                                ->with('groupDay') 
                                ->with('groupTag')
                                ->first(); 
        if (empty($hobbyDb)) {
            return response()->json([
                'status' => 'failed',
                'message' => 'hobby not found.',
            ], 404);
        }

        // กรองข้อมูลด้วย resource
        $data = new GroupResource($hobbyDb);

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

    function checkRequestGroup($hID) { //done
        $hobbyDb = GroupModel::where('groupID', $hID)
                                ->where('type', 'hobby')
                                ->where('status', 1)
                                ->orderBy('updated_at', 'DESC')
                                ->with('hobby')
                                ->with(['hobby.leaderGroup'])
                                ->with('request')
                                ->first();

        if(empty($hobbyDb)) {
            return response()->json([
                'status' => 'failed',
                'message' => 'hobby not found.',
            ], 404);
        }

        if(sizeof($hobbyDb->request) <= 0) {
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

    function rejectOrAcceptRequest(Request $request, $hID) {
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

    function kickMember($hID, $uID) {  //done noti to kicked mem
        $hobbyDb = GroupModel::where('groupID', $hID)->with(['hobby.leaderGroup'])->first();
        $memberToDelete = Usermodel::where('id', $uID)->first(); 

        // การเช็ค leader ว่า uID == leader จริง จะอยู่ที่ middleware checkLeader
        // หากไม่ใช่ จะส่ง 403

        if(empty($hobbyDb)) { //เช็คว่ามี group ในระบบมั้ย
            return response()->json([
                'status' => 'failed',
                'message' => 'hobby not found.',
            ], 404);
        }

        if($hobbyDb->hobby->leaderGroup->id == $uID) { //เช็คกรณี leader เตะตัวเอง
            return response()->json([
                'status' => 'failed',
                'message' => 'can not kick yourself, You are the leader.',
            ], 400);
        }

        if(empty($memberToDelete)) { //เช็คว่ามี user ในระบบมั้ย
            return response()->json([
                'status' => 'failed',
                'message' => 'member not found.',
            ], 404);
        }

        $checkDeleteUser = MemberModel::where('groupID',$hobbyDb->id)->where('userID',$uID)->first();

        if(empty($checkDeleteUser)) { //เช็คว่ามี user ในกลุ่มที่จะลบมั้ย
            return response()->json([
                'status' => 'failed',
                'message' => 'user not found in this group.',
            ], 404);
        }

        $deleteUser = $checkDeleteUser->delete();

        if($deleteUser) {
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
        }else {
            return response()->json([
                'status' => 'failed',
                'message' => 'failed to kick member.',
            ], 500);
        }
    }

    function deleteGroup($hID) { //done noti to mem
        $uID = auth()->user()->id;
        $hobbyDb = GroupModel::where('groupID', $hID)->with('member')->with(['hobby.leaderGroup'])->first();
        $hobbyDetail = HobbyModel::where('id', $hID); 

        foreach ($hobbyDb->member as $member) {
            if($member->id != $uID) {
                NotifyModel::insert([ //แจ้งเตือนไปยังสมาชิกทุกคนว่ากลุ่มถูกลบ
                    'receiverID' => $member->id,
                    'senderID' => $hobbyDb->hobby->leaderGroup->id,
                    'postID' => $hID,
                    'type' => 'deleteGroup'
                ]);
            }
        }
        if(empty($hobbyDetail)) {
            return response()->json([
                'status' => 'failed',
                'message' => 'hobby not found.',
            ], 404);
        }

        if($hobbyDetail->delete()){ //ลบรายละเอียดที่เกี่ยวข้องทั้งหมด ละเว้นพวก static
            GroupDayModel::where('groupID',$hobbyDb->id)->delete();
            GroupTagModel::where('groupID',$hobbyDb->id)->delete();
            BookmarkModel::where('groupID',$hobbyDb->id)->delete();
            MemberModel::where('groupID',$hobbyDb->id)->delete();
            RequestModel::where('groupID',$hobbyDb->id)->delete();
            $hobbyDb->delete();
            return response()->json([
                'status' => 'ok',
                'message' => 'delete group success.',
            ], 200);
        }else{
            return response()->json([
                'status' => 'failed',
                'message' => 'failed to delete group.',
            ], 500);
        }
    }
}