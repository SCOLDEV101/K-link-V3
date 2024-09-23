<?php

namespace App\Http\Controllers;

use App\Models\HobbyModel;
use App\Models\LibraryModel;
use App\Http\Resources\LibraryResource;
use Illuminate\Http\Request;
use Illuminate\Support\Facades\File;
use Illuminate\Support\Facades\Validator;
use Illuminate\Support\Facades\Storage;
use App\Http\Resources\GroupResource;
use App\Models\GroupModel;
use App\Models\GroupTagModel;
use App\Models\MemberModel;
use App\Models\NotifyModel;
use App\Models\GroupDayModel;

class LibraryController extends Controller
{
    function showAllLibrary(Request $request)
    {
        $libraryDb = GroupModel::where([['type', 'library'],['status', 1]])
            ->with(['library','bookmark','library.imageOrFile','library.faculty','library.major','library.department','groupDay','groupTag'])
            ->orderBy('updated_at', 'DESC')
            ->get();

        if (!$libraryDb) {
            return response()->json([
                'status' => 'failed',
                'message' => 'library not found.',
            ], 404);
        }

        $data = GroupResource::collection($libraryDb);
        if (sizeof($data) > 0) {
            return response()->json([
                'status' => 'ok',
                'message' => 'fetch all lbrary success.',
                'data' => $data,
                // 'nextPageUrl' => $libraryDb->nextPageUrl()
            ], 200);
        } else {
            return response()->json([
                'status' => 'failed',
                'message' => 'failed to fetch all library.',
            ], 500);
        };
    }

    function createLibrary(Request $request)
    {
        // wait for code from main
    }

    function updateLibrary(Request $request, $hID)
    {
        // wait for code from main
    }

    function aboutLibrary($hID)
    {
       // wait for code from main
    }

    function deleteLibrary($hID)
    {
        $groupDb = GroupModel::where([['groupID', $hID], ['type', 'library'], ['status', 1]])
            ->with(['library', 'library.imageOrFile', 'groupDay', 'groupTag'])
            ->orderBy('updated_at', 'DESC')
            ->first();
        if ($groupDb) {
            if (
                GroupModel::where('groupID', $hID)->delete() && LibraryModel::where('id', $hID)->delete()
                && GroupTagModel::where('groupID', $groupDb->id)->delete() && GroupDayModel::where('groupID', $groupDb->id)->delete()
            ) {
                NotifyModel::create([
                    'receiverID' => $groupDb->library->createdBy,
                    'senderID' => $groupDb->library->createdBy,
                    'postID' => $groupDb->id,
                    'type' => "delete",
                ]);
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

    // function libraryurldownload($hID)
    // {
    //     $libraryDb = HobbyModel::with('library', 'leaderGroup')->where('hID', $hID)->first();
    //     if (!$libraryDb) {
    //         return response()->json([
    //             'status' => 'failed',
    //             'message' => 'library not found.',
    //         ], 404);
    //     }
    //     $path = 'uploaded/Library/';
    //     $filePath = $path . $libraryDb->library->filepath;
    //     if (!file_exists($filePath)) {
    //         return response()->json([
    //             'status' => 'failed',
    //             'message' => 'file not found.',
    //         ], 500);
    //     }
    //     $signedUrl = '/' . $filePath;
    //     return response()->json([
    //         'status' => 'failed',
    //         'message' => 'get link success.',
    //         'url' => $signedUrl
    //     ], 404);
    // }

    function libraryshared(Request $request)
    {
        $hID = $request->input('hID');
        $libraryDb = HobbyModel::with('library')->where('hID', $hID)->first();
        if (!$libraryDb) {
            return response()->json([
                'status' => 'failed',
                'message' => 'library not found.',
            ], 404);
        }
        $librarydata = [
            'shared' => ($libraryDb->library->shared) + 1,
        ];
        if (LibraryModel::where('hID', $hID)->update($librarydata)) {
            return response()->json([
                'status' => 'ok',
                'message' => 'shared library success.'
            ], 200);
        } else {
            return response()->json([
                'status' => 'failed',
                'message' => 'failed to shared library.'
            ], 500);
        };
    }

    function librarydownloaded(Request $request)
    {
        $hID = $request->input('hID');
        $libraryDb = HobbyModel::with('library', 'leaderGroup')->where('hID', $hID)->first();
        if (!$libraryDb) {
            return response()->json([
                'status' => 'failed',
                'message' => 'library not found.',
            ], 404);
        }
        $librarydata = [
            'downloaded' => ($libraryDb->library->downloaded) + 1,
        ];
        if (LibraryModel::where('hID', $hID)->update($librarydata)) {
            return response()->json([
                'status' => 'ok',
                'message' => 'downloaded library success.'
            ], 200);
        } else {
            return response()->json([
                'status' => 'failed',
                'message' => 'failed to download library.'
            ], 500);
        };
    }
}
