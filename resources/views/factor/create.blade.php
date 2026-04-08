<x-app-layout>
    <form method="post" action="{{ route('coefs.create') }}" class="mt-6 space-y-6">
        @csrf
        @method('post')
        <div class="factors-create">

            <div class="fields">
                <div class="field">
                    <label class="required" for="time">{{ __('coefs.time') }}</label>
                    <input class="@error('time') is-invalid @enderror"
                        type="text" name="time" value="{{ old('time') }}" />
                    <div class="validation-error">@error('time') {{ $message }} @enderror</div>
                </div>

{{--                <div class="field">--}}
{{--                    <label class="required" for="k1">{{ __('coefs.k1') }}</label>--}}
{{--                    <input type="text"--}}
{{--                           class="@error('k1') is-invalid @enderror"--}}
{{--                           min="0.01" step="0.01"--}}
{{--                           name="k1" value="{{ old('k1', 1.0) }}" />--}}
{{--                    <div class="validation-error">@error('k1') {{ $message }} @enderror</div>--}}
{{--                </div>--}}

{{--                <div class="field">--}}
{{--                    <label class="required" for="k2">{{ __('coefs.k2') }}</label>--}}
{{--                    <input type="number" min="0.0" step="0.01"  name="k2" value="{{ old('k2', 0.0) }}" />--}}
{{--                    <div class="validation-error">@error('k2') {{ $message }} @enderror</div>--}}
{{--                </div>--}}

{{--                <div class="field">--}}
{{--                    <label class="required" for="k3">k3</label>--}}
{{--                    <input type="number" min="0.01" step="0.01"  name="k3" value="{{ old('k3', 2.0) }}" />--}}
{{--                    <div class="validation-error">@error('k3') {{ $message }} @enderror</div>--}}
{{--                </div>--}}

                @if ($errors->any())
                    <div class="alert alert-danger">
                        <ul>
                            @foreach ($errors->all() as $error)
                                <li>{{ $error }}</li>
                            @endforeach
                        </ul>
                    </div>
                @endif
                {{ dump(session()->get('errors')) }}
                {{ dump(session()->get('success')) }}
            </div>
            <div class="hints">
                <p>{{ __('coefs.now_u_have') }}</p>
                <table class="table table-responsive">
                    <thead>
                    <tr>
                        <th>{{ __('coefs.time') }}</th>
                        <th>{{ __('coefs.k1') }}</th>
                        <th>{{ __('coefs.k2') }}</th>
                        <th>{{ __('coefs.k3') }}</th>
                    </tr>
                    </thead>
                    <tbody>
                    @foreach($factors as $factor)
                        <tr>
                            <td>
                                {{ $factor->time->format('H:i') }}
                            </td>
                            <td>
                                {{ $factor->k1formatted }}
                            </td>
                            <td>
                                {{ $factor->k2formatted }}
                            </td>
                            <td>
                                {{ $factor->k3formatted }}
                            </td>
                        </tr>
                    @endforeach
                    </tbody>
                </table>
            </div>

            <div class="button-horizontal">
                <button class="btn settings__btn-save primary" type="submit">{{ __('inputs.save') }}</button>
                <a class="btn settings__btn-cancel default" href="{{ route("coefs") }}">{{ __('inputs.cancel') }}</a>
            </div>

        </div>
    </form>

</x-app-layout>
