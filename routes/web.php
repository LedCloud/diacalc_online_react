<?php

use App\Http\Controllers\ProfileController;
use App\Http\Middleware\MenuStructure;
use Illuminate\Support\Facades\Route;
use Illuminate\Support\Facades\Auth;

Route::get('/', function () {
    if (Auth::check()) {
        return redirect()->route('dashboard');
    }
    return view('welcome');
})->name('home');

Route::get('/dashboard', function () {
    return view('dashboard');
})->middleware([MenuStructure::class])
    ->middleware(['auth', 'verified'])
    ->name('dashboard');

Route::middleware(['auth', MenuStructure::class])->group(function () {
    Route::get('/profile', [ProfileController::class, 'edit'])->name('profile.edit');
    Route::patch('/profile', [ProfileController::class, 'update'])->name('profile.update');
    Route::delete('/profile', [ProfileController::class, 'destroy'])->name('profile.destroy');

    Route::livewire('/settings', 'pages::settings')->name('settings');

    Route::livewire('/factors', 'pages::factors')->name('factors');
    Route::livewire('/factors/create', 'pages::factors.create')->name('factors.create');
    Route::livewire('/factors/{id}/edit', 'pages::factors.create')->name('factors.edit');

    Route::livewire('/calculations', 'pages::calculations')->name('calculations');

    Route::get('/twoinputs', fn()=> view('twoinputs'))->name('twoinputs');
});



require __DIR__.'/auth.php';
