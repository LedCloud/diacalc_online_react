<?php

namespace App\Classes;

class MenuStructure
{
    const structure = [
        [
            'route' => 'dashboard',
            'name' => 'Dashboard',
            'livewire' => false,
        ],
        [
            'name' => 'Settings',
            'route' => 'settings',
            'livewire' => true,
        ],
        [
            'name' => 'Settings React',
            'route' => 'settings.react',
            'livewire' => false,
        ],
        [
            'name' => 'Settings Sub',
            'submenu' => [
                ['route' => 'settings.react', 'name' => 'Settings', 'livewire' => false, ],
                ['route' => 'factors', 'name' => 'Factors', 'livewire' => true,],
                ['route' => 'calculations', 'name' => 'CalcReact'],
                ['route' => 'factors', 'name' => 'Calculations', 'livewire' => true,],
            ],
        ],
    ];

    public static function getMenuStructure()
    {
        return self::structure;
    }
}
