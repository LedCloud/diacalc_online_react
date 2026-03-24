<?php

namespace App\Classes\Settings;

class UserSettings extends SettingBase
{
    protected $settingName = 'DiacalcUser';

    protected const DEFAULT = [ //TODO make it possible to be changed
        'menu_info' => 152,
        'round_to' => 0,
        'is_plasma' => 1,
        'is_mmol' => 1,
        'target' => 5.6,
        'use_freq' => 1,
        'freq_qty' => 15,
        'filter_off' => 25,
        'k3_factor' => 187,
        'weight' => 60,
        'factors_by_time' => 0,
        'calory_limit' => 2000,
        'low_level' => 4.0,
        'high_level' => 8,
        'period' => 7,
    ];

    public function setValues($values)
    {
        parent::setValues($this->params);
    }

    public function __get(string $name)
    {
        $this->loadParams();

        if (array_key_exists($name, $this->params)) {
            return $this->params[$name];
        }

        return null;
    }
    public function __set(string $name, mixed $value)
    {
        $this->loadParams();

        if (array_key_exists($name, $this->params)) {
            $this->params[$name] = $value;
        }
    }
}
