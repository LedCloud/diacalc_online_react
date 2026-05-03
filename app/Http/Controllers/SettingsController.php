<?php

namespace App\Http\Controllers;

use App\Classes\Settings\MenuInfo;
use App\Classes\Settings\UserSetting;
use Illuminate\Support\Facades\Auth;
use Illuminate\Support\Facades\Log;
use Illuminate\Support\Facades\Redirect;
use Illuminate\Validation\Rule;
use Inertia\Inertia;
use Illuminate\Http\Request;

class SettingsController extends Controller
{
    public function index()
    {
        if (auth()) {
            $settings = Auth::user()->getSetting('User');
        } else {
            $settings = UserSetting::DEFAULT;
        }

        return Inertia::render('Settings',[
            'settings' => $settings,
            'menuMasks' => MenuInfo::getAllNamed(),
        ]);
    }

    public function update(Request $request)
    {
        Log::info('Request', [$request]);
        $validated = $request->validate([
            'menu_info' => ['numeric', 'integer', 'min:1', 'max:255'],
            //'round_to' => ['numeric', 'integer', 'min:0', 'max:2'],
            'calory_limit' => ['numeric', 'integer', 'min:1200', ],
            'round_to' => ['numeric', Rule::in(['1', '2', '3']),],
            'is_mmol' => ['numeric', Rule::in(['1', '0'])],
            'is_plasma' => ['numeric', Rule::in(['1', '0'])],
            'target' => ['numeric', 'min:3'],
            'low_level' => ['numeric', 'min:3'],
            'high_level' => ['numeric', 'min:3'],
        ]);

        Log::info('validated', $validated);
        $settings = Auth::user()->getSetting('User');

        $formatted = [
            'menu_info' => $validated['menu_info'],
            'calory_limit' => $validated['calory_limit'],
            'round_to' => $validated['round_to'],
            'is_mmol' => intval($validated['is_mmol']),
            'is_plasma' => intval($validated['is_plasma']),
            'target' => $validated['target'],
            'low_level' => $validated['low_level'],
            'high_level' => $validated['high_level'],
        ];

        $settings = array_merge($settings, $formatted);

        Log::info('Merged', $settings);

        Auth::user()->putSetting('User', $settings);

        return Redirect::route('settings.react');
    }
}
