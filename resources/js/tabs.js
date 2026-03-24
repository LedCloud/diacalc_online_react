"use_strict";

document.querySelectorAll('.tab-btn').forEach(button => {
  button.addEventListener('click', () => {
    const targetId = button.getAttribute('data-target');
    const targetTab = document.getElementById(targetId);

    // 1. Убираем active у всех кнопок
    document.querySelectorAll('.tab-btn').forEach(btn => btn.classList.remove('active'));
    // 2. Убираем active у всех блоков контента
    document.querySelectorAll('.tab-pane').forEach(pane => pane.classList.remove('active'));

    // 3. Добавляем active нажатой кнопке и нужному контенту
    button.classList.add('active');
    targetTab.classList.add('active');
  });
});

console.log('Hi there');
