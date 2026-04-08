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

    Route::get('/settings', fn() => view('settings') )->name('settings');
    Route::get('/coefs', fn() => view('coefs') )->name('coefs');

    Route::get('/coefs/create', fn() => view('coefs.create'))->name('coefs.create');
});



require __DIR__.'/auth.php';
