<?php

namespace App\Http\Controllers;

use App\Classes\Settings\MenuInfo;
use App\Services\CalculateFactorsService;
use Inertia\Inertia;

class DashbordController
{
    public function index()
    {
        $menus = auth()->user()->menus;
        $setting = auth()->user()->getSetting('User');

        if ($setting['factors_by_time'] && count(auth()->user()->factors)) {
            $factors = CalculateFactorsService::calculate(auth()->user()->factors);
        }

        $masks = MenuInfo::getAllNamed();
        unset($masks['true'], $masks['false']);

        return Inertia::render('Dashboard',
            [
                'menu_items' => $menus,
                'settings' => $setting,
                'menu_masks' => $masks,
                'factors' => $factors,
            ]
        );
    }
}
