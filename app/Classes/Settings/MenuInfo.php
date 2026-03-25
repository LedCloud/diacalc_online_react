<?php

namespace App\Classes\Settings;

class MenuInfo
{
    const MASK_PROT = 1;
    const MASK_FAT = 2;
    const MASK_CARB = 4;
    const MASK_BE = 8;
    const MASK_DOSE = 16;
    const MASK_GI = 32;
    const MASK_GL = 64;
    const MASK_CALOR = 128;

    public static function getAll()
    {
        return [
            self::MASK_PROT,
            self::MASK_FAT,
            self::MASK_CARB,
            self::MASK_BE,
            self::MASK_DOSE,
            self::MASK_GI,
            self::MASK_GL,
            self::MASK_CALOR,
        ];
    }

    public static function isValid($key)
    {
        return in_array($key, self::getAll());
    }
}
