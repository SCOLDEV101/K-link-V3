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
        $id = $allUser[$randomIndex]->id;
        if($request->input('id')){
            $id = $request->input('id');
        }
        $user = UserModel::where('id', $id)->first();
        if (empty($user)) {
            return response()->json([
                'status' => 'failed',
                'message' => 'cannot find user.',
            ], 404);
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
        $id = auth()->user()->id;
        $user = UserModel::where('id', $id)->first();
        $user->tokens()->delete();
        return response()->json([
            'status' => 'ok',
            'message' => 'logout success.',
        ], 200);
    }
}
