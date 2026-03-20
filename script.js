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
    readUserData(); // Читаем данные при загрузке страницы
};

request.onerror = (event) => {
    console.error("Ошибка при открытии базы данных:", event.target.errorCode);
};

// Чтение данных из базы
function readUserData() {
    const transaction = db.transaction(["userData"], "readonly");
    const store = transaction.objectStore("userData");
    const request = store.get(1); // Берём первую запись

    request.onsuccess = (event) => {
        const data = event.target.result;
        if (data) {
            document.getElementById("displayName").textContent = data.name || "";
            document.getElementById("displayPhone").textContent = data.phone || "";
        }
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

    const transaction = db.transaction(["userData"], "readwrite");
    const store = transaction.objectStore("userData");
    const request = store.put({ id: 1, name, phone }); // Сохраняем данные

    request.onsuccess = () => {
        alert("Данные сохранены!");
        readUserData(); // Обновляем отображение
        document.getElementById("dataForm").reset(); // Очищаем форму
    };

    request.onerror = () => {
        alert("Ошибка при сохранении данных.");
    };
});

// Очистка данных
document.getElementById("clearBtn").addEventListener("click", () => {
    const transaction = db.transaction(["userData"], "readwrite");
    const store = transaction.objectStore("userData");
    const request = store.delete(1); // Удаляем запись

    request.onsuccess = () => {
        alert("Данные очищены!");
        readUserData(); // Обновляем отображение
    };

    request.onerror = () => {
        alert("Ошибка при очистке данных.");
    };
});