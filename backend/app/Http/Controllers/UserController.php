<?php

namespace App\Http\Controllers;

use Illuminate\Http\Request;
use Validator;
use App\Models\User;
use Illuminate\Support\Facades\Hash;
use Illuminate\Support\Facades\Auth;

class UserController extends Controller
{
    public function create_user(Request $request)
    {
        $valid = Validator::make($request->all(), [
            'name' => 'required|string|max:255',
            'email' => 'required|email|unique:users,email',
            'password' => 'required|min:6',
        ]);

        if ($valid->fails()) {
            return response()->json(['errors' => $valid->errors()], 400);
        }

        $existingUser = User::where('email', $request->email)->first();
        if ($existingUser) {
            return response()->json(['error' => 'User already exists'], 409);
        }

        $user = User::create([
            'name' => $request->name,
            'email' => $request->email,
            'password' => Hash::make($request->password),
        ]);

        $token = $user->createToken('UserToken')->plainTextToken;

        return response()->json(['message' => 'User created successfully', 'user' => $user, 'token' => $token], 201);
    }

    public function login(Request $request)
    {
        $valid = Validator::make($request->all(), [
            'email' => 'required|email',
            'password' => 'required',
        ]);

        if ($valid->fails()) {
            return response()->json(['errors' => $valid->errors()], 400);
        }

        $user = User::where('email', $request->email)->first();

        if (!$user || !Hash::check($request->password, $user->password)) {
            return response()->json(['error' => 'Invalid credentials'], 401);
        }

        $token = $user->createToken('UserToken')->plainTextToken;

        return response()->json(['message' => 'Login successful', 'user' => $user, 'token' => $token], 200);
    }
}
