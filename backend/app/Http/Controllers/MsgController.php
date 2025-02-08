<?php

namespace App\Http\Controllers;

use App\Models\Msg;
use Illuminate\Http\Request;
use Validator;

class MsgController extends Controller
{
    public function send_msg(Request $request)
    {
        $valid = Validator::make($request->all(), [
            'sender_id' => 'required',
            'receiver_id' => 'required',
            'message' => 'nullable|string',
            'file' => 'nullable|file',
        ]);

        if ($valid->fails()) {
            return response()->json(['errors' => $valid->errors()], 400);
        }

        $msg = new Msg();
        $msg->sender_id = $request->sender_id;
        $msg->receiver_id = $request->receiver_id;
        $msg->message = $request->message;

        if ($request->hasFile('file')) {
            $filePath = $request->file('file')->store('messages', 'public');
            $msg->file = asset('storage/' . ltrim($filePath, '/'));
        }

        $msg->save();

        return response()->json(['message' => 'Message sent successfully', 'data' => $msg], 200);
    }
    // return all messages 
    public function get_msg($receiver_id)
    {
        $msg = Msg::where('receiver_id', $receiver_id)->first();

        if ($msg) {
            return response()->json(['status' => 200, 'data' => $msg], 200);
        } else {
            return response()->json(['status' => 404, 'message' => 'Message not found'], 404);
        }
    }





}
