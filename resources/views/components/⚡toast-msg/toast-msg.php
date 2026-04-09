<?php

use Illuminate\Support\Facades\Log;
use Livewire\Component;
use Livewire\Attributes\On;

new class extends Component {
    public const TTL = 3000;
    public const STACK_KEY = 'toasts';

    /**
     * @var array
     */
    public $toasts;

    #[On('toast_msg')]
    public function updateToastList($toast_msg)
    {
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

    #[On('newToastMessage')]
    public function newMessage(array $newMessage)
    {
        session()->push(static::STACK_KEY, $newMessage + [
                'time' => now(),
                'id' => md5(time() . $newMessage['message']),
            ]);

        $this->toasts = session()->get(static::STACK_KEY);
    }

//    public function render()
//    {
//        $this->refreshToasts();
//        return view('livewire.toast-message');
//    }

    #[On('refreshToasts')]
    public function refreshToasts()
    {
        //this function should be called from js periodically
        $toasts = session()->get(static::STACK_KEY, []);
        foreach ($toasts as $key => $toast) {
            if (abs(now()->diffInMilliseconds($toast['time'])) > self::TTL) {
                unset($toasts[$key]);
            }
        }
        $this->toasts = array_values($toasts);
        session()->put(self::STACK_KEY, $toasts);
    }

    #[On('closeToast')]
    public function closeToast(string $id)
    {
        if (!session()->has(self::STACK_KEY)) {
            return;
        }
        $stack = session()->get(self::STACK_KEY);
        $stack = array_combine(array_column($stack, 'id'), $stack);
        if (array_key_exists($id, $stack)) {
            unset($stack[$id]);
        }
        $stack = array_values($stack);
        session()->put(self::STACK_KEY, $stack);
        $this->toasts = $stack;
    }
};
