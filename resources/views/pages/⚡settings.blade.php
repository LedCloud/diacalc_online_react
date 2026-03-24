<?php

use Livewire\Component;

new class extends Component
{
    //
};
?>

<div>
    <div class="tabs">
        <button class="tab-btn active" data-target="tab-menu">menu</button>
        <button class="tab-btn" data-target="tab-glucose">Glucose</button>
        <button class="tab-btn" data-target="tab-products">Products</button>

          <!-- Контент вкладок -->
        <div class="tab-content">
            <div id="tab-menu" class="tab-pane active">
                Контент профиля...
            </div>
            <div id="tab-glucose" class="tab-pane">
                Настройки системы...
            </div>
            <div id="tab-products" class="tab-pane">
                Ваши сообщения...
            </div>
        </div>
    </div>
</div>
