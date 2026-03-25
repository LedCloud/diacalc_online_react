<?php

namespace App\Classes\Diacalc;

class Glucose
{
    protected static $settings = null;

    protected $value;

    protected $is_mmol = null;
    protected $is_plasma = null;

    /**
     * Value is always in mmol and whole
     * @param $value
     */
    public function __construct($value)
    {
        static::init();
        $this->value = $value;
    }

    protected static function init()
    {
        if (!isset(static::$settings)) {
            static::$settings = auth()->user()->getSetting('User');
        }
    }

    public static function convertToRaw($value, $is_mmol = null, $is_plasma = null)
    {
        static::init();

        if (!isset($is_mmol))
        {
            $is_mmol = static::$settings['is_mmol'];
        }

        if (!isset($is_plasma)) {
            $is_plasma = static::$settings['is_plasma'];
        }

        return $value / (
                (static::$settings['is_plasma'] ? 1.12 : 1) * (static::$settings['is_mmol'] ? 1 : 18)
            );
    }

    public function getRawValue()
    {
        return $this->value;
    }

    public function setGlucose($value)
    {
        //convert to mmol and whole
        $this->value = $value / (
            (static::$settings['is_plasma'] ? 1.12 : 1) * (static::$settings['is_mmol'] ? 1 : 18)
            );
    }

    public function getForView($decimal_separator = null)
    {
        if (empty($decimal_separator)) {
            $decimal_separator = '.';
        }

        if (!isset($this->is_mmol)) {
            $is_mmol = static::$settings['is_mmol'];
        } else {
            $is_mmol = $this->is_mmol;
        }

        if (!isset($this->is_plasma)) {
            $is_plasma = static::$settings['is_plasma'];
        } else {
            $is_plasma = $this->is_plasma;
        }

        $vl = $this->value * ($is_plasma ? 1.12 : 1)
            *
            ($is_mmol ? 1 : 18);

        if ($is_mmol) {
            return number_format($vl, 1, $decimal_separator, '');

        }
        return number_format($vl, 0, $decimal_separator, '');
    }

    public function setMmol(bool $is_mmol): void
    {
        $this->is_mmol = $is_mmol;
    }

    public function setPlasma(bool $is_plasma): void
    {
        $this->is_plasma = $is_plasma;
    }
}
