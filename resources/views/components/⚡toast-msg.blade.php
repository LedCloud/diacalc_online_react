<?php

use Livewire\Component;
use Livewire\Attributes\On;

new class extends Component
{
    public const STACK_KEY = 'toasts';

    /**
     * @var array
     */
    public $toasts;

    #[On('toast_msg')]
    public function updateToastList($toast_msg)
    {
        Log::info('Listener', $toast_msg);
        $toast_msg['time'] = now();
        $toast_msg['id'] = md5($toast_msg['time']->toIso8601String() . $toast_msg['title'] .
            $toast_msg['message'] .
            ($toast_msg['is_success'] ? ' true' : ' false'));

        session()->push(static::STACK_KEY, $toast_msg);
        $this->toasts = session()->get(static::STACK_KEY);
    }

    public function mount()
    {
        $this->toasts = [];
    }

//    protected $listeners = ['newToastMessage' => 'newMessage', 'closeToast','refreshToasts'];
//

//
//    /**
//     * @param array $newMessage
//     * @return void
//     */
//    public function newMessage(array $newMessage)
//    {
//        session()->push(static::STACK_KEY, $newMessage + [
//                'time' => now(),
//                'id' => md5(time().$newMessage['message']),
//            ]);
//        $this->toasts = session()->get(static::STACK_KEY);
//    }
//
//    public function render()
//    {
//        $this->refreshToasts();
//        return view('livewire.toast-message');
//    }
//
    #[On('refreshToasts')]
    public function refreshToasts()
    {
        Log::info('Toasts cleared');
        $this->toasts = session()->get(static::STACK_KEY, []);
        foreach($this->toasts as $key => $toast) {
            if (now()->diffInMilliseconds($toast['time']) > 2500) {
                unset($this->toasts[$key]);
            }
        }
        $this->toasts = array_values($this->toasts);
        session()->put(self::STACK_KEY, $this->toasts);
    }

    public function closeToast(string $id)
    {
        if (!session()->has(self::STACK_KEY)) {
            return;
        }
        $this->stack = session()->get(self::STACK_KEY);
        foreach($this->stack as $key => $message) {
            if ($message['id'] == $id) {
                unset($this->stack[$key]);
            }
        }
        $this->stack = array_values($this->stack);
        session()->put(self::STACK_KEY, $this->stack);
    }
};
?>

<div>&nbsp;
    @if(!empty($toasts))
{{--                @dd($toasts)--}}
        <div class="flex flex-col absolute top-5 right-5">
            @foreach($toasts as $toast)
                <div id='toast-{{ $toast['id'] }}' class="toasts absolute top-{{ ($loop->index*2 + 5) }} right-5"
                     x-data="{ show: false }"
                     x-init="show = true; setTimeout(() => show = false, 3000)"
                     x-show="show"
                >
                <div id='toast-{{ $toast['id'] }}' class="toasts mb-4">
                    <div class="flex space-x-2 justify-center">
                        <div class="bg-white shadow-lg mx-auto w-64 max-w-full text-sm pointer-events-auto bg-clip-padding rounded-lg block" id="static-example" role="alert" aria-live="assertive" aria-atomic="true" data-mdb-autohide="false">
                            <div class="@if($toast['is_success']) bg-green-100 @else bg-orange-100 @endif flex justify-between items-center py-2 px-3 bg-clip-padding border-b border-gray-200 rounded-t-lg">
                                <p class="font-bold text-gray-500">{{ $toast['title'] }}</p>
                                <div class="flex items-center">
                                    <button type="button" class=" btn-close box-content w-4 h-4 ml-2 text-black border-none rounded-none opacity-50 focus:shadow-none focus:outline-none focus:opacity-100 hover:text-black hover:opacity-75 hover:no-underline" data-mdb-dismiss="toast" aria-label="Close"
                                            wire:click="closeToast('{{ $toast['id'] }}')"
                                    ></button>
                                </div>
                            </div>
                            <div class="p-3 bg-green-50 rounded-b-lg break-words text-gray-700">
                                {{ $toast['message'] }}
                            </div>
                        </div>
                    </div>
                </div>
            @endforeach
        </div>
        <script>
            var nIntervId = setInterval(() => {
                const toasts = document.querySelector('.toasts');
                if (!toasts) {
                    clearInterval(nIntervId);
                }
                this.$dispatch('refreshToasts');
                console.log('refresh toasts');
            }, 250);
        </script>
    @endif
</div>
