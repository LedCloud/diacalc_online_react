"use strict";

var nIntervId = setInterval(() => {
    const toasts = document.querySelectorAll('.toasts');
    console.log(toasts);
    if (toasts.length === 0) {
        //clearInterval(nIntervId);
        return;
    }
    /*if ($('.toasts').length === 0) {
        clearInterval(nIntervId);
    }*/
    //window.Livewire.emit('refreshToasts');
    console.log('Dispatch');
    this.$dispatch('refreshToasts');
}, 250);
