<?php

namespace App\Http\Controllers\API\Admins;

use App\Http\Controllers\Controller;
use Illuminate\Http\Request;
use App\Http\Requests\UserRequest;
use App\Http\Resources\UserResource;
use App\User;
use Illuminate\Support\Facades\Storage;
use App\Jobs\SendUsersMails;

class UserController extends Controller
{
    //create user
    public function store(UserRequest $request)
    {
        $pic_name = time() . $request->file('avatar')->getClientOriginalName();

        $path = $request->file('avatar')->storeAs(
            'public/Users/',
            $pic_name
        );
        $user = User::create([
            'name' => $request->name,
            'email' => $request->email,
            'password' => $request->password,
            'avatar' => $pic_name,
            'isAdmin' => 0,

        ]);
        if (!$user) {
            return response()->json(
                ["Error" => "Sorry,You can't create a new User as you have to fill all the required fields"],
                404
            );
        } else {
            $user->assignRole('user');
            dispatch(new SendUsersMails($request->email, $user->isAdmin))->delay(now()->addMinutes(3));
            return response()->json(
                [
                    "Success" => 'User is added successfully ^_^ ',
                    "Data:" => $user
                ],
                200
            );
        }
    }
    //delete User
    public function destroy($user)
    {
        $user = User::find($user);
        if ($user) {
            Storage::delete('/Users/Users/' . $user->avatar);
            $user->delete();
            return response()->json(
                ["success" => "User Deleted"],
                200
            );
        } else {
            return response()->json(
                ["success" => "User Not Existed"],
                400
            );
        }
    }
    //update
    public function update(Request $request, $user)
    {
        $user = User::findOrFail($user);
        if ($user) {   //delete image
            Storage::delete('/Users/Users/' . $user->avatar);
            $pic_name = time() . $request->file('avatar')->getClientOriginalName();

            $path = $request->file('avatar')->storeAs(
                'Users/Users/',
                $pic_name
            );
            $user->update([
                'name' => $request->name,
                'email' => $request->email,
                'password' => $request->password,
                'avatar' => $pic_name,
            ]);
        }
    }

    //index
    public function index()
    {
        return UserResource::collection(User::all());
    }

    //show
    public function show($id)
    {
        $user = User::where('id',$id)->first();
        if($user)
        {
            return response()->json([
                "status"=>200,
                "user"=>new UserResource($user),
            ]);
        }
        return response()->json([
            "status"=>404,
            "message"=>"Not Found"
        ]);
    }
}
