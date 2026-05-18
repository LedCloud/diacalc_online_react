<?php

namespace App\Http\Controllers;

use App\Classes\Settings\MenuInfo;
use App\Classes\Settings\UserSetting;
use Illuminate\Http\Request;
use Illuminate\Support\Facades\Auth;
use Illuminate\Support\Facades\Redirect;
use Illuminate\Validation\Rule;
use Inertia\Inertia;

class FactorsController extends Controller
{
    public function index()
    {
        $factors = Auth::user()->factors;
        $settings = Auth::user()->getSetting('User');

        $factors = Auth::user()->factors;
        /*$factors = Auth::user()->factors->map(function($e){
            $arr = $e->toArray();
            $time = \DateTime::createFromFormat("H:i:s");
            $arr['time'] = $time->format('H:i');
            return $arr;
        });*/

        return Inertia::render('Factors',[
            'factors' => $factors,
            'settings' => $settings,
        ]);
    }

    public function update(Request $request)
    {
        $validated = $request->validate([
            'timedFactors' => ['string', Rule::in('timed')],
        ]);

        $settings = array_merge(Auth::user()->getSetting('User'), $validated);

        Auth::user()->putSetting('User', $settings);

        session()->flash('notification', 'Settings saved');

        return Redirect::route('factors.react');
    }
}
