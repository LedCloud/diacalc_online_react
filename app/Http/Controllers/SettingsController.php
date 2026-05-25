<?php

namespace App\Http\Controllers;

use App\Classes\Settings\MenuInfo;
use App\Classes\Settings\UserSetting;
use App\Http\Requests\SettingsPatchRequest;
use Illuminate\Support\Facades\Auth;
use Illuminate\Support\Facades\Redirect;
use Inertia\Inertia;

class SettingsController extends Controller
{
    public function index()
    {
        if (auth()) {
            $settings = Auth::user()->getSetting('User');
        } else {
            $settings = UserSetting::DEFAULT;
        }

        /*session()->flash('notification', 'Catch me');
        session()->flash('error', 'Catch an error');
        session()->flash('warning', 'Catch a warning too')*/;

        return Inertia::render('Settings',[
            'settings' => $settings,
            'menuMasks' => MenuInfo::getAllNamed(),
        ]);
    }

    public function update(SettingsPatchRequest $request)
    {
        $validated = $request->validated();

        $settings = array_merge(Auth::user()->getSetting('User'), $validated);

        Auth::user()->putSetting('User', $settings);

        session()->flash('notification', 'Settings saved');

        return Redirect::route('settings');
    }
}
