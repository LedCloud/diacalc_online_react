<?php

namespace App\Console\Services;

use App\Models\ArcGroup;
use Illuminate\Support\Facades\DB;

class CopyArchiveService
{
    public function copyArchive()
    {
        $groups = DB::connection('old_diacalc')
            ->table('arcgroups')
            ->select('id', 'name')
            ->get();

        $products = DB::connection('old_diacalc')
            ->table('arcproducts')
            ->select(['id', 'idgroup', 'name', 'prot', 'fat', 'carb', 'gi'])
            ->get()
            ->groupBy('idgroup');

        foreach ($groups as $group) {
            $arc_group = new ArcGroup;
            $arc_group->name = $group->name;
            $arc_group->save();

            // Safely extract the pre-grouped products collection, fallback to empty collection
            $group_products = $products->get($group->id, collect([]));

            $group_products = $group->products;
            $parts = [];
            if ($group_products->isNotEmpty()) {
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
