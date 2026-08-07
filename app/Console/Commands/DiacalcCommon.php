<?php

namespace App\Console\Commands;

use App\Console\Services\CopyService;
use App\Console\Services\CopyUsersService;
use App\Models\User;
use Illuminate\Console\Command;

class DiacalcCommon extends DiacalcBaseCommand
{
    /**
     * The name and signature of the console command.
     *
     * @var string
     */
    protected $signature = 'diacalc:all';

    /**
     * The console command description.
     *
     * @var string
     */
    protected $description = 'Do all required migations from old program to this one';

    /**
     * Execute the console command.
     */
    public function handle(CopyService $copyService)
    {
        //copy archive
        $copyService->copyArchive();
        //1 copy users only that are null in the map, change the map
        //$copyService->copyUsers(self::$sharedUsersMap);
        //2 copy settings

        //and so on

        /*$name = $this->ask('What is your name?', 'Nemo');
        $msg = "You said $name";
        $this->info($msg);
        $this->warn($msg);
        $this->line($msg); $this->line($msg);

        $this->table(
            ['Name', 'Email'],
            User::all(['name', 'email'])->toArray()
        );*/
        /*$this->error('Blah');

        return 1;*/
    }
}
