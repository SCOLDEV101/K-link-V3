<?php

namespace App\Http\Controllers;

use Illuminate\Http\Request;
use App\Models\GroupModel;
use App\Models\UserModel;
use App\Http\Resources\GroupResource;
use App\Http\Resources\UserResource;
use Illuminate\Support\Facades\Validator;

class SearchController extends Controller
{
    function searchGroup(Request $request, string $type = null)
    {
        $validationRules = GroupModel::$searchValidator[0];
        $validationMessages = GroupModel::$searchValidator[1];
        $validator = Validator::make($request->all(), $validationRules, $validationMessages);

        if ($validator->fails()) {
            return response()->json([
                'status' => 'failed',
                'message' => $validator->errors()
            ], 400);
        }

        $keyword = trim($request->input('keyword'));
        if (!empty($type)) {
            $groupDb = GroupModel::SELECT('group_models.*')->where([['group_models.type', $type], ['group_models.status', 1]]);
        } else {
            $groupDb = GroupModel::SELECT('group_models.*')->where([['group_models.status', 1]]);
        }
        if (!empty($keyword) && boolval($type == "hobby" || $type == "tutoring")) {
            $groupDb = $groupDb
                ->LeftJoin($type.'_models', 'group_models.groupID', '=', $type."_models.id")
                ->LeftJoin('group_tag_models', 'group_models.id', '=', 'group_tag_models.groupID')
                ->LeftJoin('tag_models', 'group_tag_models.tagID', '=', 'tag_models.id')
                ->LeftJoin('user_models', $type.'_models.leader', '=', 'user_models.id')
                ->where(function ($groupDb) use ($keyword,$type) {
                    return $groupDb
                        ->where("$type".'_models.name', 'like', "%$keyword%")
                        ->orwhere("$type".'_models.location', 'like', "%$keyword%")
                        ->orwhere('tag_models.name', 'like', "%$keyword%")
                        ->orwhere('user_models.id', 'like', "%$keyword%")
                        ->orwhere('user_models.username', 'like', "%$keyword%")
                    ;
                })->with(['hobby', 'hobby.imageOrFile', 'hobby.leaderGroup', 'member', 'request', 'groupDay', 'groupTag', 'bookmark','tutoring','tutoring.imageOrFile','tutoring.leaderGroup','tutoring.faculty','tutoring.major',
                    'tutoring.department'])
                ->orderBy('group_models.updated_at', 'DESC')
                ->paginate(8);
        }
        else if(!empty($keyword) && $type == "library"){
            $groupDb = $groupDb
                ->LeftJoin($type.'_models', 'group_models.groupID', '=', $type."_models.id")
                ->LeftJoin('group_tag_models', 'group_models.id', '=', 'group_tag_models.groupID')
                ->LeftJoin('tag_models', 'group_tag_models.tagID', '=', 'tag_models.id')
                ->LeftJoin('user_models', $type.'_models.createdBy', '=', 'user_models.id')
                ->where(function ($groupDb) use ($keyword,$type) {
                    return $groupDb
                        ->where("$type".'_models.name', 'like', "%$keyword%")
                        ->orwhere('tag_models.name', 'like', "%$keyword%")
                        ->orwhere('user_models.id', 'like', "%$keyword%")
                        ->orwhere('user_models.username', 'like', "%$keyword%")
                    ;
                })->with(['member', 'request', 'groupDay', 'groupTag', 'bookmark',
                    'library', 'library.imageOrFile', 'library.faculty', 'library.major', 'library.department'])
                ->orderBy('group_models.updated_at', 'DESC')
                ->paginate(8);
        }
        else {
            $groupDb = $groupDb
                ->with(['hobby', 'hobby.imageOrFile', 'hobby.leaderGroup', 'member', 'request', 'groupDay', 'groupTag', 'bookmark','tutoring','tutoring.imageOrFile','tutoring.leaderGroup','tutoring.faculty','tutoring.major',
                    'tutoring.department','library', 'library.imageOrFile', 'library.faculty', 'library.major', 'library.department'])
                ->orderBy('group_models.updated_at', 'DESC')
                ->paginate(8);
        }

        if (sizeof($groupDb) > 0) {
            $data = GroupResource::collection($groupDb);
            return response()->json([
                'prevPageUrl' => $groupDb->previousPageUrl(),
                'status' => 'ok',
                'message' => 'fetch search success',
                'listItem' => $data,
                'nextPageUrl' => $groupDb->nextPageUrl()
            ], 200);
        } else {
            return response()->json([
                'status' => 'failed',
                'message' => 'not found',
            ], 404);
        }
    }

    function searchInvite(Request $request, $groupID)
    {
        $validationRules = GroupModel::$searchValidator[0];
        $validationMessages = GroupModel::$searchValidator[1];
        $validator = Validator::make($request->all(), $validationRules, $validationMessages);

        if ($validator->fails()) {
            return response()->json([
                'status' => 'failed',
                'message' => $validator->errors()
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

        //--- check members
        if (empty($groupDb->member)) {
            return response()->json([
                'status' => 'failed',
                'message' => 'members not found.',
            ], 404);
        } else {
            $memberArray = $groupDb->member->pluck('id')->toArray();
        }
        //-------

        //---- check requests
        if (empty($groupDb->request)) {
            return response()->json([
                'status' => 'failed',
                'message' => 'request not found.',
            ], 404);
        } else {
            $requestArray = $groupDb->request->pluck('id')->toArray();
        }
        //-----

        //---- check in group
        if (!in_array((int)auth()->user()->id, $memberArray)) {
            return response()->json([
                'status' => 'failed',
                'message' => 'unauthorize.',
            ], 401);
        }
        //-------

        $keyword = trim($request->input('keyword'));
        $userDb = UserModel::SELECT('user_models.*')->where([['user_models.status', 1]]);
        if (!empty($keyword)) {
            $userDb = $userDb
                ->leftJoin('faculty_models', 'faculty_models.id', '=', 'user_models.facultyID')
                ->leftJoin('major_models', 'major_models.id', '=', 'user_models.majorID')
                ->where(function ($query) use ($keyword) {
                    return $query->where('user_models.status', '=', 1)
                        ->where('user_models.id', 'like', "%$keyword%")
                        ->orwhere('user_models.fullname', 'like', "%$keyword%")
                        ->orwhere('user_models.username', 'like', "%$keyword%")
                        ->orwhere('faculty_models.nameTH', 'like', "%$keyword%")
                        ->orwhere('faculty_models.nameEN', 'like', "%$keyword%")
                        ->orwhere('major_models.shortName', 'like', "%$keyword%")
                        ->orwhere('major_models.nameTH', 'like', "%$keyword%")
                        ->orwhere('major_models.nameEN', 'like', "%$keyword%")
                    ;
                })->orderBy('user_models.updated_at', 'DESC')
                ->paginate(16);
        } else {
            $userDb = $userDb
                ->orderBy('user_models.updated_at', 'DESC')
                ->paginate(16);
        }


        if (sizeof($userDb) > 0) {
            $data = UserResource::collection($userDb);
            return response()->json([
                'prevPageUrl' => $userDb->previousPageUrl(),
                'status' => 'ok',
                'message' => 'fetch search user success',
                'data' => $data,
                'nextPageUrl' => $userDb->nextPageUrl()
            ], 200);
        } else {
            return response()->json([
                'status' => 'failed',
                'message' => 'user not found',
            ], 404);
        }
    }

    function tagQuery(Request $request) {}
}
