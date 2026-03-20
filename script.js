// Логика для работы с IndexedDB
let db;

// Открытие базы данных
const request = indexedDB.open("myDatabase", 1);
request.onupgradeneeded = (event) => {
    db = event.target.result;
    const objectStore = db.createObjectStore("userData", { keyPath: "id" });
};

request.onsuccess = (event) => {
    db = event.target.result;
    displayData(); // Читаем и отображаем данные при загрузке страницы
};

request.onerror = (event) => {
    console.error("Ошибка при открытии базы данных:", event.target.errorCode);
};

// Отображение данных в таблице
function displayData() {
    const tableBody = document.querySelector("#dataTable tbody");
    tableBody.innerHTML = ""; // Очищаем таблицу

    const transaction = db.transaction(["userData"], "readonly");
    const store = transaction.objectStore("userData");
    const request = store.getAll(); // Получаем ВСЕ записи

    request.onsuccess = (event) => {
        const data = event.target.result;
        data.forEach(item => {
            const row = `
                <tr>
                    <td>${item.id}</td>
                    <td>${item.name}</td>
                    <td>${item.phone}</td>
                    <td><button class="delete-btn" data-id="${item.id}">Удалить</button></td>
                </tr>
            `;
            tableBody.insertAdjacentHTML("beforeend", row);
        });

        // Добавляем слушатели для кнопок удаления
        document.querySelectorAll(".delete-btn").forEach(btn => {
            btn.addEventListener("click", deleteRecord);
        });
    };
}

// Сохранение данных в базу
document.getElementById("dataForm").addEventListener("submit", (event) => {
    event.preventDefault(); // Предотвращаем перезагрузку страницы

    const name = document.getElementById("nameInput").value.trim();
    const phone = document.getElementById("phoneInput").value.trim();

    if (!name || !phone) {
        alert("Пожалуйста, заполните оба поля.");
        return;
    }

    // Генерируем уникальный ID (можно заменить на auto-increment, если нужно)
    const id = Date.now();

    const transaction = db.transaction(["userData"], "readwrite");
    const store = transaction.objectStore("userData");
    const request = store.put({ id, name, phone }); // Сохраняем данные

    request.onsuccess = () => {
        alert("Данные сохранены!");
        displayData(); // Обновляем таблицу
        document.getElementById("dataForm").reset(); // Очищаем форму
    };

    request.onerror = () => {
        alert("Ошибка при сохранении данных.");
    };
});

// Удаление отдельной записи
function deleteRecord(event) {
    const recordId = parseInt(this.dataset.id);

    const transaction = db.transaction(["userData"], "readwrite");
    const store = transaction.objectStore("userData");
    const request = store.delete(recordId); // Удаляем запись

    request.onsuccess = () => {
        alert("Запись удалена!");
        displayData(); // Обновляем таблицу
    };

    request.onerror = () => {
        alert("Ошибка при удалении записи.");
    };
}

// Очистка всех данных
document.getElementById("clearAllBtn").addEventListener("click", () => {
    const transaction = db.transaction(["userData"], "readwrite");
    const store = transaction.objectStore("userData");
    const request = store.clear(); // Очищаем всю таблицу

    request.onsuccess = () => {
        alert("Все данные очищены!");
        displayData(); // Обновляем таблицу
    };

    request.onerror = () => {
        alert("Ошибка при очистке данных.");
    };
});