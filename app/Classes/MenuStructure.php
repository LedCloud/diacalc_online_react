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
        /*[
            'name' => 'Settings',
            'submenu' => [
                ['route' => 'settings', 'name' => 'Settings'],
                ['route' => 'factors', 'name' => 'Factors'],
                ['route' => 'calculations', 'name' => 'Calculations'],
            ],
        ],*/
    ];

    public static function getMenuStructure()
    {
        return self::structure;
    }
}
