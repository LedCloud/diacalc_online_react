"use strict";

const main = function() {

    let opened = false;

    Array.from(document.querySelectorAll('.row-dropdown')).forEach(row => {
        const trigger = row.querySelector('.trigger');
        trigger.addEventListener('click', (e)=>{
            const n = e.target.closest('button');

            const drop_down = n.nextElementSibling;
            if (drop_down.classList.contains('hidden')) {
                drop_down.classList.remove('hidden');
                opened = drop_down;
                console.log('Show menu');
            } else {
                drop_down.classList.add('hidden');
                opened = false;
            }
        });
    });

    // document.addEventListener('click', (event) => {
    //     if (false === opened)
    //         return;
    //
    //     const isClickOutside = !opened.contains(event.target);
    //
    //     if (isClickOutside) {
    //         // Logic for clicking OUTSIDE goes here
    //         opened.classList.add('hidden');
    //         console.log('Hide menu');
    //     }
    // });
};

main();

