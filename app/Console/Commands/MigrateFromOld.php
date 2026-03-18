<?php

namespace App\Console\Commands;

use Illuminate\Console\Command;
use Illuminate\Support\Facades\DB;


class MigrateFromOld extends Command
{
    /**
     * The name and signature of the console command.
     *
     * @var string
     */
    protected $signature = 'diacalc:migrate';

    /**
     * The console command description.
     *
     * @var string
     */
    protected $description = 'This command will mirate the database from old diacalc';

    /**
     * Execute the console command.
     */
    public function handle()
    {
        DB::connection('old_mysql')->select('')
    }
}
