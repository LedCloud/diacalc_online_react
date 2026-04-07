<?php

namespace App\Models;

use Illuminate\Database\Eloquent\Model;
use Illuminate\Database\Eloquent\Relations\BelongsTo;

class Factors extends Model
{
    public $timestamps = false;
    protected $fillable = [
        'user_id',
        'time',
        'k1','k2','k3',
    ];

    protected $casts = [
        'time' => 'datetime',
    ];

    public function user(): BelongsTo
    {
        return $this->belongsTo(User::class);
    }
}
