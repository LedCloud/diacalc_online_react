<?php

namespace App\Classes;

class MenuStructure
{
    const structure = [
        [
            'route' => 'dashboard',
            'name' => 'Dashboard',
        ],
        [
            'name' => 'Settings',
            'submenu' => [
                ['route' => 'settings', 'name' => 'Settings'],
                ['route' => 'coefs', 'name' => 'Factors'],
            ],
        ],
    ];

    public static function getMenuStructure()
    {
        return self::structure;
    }
}
