<?php

use Illuminate\Support\Facades\Auth;
use Illuminate\Support\Facades\Log;
use Livewire\Component;

new class extends Component {
    const MENU = 'menu';
    const GLUCOSE = 'glucose';
    const PRODUCTS = 'products';

    const MASK_PROT = 1;
    const MASK_FAT = 2;
    const MASK_CARB = 4;
    const MASK_BE = 8;
    const MASK_DOSE = 16;
    const MASK_GI = 32;
    const MASK_GL = 64;
    const MASK_CALOR = 128;


    public $section = '';
    public $settings = null;
    public array $selectedMasks = [];

    // Вызываем перед сохранением или в updated
    public function updatedSelectedMasks()
    {
        // Складываем все значения массива: [2, 4] -> 6
        $this->settings['menu_info'] = array_sum($this->selectedMasks);
    }
    public function mount()
    {
        $this->section = self::MENU;
        $this->settings = Auth::user()->getSetting('User');

        // Например, если в БД 6, превращаем в [2, 4]
        foreach ($this->collectAllMasks() as $bit) {
            if ($this->settings['menu_info'] & $bit) {
                $this->selectedMasks[] = (string)$bit;
            }
        }
    }

    protected function collectAllMasks()
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

    public function save()
    {
        Auth::user()->putSetting('User', $this->settings);



        $toast_msg = [
            'title' => 'Settings',
            'message' => 'Settings were saved',
            'is_success' => true,
        ];
        session()->flash('notification', 'Post successfully updated.');
        return;
//        Log::info('Create a toast', $toast);
        $this->dispatch('toast_msg',toast_msg: $toast_msg)->to('toast-msg');
    }

    public function setSection($sectionName)
    {
        Log::info('Clicked', [$sectionName]);
        $available = [
            self::MENU, self::GLUCOSE, self::PRODUCTS
        ];

        if (in_array($sectionName, $available)) {
            Log::info('Yes, I set section');
            $this->section = $sectionName;
        }
    }
};
?>

<div>
    <form class="settings__form" wire:submit="save">
        <div class="tabs">
            <button type="button"
                    wire:click="$set('section', 'menu')"
                    class="tab-btn {{ $section === 'menu' ? 'active' : '' }}"
                    data-target="tab-menu">menu
            </button>
            <button type="button"
                    wire:click="$set('section', 'glucose')"
                    class="tab-btn {{ $section === 'glucose' ? 'active' : '' }}"
                    data-target="tab-glucose">Glucose
            </button>
            <button type="button"
                    wire:click="$set('section', 'products')"
                    class="tab-btn {{ $section === 'products' ? 'active' : '' }}"
                    data-target="tab-products">Products
            </button>

            <!-- Контент вкладок -->
            <div class="tab-content">
                <div id="tab-menu" class="tab-pane {{ $section === 'menu' ? 'active' : '' }}">

                    <fieldset>
                        <legend>Info in menu</legend>
                        <label for="menu-prot">
                            <input id="menu-prot"
                               wire:model.live="selectedMasks"
                               value="{{ $this::MASK_PROT }}"
                              type="checkbox"/>Proteins</label>
                        <label for="menu-fat"><input id="menu-fat"
                                                     wire:model.live="selectedMasks"
                                                     value="{{ $this::MASK_FAT }}"
                             type="checkbox"/>Fats</label>
                        <label for="menu-carb"><input id="menu-carb"
                                                      wire:model.live="selectedMasks"
                                                      value="{{ $this::MASK_CARB }}"
                              type="checkbox"/>Carbs</label>
                        <label for="menu-be"><input id="menu-be"
                                                    wire:model.live="selectedMasks"
                                                    value="{{ $this::MASK_BE }}"
                                type="checkbox"/>BE</label>
                        <label for="menu-dose"><input id="menu-dose"
                                                      wire:model.live="selectedMasks"
                                                      value="{{ $this::MASK_DOSE }}"
                              type="checkbox"/>Dose</label>
                        <label for="menu-gi"><input id="menu-gi"
                                                    wire:model.live="selectedMasks"
                                                    value="{{ $this::MASK_GI }}"
                            type="checkbox"/>GI</label>
                        <label for="menu-gl"><input id="menu-gl"
                                                    wire:model.live="selectedMasks"
                                                    value="{{ $this::MASK_GL }}"
                            type="checkbox"/>GL</label>
                        <label for="menu-calory"><input id="menu-calory"
                                                        wire:model.live="selectedMasks"
                                                        value="{{ $this::MASK_CALOR }}"
                            type="checkbox"/>Calory</label>
                    </fieldset>

                </div>
                <div id="tab-glucose" class="tab-pane {{ $section === 'glucose' ? 'active' : '' }}">
                    2
                </div>
                <div id="tab-products" class="tab-pane {{ $section === 'products' ? 'active' : '' }}">
                    3
                </div>
            </div>
        </div>
        <button class="settings__btn-save">Save</button>
        @if (session()->has('notification'))
            <div class="alert alert-success"
                 x-data="{ show: false }"
                 x-init="show = true; setTimeout(() => show = false, 3000)"
                 x-show="show"
            >
                {{ session('notification') }}
            </div>
        @endif
    </form>
</div>
