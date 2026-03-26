// Каталог товаров (вложенная структура)
const PRODUCT_CATALOG = {
  Корень: {
    Корневище: {
        Бар: {
            Алкоголь: {
                Водка: [
                    { name: "Водка в АС", price: 850 },
                    { name: "Абсолют", price: 4000 },
                    { name: "Белуга", price: 4000 },
                    { name: "Русский стандарт", price: 2500 },
                    { name: "Русс. стандарт Платина", price: 2800}
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
        },
        Еда: {
            Гарнир: [
                { name: "Фри", price: 850 },
                { name: "По деревенски", price: 1200 },
                { name: "Рис", price: 650 }
            ],
            Вторые_блюда: [
              { name: "Нагетсы", price: 150 },
              { name: "Свинина_с_овощами" price: 250 },
              { name: "Хуета", price: 220 }
            ],
            Салаты: [
              { name: "Цезарь", price: 490},
              { name: "Теплый", price: 480},
              { name: "Рыбный", price: 550},
              { name: "С_телятиной", price: 490},
              { name: "С_Хрустящими_баклажанами", price: 430},
              { name: "Кремметта", price: 610}
            ]
        },
        Тара: [
          { name: "Контейнер 1блюло", price: 40 },
          { name: "роо", price: 72},
          { name: "ро", price: 88}
          
        ]
  
    }
  }
};

// Переменные состояния
let db; // ссылка на открытую базу данных
let currentTable = null; // текущий стол (table1..table6)
let categoryPath = ['Корень']; // путь к текущей категории

// Настройки базы данных
const DB_NAME = "BarManagerDB1";
const DB_VERSION = 7;

// Массив с номерами столов
const TABLES = ['table1', 'table2', 'table3', 'table4', 'table5', 'table6'];

// --- Открытие и инициализация базы данных ---
const openRequest = indexedDB.open(DB_NAME, DB_VERSION);

openRequest.onupgradeneeded = function(event) {
    db = event.target.result;

    // Создаём хранилище для каждого стола
    TABLES.forEach(tableName => {
        if (!db.objectStoreNames.contains(tableName)) {
            const store = db.createObjectStore(tableName, { keyPath: 'id', autoIncrement: true });
            store.createIndex('name', 'name', { unique: false });
            store.createIndex('quantity', 'quantity', { unique: false });
            store.createIndex('pricePerItem', 'pricePerItem', { unique: false });
            store.createIndex('timestamp', 'timestamp', { unique: false });
            store.createIndex('isDone', 'isDone', { unique: false });
        }
    });
};

openRequest.onsuccess = function(event) {
    db = event.target.result;
    console.log('База данных открыта:', db);
    initUI();
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
    setTimeout(simulateTableSelection, 100); // Небольшая задержка для гарантии завершения создания базы данных
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
                <div class="product-list" id="product-list"></div>
            </div>
            
            <div class="right-panel">
                <div class="panel-header"><h2>Заказы (${tableName})</h2></div>
                <table class="order-table" id="order-table">
                    <thead>
                        <tr><th>Товар</th><th>Кол-во</th><th>Цена</th><th>Сумма</th><th>Отдал</th><th></th></tr>
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
    displayOrders();
    updateCurrentTableSum();
}

// --- Показать содержимое текущей категории ---
function showCurrentCategoryContent() {
    const productList = document.getElementById('product-list');
    productList.innerHTML = ''; // Очищаем предыдущий контент

    // Получаем текущий уровень дерева
    let currentLevel = PRODUCT_CATALOG;
    for (let part of categoryPath) {
        currentLevel = currentLevel[part]; // Переходим по каждому уровню
    }

    // Показываем кнопки возврата назад, если это не корень
    const backBtn = document.querySelector('.back-btn');
    backBtn.style.display = categoryPath.length > 1 ? 'inline-block' : 'none';

    // Определяем, достигли ли мы конечного списка продуктов
    if (Array.isArray(currentLevel)) {
        // Если это массив, показываем продукты
        currentLevel.forEach(item => {
            const div = document.createElement('div');
            div.className = 'product-item';
            div.textContent = `${item.name} — ${item.price} ₽`;
            div.dataset.name = item.name;
            div.addEventListener('click', () => selectProduct(item)); // Выбор продукта
            productList.appendChild(div);
        });
    } else if (typeof currentLevel === 'object') {
        // Иначе показываем кнопки категорий
        for (let key in currentLevel) {
            const btn = document.createElement('button');
            btn.className = 'category-btn';
            btn.textContent = key;
            btn.dataset.category = key;
            btn.addEventListener('click', () => {
                categoryPath.push(key); // Переход на следующий уровень
                showCurrentCategoryContent(); // Рекурсивный вызов
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

// Проверка валидности введённого количества
function isValidQuantity(qty) {
    return typeof qty === 'number' && !isNaN(qty) && qty >= 0.1;
}

// --- Добавление товара в заказ (в IndexedDB) ---
function addToOrder(product, quantity) {
    const transaction = db.transaction([currentTable], 'readwrite');
    const store = transaction.objectStore(currentTable);
    
    store.index('name').openCursor(IDBKeyRange.only(product.name)).onsuccess = function(event) {
        const cursor = event.target.result;
        
        if (cursor) { // Проверяю существование элемента
            const existingOrder = cursor.value;
            const newQuantity = existingOrder.quantity + quantity;
            
            store.put({
                id: existingOrder.id,
                name: product.name,
                pricePerItem: product.price,
                quantity: newQuantity,
                timestamp: Date.now(),
                isDone: existingOrder.isDone // Добавляю статус "отдано"
            });

            displayOrders();
            updateCurrentTableSum();
        } else {
            store.add({
                name: product.name,
                pricePerItem: product.price,
                quantity: quantity,
                timestamp: Date.now(),
                isDone: false // По умолчанию товар не отдан
            }).onsuccess = () => {
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
                <td><input type='checkbox' class='done-checkbox' ${order.isDone ? 'checked' : ''} data-id="${order.id}"></td>
                <td><button class='delete-btn' data-id="${order.id}">✖</button></td>
            `;
            tbody.appendChild(tr);
            
            const checkbox = tr.querySelector('.done-checkbox');
            checkbox.addEventListener('change', () => toggleDone(order.id));

            tr.querySelector('.delete-btn').addEventListener('click', () => deleteOrder(order.id));
        });

        // Добавляем итоговую строку только один раз, после цикла
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
        updateButtonSum(currentTable, total);
    });
}

// Расчёт суммы заказа для стола (асинхронно)
async function calculateTableSum(tableName) {
    try {
        // Проверяем существование хранилища
        if (!db.objectStoreNames.contains(tableName)) return 0;

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

// Обновление суммы на кнопке конкретного стола
function updateButtonSum(tableName, totalSum) {
    // Находим кнопку нужного стола
    const button = document.querySelector(`.table-btn[data-table="${tableName}"]`);
    
    if (button) {
        const span = button.querySelector('.order-sum');
        if (span) {
            span.textContent = roundPrice(totalSum);
        }
    }
}

// Вспомогательная функция для асинхронных операций с IndexedDB
function IDBPromise(storeName, mode, operation) {
    return new Promise((resolve, reject) => {
        // Проверяем существование хранилища перед созданием транзакции
        if (!db.objectStoreNames.contains(storeName)) {
            resolve([]); // Возвращаем пустой массив, если хранилища нет
            return;
        }

        const transaction = db.transaction(storeName, mode);
        const store = transaction.objectStore(storeName);
        
        const req = operation(store);
        req.onsuccess = () => resolve(req.result);
        req.onerror = reject;
    });
}

// Имитация нажатия на кнопки столов
// Автоматическое обновление сумм при загрузке страницы
function simulateTableSelection() {
    console.log('Автоматическое обновление сумм столов');

    // Проходим по каждому столу и обновляем сумму
    TABLES.forEach(tableName => {
        refreshTableSumWithoutOpening(tableName);
    });
}

// Обновление суммы на кнопке без открытия интерфейса
function refreshTableSumWithoutOpening(tableName) {
    calculateTableSum(tableName).then(total => {
        updateButtonSum(tableName, total);
    });
}

// Галочка "Отдал"
function toggleDone(id) {
    const transaction = db.transaction([currentTable], 'readwrite');
    const store = transaction.objectStore(currentTable);
    
    store.get(id).onsuccess = e => {
        const order = e.target.result;
        order.isDone = !order.isDone;
        store.put(order);
    };

    displayOrders();
    updateCurrentTableSum();
}

// Эффект hover для кнопок
function addHover(el, cls) {
    el.addEventListener('mouseenter', () => el.classList.add(`${cls}hovered`));
    el.addEventListener('mouseleave', () => el.classList.remove(`${cls}hovered`));
}
