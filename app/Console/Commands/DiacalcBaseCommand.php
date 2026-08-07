<?php

namespace App\Console\Commands;

use App\Models\User;
use Illuminate\Console\Command;
use Illuminate\Support\Collection;
use Illuminate\Support\Facades\DB;
use Symfony\Component\Console\Input\InputInterface;
use Symfony\Component\Console\Output\OutputInterface;

abstract class DiacalcBaseCommand extends Command
{
    // Use a static property so the database is only queried ONCE if running diacalc:all
    protected static ?array $sharedUsersMap = null;
    protected ?array $usersMap = null;

    /**
     * Initializes the command after the input has been bound and before the input
     * is validated.
     *
     * This is mainly useful when a lot of commands extends one main command
     * where some things need to be initialized based on the input arguments and options.
     *
     * @see InputInterface::bind()
     * @see InputInterface::validate()
     *
     * @return void
     */
    protected function initialize(InputInterface $input, OutputInterface $output): void
    {
        // Always call the parent initialize method to respect Laravel's core framework setup
        parent::initialize($input, $output);

        // Fetch from database only if the static map is completely empty
        if (self::$sharedUsersMap === null) {
            $emails = \DB::connection('old_diacalc')
                ->table('backup_users')
                ->pluck('id', 'email')
                ->toArray();

            $users = \App\Models\User::whereIn('email', array_keys($emails))
                ->get()
                ->keyBy('email');

            self::$sharedUsersMap = [];
            foreach ($emails as $email => $old_id) {
                $existing_user = $users->get($email);

                self::$sharedUsersMap[$email] = [
                    'old_id' => $old_id,
                    'id' => $existing_user ? $existing_user->id : null,
                ];
            }
        }

        // Set the local property so the child class can access it directly as $this->usersMap
        $this->usersMap = self::$sharedUsersMap;
    }

    /*/** create a map of old users and already existing users
     * 'old@email.com' => [
     *   'old_id' => 1,
     *   'id' => 2|null,
     * ]
     */
    /*protected function makeUsersMap():void
    {
        if (!empty(self::$usersMap)) {
            return;
        }

        $emails = DB::connection('old_diacalc')
            ->table('backup_users')
            ->pluck('id', 'email')
            ->toArray();

        $users = User::whereIn('email', array_keys($emails))->get();

        self::$usersMap = [];
        foreach($emails as $email => $old_id) {

            self::$usersMap[$email] = [
                'old_id' => $old_id,
            ];
            $existing_user = $users->where('email', $email)->first();
            if ($existing_user) {
                self::$usersMap[$email]['id'] = $existing_user->id;
            }
        }
    }*/
}
