<?php

namespace App\Console\Commands;

use App\Models\ArcGroup;
use App\Models\ArcProduct;
use App\Models\Product;
use App\Models\ProductGroup;
use Illuminate\Console\Command;
use Illuminate\Support\Carbon;
use Illuminate\Support\Facades\DB;
use App\Models\User;

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
    protected $description = 'This command will move data from the old database. It should be run once.';

    /**
     * Execute the console command.
     */
    public function handle()
    {
        if ($this->moveArchive()) {
            echo "archive moved\n";
        } else {
            echo "archive not moved, check logs\n";
        }

        if ($this->moveUsers()) {
            echo "users moved\n";
        } else {
            echo "users not moved, check logs\n";
        }
    }

    protected function moveUsers()
    {
        $oldUsers = DB::connection('old_diacalc')
            ->table('backup_users')
            ->get();
        foreach ($oldUsers as $old_user) {
            $user = User::where('email', $old_user->email)->first();
            if (!$user) {
                $data = [
                    'name' => $old_user->login,
                    'email' => $old_user->email,
                    'email_verified_at' => Carbon::createFromTimestamp($old_user->lastuse),
                    'password' => $old_user->pass,
                    'created_at' => now(),
                    'updated_at' => now(),
                ];
                $user_id = DB::table('users')->insertGetId($data);
                echo "User created: $user_id\n";
            } else {
                $user_id = $user->id;
                echo "User exists: $user_id\n";
            }
            //copy settings

            $this->moveProducts($user_id, $old_user->id);

            //copy menus
        }

        return true;
    }

    protected function moveProducts($user_id, $old_user_id)
    {
        //Now we have an id and can insert all other datas
        $groups = DB::connection('old_diacalc')
            ->table('backup_groups')
            ->where('iduser', $old_user_id)
            ->get();
        $group_ids = $groups->pluck('id');
        $products = DB::connection('old_diacalc')
            ->table('backup_prods')
            ->select('*')
            ->whereIn('idgroup', $group_ids)
            ->get();
        //create groups and products in it
        $sort_order = 1;
        foreach($groups as $group) {

            $created_gr = ProductGroup::create([
                'name' => $group->name,
                'user_id' => $user_id,
                'sort_order' => $sort_order++,
            ]);

            echo "Group is created " . $created_gr->id . "\n";

            //not complex at first
            $filtered = $products
                ->where('idgroup', $group->id)
                ->where('cmpl', 0)
                ->all();

            $prepared = array_map(fn($pr) => [
                'name' => $pr->name,
                'prot' => $pr->prot,
                'fat' => $pr->fat,
                'carb' => $pr->carb,
                'gi' => $pr->gi,
                'weight' => $pr->weight,
                'used' => $pr->usage,
                'product_group_id' => $created_gr->id,
            ], $filtered);
            if (!empty($prepared)) {
                DB::table('products')->insert($prepared);
            }
            //Now do complex products
            $complex = $products
                ->where('idgroup', $group->id)
                ->where('cmpl', 1)
                ->all();
            //Get all of them
            $complex_ids = array_column($complex, 'id');
            $complex_products = DB::connection('old_diacalc')
                ->table('backup_cmpl')
                ->whereIn('idprod', $complex_ids)
                ->get();
            foreach($complex as $compl_product) {
                //create product
                $compl_product_created = Product::create([
                    'name' => $compl_product->name,
                    'prot' => $compl_product->prot,
                    'fat' => $compl_product->fat,
                    'carb' => $compl_product->carb,
                    'gi' => $compl_product->gi,
                    'weight' => $compl_product->weight,
                    'used' => $compl_product->usage,
                    'product_group_id' => $created_gr->id,
                ]);

                $compl_content = $complex_products
                    ->where('idprod', $compl_product->id)
                    ->all();

                $prepared = array_map(fn($pr) => [
                    'name' => $pr->name,
                    'prot' => $pr->prot,
                    'fat' => $pr->fat,
                    'carb' => $pr->carb,
                    'gi' => $pr->gi,
                    'weight' => $pr->weight,
                    'product_id' => $compl_product_created->id,
                    'product_group_id' => $created_gr->id,
                ], $compl_content);
                if (!empty($prepared)) {
                    DB::table('products')->insert($prepared);
                }
            }
        }

        return true;
    }



    protected function moveArchive()
    {
        return false;
        $groups = DB::connection('old_diacalc')->select('SELECT id, name FROM arcgroups');
        if (!empty($groups)) {
            $group_ids = array_column($groups, 'id');
            $groups = array_combine($group_ids, $groups);
        }
        $products = DB::connection('old_diacalc')->select('SELECT id, idgroup, name, prot, fat, carb, gi FROM arcprods');
        foreach ($groups as $group) {
            $arc_group = new ArcGroup;
            $arc_group->name = $group->name;
            $arc_group->save();
            $group_products = array_filter($products, fn($p) => $p->idgroup == $group->id);
            $parts = [];
            if (!empty($group_products)) {
                foreach ($group_products as $product) {
                    $parts[] = [
                        'group_id' => $arc_group->id,
                        'name' => $product->name,
                        'prot' => $product->prot,
                        'fat' => $product->fat,
                        'carb' => $product->carb,
                        'gi' => $product->gi,
                    ];
                }
                DB::table('arc_products')->insert($parts);
            }
        }
        return true;
    }
}
