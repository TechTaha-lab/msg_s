<?php

namespace App\Http\Controllers;

use App\Models\Profile;
use Illuminate\Http\Request;
use Illuminate\Support\Facades\Validator;
use Illuminate\Support\Facades\Storage;

class ProfileController extends Controller
{
    public function create_profile(Request $request)
    {
        $validator = Validator::make($request->all(), [
            'user_id' => 'required|exists:users,id',
            'name' => 'required|string|max:255',
            'description' => 'required|string|max:1000',
            'image' => 'required|image|mimes:jpeg,png,jpg,gif|max:2048',
        ]);

        if ($validator->fails()) {
            return response()->json(['errors' => $validator->errors()], 400);
        }

        try {
            $imageUrl = null;

            if ($request->hasFile('image')) {
                $image = $request->file('image');
                $imageName = time() . '_' . $image->getClientOriginalName();
                $imagePath = $image->storeAs('profiles', $imageName, 'public');
                $imageUrl = asset('storage/' . $imagePath);
            }

            $profile = Profile::create([
                'user_id' => $request->user_id,
                'name' => $request->name,
                'description' => $request->description,
                'image' => $imageUrl,
            ]);

            return response()->json(['message' => 'Profile created successfully', 'profile' => $profile], 201);
        } catch (\Exception $e) {
            return response()->json(['error' => 'Something went wrong', 'details' => $e->getMessage()], 500);
        }
    }

    public function delete_profile($id)
    {
        $profile = Profile::find($id);

        if (!$profile) {
            return response()->json(["status" => 404, "msg" => "Profile Not Found"], 404);
        }

        if ($profile->image) {
            $imagePath = str_replace(asset('storage/'), '', $profile->image);
            Storage::disk('public')->delete($imagePath);
        }

        $profile->delete();

        return response()->json(["status" => 200, "msg" => "Profile deleted successfully"]);
    }

    public function update_profile(Request $request, $id)
    {
        $profile = Profile::find($id);

        if (!$profile) {
            return response()->json(["status" => 404, "msg" => "Profile Not Found"], 404);
        }

        $validator = Validator::make($request->all(), [
            'name' => 'sometimes|string|max:255',
            'description' => 'sometimes|string|max:1000',
            'image' => 'sometimes|image|mimes:jpeg,png,jpg,gif|max:2048',
        ]);

        if ($validator->fails()) {
            return response()->json(['errors' => $validator->errors()], 400);
        }

        try {
            if ($request->hasFile('image')) {
                if ($profile->image) {
                    $oldImagePath = str_replace(asset('storage/'), '', $profile->image);
                    Storage::disk('public')->delete($oldImagePath);
                }

                $image = $request->file('image');
                $imageName = time() . '_' . $image->getClientOriginalName();
                $imagePath = $image->storeAs('profiles', $imageName, 'public');
                $profile->image = asset('storage/' . $imagePath);
            }

            if ($request->has('name')) {
                $profile->name = $request->name;
            }

            if ($request->has('description')) {
                $profile->description = $request->description;
            }

            $profile->save();

            return response()->json(["status" => 200, "msg" => "Profile updated successfully", "profile" => $profile]);
        } catch (\Exception $e) {
            return response()->json(['error' => 'Something went wrong', 'details' => $e->getMessage()], 500);
        }
    }
    public function get_profiles()
    {
        $profiles = Profile::all();
        return response()->json(["status" => 200, "profiles" => $profiles]);
    }
    public function get_profile_by_user_id($user_id)
{
    $profile = Profile::where('user_id', $user_id)->first();

    if (!$profile) {
        return response()->json(["status" => 404, "msg" => "Profile Not Found"], 404);
    }

    return response()->json(["status" => 200, "profile" => $profile]);
}

    
}
