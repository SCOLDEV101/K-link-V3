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
use App\Http\Resources\HobbyAboutGroupResource;
use App\Http\Resources\TutoringGroupResource;
use Illuminate\Support\Facades\Validator;
use App\Models\imageOrFileModel;
use App\Models\TagModel;

class TutoringController extends Controller
{
    function showAllGroup(Request $request)
    { {
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

            $TutoringModel = new TutoringModel;
            $hID = $TutoringModel->idGeneration();

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

            if (TutoringModel::insert($hobbydata) && MemberModel::insert($memberdata)) {
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
    {
        //done (waitng for checking) **noti to everymem
        $uID = auth()->user()->id;

        //ปิด validate หากต้องการเทสเอง
        //ถ้าเปิด ต้องให้ frontend ส่งค่าเก่าติดมาด้วย
        $validationRules = TutoringModel::$validator[0];
        $validationMessages = TutoringModel::$validator[1];

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
        if (TutoringModel::where('id', $hID)->update($data)) {
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
    {
        $hobbyDb = TutoringModel::where('hID', $hID)->with('leaderGroup')->first();
        if (!$hobbyDb) {
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

        if ($hobbyDb->leaderGroup->uID == auth()->user()->uID) {
            $role = 'leader';
        } else {
            $role = null;
        }

        if ($data) {
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

    function aboutGroup($hID)
    {
        $hobbyDb = TutoringModel::where('hID', $hID)->first();
        if (empty($hobbyDb)) {
            return response()->json([
                'status' => 'failed',
                'message' => 'hobby not found.',
            ], 404);
        }

        $data = new TutoringGroupResource($hobbyDb);

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

    function checkRequestGroup($hID)
    {
        $hobbyDb = TutoringModel::where('hID', $hID)->first();
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
        $groupDb = TutoringModel::where('hID', $hID)->first();
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

        $data = [
            'member' => implode(',', $memberArray),
            'memberRequest' => implode(',', $requestArray)
        ];

        if (TutoringModel::where('hID', $hID)->update($data)) {
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
        $hobbyDb = TutoringModel::where('hID', $hID)->first();

        if (!UserModel::where('uID', $uID)->first()) {
            return response()->json([
                'status' => 'failed',
                'message' => 'user not found.',
            ], 404);
        }

        if ($hobbyDb->leader == $uID) {
            return response()->json([
                'status' => 'failed',
                'message' => 'can not kick yourself.',
            ], 404);
        }

        $memberArray = explode(',', $hobbyDb->member);
        if (in_array($uID, $memberArray)) {
            $memberArray = array_diff($memberArray, [$uID]);
            if (TutoringModel::where('hID', $hID)->update(['member' => implode(',', $memberArray)])) {
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
        $groupDb = GroupModel::where('groupID', $hID)
            ->where([['type', 'hobby'], ['status', 1]])
            ->with(['hobby', 'hobby.imageOrFile', 'hobby.leaderGroup', 'groupDay', 'groupTag', 'member'])
            ->orderBy('updated_at', 'DESC')
            ->first();

        if ($groupDb->type == "tutoring") {
            if (
                GroupModel::where('groupID', $hID)->delete() && TutoringModel::where('id', $hID)->delete()
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
            ], 500);
        }
    }

    function changeLeaderGroup($hID, $uID)
    {
        $hobbyDb = TutoringModel::where('hID', $hID)->first();

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
