<?php

use Illuminate\Support\Facades\Auth;
use Illuminate\Support\Facades\Log;
use Livewire\Component;
use App\Classes\Settings\MenuInfo;
use App\Classes\Diacalc\Glucose;

new class extends Component {
    const MENU = 'menu';
    const GLUCOSE = 'glucose';
    const PRODUCTS = 'products';

    public $section = '';
    public $settings = null;
    public array $selectedMasks = [];
    public int $selectRound = 0;
    public int $calory_limit = 0;
    public bool $is_plasma = true;
    public bool $is_mmol = false;
    public float $target = 0;
    public float $low_level = 0;
    public float $high_level = 0;

    protected function recalculate()
    {
        $raw = Glucose::convertToRaw($this->target, $this->is_mmol, $this->is_plasma);

        $gl = new Glucose($raw);
        $gl->setMmol($this->is_mmol);
        $gl->setPlasma($this->is_plasma);

        $this->target = $gl->getForView();
    }

    public function updatedSelectedMasks()
    {
        $this->settings['menu_info'] = array_sum($this->selectedMasks);
    }

    public function updatedSelectRound()
    {
        $this->settings['round_to'] = $this->selectRound;
    }

    public function updatedCaloryLimit()
    {
        $this->settings['calory_limit'] = $this->calory_limit;
    }

    public function updatedTarget()
    {
        $this->settings['target'] = Glucose::convertToRaw($this->target);
    }

    public function updatedLowLevel()
    {
        $this->settings['low_level'] = Glucose::convertToRaw($this->low_level);
    }

    public function updatedHighLevel()
    {
        $this->settings['high_level'] = Glucose::convertToRaw($this->high_level);
    }

    public function updatedIsPlasma()
    {
        $this->settings['is_plasma'] = $this->is_plasma;
        $this->recalculate();
    }

    public function updatedIsMmol()
    {
        $this->settings['is_mmol'] = $this->is_mmol;
        $this->recalculate();
    }

    public function mount()
    {
        $this->section = self::MENU;
        $this->settings = Auth::user()->getSetting('User');

        foreach (MenuInfo::getAll() as $bit) {
            if ($this->settings['menu_info'] & $bit) {
                $this->selectedMasks[] = (string)$bit;
            }
        }
        Log::info('In mount', $this->settings);
        $this->selectRound = $this->settings['round_to'];
        $this->calory_limit = $this->settings['calory_limit'];
        $this->is_plasma = $this->settings['is_plasma'];
        $this->is_mmol = $this->settings['is_mmol'];
        $t = new \App\Classes\Diacalc\Glucose($this->settings['target']);
        $this->target = $t->getForView();
        $t = new \App\Classes\Diacalc\Glucose($this->settings['low_level']);
        $this->low_level = $t->getForView();
        $t = new \App\Classes\Diacalc\Glucose($this->settings['high_level']);
        $this->high_level = $t->getForView();
    }

    public function save()
    {
        Auth::user()->putSetting('User', $this->settings);
        session()->flash('notification', 'Settings saved');
    }

    public function setSection($sectionName)
    {
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
                    wire:click="$set('section', $this::MENU)"
                    class="tab-btn {{ $section === $this::MENU ? 'active' : '' }}"
                    data-target="tab-menu">menu
            </button>
            <button type="button"
                    wire:click="$set('section', $this::GLUCOSE)"
                    class="tab-btn {{ $section === $this::GLUCOSE ? 'active' : '' }}"
                    data-target="tab-glucose">Glucose
            </button>
            <button type="button"
                    wire:click="$set('section', $this::PRODUCTS)"
                    class="tab-btn {{ $section === $this::PRODUCTS ? 'active' : '' }}"
                    data-target="tab-products">Products
            </button>

            <!-- Контент вкладок -->
            <div class="tab-content">
                <div id="tab-menu" class="tab-pane {{ $section === $this::MENU ? 'active' : '' }}">

{{--                    Divide this panel into three panes--}}
                    <div class="menu-panes">
                        <div class="menu-panes__pane">
                            <div class="menu-panes__pane_header">Menu information</div>
                            <div class="menu-panes__pane_content">
                                <fieldset>
                                    <legend>Info in menu</legend>
                                    <label for="menu-prot">
                                        <input id="menu-prot"
                                               wire:model.live="selectedMasks"
                                               value="{{ \App\Classes\Settings\MenuInfo::MASK_PROT }}"
                                               type="checkbox"/>Proteins</label>
                                    <label for="menu-fat">
                                        <input id="menu-fat"
                                               wire:model.live="selectedMasks"
                                               value="{{ \App\Classes\Settings\MenuInfo::MASK_FAT }}"
                                               type="checkbox"/>Fats</label>
                                    <label for="menu-carb">
                                        <input id="menu-carb"
                                               wire:model.live="selectedMasks"
                                               value="{{ MenuInfo::MASK_CARB }}"
                                               type="checkbox"/>Carbs</label>
                                    <label for="menu-be">
                                        <input id="menu-be"
                                               wire:model.live="selectedMasks"
                                               value="{{ \App\Classes\Settings\MenuInfo::MASK_BE }}"
                                               type="checkbox"/>BE</label>
                                    <label for="menu-dose">
                                        <input id="menu-dose"
                                               wire:model.live="selectedMasks"
                                               value="{{ \App\Classes\Settings\MenuInfo::MASK_DOSE }}"
                                               type="checkbox"/>Dose</label>
                                    <label for="menu-gi">
                                        <input id="menu-gi"
                                               wire:model.live="selectedMasks"
                                               value="{{ \App\Classes\Settings\MenuInfo::MASK_GI }}"
                                               type="checkbox"/>GI</label>
                                    <label for="menu-gl">
                                        <input id="menu-gl"
                                               wire:model.live="selectedMasks"
                                               value="{{ \App\Classes\Settings\MenuInfo::MASK_GL }}"
                                               type="checkbox"/>GL</label>
                                    <label for="menu-calory">
                                        <input id="menu-calory"
                                               wire:model.live="selectedMasks"
                                               value="{{ \App\Classes\Settings\MenuInfo::MASK_CALOR }}"
                                               type="checkbox"/>Calory</label>
                                </fieldset>
                                <fieldset>
                                    {{--                        <legend>Round dose to</legend>--}}
                                    <label for="round-dose">Round</label>
                                    <select id="round-dose" wire:model.live="selectRound">
                                        <option value="0">No fraction</option>
                                        <option value="1">To 1/2</option>
                                        <option value="2">To 1/4</option>
                                    </select>
                                    <label for="calory_limit">Calories limit</label>
                                    <input id="calory_limit" type="number" min="1" step="1" wire:model="calory_limit"/>
                                </fieldset>
                            </div>

                        </div>
                        <div class="menu-panes__pane">
                            <div class="menu-panes__pane_header">Glucose</div>
                            <div class="menu-panes__pane_content">
                                <fieldset>
                                    <label for="is_plasma_false">
                                        <input type="radio" name="is_plasma"
                                            id="is_plasma_false"
                                            wire:model.live="is_plasma" value="0" />Whole</label>
                                    <label for="is_plasma_true">
                                        <input type="radio" name="is_plasma"
                                           id="is_plasma_true"
                                           wire:model.live="is_plasma" value="1" />Plasma</label>
                                </fieldset>
                                <fieldset>
                                    <label for="is_mmol_true">
                                        <input type="radio" name="is_mmol"
                                               id="is_mmol_true"
                                               wire:model.live="is_mmol" value="1" />mmol</label>
                                    <label for="is_mmol_false">
                                        <input type="radio"
                                               name="is_mmol"
                                               id="is_mmol_false"
                                               wire:model.live="is_mmol" value="0" />mg/dl</label>
                                </fieldset>

                                <div class="field" wire:key="target-id-{{ $is_plasma ? '1' : '0' }}-{{ $is_mmol ? '1' : '0' }}">
                                    <label for="target">Target</label>
                                    <input id="target" type="number" step="0.1" min="1" wire:model="target"/>
                                </div>

                                <div class="field" wire:key="low-level-id-{{ now() }}">
                                    <label for="low_level">Low level</label>
                                    <input id="low_level" type="number" step="0.1" min="1" wire:model="low_level"/>
                                </div>

                                <div class="field" wire:key="high-level-id-{{ now() }}">
                                    <label for="high_level">High level</label>
                                    <input id="high_level" type="number" step="0.1" min="1" wire:model="high_level"/>
                                </div>
                            </div>
                        </div>
                        <div class="menu-panes__pane">third</div>
                    </div>

                </div>
                <div id="tab-glucose" class="tab-pane {{ $section === $this::GLUCOSE ? 'active' : '' }}">
                    2
                </div>
                <div id="tab-products" class="tab-pane {{ $section === $this::PRODUCTS ? 'active' : '' }}">
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
