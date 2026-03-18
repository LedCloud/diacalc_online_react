<?php

namespace App\Classes\Settings;

use App\Classes\Settings\SettingBase;
use Illuminate\Support\Facades\Log;

class ContactEmailsSetting extends SettingBase
{
    protected const DEFAULT = [
        'emails' => '',
        'use' => true,
    ];

    protected $settingName = 'Emails';

    public function getEmails()
    {
        $this->loadParams();

        return array_filter(
            array_map(function($el){return trim($el);},
                explode(',', $this->params['emails'])));
    }

    public function useEmail()
    {
        $this->loadParams();

        return $this->params['use'];
    }
    public function setValues($values) {
        $current = [
            'emails' => $this->params['emails'],
            'use' => $this->params['use'],
        ];

        $values = array_merge($current, $values);

        if (array_key_exists('emails', $values)) {
            Log::info($values['emails']);
            $values['emails'] = implode(',',
                array_filter(
                    array_map(
                        'trim',
                        explode(',', $values['emails']),
                    ),
                    fn($el) => filter_var($el, FILTER_VALIDATE_EMAIL))
            );
            Log::info($values['emails']);
        }

        parent::setValues($values);
    }
}
