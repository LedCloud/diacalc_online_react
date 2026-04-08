<?php

use App\Classes\Diacalc\Glucose;
use Illuminate\Support\Facades\Auth;
use Livewire\Component;
use Livewire\Attributes\Validate;

new class extends Component
{
    #[Validate('required|string')]
    public $time;

    #[Validate('required|numeric|min:0.01')]
    public $k1;

    #[Validate('required|numeric|min:0.0')]
    public $k2;

    #[Validate('required|numeric|min:0.01')]
    public $k3;

    public $factors;

    public function boot()
    {
        $this->k1 = 1;
        $this->k2 = 0;
        $this->k3 = 2;
    }

    public function mount()
    {
        $this->factors = Auth::user()->factors;
    }

    public function save()
    {
        $this->validate();
        //create factors

        $data = [
            'time' => $this->time,
            'k1' => $this->k1,
            'k2' => $this->k2,
            'k3' => (new Glucose(5.6))
                ->setGlucose($this->k3)
                ->getRawValue(),
        ];

        Auth::user()->factors()->create($data);

        session()->flash('notification', __('coefs.created'));

        redirect()->route('coefs');
    }
};
