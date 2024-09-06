<?php

namespace App\Http\Resources;

use Illuminate\Http\Request;
use Illuminate\Http\Resources\Json\JsonResource;
use App\Models\UserModel;
use setasign\Fpdi\Fpdi;

class MyPostResource extends JsonResource
{
    /**
     * Transform the resource into an array.
     *
     * @return array<string, mixed>
     */
    public function toArray($request)
    {
        $isMember = false;
        $isRequest = false;
        $isCreator = false;
        $isLeader = false;
        $isHobby = false;
        $isLibrary = false;
        $isTutoring = false;
        $bookmark = false;

        $status = 'join';
        $members = explode(',', $this->member);
        $requestmembers = explode(',', $this->memberRequest);
        $uID = auth()->user()->uID;
        if(in_array($uID,$members)&&($this->type!='library')){
            $status = 'member';
            $isMember = true;
        }

        if(in_array($uID,$requestmembers)){
            $status = 'request';
            $isRequest = true;
        }
        else if(count($members) >= $this->memberMax && $this->memberMax != null){
            $status = 'full';
        }

        if($uID == $this->leader){
            $isLeader = true;
        }

        if($uID == $this->createdBy){
            $isCreator = true;
        }

        if($this->type == 'library'){
            $isLibrary = true;
        }

        if($this->type == 'hobby'){
            $isHobby = true;
        }

        if($this->type == 'tutoring'){
            $isTutoring = true;
        }

        $bookmarkObject = UserModel::bookmark();
        if ($bookmarkObject->contains('hID', $this->hID)) {
            $bookmark = true;
        }

        if($this->type == 'library') {
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
        }

        if($isMember || $isRequest || $isCreator || $isLeader){
            return [
                'hID'=>$this->hID,
                'type'=>$this->type,
                'image'=>$this->image,
                'tag'=>$this->tag,
                'member'=>count($members),
                'memberMax'=>$this->memberMax,
                'activityName'=>$this->activityName,
                'leader'=>$this->leaderGroup->username ?? 'Unknown',
                'teachBy'=>$this->leaderGroup->username ?? 'Unknown',
                'weekDate'=>$this->weekDate,
                'actTime'=>$this->actTime,
                'location'=>$this->location,
                'detail'=>$this->detail,
                'userstatus'=>$status,
                'tutoringFaculty' =>$this->tutoring->faculty->facultyNameTH ?? null,
                'tutoringMajor' =>$this->tutoring->major->majorNameTH ?? null,
                'date'=>$this->tutoring->date ?? null,
                'Starttime'=>$this->tutoring->startTime ?? null,
                'Endtime'=>$this->tutoring->endTime ?? null,
                'img'=>$files ?? null,
                'libraryFaculty'=>$this->library->faculty->facultyNameTH ?? null,
                'FilterTag' => array(
                    'isMember'=>$isMember ?? null,
                    'isRequest'=>$isRequest ?? null,
                    'isLeader'=>$isLeader ?? null,
                    'isCreator'=>$isCreator ?? null,
                    'isLibrary'=>$isLibrary ?? null,
                    'isHobby'=>$isHobby ?? null,
                    'isTutoring'=>$isTutoring ?? null,
                ),
                'bookmark' => $bookmark ?? null,
            ];
        }
        return null;
    }
}