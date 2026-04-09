<?php

use Livewire\Component;
use Livewire\Attributes\Reactive;
use Livewire\Attributes\Computed;

new class extends Component
{
    public int $av = 2;
    public int $bv = 4;

    //as a constructor
    public function mount()
    {
        $this->av = 2;
        //$this->bv = 4;
    }

    public function boot()
    {
        //$this->bv = 2 * $this->av;
    }
    public function render()
    {
        $this->bv = 2 * $this->av;
        return $this->view([
            'bv' => $this->av * 2,
        ]);
    }

    public function changeBv()
    {
        $this->av = intval($this->bv / 2);
    }

    public function changeAv()
    {
        $this->bv = $this->av * 2;
    }
};
?>

<div>
    Two inputs
    <input type="text" x-model="$wire.av"
           x-on:change="@this.call('changeAv')"
            />
    <input type="text"
           x-model="$wire.bv"
           x-on:change="@this.call('changeBv')"
            />
    <br>
    <ul>
        <li>{{ $av }}</li>
        <li>{{ $bv }}</li>
    </ul>
    <span wire:loading>Saving...</span>
</div>
