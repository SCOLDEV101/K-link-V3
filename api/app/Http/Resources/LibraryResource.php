<?php

namespace App\Http\Resources;

use setasign\Fpdi\Fpdi;
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
        $tags = explode(',',$this->tag);
        $path = public_path('uploaded/Library/');
        $files = [];
        $pdf = new Fpdi();
        foreach (explode(',', $this->library->filepath) as $file) {
            $filePath = $path . $file;
            if (!file_exists($filePath)) {
                continue;
            }
            $pdf->setSourceFile($filePath);
            $templatepdf = $pdf->importPage(1);
            $pdf->AddPage();
            $pdf->useTemplate($templatepdf);
            $pdfContent = $pdf->Output('S');
            $base64Pdf = base64_encode($pdfContent);
            array_push($files, $base64Pdf);
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
            'filename' => $this->library->filespath,
            'download' => $this->library->downloaded,
            'shares' => $this->library->shared,
            'tag' => $this->tag,
            'img' => $files,
        ];
    }
}
