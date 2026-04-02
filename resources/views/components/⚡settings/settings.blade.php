<div>
    <form class="settings__form" wire:submit="save">
        <div class="tabs">
            <button type="button"
                    wire:click="$set('section', '{{ $this::MENU }}')"
                    class="tab-btn {{ $section === $this::MENU ? 'active' : '' }}"
                    >menu
            </button>
            <button type="button"
                    wire:click="$set('section', '{{ $this::GLUCOSE }}')"
                    class="tab-btn {{ $section === $this::GLUCOSE ? 'active' : '' }}"
                    >Glucose
            </button>
            <button type="button"
                    wire:click="$set('section', '{{ $this::PRODUCTS }}')"
                    class="tab-btn {{ $section === $this::PRODUCTS ? 'active' : '' }}"
                    >Products
            </button>

            <!-- Контент вкладок -->
{{--            <div class="tab-content">--}}
{{--                <div id="tab-menu" class="tab-pane {{ $section === $this::MENU ? 'active' : '' }}">--}}

                    <div class="tab-content menu-panes">
                        <div class="tab-pane menu-panes__pane {{ $section === $this::MENU ? 'active' : '' }}">

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
                                               value="{{ \App\Classes\Settings\MenuInfo::MASK_CARB }}"
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
                                    <label for="round-dose">Round</label>
                                    <select id="round-dose" wire:model.live="selectRound">
                                        <option value="0">No fraction</option>
                                        <option value="1">To 1/2</option>
                                        <option value="2">To 1/4</option>
                                    </select>
                                    <label for="calory_limit">Calories limit</label>
                                    <input id="calory_limit" type="number" min="1" step="1" wire:model="calory_limit"/>
                                    <div class="validation-error">@error('calory_limit') {{ $message }} @enderror</div>
                                </fieldset>
                            </div>

                        </div>

                        <div class="menu-panes__pane tab-pane {{ $section === $this::GLUCOSE ? 'active' : '' }}">
                            <div class="menu-panes__pane_header">Glucose</div>
                            <div class="menu-panes__pane_content">
                                <fieldset>
                                    <label for="plasma">
                                        <input type="radio"
                                               name="plasma"
                                            id="plasma"
                                            wire:model.live="plasma"
                                           value="{{ $this::WHOLE }}" />Whole</label>
                                    <label for="whole">
                                        <input type="radio" name="plasma"
                                           id="whole"
                                           wire:model.live="plasma"
                                               value="{{ $this::PLASMA }}" />Plasma</label>
                                </fieldset>
                                <fieldset>
                                    <label for="mmol">
                                        <input type="radio" name="mmol"
                                               id="mmol"
                                               wire:model.live="mmol"
                                               value="{{ $this::MMOL }}" />mmol</label>
                                    <label for="mgdl">
                                        <input type="radio"
                                               name="mmol"
                                               id="mgdl"
                                               wire:model.live="mmol"
                                               value="{{ $this::MGDL }}" />mg/dl</label>
                                </fieldset>

                                <div class="field" wire:key="target-id-{{ $plasma }}-{{ $mmol }}">
                                    <label for="target">Target</label>
                                    <input id="target" type="number" step="0.1" min="3"
                                           wire:model.live.blur="target"/>
                                    <div class="validation-error">@error('target') {{ $message }} @enderror</div>
                                </div>

                                <div class="field" wire:key="low-level-id-{{ now() }}">
                                    <label for="low_level">Low level</label>
                                    <input id="low_level" type="number" step="0.1" min="3" wire:model="low_level"/>
                                    <div class="validation-error">@error('low_level') {{ $message }} @enderror</div>
                                </div>

                                <div class="field" wire:key="high-level-id-{{ now() }}">
                                    <label for="high_level">High level</label>
                                    <input id="high_level" type="number" step="0.1" min="3" wire:model="high_level"/>
                                    <div class="validation-error">@error('high_level') {{ $message }} @enderror</div>
                                </div>
                            </div>
                        </div>

                        <div class="menu-panes__pane tab-pane {{ $section === $this::PRODUCTS ? 'active' : '' }}">
                            <div class="menu-panes__pane_header">Products</div>
                            <div class="menu-panes__pane_content">
                                <fieldset>
                                    <legend>Fill with the default products</legend>
                                    <button class="btn settings__btn-fill" type="button" wire:click="fillProducts">Fill with the default products</button>
                                </fieldset>
                                <label for="use_freq">
                                    <input type="checkbox" id="use_freq" wire:model="use_freq">
                                    Use freq</label>
                                <div class="field">
                                    <label for="freq_qty">Freq qty</label>
                                    <input id="freq_qty" type="number"
                                           wire:model="freq_qty"/>
                                    <div class="validation-error">@error('freq_qty') {{ $message }} @enderror</div>
                                </div>
                                <div class="field">
                                    <label for="filter_off">Filter off</label>
                                    <input id="filter_off" type="number"
                                           wire:model="filter_off"/>
                                    <div class="validation-error">@error('filter_off') {{ $message }} @enderror</div>
                                </div>
                            </div>
                        </div>
                    </div>

                </div>
        <div class="button-horizontal">
        <button class="btn settings__btn-save default" type="submit">Save</button>
        <a class="btn settings__btn-calcel" href="{{ route("dashboard") }}">Cancel</a>
        </div>
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
