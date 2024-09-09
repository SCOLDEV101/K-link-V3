<?php

namespace App\Http\Resources;

use setasign\Fpdi\Fpdi;
use Exception;
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
        $tags = explode(',', $this->tag);
        $path = public_path('uploaded/Library/');
        $files = [];
        $pdf = new Fpdi();
        $encodedname = $this->library->filepath;
        $arrayname = preg_split('/-|[.s]/', $encodedname,-1, PREG_SPLIT_NO_EMPTY);
        $intersect = array_search('-', $arrayname)+1;
        $fileoriginname = $arrayname[$intersect];
        
        foreach (explode(',', $this->library->filepath) as $file) {
            $filePath = $path . $file;
            if (!file_exists($filePath)) {
                $originname = 'not found';
                array_push($files, null);
                continue;
            }
            $originname = preg_replace('/^[\d .-]+/','', basename($fileoriginname));
            try {
                $pdf->setSourceFile($filePath);
                $templatepdf = $pdf->importPage(1);
                $pdf->AddPage();
                $pdf->useTemplate($templatepdf);
                $pdfContent = $pdf->Output('S');
                $base64Pdf = base64_encode($pdfContent);
                array_push($files, $base64Pdf);
            } catch (Exception $error) {
                array_push($files, null);
                continue;
            }
        }

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
            'download' => $this->library->downloaded,
            'shares' => $this->library->shared,
            'tag' => $this->tag,
            'img' => $files ?? null,
        ];
    }
}
