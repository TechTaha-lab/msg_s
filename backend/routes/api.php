<?php

use App\Http\Controllers\MsgController;
use App\Http\Controllers\ProfileController;
use App\Http\Controllers\UserController;
use Illuminate\Http\Request;
use Illuminate\Support\Facades\Route;

Route::get('/user', function (Request $request) {
    return $request->user();
})->middleware('auth:sanctum');

route::post('/CreateAccount',[UserController::class,'create_user']);
route::post('/login',[UserController::class,'login']);
route::post('/profile',[ProfileController::class,'create_profile']);
route::delete('/profile/{id}',[ProfileController::class,'delete_profile']);
route::put('/profile/{id}',[ProfileController::class,'update_profile']);

route::get('/profile',[ProfileController::class,'get_profiles']);

route::get('/profile/{id}',[ProfileController::class,'get_profile_by_user_id']);

route::post('/send_msg',[MsgController::class,'send_msg']);

route::get('/get_msg/{id}',[MsgController::class,'get_msg']);