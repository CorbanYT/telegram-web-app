// Настройки базы данных
const DB_NAME = "BarManagerDB";
const DB_VERSION = 1;

// Каталог товаров
const PRODUCT_CATALOG = {
    Пиво: [
        { name: "Стелла безалкогольное", price: 150 },
        { name: "Миллер", price: 250 },
        { name: "Хадыженское", price: 220 }
    ],
    Водка: [
        { name: "Белуга", price: 1200 },
        { name: "Беленькая", price: 650 }
    ]
};

// Переменные состояния
let db; // ссылка на открытую базу данных
let currentTable = null; // текущий стол (table1 или table2)
let currentCategory = null; // текущая категория (Пиво или Водка)
let selectedProduct = null; // выбранный продукт для добавления

// --- Открытие и инициализация базы данных ---
const openRequest = indexedDB.open(DB_NAME, DB_VERSION);

openRequest.onupgradeneeded = function(event) {
    db = event.target.result;
    
    // Создаем хранилища для каждого стола, если их нет
    if (!db.objectStoreNames.contains('table1')) {
        const table1 = db.createObjectStore('table1', { keyPath: 'id', autoIncrement: true });
        table1.createIndex('quantity', 'quantity', { unique: false });
    }
    
    if (!db.objectStoreNames.contains('table2')) {
        const table2 = db.createObjectStore('table2', { keyPath: 'id', autoIncrement: true });
        table2.createIndex('quantity', 'quantity', { unique: false });
    }
};

openRequest.onsuccess = function(event) {
    db = event.target.result;
    initUI(); // Инициализируем интерфейс после открытия базы данных
};

openRequest.onerror = function(event) {
    console.error("Ошибка открытия базы данных:", event.target.errorCode);
};

// --- Инициализация интерфейса ---
function initUI() {
    // Назначаем слушателей на кнопки выбора стола
    document.querySelectorAll('.table-btn').forEach(btn => {
        btn.addEventListener('click', () => showTableInterface(btn.dataset.table));
    });
}

// --- Создание интерфейса для конкретного стола ---
function showTableInterface(tableName) {
    currentTable = tableName; // Запоминаем текущий стол

    const contentArea = document.getElementById('content-area');
    contentArea.innerHTML = `
        <div class="content-area">
            <div class="left-panel">
                <div class="panel-header"><h2>Категории</h2></div>
                <button class="category-btn" data-category="Пиво">Пиво</button>
                <button class="category-btn" data-category="Водка">Водка</button>
                
                <div class="product-list" id="product-list">
                    <!-- Товары появятся здесь -->
                </div>
            </div>
            
            <div class="right-panel">
                <div class="panel-header"><h2>Заказы (${tableName})</h2></div>
                <table class="order-table" id="order-table">
                    <thead>
                        <tr><th>Товар</th><th>Кол-во</th><th>Цена</th><th>Сумма</th><th></th></tr>
                    </thead>
                    <tbody>
                        <!-- Заказ появится здесь -->
                    </tbody>
                </table>
                <div class="action-btns">
                    <button class="btn-delete">Удалить выбранный товар</button>
                    <button class="btn-clear">Очистить весь стол</button>
                </div>
            </div>
        </div>
    `;

    // Назначаем слушателей на кнопки категорий
    document.querySelectorAll('.category-btn').forEach(btn => {
        btn.addEventListener('click', () => showProducts(btn.dataset.category));
    });

    // Назначаем слушателей на кнопки действий
    document.querySelector('.btn-delete').addEventListener('click', deleteLastOrder);
    document.querySelector('.btn-clear').addEventListener('click', clearTable);

    // Показываем товары первой категории по умолчанию и загружаем заказ
    showProducts('Пиво');
    displayOrders();
}

// --- Показать список товаров категории ---
function showProducts(category) {
    currentCategory = category; // Запоминаем текущую категорию

    const productList = document.getElementById('product-list');
    productList.innerHTML = ''; // Очищаем список

    // Активируем выбранную категорию визуально
    document.querySelectorAll('.category-btn').forEach(btn => btn.classList.remove('active'));
    document.querySelector(`[data-category="${category}"]`).classList.add('active');

    // Показываем товары категории
    PRODUCT_CATALOG[category].forEach(item => {
        const div = document.createElement('div');
        div.className = 'product-item';
        div.textContent = `${item.name} — ${item.price} ₽`;
        div.dataset.name = item.name; // Сохраняем имя продукта для обработки клика
        div.addEventListener('click', () => selectProduct(item));
        productList.appendChild(div);
    });
}

