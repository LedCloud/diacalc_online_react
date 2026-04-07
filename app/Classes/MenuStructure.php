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
            'route' => 'settings',
            'name' => 'Settings',
        ],
        [
            'route' => 'coefs',
            'name' => 'Coefficients',
        ],
    ];

    public static function getMenuStructure()
    {
        return self::structure;
    }
}
