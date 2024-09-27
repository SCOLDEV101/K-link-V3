<?php

use Illuminate\Http\Request;
use Illuminate\Support\Facades\Route;
use App\Http\Controllers\AuthController;
use App\Http\Controllers\SearchController;
use App\Http\Controllers\LibraryController;
use App\Http\Controllers\HobbyController;
use App\Http\Controllers\UserController;
use App\Http\Controllers\TutoringController;

/*
|--------------------------------------------------------------------------
| API Routes
|--------------------------------------------------------------------------
|
| Here is where you can register API routes for your application. These
| routes are loaded by the RouteServiceProvider and all of them will
| be assigned to the "api" middleware group. Make something great!
|
*/

// Route::middleware('auth:sanctum')->get('/user', function (Request $request) {
//     return $request->user();
// });

Route::group(['middleware' => ['api', 'auth:sanctum']], function () {
    Route::controller(SearchController::class)->group(function () {
        Route::post('/searching/search/{type?}', 'searchKeyword');
        Route::post('/searching/searchInvite/{hID}', 'searchInvite');
    });

    Route::prefix('hobby')->group(function () {
        Route::controller(HobbyController::class)->group(function () {
            Route::get('kmitl', 'fetchKmitl');
            Route::get('member/{hID}', 'memberGroup');
            Route::get('aboutGroup/{hID}', 'aboutGroup');
            Route::get('showAllGroup', 'showAllGroup');
            Route::post('createGroup', 'createGroup');

            Route::group(['middleware' => 'leaderCheck'], function () {
                Route::post('updateGroup/{hID}', 'updateGroup');
                Route::get('requestMember/{hID}', 'checkRequestGroup');
                Route::post('rejectOrAcceptMember/{hID}', 'rejectOrAcceptRequest');
                Route::post('kickMember/{hID}/{uID}', 'kickMember');
                Route::delete('deleteGroup/{hID}', 'deleteGroup');
                Route::post('changeLeader/{hID}/{uID}', 'changeLeaderGroup');
            });
        });
    });

    Route::prefix('user')->group(function () {
        Route::controller(UserController::class)->group(function () {
            Route::get('viewBookmark', 'viewBookmark');
            Route::post('addOrDeleteBookmark/{id}', 'addOrDeleteBookmark');
            Route::post('report', 'report');
            Route::get('memberInfo/{uID?}', 'memberInfo');
            // Route::get('aboutMyAccount', 'showAboutUser');
            Route::post('updateMyAccount', 'updateAboutUser');
            Route::get('invitePage/{id}', 'invitePage');
            Route::post('inviteFriend/{hID}', 'inviteFriend');
            Route::post('joinGroup/{id}', 'requestToGroup');
            Route::get('notification', 'notification');
            Route::get('myPost', 'myPost');
            Route::delete('leaveGroup/{hID}','leaveGroup');
        });
    });

    Route::prefix('library')->group(function() {
        Route::controller(LibraryController::class)->group(function(){
            Route::get('showAllGroup','showAllGroup');
            Route::post('createGroup','createGroup');
            Route::get('aboutGroup/{hID}','aboutGroup');
            Route::get('librarydownload/{hID}','libraryurldownload');
            Route::post('sharedlibrary','libraryshared');
            Route::post('downloadedlibrary','librarydownloaded');
            Route::group(['middleware' => 'leaderCheck'], function() {
                Route::post('updateGroup/{hID}','updateGroup');
                Route::delete('deleteGroup/{hID}','deleteGroup');
            });
        });
    });

    Route::prefix('tutoring')->group(function () {
        Route::controller(TutoringController::class)->group(function () {
            Route::get('member/{hID}', 'memberGroup');
            Route::get('aboutGroup/{hID}', 'aboutGroup');
            Route::get('showAllGroup', 'showAllGroup');
            Route::post('createGroup', 'createGroup');

            Route::group(['middleware' => 'leaderCheck'], function () {
                Route::post('updateGroup/{hID}', 'updateGroup');
                Route::get('requestMember/{hID}', 'checkRequestGroup');
                Route::post('rejectOrAcceptMember/{hID}', 'rejectOrAcceptRequest');
                Route::post('kickMember/{hID}/{uID}', 'kickMember');
                Route::delete('deleteGroup/{hID}', 'deleteGroup');
                Route::post('changeLeader/{hID}/{uID}', 'changeLeaderGroup');
            });
        });
    });
    
});

Route::controller(AuthController::class)->group(function () {
    Route::get('/login', 'login');
    Route::post('/login', 'login');
    Route::get('/logout', 'logout');
});
