<?php

namespace App\Http\Controllers;

use App\Jobs\pdfToImage;
use Illuminate\Support\Facades\Log;
use Exception;
use App\Models\LibraryModel;
use Illuminate\Http\Request;
use Illuminate\Support\Facades\File;
use Illuminate\Support\Facades\Validator;
use App\Http\Resources\GroupResource;
use App\Models\GroupModel;
use App\Models\GroupTagModel;
use App\Models\TagModel;
use App\Models\NotifyModel;
use App\Models\imageOrFileModel;
use App\Models\MajorModel;
use Illuminate\Support\Facades\Response;

class LibraryController extends Controller
{
    function showAllGroup(Request $request)
    {
        $libraryDb = GroupModel::where([['type', 'library'], ['status', 1]])
            ->with(['library', 'bookmark', 'library.imageOrFile', 'library.faculty', 'library.major', 'library.department', 'groupTag'])
            ->orderBy('updated_at', 'DESC')
            ->paginate(8);

        if (sizeof($libraryDb) <= 0) {
            return response()->json([
                'status' => 'failed',
                'message' => 'group not found.',
            ], 404);
        }

        $data = GroupResource::collection($libraryDb);
        if (sizeof($data) > 0) {
            return response()->json([
                'status' => 'ok',
                'message' => 'fetch all lbrary success.',
                'listItem' => $data,
                // 'nextPageUrl' => $libraryDb->nextPageUrl()
            ], 200);
        } else {
            return response()->json([
                'status' => 'failed',
                'message' => 'failed to fetch all library.',
            ], 500);
        };
    }

