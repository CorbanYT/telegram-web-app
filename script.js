// Настройки базы данных
const DB_NAME = "BarManagerDB1";
const DB_VERSION = 5;

// Каталог товаров (вложенная структура)
const PRODUCT_CATALOG = {
  Корень: {
    Бар: {
      Алкоголь: {
        Водка: [
          { name: "Белуга", price: 1200 },
          { name: "Беленькая", price: 650 }
        ],
        Пиво: [
          { name: "Стелла безалкогольное", price: 150 },
          { name: "Миллер", price: 250 },
          { name: "Хадыженское", price: 220 }
        ]
      },
      Безалкогольные: {
        Напитки: [
          { name: "Кола", price: 100 },
          { name: "Фанта", price: 100 }
        ]
      }
    }
  }
};

// Переменные состояния
let db; // ссылка на открытую базу данных
let currentTable = null; // текущий стол (table1 или table2)
let categoryPath = ['Корень']; // путь к текущей категории

// --- Открытие и инициализация базы данных ---
const openRequest = indexedDB.open(DB_NAME, DB_VERSION);

openRequest.onupgradeneeded = function(event) {
    db = event.target.result;
    
    // Создаем хранилища для каждого стола, если их нет
    if (!db.objectStoreNames.contains('table1')) {
        const table1 = db.createObjectStore('table1', { keyPath: 'id', autoIncrement: true });
        table1.createIndex('name', 'name', { unique: false });
        table1.createIndex('quantity', 'quantity', { unique: false });
    }
    
    if (!db.objectStoreNames.contains('table2')) {
        const table2 = db.createObjectStore('table2', { keyPath: 'id', autoIncrement: true });
        table2.createIndex('name', 'name', { unique: false });
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
    // Назначаем слушателей на кнопки выбора столов
    document.querySelectorAll('.table-btn').forEach(btn => {
        btn.addEventListener('click', () => showTableInterface(btn.dataset.table));
    });
    updateAllTableSums();
}

// --- Создание интерфейса для конкретного стола ---
function showTableInterface(tableName) {
    currentTable = tableName;
    categoryPath = ['Корень']; // Сбрасываем путь к категории

    const contentArea = document.getElementById('content-area');
    contentArea.innerHTML = `
        <div class="content-area">
            <div class="left-panel">
                <div class="panel-header"><h2>Категории</h2></div>
                <button class="category-btn back-btn" style="display:none;">Назад</button>
                <div class="product-list" id="product-list">
                    <!-- Товары и категории появятся здесь -->
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

    document.querySelector('.btn-delete').addEventListener('click', deleteLastOrder);
    document.querySelector('.btn-clear').addEventListener('click', clearTable);

    showCurrentCategoryContent();
    displayOrders(); // Загружаем сохраненный заказ сразу при открытии стола
}

// --- Показать содержимое текущей категории ---
function showCurrentCategoryContent() {
    const productList = document.getElementById('product-list');
    productList.innerHTML = '';

    let currentLevel = PRODUCT_CATALOG;
    for (let part of categoryPath) {
        currentLevel = currentLevel[part];
    }

    const backBtn = document.querySelector('.back-btn');

    if (Array.isArray(currentLevel)) {
        backBtn.style.display = 'inline-block';
        currentLevel.forEach(item => {
            const div = document.createElement('div');
            div.className = 'product-item';
            div.textContent = `${item.name} — ${item.price} ₽`;
            div.dataset.name = item.name;
            div.addEventListener('click', () => selectProduct(item));
            productList.appendChild(div);
        });
    } else if (typeof currentLevel === 'object') {
        backBtn.style.display = categoryPath.length > 1 ? 'inline-block' : 'none';
        for (let key in currentLevel) {
            const btn = document.createElement('button');
            btn.className = 'category-btn';
            btn.textContent = key;
            btn.dataset.category = key;
            btn.addEventListener('click', () => {
                categoryPath.push(key);
                showCurrentCategoryContent();
            });
            productList.appendChild(btn);
        }
    }
}

document.addEventListener('click', function(event) {
    if (event.target.classList.contains('back-btn')) {
        if (categoryPath.length > 1) {
            categoryPath.pop();
            showCurrentCategoryContent();
        }
    }
});

// --- Выбор товара для добавления в заказ ---
function selectProduct(product) {
    const modalHTML = `
        <div class="modal-overlay">
            <div class="modal-content">
                <h3>Добавить "${product.name}"</h3>
                <p>Цена за единицу: ${product.price} ₽</p>
                <div class="quantity-container">
                    <button class="qty-btn minus-two">-2</button>
                    <button class="qty-btn minus-one">-1</button>
                    <input type="number" id="qty-input" min="0.1" step="0.1" value="1" class="modal-quantity">
                    <button class="qty-btn plus-one">+1</button>
                    <button class="qty-btn plus-two">+2</button>
                </div>
                <br><br>
                <button id="qty-confirm-btn" class="modal-button">Добавить в заказ</button>
            </div>
        </div>
    `;
    document.body.insertAdjacentHTML('beforeend', modalHTML);

    const input = document.getElementById('qty-input');
    
    document.querySelectorAll('.qty-btn').forEach(btn => {
        btn.addEventListener('click', () => {
            let currentQty = parseFloat(input.value);
            
            switch (btn.className.split(' ').pop()) {
                case 'minus-one': currentQty -= 1; break;
                case 'plus-one': currentQty += 1; break;
                case 'minus-two': currentQty -= 2; break;
                case 'plus-two': currentQty += 2; break;
            }
            
            if (currentQty < 0.1) currentQty = 0.1;
            
            input.value = currentQty.toFixed(1);
        });
    });

    document.getElementById('qty-confirm-btn').addEventListener('click', () => {
        const qty = parseFloat(input.value);
        if (isValidQuantity(qty)) {
            addToOrder(product, qty);
            document.querySelector('.modal-overlay').remove();
        } else {
            alert('Некорректное количество!');
        }
    });
}

function isValidQuantity(qty) {
    return typeof qty === 'number' && !isNaN(qty) && qty >= 0.1;
}

// --- Добавление товара в заказ (в IndexedDB) ---
function addToOrder(product, quantity) {
    const transaction = db.transaction([currentTable], 'readwrite');
    const store = transaction.objectStore(currentTable);
    
    store.index('name').openCursor(IDBKeyRange.only(product.name)).onsuccess = function(event) {
        const cursor = event.target.result;
        
        if (cursor) {
            const existingOrder = cursor.value;
            const newQuantity = existingOrder.quantity + quantity;
            
            store.put({
                id: existingOrder.id,
                name: product.name,
                pricePerItem: product.price,
                quantity: newQuantity,
                timestamp: Date.now()
            });
            
            displayOrders();
        } else {
            store.add({
                name: product.name,
                pricePerItem: product.price,
                quantity: quantity,
                timestamp: Date.now()
            }).onsuccess = () => {
                displayOrders();
            };
        }
    };
}

// --- Отображение текущего заказа ---
function displayOrders() {
    const tbody = document.querySelector('#order-table tbody');
    tbody.innerHTML = '';

    const transaction = db.transaction([currentTable], 'readonly');
    const store = transaction.objectStore(currentTable);
    
    store.getAll().onsuccess = function(event) {
        const orders = event.target.result.sort((a,b) => b.timestamp - a.timestamp);
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
            
            tr.querySelector('.delete-btn').addEventListener('click', () => deleteOrder(order.id));
        });

        const totalRow = document.createElement('tr');
        totalRow.className = 'total-row';
        totalRow.innerHTML = `<td colspan="3" style="text-align:right; font-weight:bold;">Итого:</td><td colspan="2" style="font-weight:bold;">${roundPrice(totalSum)} ₽</td>`;
        tbody.appendChild(totalRow);
        
        // Обновляем сумму на кнопках столов после отрисовки заказа
        updateAllTableSums();
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
    
    store.delete(id).onsuccess = () => {
        displayOrders();
        updateAllTableSums();
    };
}

// --- Удаление последнего добавленного товара ---
function deleteLastOrder() {
    if (!currentTable) return alert('Выберите стол');
    
    const transaction = db.transaction([currentTable], 'readwrite');
    const store = transaction.objectStore(currentTable);
    
    store.getAll().onsuccess = function(event) {
        const orders = event.target.result;
        if (orders.length === 0) return alert('Заказ пуст');
        
        const latestOrder = orders.reduce((prev, curr) => prev.timestamp > curr.timestamp ? prev : curr);
        store.delete(latestOrder.id).onsuccess = () => displayOrders();
        
        // Обновляем суммы на кнопках после удаления
        updateAllTableSums();
    };
}

// --- Очистка всего заказа ---
function clearTable() {
    if (!currentTable) return alert('Выберите стол');
    
    if (!confirm('Вы уверены, что хотите очистить весь стол?')) return;
    
    const transaction = db.transaction([currentTable], 'readwrite');
    const store = transaction.objectStore(currentTable);
    
    store.clear().onsuccess = () => displayOrders();
    
     // Обновляем суммы на кнопках после очистки
     updateAllTableSums();
}


// ===================== НОВЫЕ ФУНКЦИИ ДЛЯ СУММЫ НА КНОПКАХ =====================

/**
 * Обновляет сумму на ВСЕХ кнопках выбора столов.
 */
// Обновление суммы на всех кнопках столов
async function updateAllTableSums() {
    const buttons = document.querySelectorAll('.table-btn');
    
    for (const btn of buttons) {
        const tableName = btn.dataset.table;
        const span = btn.querySelector('.order-sum');

        if (span && tableName) {
            const total = await calculateTableSum(tableName);
            span.textContent = roundPrice(total);
        }
    }
}

// Вспомогательная функция для асинхронных операций с IndexedDB
function IDBPromise(storeName, mode, operation) {
    return new Promise((resolve, reject) => {
        const transaction = db.transaction(storeName, mode);
        const store = transaction.objectStore(storeName);
        
        operation(store).onsuccess = resolve;
        operation(store).onerror = reject;
    });
}

/**
 * Считает общую сумму заказа для указанного стола.
 * @param {string} tableName - Имя хранилища ('table1' или 'table2')
 */
// Расчет суммы заказа для стола (асинхронно)
// Расчет суммы заказа для стола (асинхронно)
async function calculateTableSum(tableName) {
    try {
        const result = await IDBPromise(tableName, 'readonly', store => store.getAll());
        
        // Проверяем, что результат — это массив
        if (!Array.isArray(result)) {
            return 0; // Возвращаем 0, если результат не массив
        }

        let totalSum = 0;

        result.forEach(order => {
            totalSum += roundPrice(order.pricePerItem * order.quantity);
        });

        return totalSum;
    } catch (err) {
        console.error('Ошибка при расчете суммы:', err);
        return 0;
    }
}