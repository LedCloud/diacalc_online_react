<x-app-layout>

<div>
    <div class="tabs">
        <button class="tab-btn active" data-target="tab-menu">menu</button>
        <button class="tab-btn" data-target="tab-glucose">Glucose</button>
        <button class="tab-btn" data-target="tab-products">Products</button>

          <!-- Контент вкладок -->
        <div class="tab-content">
            <div id="tab-menu" class="tab-pane active">
                <livewire:settings :section="menu" />
            </div>
            <div id="tab-glucose" class="tab-pane">
                <livewire:settings :section="glucose" />
            </div>
            <div id="tab-products" class="tab-pane">
                <livewire:settings :section="products" />
            </div>
        </div>
    </div>
</div>
</x-app-layout>
