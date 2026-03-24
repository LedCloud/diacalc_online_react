<?php

use Illuminate\Database\Migrations\Migration;
use Illuminate\Database\Schema\Blueprint;
use Illuminate\Support\Facades\Schema;
use Illuminate\Support\Facades\DB;

return new class extends Migration
{
    /**
     * Run the migrations.
     */
    public function up(): void
    {
        Schema::table('settings', function(Blueprint $table){
            $table->unsignedBigInteger('user_id')->default(0);
        });

        $admin_id = DB::table('roles')
            ->join('role_users', 'roles.id', '=', 'role_users.role_id')
            ->join('users', 'role_users.user_id', '=', 'users.id')
            ->where('roles.slug', 'admin')
            ->get('users.id')
            ->first()->id;

        DB::table('settings')->update(['user_id' => $admin_id]);

        Schema::table('settings', function(Blueprint $table){
            $table->foreign('user_id')
                ->references('id')
                ->on('users')
                ->onDelete('cascade');
        });
    }

    /**
     * Reverse the migrations.
     */
    public function down(): void
    {
        Schema::table('settings', function(Blueprint $table) {
            $table->dropColumn('user_id');
        });
    }
};
