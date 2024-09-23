<?php

namespace App\Http\Resources;

use Illuminate\Http\Request;
use Illuminate\Http\Resources\Json\JsonResource;
use App\Models\UserModel;

class LibraryResource extends JsonResource
{
    /**
     * Transform the resource into an array.
     *
     * @return array<string, mixed>
     */
    public function toArray(Request $request): array
    {
        $bookmarkObject = UserModel::bookmark();
        if ($bookmarkObject->contains('hID', $this->hID)) {
            $bookmark = true;
        }
        $encodedname = $this->library->filepath;
        $arrayname = preg_split('/-|[.s]/', $encodedname, -1, PREG_SPLIT_NO_EMPTY);
        $intersect = array_search('-', $arrayname) + 1;
        $fileoriginname = $arrayname[$intersect];

        $filePath = public_path('uploaded/Library/'. $this->library->filepath);
        $encodednamenoExt = preg_replace('/\.[^.]+$/', '', $encodedname);

        if (file_exists($filePath)) {
            $originname = preg_replace('/^[\d .-]+/', '', basename($fileoriginname));
        }
        else $originname = 'not found';

        $thumbnailPath = public_path('pdfImage\\'.$encodednamenoExt.'\\output_page_1.jpg');
        if(file_exists($thumbnailPath)){
            $thumbnailPath = '/pdfImage/'.$encodednamenoExt. '/output_page_1.jpg';
        }
        else $thumbnailPath = null;

        return [
            'lID' => $this->library->libraryID,
            'hID' => $this->hID,
            'type' => $this->type,
            'activityName' => $this->activityName,
            'Major' => $this->library->faculty->facultyNameTH,
            'leader' => $this->leaderGroup->username ?? 'Unknown',
            'detail' => $this->detail,
            'bookmark' => $bookmark ?? null,
            'filename' => $originname,
            'encodedfilename' => $this->library->filepath,
            'downloads' => $this->library->downloaded,
            'shares' => $this->library->shared,
            'tag' => $this->tag,
            'thumbnail' => $thumbnailPath
        ];
    }
}
