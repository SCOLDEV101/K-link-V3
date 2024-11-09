<?php

namespace App\Http\Controllers;

use Illuminate\Http\Request;
use App\Models\GroupModel;
use App\Models\UserModel;
use App\Http\Resources\GroupResource;
use App\Http\Resources\UserResource;
use Illuminate\Support\Facades\Validator;
use App\Models\GroupTagModel;
use App\Models\TagModel;

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

    function tagQuerySearch(Request $request){
        $type = trim($request->input('type'));

        $tags = GroupTagModel::where('type',$type)->with(['tagName'])
                                            ->select('tagID')
                                            // ->distinct()
                                            ->get();
        
        $tagsModified = $tags->pluck('tagName.name')->toArray();

        $excludedTags = ['ช่วงเช้า', 'ช่วงสาย', 'ช่วงบ่าย', 'ช่วงเย็น', 'ช่วงค่ำ', 'ช่วงดึก'];

        //เอา tag ช่วงเวลาออก
        $tagsModified = array_filter($tagsModified, function($tag) use ($excludedTags) {
            return !in_array($tag, $excludedTags);
        });

        //นับจำนวน element แต่ละตัวใน array
        $valueCounts = array_count_values($tagsModified);

        //เรียงจากมากไปน้อย
        arsort($valueCounts);

        //หั่นเอา 10 ตัวแรก
        $topTags = array_slice($valueCounts, 0, 10, true);

        $suggestedTags = [];
        foreach ($topTags as $value => $count) {
            $suggestedTags[] = $value;
        }

        return response()->json([
            'status' => 'success',
            'data' => $suggestedTags,
        ], 200);
    }

    function tagQueryGroup(Request $request) {
        $name = trim($request->input('activityName'));
        $startTime = trim($request->input('startTime'));
        $place = trim($request->input('location'));
        $type = trim($request->input('type'));                               
        $search = trim($request->input('search'));                               

        $tags = TagModel::get();
        $tagsModified = $tags->pluck('name')->toArray();

        if($search){
            $suggestedTags = $this->suggestSearch($search,$tagsModified);
            $suggestedTags = array_map(function($suggestion) {
                return $suggestion['keyword'];
            }, $suggestedTags);
        } else {
            if($name){
                $suggestedTags = $this->suggestTags($name,$tagsModified);
            }else{
                //แสดง tag ยอดนิยมทั้งหมด ยกเว้นช่วงเวลา ------------------------------------------------
                $Alltags = GroupTagModel::where('type',$type)->with(['tagName'])
                                                                ->select('tagID')
                                                                // ->distinct()
                                                                ->get();
    
                $tagsModified = $Alltags->pluck('tagName.name')->toArray();
                $excludedTags = ['ช่วงเช้า', 'ช่วงสาย', 'ช่วงบ่าย', 'ช่วงเย็น', 'ช่วงค่ำ', 'ช่วงดึก'];
    
                //เอา tag ช่วงเวลาออก
                $tagsModified = array_filter($tagsModified, function($tag) use ($excludedTags) {
                    return !in_array($tag, $excludedTags);
                });
    
                //นับจำนวน element แต่ละตัวใน array
                $valueCounts = array_count_values($tagsModified);
    
                //เรียงจากมากไปน้อย
                arsort($valueCounts);
    
                //หั่นเอา 10 ตัวแรก
                $topTags = array_slice($valueCounts, 0, 10, true); 
    
                $suggestedTags = [];
                foreach ($topTags as $value => $count) {
                    $suggestedTags[] = ['keyword' => $value,'percent' => 100];
                }
                // ----------------------------------------------------------------------------------
            }
    
            if($place){
                $suggestedFromPlace = $this->suggestPlaces($place, $tagsModified);
                $suggestedTags = array_merge($suggestedTags, $suggestedFromPlace);
    
                usort($suggestedTags, function($a, $b) {
                    return $b['percent'] <=> $a['percent'];
                });
    
                $suggestedTags = array_map(function($suggestion) {
                    return $suggestion['keyword'];
                }, $suggestedTags);
    
                $suggestedTags = array_values(array_unique($suggestedTags));
                $suggestedTags = array_slice($suggestedTags, 0, 10, true); 
            }
            
            
            if(!$place){
                $suggestedTags = array_map(function($suggestion) {
                    return $suggestion['keyword'];
                }, $suggestedTags);
            }
    
            if($startTime){
                $suggestedFromTime = $this->suggestTime($startTime);
                if(count($suggestedTags) == 10){
                    array_pop($suggestedTags);
                    array_splice($suggestedTags, 9, 0, $suggestedFromTime);
                }else{
                    $suggestedTags[] = $suggestedFromTime;
                }
            }    
        }

        return response()->json([
            'status' => 'success',
            'data' => $suggestedTags,
        ], 200);
    }

    // ฟังก์ชันลบสระ 
    private function removeThaiVowelsAndDiacritics($text) {
        // $diacritics = ['ะ', 'า', 'ิ', 'ี', 'ึ', 'ื', 'ุ', 'ู', 'เ', 'แ', 'โ', 'ใ', 'ไ', 'ั', '็', '่', '้', '๊', '๋', '์'];
        $diacritics = ['ะ', 'ิ', 'ี', 'ึ', 'ื', 'ุ', 'ู', 'ั', '็', '่', '้', '๊', '๋', '์'];
        return str_replace($diacritics, '', $text);
    }

    // เทียบ No Caps Lock กับ Caps Lock
    private function isSameThaiText($text1, $text2) {
        $capsToNoCaps = [
            '๐' => 'ๆ', '"' => 'ไ', 'ฎ' => 'ำ', 'ฑ' => 'พ', 'ธ' => 'ะ', 'ํ' => 'ั',
            '๊' => 'ี', 'ณ' => 'ร', 'ฯ' => 'น', 'ญ' => 'ย', 'ฐ' => 'บ', ',' => 'ล',
            'ฅ' => 'ฃ', 'ฤ' => 'ฟ', 'ฆ' => 'ห', 'ฏ' => 'ก', 'โ' => 'ด', 'ฌ' => 'เ',
            '็' => '้', '๋' => '่', 'ษ' => 'า', 'ศ' => 'ส', 'ซ' => 'ว', '.' => 'ง',
            '(' => 'ผ', ')' => 'ป', 'ฉ' => 'แ', 'ฮ' => 'อ', 'ฺ' => 'ิ', '์' => 'ื',
            '?' => 'ท', 'ฒ' => 'ม', 'ฬ' => 'ใ', 'ฦ' => 'ฝ', '+' => 'ๅ', '๑' => '/',
            '๒' => '-', '๓' => 'ภ', '๔' => 'ถ', 'ู' => 'ุ', '฿' => 'ึ', '๕' => 'ค',
            '๖' => 'ต', '๗' => 'จ', '๘' => 'ข', '๙' => 'ช',
        ];
    
        // Reverse the mapping to include both directions
        $noCapsToCaps = array_flip($capsToNoCaps);
    
        // Create two transformed versions of each text to compare both ways
        $text1ToNoCaps = strtr($text1, $capsToNoCaps);
        $text1ToCaps = strtr($text1, $noCapsToCaps);
    
        $text2ToNoCaps = strtr($text2, $capsToNoCaps);
        $text2ToCaps = strtr($text2, $noCapsToCaps);
    
        // Store the maximum percent similarity found
        $maxPercent = 0;
    
        // Check all combinations and calculate the highest percent
        similar_text($text1, $text2, $percent);
        $maxPercent = max($maxPercent, $percent);
    
        similar_text($text1ToNoCaps, $text2, $percent);
        $maxPercent = max($maxPercent, $percent);
    
        similar_text($text1ToCaps, $text2, $percent);
        $maxPercent = max($maxPercent, $percent);
    
        similar_text($text2ToNoCaps, $text1, $percent);
        $maxPercent = max($maxPercent, $percent);
    
        similar_text($text2ToCaps, $text1, $percent);
        $maxPercent = max($maxPercent, $percent);
    
        similar_text($text1ToNoCaps, $text2ToNoCaps, $percent);
        $maxPercent = max($maxPercent, $percent);
    
        similar_text($text1ToCaps, $text2ToCaps, $percent);
        $maxPercent = max($maxPercent, $percent);
    
        return $maxPercent; // Return the highest percent found
    }
    

    // เปลี่ยนตัวสะกด
    private function thaiSpelling($text) {
        $spelling = [
            'ญ' => 'น', 'ณ' => 'น', 'ร' => 'น', 'ล' => 'น', 'ฬ' => 'น',
            'ก' => 'ก', 'ข' => 'ก', 'ค' => 'ก', 'ฆ' => 'ก',
            'ด' => 'ด', 'จ' => 'ด', 'ช' => 'ด', 'ซ' => 'ด', 'ฎ' => 'ด',
            'ฏ' => 'ด', 'ฐ' => 'ด', 'ฑ' => 'ด', 'ฒ' => 'ด', 'ต' => 'ด',
            'ถ' => 'ด', 'ท' => 'ด', 'ธ' => 'ด', 'ศ' => 'ด', 'ษ' => 'ด', 'ส' => 'ด',
            'บ' => 'บ', 'ป' => 'บ', 'ภ' => 'บ', 'พ' => 'บ', 'ฟ' => 'บ',
            'ใ' => 'ใ', 'ใ' => 'ไ'
        ];

        $text = strtr($text, $spelling);
        return $text;
    }

    // แท็กแนะนำจากชื่อ
    private function suggestTags($name, $keywords) {
        $suggestions = [];
    
        // Normalize the direct spelling and remove vowels from the name
        $nameWithDirectSpelling = $this->thaiSpelling($name);
        $nameWithNoVowel = $this->removeThaiVowelsAndDiacritics($nameWithDirectSpelling);
    
        foreach ($keywords as $keyword) {
            // Normalize the keyword similarly
            $keywordWithDirectSpelling = $this->thaiSpelling($keyword);
            $keywordWithNoVowel = $this->removeThaiVowelsAndDiacritics($keywordWithDirectSpelling);
    
            // Get the maximum similarity percent
            $percent = $this->isSameThaiText($nameWithNoVowel, $keywordWithNoVowel);
    
            if ($percent > 30 && !in_array($keyword, ['ช่วงเช้า', 'ช่วงสาย', 'ช่วงบ่าย', 'ช่วงเย็น', 'ช่วงค่ำ', 'ช่วงดึก'])) {
                $suggestions[] = [
                    'keyword' => strtolower($keyword),
                    'percent' => $percent
                ];
            }
        }
    
        // Sort suggestions by similarity percentage
        usort($suggestions, function($a, $b) {
            return $b['percent'] <=> $a['percent'];
        });
    
        // Handle cases where no suggestions match
        if (empty($suggestions)) {
            // Fallback if no suggestions
            return [['keyword' => $name, 'percent' => 100]];
        } else {
            // Limit to the top 10 suggestions
            return array_slice($suggestions, 0, 10);
        }
    }

    // แท็กแนะนำจากการพิมพ์
    private function suggestSearch($search, $keywords) {
        $suggestions = [];
    
        // Normalize the direct spelling and remove vowels from the name
        $searchWithDirectSpelling = $this->thaiSpelling($search);
        $searchWithNoVowel = $this->removeThaiVowelsAndDiacritics($searchWithDirectSpelling);
    
        foreach ($keywords as $keyword) {
            // Normalize the keyword similarly
            $keywordWithDirectSpelling = $this->thaiSpelling($keyword);
            $keywordWithNoVowel = $this->removeThaiVowelsAndDiacritics($keywordWithDirectSpelling);
    
            // Get the maximum similarity percent
            $percent = $this->isSameThaiText($searchWithNoVowel, $keywordWithNoVowel);
    
            if ($percent > 30 && !in_array($keyword, ['ช่วงเช้า', 'ช่วงสาย', 'ช่วงบ่าย', 'ช่วงเย็น', 'ช่วงค่ำ', 'ช่วงดึก'])) {
                $suggestions[] = [
                    'keyword' => strtolower($keyword),
                    'percent' => $percent
                ];
            }
        }
    
        // Sort suggestions by similarity percentage
        usort($suggestions, function($a, $b) {
            return $b['percent'] <=> $a['percent'];
        });
    
        // Handle cases where no suggestions match
        if (empty($suggestions)) {
            // Fallback if no suggestions
            return [['keyword' => $search, 'percent' => 100]];
        } else {
            // Limit to the top 10 suggestions
            return array_slice($suggestions, 0, 10);
        }
    }

    // แท็กแนะนำจากสถานที่
    private function suggestPlaces($place, $keywords) {
        $suggestions = [];
    
        // Normalize the direct spelling and remove vowels from the place
        $placeWithDirectSpelling = $this->thaiSpelling($place);
        $placeWithNoVowel = $this->removeThaiVowelsAndDiacritics($placeWithDirectSpelling);
    
        foreach ($keywords as $keyword) {
            // Normalize the keyword similarly
            $keywordWithDirectSpelling = $this->thaiSpelling($keyword);
            $keywordWithNoVowel = $this->removeThaiVowelsAndDiacritics($keywordWithDirectSpelling);
    
            // Get the maximum similarity percent
            $percent = $this->isSameThaiText($placeWithNoVowel, $keywordWithNoVowel);
    
            if ($percent > 30 && !in_array($keyword, ['ช่วงเช้า', 'ช่วงสาย', 'ช่วงบ่าย', 'ช่วงเย็น', 'ช่วงค่ำ', 'ช่วงดึก'])) {
                $suggestions[] = [
                    'keyword' => strtolower($keyword),
                    'percent' => $percent
                ];
            }
        }
    
        // Sort suggestions by similarity percentage
        usort($suggestions, function($a, $b) {
            return $b['percent'] <=> $a['percent'];
        });
    
        // Handle cases where no suggestions match
        if (empty($suggestions)) {
            // Fallback if no suggestions
            return [['keyword' => $place, 'percent' => 100]];
        } else {
            // Limit to the top 10 suggestions
            return array_slice($suggestions, 0, 10);
        }
    }

    // แท็กแนะนำจากเวลาเริ่ม
    private function suggestTime($startTime) {
        $time = strtotime($startTime);
        if (!$time) {
            return null;
        }

        $hour = (int) date('H', $time);

        if ($hour >= 6 && $hour < 9) {
            return 'ช่วงเช้า'; 
        } elseif ($hour >= 9 && $hour < 12) {
            return 'ช่วงสาย';
        } elseif ($hour >= 12 && $hour < 15) {
            return 'ช่วงบ่าย';
        } elseif ($hour >= 15 && $hour < 18) {
            return 'ช่วงเย็น'; 
        } elseif ($hour >= 18 && $hour < 21) {
            return 'ช่วงค่ำ';
        } else {
            return 'ช่วงดึก'; 
        }
    }
}