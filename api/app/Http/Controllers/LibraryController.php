<?php

namespace App\Http\Controllers;

use App\Models\HobbyModel;
use App\Models\LibraryModel;
use App\Http\Resources\LibraryResource;
use Illuminate\Http\Request;
use Illuminate\Support\Facades\File;
use Illuminate\Support\Facades\Validator;
use Illuminate\Support\Facades\Storage;

class LibraryController extends Controller
{
    function showAllLibrary(Request $request)
    {
        $libraryDb = HobbyModel::where('type', 'library')->orderBy('updated_at', 'DESC')->with('leaderGroup')->paginate($request->get('perPage', 8));
        if (!$libraryDb) {
            return response()->json([
                'status' => 'failed',
                'message' => 'library not found.',
            ], 404);
        }

        $data = LibraryResource::collection($libraryDb);
        if (sizeof($data) != 0) {
            return response()->json([
                'status' => 'ok',
                'message' => 'fetch all lbrary success.',
                'data' => $data,
                'nextPageUrl' => $libraryDb->nextPageUrl()
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
                $name =  'library-' . now()->format('YmdHis') . 'date-name' . str_replace(' ', '', basename($file->getClientOriginalName(), ".pdf"));
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
        $spliter = 'date-name';
        $encodedname = $libraryDb->library->filepath;
        $arrayname = explode($spliter, $encodedname);
        $intersect = array_search($spliter, $arrayname);
        $fileoriginname = $arrayname[$intersect + 1];
        $originname = preg_split("/.pdf/", $fileoriginname)[0];


        $path = public_path('uploaded/Library/');
        $filePath = $path . $libraryDb->library->filepath;
        $filesize = filesize($filePath);
        $base64Pdf = base64_encode(file_get_contents($filePath));

        $data = [
            'subject' => $libraryDb->subject ?? 'none',
            'filename' => $originname,
            'owner' => $libraryDb->leaderGroup->username,
            'uploadDate' => $libraryDb->created_at,
            'filesizeInBytes' => $filesize,
            'file' => $base64Pdf,
        ];
        return response()->json([
            'status' => 'ok',
            'message' => 'fetch library success.',
            'data' => $data
        ], 200);
    }

    function deleteLibrary($hID)
    {
        $hobbyDb = HobbyModel::where('hID', $hID)->first();
        $libraryDb = LibraryModel::where('hID', $hID)->first();
        $path = public_path('uploaded/Library/');
        if ($hobbyDb->leader == auth()->user()->uID) {
            $hobbyDeleted = HobbyModel::where('hID', $hID)->delete();
            $libraryDeleted = LibraryModel::where('hID', $hID)->delete();
            File::delete($path . $libraryDb->filespath);
            if ($hobbyDeleted && $libraryDeleted) {
                return response()->json([
                    'status' => 'ok',
                    'message' => 'delete library success.',
                ], 200);
            } else {
                return response()->json([
                    'status' => 'failed',
                    'message' => 'failed to delete library.',
                ], 500);
            }
        } else {
            return response()->json([
                'status' => 'failed',
                'message' => 'unauthorize.',
            ], 401);
        }
    }

    function libraryurldownload($hID)
    {
        $libraryDb = HobbyModel::with('library', 'leaderGroup')->where('hID', $hID)->first();
        if (!$libraryDb) {
            return response()->json([
                'status' => 'failed',
                'message' => 'library not found.',
            ], 404);
        }
        $path = 'uploaded/Library/';
        $filePath = $path . $libraryDb->library->filepath;
        if (!file_exists($filePath)) {
            return response()->json([
                'status' => 'failed',
                'message' => 'file not found.',
            ], 500);
        }
        $signedUrl = '/' . $filePath;
        return response()->json([
            'status' => 'failed',
            'message' => 'get link success.',
            'url' => $signedUrl
        ], 404);
    }

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
