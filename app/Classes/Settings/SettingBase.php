<?php

namespace App\Classes\Settings;

use App\Models\Setting;
use App\Models\User;
use Illuminate\Support\Facades\Log;
use Illuminate\Support\Facades\Validator;
use Illuminate\Support\Str;

abstract class SettingBase
{
    protected const DEFAULT = [];

    protected $settingName;

    protected ?array $params = null;

    public function __construct()
    {
        $this->params = $this->getValues();
    }

    /**
     * Загружаем в переменную данные, чтобы не дергать лишний раз БД
     * @return void
     */
    protected function loadParams()
    {
        if (!isset($this->params)) {
            $this->params = $this->getValues();
        }
    }

    /**
     * Вынимаем параметры для ключа
     * @return array|false|null
     */
    public function getValues(): ?array
    {
        $record = auth()->user()->setting()->firstWhere('key', $this->settingName);

        if (isset($record)) {
            $recDecoded = json_decode($record->values, true);
            return $recDecoded;
        }

        return static::DEFAULT;
    }

    /**
     * По ключу сохраняем в базу массив, переводя его в json
     * @param array $values
     * @return void
     */
    public function setValues(array $values)
    {
        Setting::updateOrCreate(
            ['key' => $this->settingName],
            ['values' => json_encode(array_merge($this->getValues(), $values))]
        );
    }
}
