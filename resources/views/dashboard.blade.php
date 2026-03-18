<x-app-layout>
    <x-slot name="header">
        <h2 class="font-semibold text-xl text-gray-800 dark:text-gray-200 leading-tight">
            {{ __('Dashboard') }}
        </h2>
    </x-slot>

    <div class="py-12">
        <div class="max-w-7xl mx-auto sm:px-6 lg:px-8">
            <div class="bg-white dark:bg-gray-800 overflow-hidden shadow-sm sm:rounded-lg">
                <div class="p-6 text-gray-900 dark:text-gray-100">
                    <div class="grid grid-cols-[1fr_3fr] gap-1 justify-center">
                        <div class="menu-container">
                            <div class="menu-header">
                                <x-menu-small-btn >
                                    b1
                                </x-menu-small-btn>
                                <x-menu-small-btn >
                                    b2
                                </x-menu-small-btn>
                                <x-menu-small-btn >
                                    wide load
                                </x-menu-small-btn>
                                <x-menu-small-btn >
                                    b3
                                </x-menu-small-btn>
                            </div>
                            <div class="menu-content">
                                @for ($i = 0; $i < 3; $i++)
                                    <x-menu-item >
                                    The current value is {{ $i }}
                                    </x-menu-item>
                                @endfor
                            </div>
                        </div>

                        <div class="border p-2 border-amber-500">main pane</div>
                    </div>
                </div>
            </div>
        </div>
    </div>
</x-app-layout>
