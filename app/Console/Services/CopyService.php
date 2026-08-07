<?php

namespace App\Console\Services;

use App\Models\ArcGroup;
use Illuminate\Support\Carbon;
use Illuminate\Support\Facades\DB;

class CopyService
{
    /**
     * It keeps the map between the old users and created in the new DB
     * It should be initiated before use @see copyUsers
     * It can be changed
     * @var array|null
     */
    protected ?array $usersMap = null;

    protected function initUsersmap()
    {
        if ($this->usersMap === null) {
            $emails = \DB::connection('old_diacalc')
                ->table('backup_users')
                ->pluck('id', 'email')
                ->toArray();

            $users = \App\Models\User::whereIn('email', array_keys($emails))
                ->get()
                ->keyBy('email');

            $this->usersMap = [];
            foreach ($emails as $email => $old_id) {
                $existing_user = $users->get($email);

                $this->usersMap[$email] = [
                    'old_id' => $old_id,
                    'id' => $existing_user ? $existing_user->id : null,
                ];
            }
        }
    }

    public function copyArchive()
    {
        $groups = DB::connection('old_diacalc')
            ->table('arcgroups')
            ->select('id', 'name')
            ->get();

        $products = DB::connection('old_diacalc')
            ->table('arcprods')
            ->select(['id', 'idgroup', 'name', 'prot', 'fat', 'carb', 'gi'])
            ->get()
            ->groupBy('idgroup');

        foreach ($groups as $group) {
            $arc_group = new ArcGroup;
            $arc_group->name = $group->name;
            $arc_group->save();

            $products->get($group->id, collect([]))
                ->map(fn($p) => [
                    'group_id' => $arc_group->id,
                    'name'     => $p->name,
                    'prot'     => $p->prot,
                    'fat'      => $p->fat,
                    'carb'     => $p->carb,
                    'gi'       => $p->gi,
                ])
                ->whenNotEmpty(function ($parts) {
                    DB::table('arc_products')->insert($parts->toArray());
                });
        }
    }

    public function copyUsers()
    {
        $this->initUsersmap();

        $absentUsers = collect($this->usersMap)->filter(fn($r) => !isset($r['id']));
        if ($absentUsers->isEmpty()) {
            return;
        }

        $absent_ids = $absentUsers->pluck('old_id')->toArray();

        // 4. Fetch the records from the old database
        $oldUsers = DB::connection('old_diacalc')
            ->table('backup_users')
            ->whereIn('id', $absent_ids)
            ->get();

        //get only those, who is not created yet
        foreach ($oldUsers as $oldUser) {
            $user_id = DB::table('users')->insertGetId([
                'name' => $oldUser->login,
                'email' => $oldUser->email,
                'email_verified_at' => Carbon::createFromTimestamp($oldUser->lastuse),
                'password' => $oldUser->pass,
                'created_at' => now(),
                'updated_at' => now(),
            ]);

            $this->usersMap[$oldUser->email]['id'] = $user_id;
        }
    }
}
