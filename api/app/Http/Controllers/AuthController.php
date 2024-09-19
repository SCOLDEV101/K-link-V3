<?php

namespace App\Http\Controllers;

use Illuminate\Http\Request;

use App\Models\UserModel;

class AuthController extends Controller
{
    public function login(Request $request)
    {
        $allUser = UserModel::select('id')->get();
        
        $count = count($allUser);
        $randomIndex = rand(0,$count-1);
        $uID = $allUser[$randomIndex]->id;

        $user = UserModel::where('id', $uID)->first();
        if (empty($user)) {
            return response()->json([
                'status' => 'failed',
                'message' => 'cannot find user.',
            ], 200);
        }
        $user->tokens()->delete();
        $token = $user->createToken('auth_token')->plainTextToken;
        return response()->json([
            'status' => 'ok',
            'message' => 'login success.',
            'token' => $token,
            'name' => $user->username
        ], 200);
    }

    public function logout()
    {
        $uID = auth()->user()->uID;
        $user = UserModel::where('uID', $uID)->first();
        $user->tokens()->delete();
        return response()->json([
            'status' => 'ok',
            'message' => 'logout success.',
        ], 200);
    }
}
