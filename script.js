// Элементы формы
const form = document.getElementById('dataForm');
const nameInput = document.getElementById('nameInput');
const phoneInput = document.getElementById('phoneInput');

// Элементы для отображения данных
const displayName = document.getId('displayName');
const displayPhone = document.getId('displayPhone');
const clearBtn = document.getId('clearBtn');

// Загрузка сохранённых данных при открытии страницы
window.onload = loadSavedData();

// Функция загрузки данных из localStorage
function loadSavedData() {
    const savedName = localStorage.getItem('userName');
    const savedPhone = localStorage.getItem('userPhone');

    if (savedName && savedPhone) {
        displayName.textContent = savedName;
        displayPhone.textContent = savedPhone;
    }
}

// Обработка отправки формы
form.addEventListener('submit', (event) => {
    event.preventDefault(); // Предотвращаем перезагрузку страницы

    // Сохраняем данные в localStorage
    localStorage.setItem('userName', nameInput.value);
    localStorage.setItem('userPhone', phoneInput.value);

    // Обновляем отображаемые данные
    displayName.textContent = nameInput.value;
    displayPhone.textContent = phoneInput.value;

    // Очищаем форму
    form.reset();
});

// Очистка данных
clearBtn.addEventListener('click', () => {
    localStorage.removeItem('userName');