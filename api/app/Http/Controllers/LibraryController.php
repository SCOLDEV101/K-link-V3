<?php

namespace App\Http\Controllers;
use App\Jobs\pdfToImage;

use App\Models\HobbyModel;
use App\Models\LibraryModel;
use App\Http\Resources\LibraryResource;
use Illuminate\Http\Request;
use Illuminate\Support\Facades\File;
use Illuminate\Support\Facades\Validator;

// New
use Illuminate\Support\Facades\Storage;
use App\Http\Resources\GroupResource;
use App\Models\GroupModel;
use App\Models\GroupTagModel;
use App\Models\MemberModel;
use App\Models\NotifyModel;
use App\Models\GroupDayModel;
// /New

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
        $validationRules = LibraryModel::$validator[0];
        $validationMessages = LibraryModel::$validator[1];
        $allowedfileExtension = ['pdf'];

        $validator = Validator::make($request->all(), $validationRules, $validationMessages);

        if ($validator->fails()) {
            return response()->json([
                'status' => 'failed',
                'message' => $validator->errors()
            ], 400);
        }

        $uID = auth()->user()->uID;
        $path = public_path('uploaded/Library/');
        if ($request->hasFile('files')) {
            $file = $request->file('files');
            $extension = $file->getClientOriginalExtension();
            if (in_array($extension, $allowedfileExtension)) {
                $name =  'library-' . now()->format('YmdHis') . str_replace(' ', '', basename($file->getClientOriginalName(), ".pdf"));
                $filename = $name . '.' . $extension;
                $file->move($path, $filename);
            } else if (!in_array($extension, $allowedfileExtension)) {
                return response()->json([
                    'status' => 'failed',
                    'message' => 'file type should be pdf only.'
                ], 200);
            }
        }

        $hobbyModel = new HobbyModel();
        $libraryModel = new LibraryModel();
        $hID = $hobbyModel->idGeneration();
        $libraryID = $libraryModel->idGeneration();
        $data = [
            'hID' => $hID,
            'type' => 'library',
            'image' => $filename,
            'tag' => $request->input('tag') ?? 'library',
            'member' => $uID,
            'memberMax' =>  null,
            'activityName' => $request->input('activityName'),
            'leader' => $uID,
            'weekDate' =>  $request->input('weekDate') ?? '-',
            'actTime' =>  '00:00:00',
            'location' =>  $request->input('location') ?? '-',
            'detail' =>  $request->input('detail') ?? null,
            'createdBy' => $uID,
            'created_at' => now(),
            'updated_at' => now()
        ];
        $librarydata = [
            'libraryID' => $libraryID,
            'hID' => $hID,
            'filepath' => $filename,
            'facultyID' => $request->input('facultyID'),
            'created_at' => now(),
            'updated_at' => now()
        ];

        if (HobbyModel::insert($data) && LibraryModel::insert($librarydata)) {
            dispatch(new PdfToImage($filename));
            return response()->json([
                'status' => 'ok',
                'message' => 'create library success.'
            ], 200);
        } else {
            return response()->json([
                'status' => 'failed',
                'message' => 'failed to create library success.'
            ], 500);
        };
    }

    function updateLibrary(Request $request, $hID)
    {
        $validationRules = LibraryModel::$updatevalidator[0];
        $validationMessages = LibraryModel::$updatevalidator[1];
        $allowedfileExtension = ['pdf'];

        $validator = Validator::make($request->all(), $validationRules, $validationMessages);
        if ($validator->fails()) {
            return response()->json([
                'status' => 'failed',
                'message' => $validator->errors()
            ], 400);
        }

        $hobbyDb = HobbyModel::where('hID', $hID)->first();
        $libraryDb = LibraryModel::where('hID', $hID)->first();
        $path = public_path('uploaded/Library/');
        if ($request->file('files')) {
            $oldFiles = explode(',', $libraryDb->filepath);
            $file = $request->file('files');
            $extension = $file->getClientOriginalExtension();
            if (in_array($extension, $allowedfileExtension)) {
                $name =  'library-' . now()->format('YmdHis') . str_replace(' ', '', basename($file->getClientOriginalName(), ".pdf"));
                // var_dump($name);
                foreach ($oldFiles as $oldFile) {
                    $intersect = array_search($name, $oldFiles);
                    if (!$intersect) {
                        File::delete($path . $oldFile);
                        unset($oldFiles[$intersect]);
                    } else continue;
                }
                $filename = $name . '.' . $extension;
                $file->move($path, $filename);
                array_push($oldFiles, $filename);
                // var_dump($oldFiles);
            }

            $filepath = implode(',', $oldFiles);
        }

        $data = [
            'tag' => $request->input('tag') ?? $hobbyDb->tag,
            'activityName' => $request->input('activityName') ?? $hobbyDb->activityName,
            'detail' =>  $request->input('detail') ?? null,
            'updated_at' => now()
        ];
        $librarydata = [
            'facultyID' => $request->input('facultyID'),
            'filepath' => $filepath,
            'updated_at' => now()
        ];

        if (HobbyModel::where('hID', $hID)->update($data) && LibraryModel::where('hID', $hID)->update($librarydata)) {
            dispatch(new PdfToImage($filename));
            return response()->json([
                'status' => 'ok',
                'message' => 'update library success.'
            ], 200);
        } else {
            return response()->json([
                'status' => 'failed',
                'message' => 'failed to update library.'
            ], 500);
        };
    }

    function aboutLibrary($hID)
    {
        $libraryDb = HobbyModel::with('library', 'leaderGroup')->where('hID', $hID)->first();
        if (!$libraryDb) {
            return response()->json([
                'status' => 'failed',
                'message' => 'library not found.',
            ], 404);
        }
        $encodedname = $libraryDb->library->filepath;
        $arrayname = preg_split('/-|[.s]/', $encodedname, -1, PREG_SPLIT_NO_EMPTY);
        $intersect = array_search('-', $arrayname) + 1;
        $fileoriginname = $arrayname[$intersect];
        $filePath = public_path('uploaded\\Library\\'.$libraryDb->library->filepath);
        // echo($filePath);
        if (file_exists($filePath)) {
            $originname = preg_replace('/^[\d .-]+/', '', basename($fileoriginname));
            $filesize = filesize($filePath);
        } else {
            $originname = 'not found';
            $filesize = 0;
        }
        $filename = basename($libraryDb->library->filepath,'.pdf');
        $imagePath = public_path('\\pdfImage\\'.$filename);
        $allImagePath = [];
        if(File::exists($imagePath)){
            // echo($imagePath);
            $allpages = File::files($imagePath);
            $totalpages = count($allpages);
            for($index=1;$index<=$totalpages;$index++){
                $imagePath='/pdfImage/'.$filename.'/output_page_'.$index.'.jpg';
                array_push($allImagePath,$imagePath);
            }
        }
        else $imagePath = null;
        $data = [
            'subject' => $libraryDb->subject ?? 'none',
            'filename' => $originname,
            'owner' => $libraryDb->leaderGroup->username,
            'uploadDate' => $libraryDb->created_at,
            'filesizeInBytes' => $filesize,
            '$totalpages'=>$totalpages ?? '0',
            'filepageurl' => $allImagePath,
            'downloadlink' => '/uploaded/Library/'.$libraryDb->library->filepath,
        ];
        return response()->json([
            'status' => 'ok',
            'message' => 'fetch library success.',
            'data' => $data
        ], 200);
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