// --- Выбор товара для добавления в заказ ---
function selectProduct(product) {
    selectedProduct = product; // Запоминаем выбранный товар

    // Создаем модальное окно для ввода количества
    const modalHTML = `
        <div class="modal-overlay">
            <div class="modal-content">
                <h3>Добавить "${product.name}"</h3>
                <p>Цена за единицу: ${product.price} ₽</p>
                <div class="quantity-container">
                    <input type="number" id="qty-input" min="0.1" step="0.1" value="1" class="modal-quantity">
                </div>
                <div class="controls-container">
                    <button class="qty-btn minus-one">-1</button>
                    <button class="qty-btn plus-one">+1</button>
                    <button class="qty-btn minus-two">-2</button>
                    <button class="qty-btn plus-two">+2</button>
                </div>
                <br><br>
                <button id="qty-confirm-btn" class="modal-button">Добавить в заказ</button>
            </div>
        </div>
    `;
    document.body.insertAdjacentHTML('beforeend', modalHTML);

    // Назначаем обработчики на кнопки изменения количества
    document.querySelectorAll('.qty-btn').forEach(btn => {
        btn.addEventListener('click', () => {
            const input = document.getElementById('qty-input');
            let currentQty = parseFloat(input.value);
            
            switch (btn.className.split(' ').pop()) {
                case 'minus-one':
                    currentQty -= 1;
                    break;
                case 'plus-one':
                    currentQty += 1;
                    break;
                case 'minus-two':
                    currentQty -= 2;
                    break;
                case 'plus-two':
                    currentQty += 2;
                    break;
            }
            
            // Ограничиваем минимум до 0.1
            if (currentQty < 0.1) currentQty = 0.1;
            
            input.value = currentQty.toFixed(1); // Округляем до десятых
        });
    });

    // Назначаем слушатель на кнопку подтверждения
    document.getElementById('qty-confirm-btn').addEventListener('click', () => {
        const qty = parseFloat(document.getElementById('qty-input').value);
        if (isValidQuantity(qty)) {
            addToOrder(product, qty);
        } else {
            alert('Некорректное количество!');
        }
        // Закрываем модальное окно
        document.querySelector('.modal-overlay').remove();
    });
}

// --- Проверка корректности введенного количества ---
function isValidQuantity(qty) {
    return typeof qty === 'number' && !isNaN(qty) && qty >= 0.1;
}

// --- Добавление товара в заказ (в IndexedDB) ---
function addToOrder(product, quantity) {
    const transaction = db.transaction([currentTable], 'readwrite');
    const store = transaction.objectStore(currentTable);
    
    // Добавляем запись в базу данных
    const request = store.add({
        name: product.name,
        pricePerItem: product.price,
        quantity: Number(quantity.toFixed(2)), // Округляем до сотых
        timestamp: Date.now() // Время добавления (для сортировки)
    });

    // Обработчик успеха
    request.onsuccess = () => {
        console.log('Товар добавлен:', product.name, 'Количество:', quantity);
        displayOrders(); // Обновляем интерфейс
    };

    // Обработчик ошибки
    request.onerror = () => {
        console.error('Ошибка добавления товара:', event.target.error);
    };
}

// --- Отображение текущего заказа ---
function displayOrders() {
    const tbody = document.querySelector('#order-table tbody');
    tbody.innerHTML = '';

    const transaction = db.transaction([currentTable], 'readonly');
    const store = transaction.objectStore(currentTable);
    
    store.getAll().onsuccess = function(event) {
        const orders = event.target.result.sort((a,b) => b.timestamp - a.timestamp); // Сортируем по времени добавления
        let totalSum = 0;

        orders.forEach(order => {
            const rowTotal = roundPrice(order.pricePerItem * order.quantity);
            totalSum += rowTotal;
            
            const tr = document.createElement('tr');
            tr.innerHTML = `
                <td>${order.name}</td>
                <td>${order.quantity}</td>
                <td>${roundPrice(order.pricePerItem)} ₽</td>
                <td>${rowTotal} ₽</td>
                <td><button class="delete-btn" data-id="${order.id}">✖</button></td>
            `;
            tbody.appendChild(tr);
            
            // Назначаем слушатель на кнопку удаления строки
            tr.querySelector('.delete-btn').addEventListener('click', () => deleteOrder(order.id));
        });

        // Добавляем строку с общей суммой
        const totalRow = document.createElement('tr');
        totalRow.className = 'total-row';
        totalRow.innerHTML = `<td colspan="3" style="text-align:right; font-weight:bold;">Итого:</td><td colspan="2" style="font-weight:bold;">${roundPrice(totalSum)} ₽</td>`;
        tbody.appendChild(totalRow);
    };
}

// --- Округление цен до копеек ---
function roundPrice(price) {
    return Math.round(price * 100) / 100;
}

// --- Удаление конкретного товара из заказа ---
function deleteOrder(id) {
    const transaction = db.transaction([currentTable], 'readwrite');
    const store = transaction.objectStore(currentTable);
    
    // Назначаем обработчик ошибки
    store.delete(id).onerror = () => {
        console.error('Ошибка удаления товара:', event.target.error);
    };
    
    // Назначаем обработчик успеха
    store.delete(id).onsuccess = () => {
        displayOrders(); // Обновляем интерфейс после успешного удаления
    };
}

// --- Удаление последнего добавленного товара (для удобства) ---
function deleteLastOrder() {
    if (!currentTable) return alert('Выберите стол');
    
    const transaction = db.transaction([currentTable], 'readwrite');
    const store = transaction.objectStore(currentTable);
    
    store.getAll().onsuccess = function(event) {
        const orders = event.target.result;
        if (orders.length === 0) return alert('Заказ пуст');
        
        // Удаляем самую свежую запись (с наибольшим временем добавления)
        const latestOrder = orders.reduce((prev, curr) => prev.timestamp > curr.timestamp ? prev : curr);
        store.delete(latestOrder.id).onsuccess = () => displayOrders();
    };
}

// --- Очистка всего заказа ---
function clearTable() {
    if (!currentTable) return alert('Выберите стол');
    
    if (!confirm('Вы уверены, что хотите очистить весь стол?')) return;
    
    const transaction = db.transaction([currentTable], 'readwrite');
    const store = transaction.objectStore(currentTable);
    
    store.clear().onsuccess = () => displayOrders();
}