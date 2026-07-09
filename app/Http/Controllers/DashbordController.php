<?php

namespace App\Http\Controllers;

use App\Classes\Settings\MenuInfo;
use Inertia\Inertia;

class DashbordController
{
    public function index()
    {
        $menus = auth()->user()->menus;
        $setting = auth()->user()->getSetting('User');

        return Inertia::render('Dashboard',
            [
                'menu_items' => $menus,
                'settings' => $setting,
                'menu_masks' => MenuInfo::getAllNamed(),
            ]
        );
    }
}
