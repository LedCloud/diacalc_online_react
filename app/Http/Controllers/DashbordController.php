<?php

namespace App\Http\Controllers;

use App\Classes\Settings\MenuInfo;
use App\Models\Menu;
use App\Services\CalculateFactorsService;
use Illuminate\Support\Facades\Log;
use Inertia\Inertia;
use Illuminate\Http\Request;

class DashbordController
{
    public function updateFactors(Request $request)
    {
        //{"factor":{"k1":1.49,"k2":0.28,"k3":1.33929,"gl1":10.7143,"gl2":5.35714,"be":12}}
        Log::info('Got factors', $request->all());

        $validated = $request->validate([
            'factor' => 'required|array',
            'factor.k1' => 'numeric|min:0.01',
            'factor.k2' => 'numeric|min:0',
            'factor.k3' => 'numeric|min:0.01',
            'factor.gl1' => 'numeric|min:0.1',
            'factor.gl2' => 'numeric|min:0.1',
            'factor.be' => 'numeric|min:0.1',
        ]);

        $eating = auth()->user()->eating;
        $eating = array_merge($eating->toArray(), $validated);

        $setting = auth()->user()->getSetting('User');
        $setting['be'] = $validated['factor']['be'];
        auth()->user()->putSetting('User', $setting);

        Log::info('Validated', $validated);

        return redirect()->back();
    }
    public function deleteitem(Menu $menu)
    {
        // Ensure the menu belongs to the current user
        if ($menu->user_id !== auth()->id()) {
            abort(403);
        }

        $menu->delete();

        return redirect()->back();
    }
    public function update(Request $request)
    {
        Log::info('req', $request->all());

        $validated = $request->validate([
            'menu_items' => 'required|array',
            'menu_items.*.id' => 'numeric|min:1|integer',
            'menu_items.*.weight' => 'numeric|min:0|integer',
        ]);

        $current_ids = auth()->user()->menus->pluck('id')->toArray();

        $to_update = array_column($validated['menu_items'], 'id');
        $to_delete = array_diff($current_ids, $to_update);
        auth()->user()->menus()->whereIn('id', $to_delete)->delete();
        foreach($validated['menu_items'] as $menu_data) {
            auth()->user()->menus()->where('id', $menu_data['id'])->update(['weight' => $menu_data['weight']]);
        }

        return redirect()->back();
    }
    public function index()
    {
        $menus = auth()->user()->menus;
        $setting = auth()->user()->getSetting('User');

        if ($setting['factors_by_time'] && count(auth()->user()->factors)) {
            $factors = CalculateFactorsService::calculate(auth()->user()->factors);
        }

        $masks = MenuInfo::getAllNamed();
        unset($masks['true'], $masks['false']);

        //dd(auth()->user()->eating);

        return Inertia::render('Dashboard',
            [
                'eating' => auth()->user()->eating,
                'menu_items' => $menus,
                'settings' => $setting,
                'menu_masks' => $masks,
                'factors' => $factors,
            ]
        );
    }
}
