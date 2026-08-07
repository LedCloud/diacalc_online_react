<?php

namespace App\Console\Services;

use App\Models\User;
use Illuminate\Support\Carbon;
use Illuminate\Support\Collection;
use Illuminate\Support\Facades\DB;

class CopyUsersService
{
    public function copyUsers(array &$map)
    {
        //get from map those we need to create only
        $absent = array_filter($map, fn($r) => !isset($r['id']));

        if (empty($absent)) {
            return;
        }

        $absent_ids = array_column($absent, 'old_id');

        //get only those, who is not created yet
        $oldUsers = DB::connection('old_diacalc')
            ->table('backup_users')
            ->whereIn('id', $absent_ids)
            ->get()
            ->keyBy('email');

        foreach ($oldUsers as $email => $oldUser) {
            //create user
            $data = [
                'name' => $oldUser->login,
                'email' => $oldUser->email,
                'email_verified_at' => Carbon::createFromTimestamp($oldUser->lastuse),
                'password' => $oldUser->pass,
                'created_at' => now(),
                'updated_at' => now(),
            ];
            $user_id = DB::table('users')->insertGetId($data);
            $map[$email]['id'] = $user_id;
        }
    }
}
