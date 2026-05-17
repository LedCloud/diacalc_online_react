<?php

namespace App\Http\Controllers;

use App\Classes\Settings\MenuInfo;
use App\Classes\Settings\UserSetting;
use Illuminate\Support\Facades\Auth;
use Illuminate\Support\Facades\Redirect;
use Inertia\Inertia;

class FactorsController extends Controller
{
    public function index()
    {
        $factors = Auth::user()->factors;
        $settings = Auth::user()->getSetting('User');

        $factors = Auth::user()->factors->map(function($e){
            $arr = $e->toArray();
            $arr['time'] = $e->time->format('H:i');
            return $arr;
        });

        return Inertia::render('Factors',[
            'factors' => $factors,
            'settings' => $settings,
        ]);
    }
}
