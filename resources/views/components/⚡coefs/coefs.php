<?php

use Illuminate\Support\Collection;
use Illuminate\Support\Facades\Auth;
use Illuminate\Support\Facades\Log;
use Livewire\Component;
use Livewire\Attributes\Validate;
use Livewire\Attributes\Computed;

new class extends Component
{
    public $settings = null;

    #[Validate('integer|min:1')]
    public $weight;

    #[Validate('numeric|min:1')]
    public $k3_factor;

    public Collection $factors;

    #[Computed]
    public function factors()
    {
        return Auth::user()->factors;
    }

    public function boot()
    {
       // $settings = Auth::user()->getSetting('User');

    }
    public function mount()
    {
        $this->settings = Auth::user()->getSetting('User');

        $this->factors = Auth::user()->factors;

        $this->weight = $this->settings['weight'];
        $this->k3_factor = $this->settings['k3_factor'];
    }

    public function updatedK3Factor($value)
    {
        $this->k3_factor = $value;
        $this->settings['k3_factor'] = $this->k3_factor;
        Auth::user()->putSetting('User', $this->settings);
    }

    public function updatedWeight($value)
    {
        if ($value <= 0) {
            $value = 1;

        }
        $this->weight = $value;
        $this->dispatch('weight-updated');

        Log::info('Updated', [$value, $this->weight]);

        $this->settings['weight'] = $this->weight;
        Auth::user()->putSetting('User', $this->settings);
    }

    public function calculateFactors()
    {
        session()->flash('notification', __('coefs.factors_calculated'));
    }

    public function deleteFactor($id)
    {
        Log::info('Deleting', [$id]);
    }
};
