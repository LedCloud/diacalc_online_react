<div>&nbsp
    @if (!empty($toasts))
    <div class="flex flex-col absolute top-5 right-5">
        @foreach($toasts as $toast)
        <div
             wire:key="toast-{{ $toast['id'] }}"
             class="toasts mb-4">
            <div class="flex space-x-2 justify-center">
                <div
                    class="bg-white shadow-lg mx-auto w-64 max-w-full text-sm pointer-events-auto bg-clip-padding rounded-lg block"
                    id="static-example" role="alert"
                    aria-live="assertive"
                    aria-atomic="true" data-mdb-autohide="false">
                    <div
                        class="@if($toast['success']) bg-green-100 @else bg-orange-100 @endif flex justify-between items-center py-2 px-3 bg-clip-padding border-b border-gray-200 rounded-t-lg">
                        <p class="font-bold text-gray-500">{{ $toast['title'] }}</p>
                        <div class="flex items-center">
                            <button type="button"
                                    wire:click="closeToast('{{ $toast['id'] }}')"
                                    class="btn-close box-content w-4 h-4 ml-2 text-black border-none rounded-none opacity-50 focus:shadow-none focus:outline-none focus:opacity-100 hover:text-black hover:opacity-75 hover:no-underline"
                                    data-mdb-dismiss="toast" aria-label="Close"
                            >X
                            </button>
                        </div>
                    </div>
                    <div class="p-3 @if($toast['success']) bg-green-50 @else bg-orange-50 @endif rounded-b-lg break-words text-gray-700">
                        {{ $toast['message'] }}
                    </div>
                </div>
            </div>
        </div>
        @endforeach
    </div>
    @endif
</div>