    function createGroup(Request $request)
    {
        //----------- Validation
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
        //--------------------

        try {
            //------------- file manage path
            $uID = auth()->user()->id;
            $path = public_path('uploaded/Library/');
            if ($request->hasFile('file')) {
                $file = $request->file('file');
                $extension = strtolower($file->getClientOriginalExtension());
                $allowedExtensions = ['pdf'];

                if (in_array($extension, $allowedExtensions)) {
                    $name =  'library-' . now()->format('YmdHis') . str_replace(' ', '', basename($file->getClientOriginalName(), ".pdf"));
                    $filename = $name . '.' . $extension;
                    $file->move($path, $filename);

                    $imageOrFile = imageOrFileModel::create([
                        'name' => $filename
                    ]);
                    dispatch(new PdfToImage($filename));
                } else {
                    // Handle the error for unsupported file types
                    return response()->json([
                        'error' => 'Invalid file type. Only pdf is allowed.'
                    ], 400);
                }
            }
            //-----------------------

            //------------ group part
            $libraryModel = new LibraryModel();
            $groupID = $libraryModel->idGeneration();
            $groupDb = GroupModel::create([
                'groupID' => $groupID,
                'type' => 'library',
                'status' => (int)1,
                'created_at' => now(),
                'updated_at' => now()
            ]);
            //------------------------

            //----------------------tag part
            $tags = explode(',', $request->input('tag'));
            foreach ($tags as $tag) {
                if ($tag == '' || $tag == null) {
                    $tag = "library";
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
                    'type' => 'library',
                ]);
            }
            //-----------------------

            //----------- library part
            if (gettype($request->input('majorID')) == "string") {
                $majorDb = MajorModel::where('shortName', $request->input('majorID'))->first();
            }
            $libraryDb = LibraryModel::create([
                'id' => $groupID,
                'imageOrFileID' => $imageOrFile->id,
                'facultyID' => $request->input('facultyID'),
                'majorID' => $majorDb->id ?? $request->input('majorID'),
                'departmentID' => $request->input('departmentID') ?? null,
                'name' => $request->input('activityName'),
                'detail' => $request->input('detail') ?? null,
                'memberMax' => null,
                'createdBy' => $uID,
                'created_at' => now(),
                'updated_at' => now()
            ]);
            //-----------------------

            //--- if save success
            if ($groupDb && $libraryDb) {
                return response()->json([
                    'status' => 'ok',
                    'message' => 'create library success.',
                    'groupID' => $groupID,
                ], 200);
            }
            //-----------------------

        } catch (Exception $e) {
            //save error message to laravel log
            Log::error('Error occurred: ' . $e->getMessage(), [
                'exception' => $e,
                'trace' => $e->getTraceAsString()
            ]);
            //delete group with all its related model when failed
            File::delete(public_path('uploaded/Library/') . $request->file('file')->getClientOriginalName());
            imageOrFileModel::where('id', $imageOrFile->id)->delete();
            GroupTagModel::where('groupID', $groupDb->id)->delete();
            LibraryModel::where('id', $groupID)->delete();
            GroupModel::where('groupID', $groupID)->delete();
            return response()->json([
                'status' => 'failed',
                'message' => 'failed to create library.'
            ], 500);
        }
    }

    function updateGroup(Request $request, $groupID)
    {
        //----------------- validation part
        $validationRules = LibraryModel::$updatevalidator[0];
        $validationMessages = LibraryModel::$updatevalidator[1];

        $validator = Validator::make($request->all(), $validationRules, $validationMessages);
        if ($validator->fails()) {
            return response()->json([
                'status' => 'failed',
                'message' => $validator->errors()
            ], 400);
        }
        //------------------------

        //-------- เรียกใช้ relation
        $groupDb = GroupModel::where([['groupID', $groupID], ['type', 'library'], ['status', 1]])
            ->with(['library', 'library.imageOrFile', 'library.faculty', 'library.major', 'library.department', 'groupTag'])
            ->orderBy('updated_at', 'DESC')
            ->first();

        if (empty($groupDb)) {
            return response()->json([
                'status' => 'failed',
                'message' => 'Group not found.'
            ], 404);
        }
        //------------------------

        //----- file manage

        if ($request->hasFile('file')) {
            $path = public_path('uploaded\\Library\\');
            //delete old file

            $file = $request->file('file');
            $extension = strtolower($file->getClientOriginalExtension());
            $allowedExtensions = ['pdf'];

            if (!in_array($extension, $allowedExtensions)) {
                return response()->json([
                    'error' => 'Invalid file type. Only pdf is allowed.'
                ], 400);
            }

            if ($groupDb->library->imageOrFile !== $request->input('file')) {
                if (!empty($groupDb->library->imageOrFile) && File::exists($path . $groupDb->library->imageOrFile->name)) {
                    imageOrFileModel::where('id', $groupDb->library->imageOrFile->id)->delete(); // ลบ data on dby
                    File::delete($path . $groupDb->library->imageOrFile->name);
                }
                //save new file
                $path = public_path('uploaded/Library/');
                $name =  'library-' . now()->format('YmdHis') . str_replace(' ', '', basename($file->getClientOriginalName(), ".pdf"));
                $filename = $name . '.' . $extension;
                $file->move($path, $filename);

                $imageOrFileDb = imageOrFileModel::create([
                    'name' => $filename
                ]);
                dispatch(new PdfToImage($filename));
            }
        } else {
            $imageOrFileDb = imageOrFileModel::where('id', $groupDb->library->imageOrFile->id)->first();
        }
        //--------------------------


        //-------------------------- library part
        $libraryDb = LibraryModel::where('id', $groupID)->update([
            'facultyID' => $request->input('facultyID') ?? $groupDb->library->facultyID ?? null,
            'majorID' => $request->input('majorID') ?? $groupDb->library->majorID ?? null,
            'departmentID' => $request->input('departmentID') ?? $groupDb->library->departmentID ?? null,
            'imageOrFileID' => $imageOrFileDb->id ?? $groupDb->library->imageOrFileID ?? imageOrFileModel::where('name', 'group-default.jpg')->first()->id,
            'name' => $request->input('activityName') ?? $groupDb->library->name,
            'detail' => $request->input('detail') ?? null,
            'updated_at' => now()
        ]);
        $groupDb = GroupModel::where('groupID', $groupID)->update([
            'updated_at' => now()
        ]);
        //--------------------------

        if ($libraryDb && $groupDb) {
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

    function aboutGroup($groupID)
    {
        $groupDb = GroupModel::where([['groupID', $groupID], ['type', 'library'], ['status', 1]])
            ->with(['library', 'library.leaderGroup', 'library.imageOrFile', 'library.faculty', 'library.major', 'library.department', 'groupTag'])
            ->first();

        if (!$groupDb) {
            return response()->json([
                'status' => 'failed',
                'message' => 'library not found.',
            ], 404);
        }

        //--- get original filename
        if (!isset($groupDb->library->imageOrFile->name)) {
            $originname = 'not found';
            $filesize = 0;
        } else {
            //--- รับชื่อไฟล์ที่เข้ารหัส
            $encodedname = $groupDb->library->imageOrFile->name;
        
            //--- แยกชื่อไฟล์โดยใช้ '-', '.', และ ' ' เป็นตัวแบ่ง
            $arrayname = preg_split('/[-. ]/', $encodedname, -1, PREG_SPLIT_NO_EMPTY);
        
            //--- ค้นหาตำแหน่งของ '-' ถ้าพบ ให้ดึงค่าหลังจากนั้น 1 ตำแหน่ง
            $intersect = array_search('-', $arrayname);
            $fileoriginname = ($intersect !== false && isset($arrayname[$intersect + 1])) ? $arrayname[$intersect + 1] : $encodedname;
        
            //--- ระบุพาธของไฟล์
            $filePath = public_path('uploaded/Library/' . $encodedname);
        
            //--- ตรวจสอบว่าไฟล์มีอยู่จริง
            if (file_exists($filePath)) {
                //--- ลบตัวเลข ช่องว่าง จุด และขีดกลางที่ขึ้นต้นชื่อไฟล์ออก
                $originname = preg_replace('/^[\d .-]+/', '', basename($fileoriginname));
                $filesize = filesize($filePath);
            } else {
                $originname = 'not found';
                $filesize = 0;
            }
        }
        //-------------------------

        //-------- get pages image
        $filename = basename($groupDb->library->imageOrFile->name, '.pdf');
        $imagePath = public_path('\\pdfImage\\' . $filename);
        $allImagePath = [];
        if (File::exists($imagePath)) {
            $allpages = File::files($imagePath);
            $totalpages = count($allpages);
            for ($index = 1; $index <= $totalpages; $index++) {
                $imagePath = '/pdfImage/' . $filename . '/output_page_' . $index . '.jpg';
                array_push($allImagePath, $imagePath);
            }
        } else $imagePath = null;
        //---------------------------

        $data = [
            'faculty' => $groupDb->library->faculty->nameEN ?? 'none',
            'major' => $groupDb->library->major->nameEN ?? 'none',
            'department' => $groupDb->library->department->name ?? 'none',
            'filename' => $originname,
            'name' => $groupDb->library->name,
            'owner' => $groupDb->library->leaderGroup->username,
            'uploadDate' => $groupDb->created_at,
            'filesizeInBytes' => $filesize,
            'totalpages' => $totalpages ?? '0',
            'filepageurl' => $allImagePath,
            'downloadlink' => '/uploaded/Library/' . $groupDb->library->imageOrFile->name,
        ];
        return response()->json([
            'status' => 'ok',
            'message' => 'fetch library success.',
            'data' => $data
        ], 200);
    }

    function deleteGroup($groupID)
    {
        $groupDb = GroupModel::where([['groupID', $groupID], ['type', 'library'], ['status', 1]])
            ->with(['library', 'library.imageOrFile', 'groupDay', 'groupTag'])
            ->orderBy('updated_at', 'DESC')
            ->first();
        if ($groupDb) {
            if (File::exists(public_path('uploaded\\Library\\') . $groupDb->library->imageOrFile->name)) {
                File::delete(public_path('uploaded\\Library\\') . $groupDb->library->imageOrFile->name);
            }
            if (File::exists(public_path('pdfImage\\') . $groupDb->library->imageOrFile->name)) {
                File::deleteDirectory(public_path('pdfImage\\') . $groupDb->library->imageOrFile->name);
            }
            if (
                GroupTagModel::where('groupID', $groupDb->id)->delete() && GroupModel::where('groupID', $groupID)->delete()
                && LibraryModel::where('id', $groupID)->delete()
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

    function libraryshared(Request $request)
    {
        $groupID = $request->input('groupID');
        $groupDb = GroupModel::where('groupID', $groupID)->with('library')->first();
        if (!$groupDb) {
            return response()->json([
                'status' => 'failed',
                'message' => 'library not found.',
            ], 404);
        }
        $librarydata = [
            'shared' => ($groupDb->library->shared) + 1,
        ];
        if (LibraryModel::where('id', $groupID)->update($librarydata)) {
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
        $groupID = $request->input('groupID');
        $libraryDb = GroupModel::where('groupID', $groupID)->with('library', 'library.imageOrFile')->first();
        if (!$libraryDb) {
            return response()->json([
                'status' => 'failed',
                'message' => 'library not found.',
            ], 404);
        }
        $librarydata = [
            'download' => ($libraryDb->library->download) + 1,
            'updated_at' => now(),
        ];
        if (LibraryModel::where('id', $groupID)->update($librarydata)) {
            $filePath = public_path("\\uploaded\\Library\\" . $libraryDb->library->imageOrFile->name);
            if (!File::exists($filePath)) {
                return response()->json([
                    'status' => 'failed',
                    'message' => 'failed to download library.'
                ], 404);;
            }
            return Response::download($filePath);
        } else {
            return response()->json([
                'status' => 'failed',
                'message' => 'failed to download library.'
            ], 500);
        };
    }
}
