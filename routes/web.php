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

    //Route::get('/settings', fn() => view('settings') )->name('settings');
    //Route::get('/factors', fn() => view('factors') )->name('factors');

    Route::get('/factors/update/{$id}', fn() => view('factor.update'))->name('factors.update');
    //Route::get('/factors/create', fn() => view('factor.create'))->name('factors.create');

    Route::livewire('/page', 'pages::make.test');

    Route::livewire('/settings', 'pages::more.settings')->name('settings');
    Route::livewire('/factors', 'pages::more.factors')->name('factors');
    Route::livewire('/factors/create', 'pages::more.factors.create')->name('factors.create');
    Route::livewire('/factors/{id}/edit', 'pages::more.factors.create')->name('factors.edit');
});



require __DIR__.'/auth.php';
