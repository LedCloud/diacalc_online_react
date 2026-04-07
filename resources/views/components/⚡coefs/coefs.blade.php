
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
                        <tr>
                            <td>
                                {{ $factor->time->format('H:i') }}
{{--                                @format_time($factor->time)--}}
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
                            <td>{{ $factor->id }}</td>
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
