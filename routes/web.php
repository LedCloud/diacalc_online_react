<?php

use App\Http\Controllers\ProfileController;
use Illuminate\Foundation\Application;
use Illuminate\Support\Facades\Auth;
use Illuminate\Support\Facades\Route;
use Inertia\Inertia;

Route::get('/', function () {
    return Inertia::render('Welcome', [
        'canLogin' => Route::has('login'),
        'canRegister' => Route::has('register'),
        'laravelVersion' => Application::VERSION,
        'phpVersion' => PHP_VERSION,
    ]);
});

Route::get('/dashboard', function () {
    return Inertia::render('Dashboard');
})->middleware(['auth', 'verified'])->name('dashboard');

Route::middleware('auth')->group(function () {
    Route::get('/profile', [ProfileController::class, 'edit'])->name('profile.edit');
    Route::patch('/profile', [ProfileController::class, 'update'])->name('profile.update');
    Route::delete('/profile', [ProfileController::class, 'destroy'])->name('profile.destroy');

    // Твой новый роут
    Route::get('/settings_react', function () {
        if (auth()) {
            $settings = Auth::user()->getSetting('User');
        } else {
            $settings = \App\Classes\Settings\UserSetting::DEFAULT;
        }
        return Inertia::render('Settings',[
            'settings' => $settings,
        ]);
    })->name('settings.react');

    Route::get('/calculations', function () {
        if (auth()) {
            $be = Auth::user()->eating->be;
        } else {
            $be = 10;
        }
        return Inertia::render('Calculations', [
            'user' => [
                'be' => $be,
            ],
        ]);
    })->name('calculations');

    Route::livewire('/settings', 'pages::settings')->name('settings');
    Route::livewire('/factors', 'pages::more.factors')->name('factors');
    Route::livewire('/factors/create', 'pages::more.factors.create')->name('factors.create');
    Route::livewire('/factors/{id}/edit', 'pages::more.factors.create')->name('factors.edit');
});

require __DIR__.'/auth.php';
