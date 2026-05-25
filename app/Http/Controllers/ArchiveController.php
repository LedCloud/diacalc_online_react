<?php

namespace App\Http\Controllers;

use App\Models\ArcGroup;
use Inertia\Inertia;

class ArchiveController extends Controller
{
    public function index()
    {
        $groups_m = ArcGroup::all();
        $groups = array_map(fn($g) => ['id'=>$g['id'], 'name'=>$g['name']], $groups_m->toArray());

        $products_m = $groups_m->first()->arc_products;

        return Inertia::render('Archive', [
            'groups' => $groups,
            'products' => $products_m,
        ]);
    }
}
