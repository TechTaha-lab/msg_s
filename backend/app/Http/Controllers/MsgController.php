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

    public function get_msg_by_receiver($receiver_id)
    {
        $msg = Msg::where('receiver_id', $receiver_id)->get();


        if ($msg) {
            return response()->json(['status' => 200, 'data' => $msg], 200);
        } else {
            return response()->json(['status' => 404, 'message' => 'Message not found'], 404);
        }
    }

    public function get_media($sender_id)
    {
        $messages = Msg::where('sender_id', $sender_id)
            ->whereNotNull('file')
            ->get();

        if ($messages->isEmpty()) {
            return response()->json(['status' => 404, 'message' => 'No media found.'], 404);
        }

        $mediaFiles = $messages->pluck('file');

        return response()->json(['status' => 200, 'data' => $mediaFiles], 200);
    }

    public function get_msg_by_sender($sender_id)
    {
        $msg = Msg::where('sender_id', $sender_id)->get();

        if ($msg->isNotEmpty()) {
            return response()->json(['status' => 200, 'data' => $msg], 200);
        } else {
            return response()->json(['status' => 404, 'message' => 'Messages not found'], 404);
        }
    }
    public function get_last_message($sender_id)
    {
        $message = Msg::where('sender_id', $sender_id)
        ->orderBy('created_at', 'desc')
            ->first();

        if ($message) {
            return response()->json(['status' => 200, 'data' => $message], 200);
        } else {
            return response()->json(['status' => 404, 'message' => 'No messages found'], 404);
        }
    }




}
