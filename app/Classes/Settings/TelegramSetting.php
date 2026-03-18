<?php

namespace App\Classes\Settings;

class TelegramSetting extends SettingBase
{
    protected const DEFAULT = [
        'botId' => '',
        'groupId' => '',
        'enabled' => false,
    ];

    protected $settingName = 'telegram';

    public function isEnabled()
    {
        $this->loadParams();

        return $this->params['enabled'];
    }

    public function getBotId()
    {
        $this->loadParams();

        return $this->params['botId'];
    }

    public function getGroupId()
    {
        $this->loadParams();

        return $this->params['groupId'];
    }
}
