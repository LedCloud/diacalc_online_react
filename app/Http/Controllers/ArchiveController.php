<?php

namespace App\Http\Controllers;

use App\Models\ArcGroup;
use App\Models\ArcProduct;
use Inertia\Inertia;

class ArchiveController extends Controller
{
    public function index()
    {
        $groups_m = ArcGroup::all();
        $groups = array_map(fn($g) => ['id'=>$g['id'], 'name'=>$g['name']], $groups_m->toArray());

        //$products_m = $groups_m->first()->arc_products;

        return Inertia::render('Archive', [
            'groups' => $groups,
            //'productsPage' => $products_m,
        ]);
    }

    public function getProducts($groupId)
    {
        $products = ArcProduct::where('group_id', $groupId)->get();

        return response()->json($products);
    }
}
