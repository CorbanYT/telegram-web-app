// Настройки базы данных
const DB_NAME = "BarManagerDB1";
const DB_VERSION = 5;

// Каталог товаров (вложенная структура)
const PRODUCT_CATALOG = {
  Корень: {
    Бар: {
      Алкоголь: {
        Водка: [
          { name: "Водка в АС", price: 850 },
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
    console.log('База данных открыта:', db); // <--- ВЫВОД В КОНСОЛЬ
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

    // Автоматика открытие столов при загрузке страницы
    simulateTableSelection(); // <--- ВАЖНО!    
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

    updateCurrentTableSum(); // <--- ОБНОВЛЯЕМ СУММУ НА КНОПКЕ!
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

// Обновление суммы на всех кнопках столов
function updateAllTableSums() {
    // Список всех столов
    const tables = ['table1', 'table2'];

    // Обрабатываем каждый стол отдельно
    tables.forEach(async (tableName) => {
        const total = await calculateTableSum(tableName);
        updateButtonSum(tableName, total);

        // Выводим сумму в консоль
        console.log(`Сумма для стола ${tableName}: ${total}`); // <--- ВЫВОД В КОНСОЛЬ
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
            
            console.log('Обновлён заказ:', existingOrder); // <--- ВЫВОД В КОНСОЛЬ
            displayOrders();
            updateCurrentTableSum();
        } else {
            store.add({
                name: product.name,
                pricePerItem: product.price,
                quantity: quantity,
                timestamp: Date.now()
            }).onsuccess = () => {
                console.log('Добавлен новый заказ:', product); // <--- ВЫВОД В КОНСОЛЬ
                displayOrders();
                updateCurrentTableSum();
            };
        }
    };
}

// --- Отображение текущего заказа ---
function displayOrders() {
    const tbody = document.querySelector('#order-table tbody');
    tbody.innerHTML = ''; // Очищаем таблицу

    let totalSum = 0;

    const transaction = db.transaction([currentTable], 'readonly');
    const store = transaction.objectStore(currentTable);
    
    store.getAll().onsuccess = function(event) {
        const orders = event.target.result.sort((a,b) => b.timestamp - a.timestamp);

        // Формируем строки с товарами
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

        // Добавляем итоговую строку только один раз, после цикла
        const totalRow = document.createElement('tr');
        totalRow.className = 'total-row';
        totalRow.innerHTML = `<td colspan="3" style="text-align:right; font-weight:bold;">Итого:</td><td colspan="2" style="font-weight:bold;">${roundPrice(totalSum)} ₽</td>`;
        tbody.appendChild(totalRow);
    };
}

// Обновление суммы на кнопке конкретного стола
function updateButtonSum(tableName, totalSum) {
    // Находим кнопку нужного стола
    const button = document.querySelector(`.table-btn[data-table="${tableName}"]`);
    
    if (button) {
        console.log(`Кнопка стола ${tableName} найдена`); // <--- ВЫВОД В КОНСОЛЬ
        const span = button.querySelector('.order-sum');
        if (span) {
            console.log(`Элемент .order-sum найден`); // <--- ВЫВОД В КОНСОЛЬ
            span.textContent = roundPrice(totalSum);
        } else {
            console.warn(`Элемент .order-sum не найден для стола ${tableName}`); // <--- ВЫВОД В КОНСОЛЬ
        }
    } else {
        console.warn(`Кнопка стола ${tableName} не найдена`); // <--- ВЫВОД В КОНСОЛЬ
    }
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
        displayOrders(); // Обновляем таблицу заказов
        updateCurrentTableSum(); // Обновляем сумму на кнопке
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
        store.delete(latestOrder.id).onsuccess = () => {
            displayOrders(); // Обновляем таблицу заказов
            updateCurrentTableSum(); // Обновляем сумму на кнопке
        };
    };
}

// --- Очистка всего заказа ---
function clearTable() {
    if (!currentTable) return alert('Выберите стол');
    
    if (!confirm('Вы уверены, что хотите очистить весь стол?')) return;
    
    const transaction = db.transaction([currentTable], 'readwrite');
    const store = transaction.objectStore(currentTable);
    
    store.clear().onsuccess = () => {
        displayOrders(); // Обновляем таблицу заказов
        updateCurrentTableSum(); // Обновляем сумму на кнопке
    };
}

// Обновление суммы на кнопке текущего стола
function updateCurrentTableSum() {
    if (!currentTable) return; // Если стол не выбран, ничего не делаем

    // Рассчитываем сумму для текущего стола
    calculateTableSum(currentTable).then(total => {
        // Находим кнопку текущего стола
        const button = document.querySelector(`.table-btn[data-table="${currentTable}"]`);
        
        if (button) {
            const span = button.querySelector('.order-sum');
            if (span) {
                span.textContent = roundPrice(total);
            }
        }
    });
}

// Расчет суммы заказа для стола (асинхронно)
async function calculateTableSum(tableName) {
    try {
        const orders = await IDBPromise(tableName, 'readonly', store => store.getAll());
        let totalSum = 0;
        orders.forEach(order => {
            totalSum += roundPrice(order.pricePerItem * order.quantity);
        });
        return totalSum;
    } catch(error) {
        console.error('Ошибка при расчете суммы:', error);
        return 0;
    }
}

// Имитация нажатия на кнопки столов
// Автоматическое обновление сумм при загрузке страницы
function simulateTableSelection() {
    console.log('Автоматическое обновление сумм столов'); // <--- ВЫВОД В КОНСОЛЬ

    // Список всех столов
    const tables = ['table1', 'table2'];

    // Проходим по каждому столу и обновляем сумму
    tables.forEach(tableName => {
        refreshTableSumWithoutOpening(tableName);
    });
}

// Вспомогательная функция для асинхронных операций с IndexedDB
function IDBPromise(storeName, mode, operation) {
    return new Promise((resolve, reject) => {
        const transaction = db.transaction(storeName, mode);
        const store = transaction.objectStore(storeName);
        
        const req = operation(store);
        req.onsuccess = () => resolve(req.result);
        req.onerror = reject;
    });
}   

// Обновление суммы на кнопке без открытия интерфейса
function refreshTableSumWithoutOpening(tableName) {
    calculateTableSum(tableName).then(total => {
        updateButtonSum(tableName, total);
    });
}