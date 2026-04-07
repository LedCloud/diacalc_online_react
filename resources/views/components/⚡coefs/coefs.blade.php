
<div>
    <div class="coefs-panes">
        <x-pane :header="__('coefs.coefficients')" prefix="coefs">
            <table class="table table-responsive">
                <thead>
                    <tr>
                        <th>{{ __('coefs.time') }}</th>
                        <th>{{ __('coefs.k1') }}</th>
                        <th>{{ __('coefs.k2') }}</th>
                        <th>{{ __('coefs.k3') }}</th>
                        <th></th>
                    </tr>
                </thead>
                <tbody>
                    @foreach($factors as $factor)
                        <tr wire:key="factor-{{ $factor->id }}">
                            <td>
                                {{ $factor->time->format('H:i') }}
                            </td>
                            <td>
                                {{ $factor->k1 }}
                            </td>
                            <td>
                                {{ $factor->k2 }}
                            </td>
                            <td>
                                {{ $factor->k3 }}
                            </td>
                            <td wire:key="dropdown-td-{{ $factor->id }}">

                                <x-dropdown align="right" width="48" wire:ignore.self
                                            wire:key="dropdown-{{ $factor->id }}">
                                    <x-slot name="trigger">
                                        <button class="text-gray-400 hover:text-gray-600 transition">
                                            <svg class="h-5 w-5" fill="currentColor" viewBox="0 0 20 20">
                                                <path d="M10 6a2 2 0 110-4 2 2 0 010 4zM10 12a2 2 0 110-4 2 2 0 010 4zM10 18a2 2 0 110-4 2 2 0 010 4z" />
                                            </svg>
                                        </button>
                                    </x-slot>

                                    <x-slot name="content" >
                                        <button type="button" wire:click="deleteFactor()"
                                                wire:key="delete-factor-btn-{{ $factor->id }}"
                                        >
                                            {{ __('Edit') }}
                                        </button>

                                        <!-- Удаление через форму внутри выпадающего списка -->
                                        <form action="{{ route('dashboard') }}" method="POST">
                                            @csrf
                                            @method('DELETE')
                                            <button type="submit" class="block w-full px-4 py-2 text-left text-sm leading-5 text-red-600 hover:bg-gray-100 focus:outline-none transition">
                                                {{ __('Delete') }}
                                            </button>
                                        </form>
                                    </x-slot>
                                </x-dropdown>
                            </td>
                        </tr>
                    @endforeach
                </tbody>
            </table>
        </x-pane>
        <x-pane :header="__('coefs.coefficients')" prefix="coefs">
            <fieldset>
                <div class="field">
                    <label for="weight">{{ __('coefs.weight') }} {{ $weight }}</label>
                    <input type="number" min="1" step="1"
                           key="weight-field-{{ $weight }}"
                           value="{{ $weight }}"
                           wire:model.live.debounce.250ms.number="weight" />
                </div>

                <div class="field">
                    <label for="k3_factor">{{ __('coefs.k3_factor') }}</label>
                    <input type="number" min="1" step="1" wire:model.live.debounce.250ms="k3_factor" />
                </div>
                <button class="btn"
                        type="button"
                        wire:click="calculateFactors"
                >{{ __('coefs.calc_factors') }}</button>
                <div class="notice">{{ __('coefs.calculate_explain') }}</div>
            </fieldset>
        </x-pane>

    </div>
    <x-notice />
</div>
