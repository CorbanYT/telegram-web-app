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
                  { name: "Стелла ба", price: 200 },
                  { name: "Стелла", price: 220 },
                  { name: "Миллер", price: 220 },
                  { name: "Козел", price: 220},
                  { name: "Хугардиан", price: 220},
                  { name: "Хадыжеское", price: 220},
                  { name: "Бад", price: 220},
                  { name: "Майкопское", price: 220},
                  { name: "Розлив", price: 170}
                ],
                Коньяк: {
                  Кизляр: [
                    { name: "Кизлярский 5", price: 3200},
                    { name: "Кизлярский 3", price: 3000},
                  ],
                  Старейшина: [
                    { name: "Старейшина 5", price: 2700},
                    { name: "Старейшина 3", price: 2500},
                  ],
                  Старый_Кахети: [
                    { name: "Кахетии 5", price: 3500},
                    { name: "Кахетти 3", price: 3300},
                  ],
                  Алекс: [
                    { name: "Алекс Сильвер", price:4000 }
                  ]
                }

            },
            Безалкогольные: {
                Напитки: [
                  { name: "Сок 0,2", price: 80 },
                  { name: "Сок 1л", price: 250 },
                  { name: "Пепси 1л", price: 250},
                  { name: "Пепси жб", price: 150},
                  { name: "Вода 0,5", price: 100},
                  { name: "Амерекано", price: 180},
                  { name: "Капучино", price: 200},
                  { name: "Латте", price: 200},
                  { name: "Эспрессо", price: 150},
                  { name: "Энергетик дор", price: 220},
                  { name: "Энергетик бомж", price: 150},
                  { name: "Энергетик 0,25", price: 250},
                  { name: "Чай м(0,5)", price: 170},
                  { name: "Чай б(1,0)", price: 280},
                  { name: "Иммунный м(0,5)", price: 250},
                  { name: "Иммунный б(1,0)", price: 350}
                ]
            }
        },
        Еда: {
            Гарнир: [
                { name: "Фри", price: 220 },
                { name: "По деревенски", price: 220 },
                { name: "Рис", price: 170 }
            ],
            Первые_Блюда: [
                { name: "Суп Лапша", price: 250},
                { name: "Суп Сырный", price: 310},
                { name: "Суп-пюре грибной", price: 310},
                { name: "Том Ям", price: 600},
                { name: "Окрошка", price: 330}
            ],
            Вторые_блюда: [
              { name: "Куриный конверт", price: 450},
              { name: "Свинина с овощами", price: 610},
              { name: "Телятина с овощами", price: 660},
              { name: "Рыба под сливочным соусом", price: 730},
              { name: "Рыба с овощами", price: 680},
 
              { name: "Карбонара", price: 330},
              { name: "Болоньезе", price: 330},
              { name: "Бургер Куриный", price: 430},
              { name: "Бургер с телятиной", price: 520},
              { name: "Тортилья с курицей", price: 590},
              { name: "Тортилья с креветками", price: 660},
              { name: "Куриные нагетсы", price: 330},
              { name: "Мидии в соусе Блю Чиз", price: 940},
              { name: "Фунчоза с морепродуктами", price: 500},
              { name: "Фунчоза с курицей", price: 390}
            ],
            Салаты: [
              { name: "Цезарь", price: 490},
              { name: "Теплый", price: 480},
              { name: "Рыбный", price: 550},
              { name: "С телятиной", price: 490},
              { name: "С Хрустящими баклажанами", price: 430},
              { name: "Кремметта", price: 610}
            ],
            Пицца: {
              Большие: [
                {name: "Пепперони б", price: 850},
                {name: "Салями б", price: 850},
                {name: "5 сыров б", price: 1100},
                {name: "4 сыра б", price: 1000},
                {name: "Маргарита б", price: 660},
                {name: "Прошутто б", price: 850},
                {name: "Гавайская б", price: 960},
                {name: "Маринара б", price: 1150},
                {name: "Мясная б", price: 1100},
                {name: "Мексиканская б", price: 1000},
                {name: "Чикаго б", price: 1000},
                {name: "Милано б", price: 1050}
              ],
              Маленькие: [
                {name: "Пепперони м", price: 490},
                {name: "Салями м", price: 490},
                {name: "5 сыров м", price: 610},
                {name: "4 сыра м", price: 550},
                {name: "Маргарита м", price: 360},
                {name: "Прошутто м", price: 490},
                {name: "Гавайская м", price: 530},
                {name: "Маринара м", price: 670},
                {name: "Мясная м", price: 610},
                {name: "Мексиканская м", price: 550},
                {name: "Чикаго м", price: 550},
                {name: "Милано м", price: 570}
              ],
            },
            Закуски: [
              { name: "Сырная тарелка", price: 450},
              { name: "Мясное ассорти", price: 600},
              { name: "Улитки", price: 850},
              { name: "Лимон с сахаром", price: 150},
              { name: "Креветки в кляре", price: 610},
              { name: "Гренки чесночные", price: 250},
              { name: "Кольца кальмара", price: 330},
              { name: "Луковые кольца", price: 250},
              { name: "Пивная тарелка", price: 610},
              { name: "Сырные шарики", price: 530},
              { name: "Янтык", price: 350},
              { name: "Фисташки", price: 330},
              { name: "Арахис", price: 200},
              { name: "Пивной сэт", price: 1400}
            ],
            Роллы: [
              { name: "Императорские", price: 580},
              { name: "Зеленый дракон", price: 470},
              { name: "Унаги Дракон", price: 490},
              { name: "Самурай", price: 450},
              { name: "Калифорния лосось", price: 450},
              { name: "Калифорния тунец", price: 430},
              { name: "Калифорния угорь", price: 520},
              { name: "Калифорния креветка", price: 430},
              { name: "Бонито", price: 430},
              { name: "Рол в темпуре с лососем", price: 450},
              { name: "Рол в темпуре с угрем", price: 500},
              { name: "Запеч. с креветкой", price: 530},
              { name: "Запеч. с угрем", price: 600},
              { name: "Запеч. с крабом", price: 390},
              { name: "Запеч. с копч. курицей", price: 390},
              { name: "Сэт №1", price: 1650},
              { name: "Сэт №2", price: 1550},
              { name: "Сэт №3", price: 1650},
              { name: "Сэт №4", price: 1900}
            ],
            Десерты: [
              { name: "Блинчики с сиропом", price: 220},
              { name: "Сырники с сиропом", price: 250},
              { name: "Мороженое с сиропом", price: 220},
              { name: "Венские вафли", price: 450},
              { name: "Тирамису", price: 330},
              { name: "Сникерс", price: 330}
            ],
            Соусы: [
              { name: "Соус Горчица", price: 60},
              { name: "Соус Кетчуп", price: 60},
              { name: "Соус Кисло-сладкий", price: 80},
              { name: "Соус Белый", price: 60},
              { name: "Соус Сметана", price: 70},
              { name: "Соус Майонез", price: 60},
              { name: "Соус Сыр", price: 60},
              { name: "Соус Сырный", price: 80}
            ]

        
        },
        Мангал: [
          { name: "Шашлык свинной", price: 1800},
          { name: "Шашлык куриный", price: 1500},
          { name: "Люля-кебаб", price: 1400},
          { name: "Скумбрия", price: 1600},
          { name: "Картофель", price: 500},
          { name: "Грибы", price: 900},
          { name: "Помидоры", price: 700},
          { name: "Баклажан", price: 700},
          { name: "Сладкий перец", price: 700},
          { name: "Соус красный мангал", price: 200},
          { name: "Соус белый мангал", price: 200}
        ],
        Тара: [
          { name: "Контейнер 1блюдо", price: 40 },
          { name: "Контейнер б", price: 25},
          { name: "Контейнер м", price: 20},
          { name: "Сэтница", price: 30},
          { name: "Коробка б", price: 50},
          { name: "Коробка м", price: 40},
          { name: "Соусник пл", price: 5},
          { name: "Стакан купол", price: 20}
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
                
                <!-- Новое поисковое окно -->
                <div class="search-block">
                    <label for="search-input">Поиск товара:</label>
                    <input type="text" id="search-input" placeholder="Начните вводить название товара">
                    <div class="search-results" id="search-results"></div>
                </div>
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
                   <!-- Новая кнопка -->
                   <button class="btn-print">Сформировать чек</button>
                </div>
            </div>
        </div>
    `;

    document.querySelector('.btn-delete').addEventListener('click', deleteLastOrder);
    document.querySelector('.btn-clear').addEventListener('click', clearTable);

    // Добавляем слушатель для новой кнопки
    document.querySelector('.btn-print').addEventListener('click', generateCheckImage);

    showCurrentCategoryContent();
    displayOrders();
    updateCurrentTableSum();

    // Инициализация поиска
    initSearchFunctionality();
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

// *** ПОИСКОВАЯ ФУНКЦИОНАЛЬНОСТЬ ***

// Инициализация поиска
function initSearchFunctionality() {
    const searchInput = document.getElementById('search-input');
    const searchResults = document.getElementById('search-results');

    // Преобразуем каталог в плоский массив товаров
    const flatCatalog = flattenCatalog(PRODUCT_CATALOG);

    // Обработчик ввода в поисковое поле
    searchInput.addEventListener('input', debounce(function() {
        const query = searchInput.value.trim().toLowerCase();
        if (!query) {
            searchResults.innerHTML = '';
            return;
        }

        // Ищем подходящие товары
        const results = fuzzySearch(query, flatCatalog);

        // Отображаем результаты
        renderSearchResults(results, searchResults);
    }, 300));

    // Обработчик клика по результатам поиска
    searchResults.addEventListener('click', function(event) {
        if (event.target.tagName !== 'BUTTON') return;

        const productName = event.target.dataset.productName;
        const selectedProduct = flatCatalog.find(p => p.name === productName);

        if (selectedProduct) {
            selectProduct(selectedProduct);
        }
    });
}

// Преобразование иерархического каталога в плоский массив товаров
function flattenCatalog(catalog) {
    const result = [];

    function traverse(obj) {
        for(let key in obj) {
            if(Array.isArray(obj[key])) {
                result.push(...obj[key]);
            } else {
                traverse(obj[key]);
            }
        }
    }

    traverse(catalog);
    return result;
}

// Дебаунсер для оптимизации частых вводов
function debounce(func, wait) {
    let timeout;
    return function(...args) {
        const later = () => {
            clearTimeout(timeout);
            func.apply(this, args);
        };
        clearTimeout(timeout);
        timeout = setTimeout(later, wait);
    };
}

// Фаззи-поиск с учётом ошибок
function fuzzySearch(query, catalog) {
    return catalog.filter(product => {
        const normalizedQuery = normalizeString(query);
        const normalizedName = normalizeString(product.name);

        // Простая реализация фаззи-поиска
        let pos = 0;
        for(let char of normalizedQuery) {
            pos = normalizedName.indexOf(char, pos);
            if(pos === -1) return false;
            pos++;
        }
        return true;
    });
}

// Приведение строки к нормализованному виду
function normalizeString(str) {
    return str.normalize('NFD').replace(/[\u0300-\u036f]/g, "").toLowerCase();
}

// Рендеринг результатов поиска (красивые карточки!)
function renderSearchResults(results, container) {
    container.innerHTML = '';

    if(results.length === 0) {
        container.innerHTML = '<div class="search-empty">Нет совпадений</div>';
        return;
    }

    results.slice(0, 10).forEach(result => {
        const card = document.createElement('button');
        card.className = 'search-card';
        card.dataset.productName = result.name;
        card.innerHTML = `
            <div class="card-name">${result.name}</div>
            <div class="card-price">${result.price} ₽</div>
        `;
        container.appendChild(card);
    });
}

// *** ФОРМИРОВАНИЕ ЧЕКА ***

// Функция формирования чека в виде изображения
function generateCheckImage() {
    if (!currentTable) return alert('Выберите стол');

    // Получаем текущие заказы
    const transaction = db.transaction([currentTable], 'readonly');
    const store = transaction.objectStore(currentTable);

    store.getAll().onsuccess = function(event) {
        const orders = event.target.result;
        if (orders.length === 0) return alert('Заказ пуст');

        // Формируем текст чека
        const checkData = generateCheckText(orders);

        // Рисуем чек на канвасе
        drawCheckOnCanvas(checkData);
    };
}

// Генерация текста чека
function generateCheckText(orders) {
    const now = new Date();
    const formattedDate = `${now.getHours()}:${now.getMinutes().toString().padStart(2, '0')} ${now.getFullYear()}-${(now.getMonth()+1).toString().padStart(2, '0')}-${now.getDate().toString().padStart(2, '0')}`;

    let checkText = '';
    checkText += 'ШАРЕДА\n\n';
    checkText += `Стол: ${currentTable.replace('table', '')}\n`;
    checkText += `Время: ${formattedDate}\n\n`;

    orders.forEach(order => {
        checkText += `${order.name.padEnd(30)}. ${order.quantity}x ${order.pricePerItem} ₽ = ${roundPrice(order.pricePerItem * order.quantity)} ₽\n`;
    });

    const total = orders.reduce((sum, o) => sum + roundPrice(o.pricePerItem * o.quantity), 0);
    checkText += `\nИТОГО: ${total.toLocaleString()} ₽\n`;

    return checkText;
}

// Рисование чека на канвасе (исправлено!)
function drawCheckOnCanvas(checkText) {
    // Создаем скрытый канвас
    const canvas = document.createElement('canvas');
    canvas.width = 300;
    
    // Автоматически определяем нужную высоту
    const lines = checkText.split('\n');
    canvas.height = 25 * lines.length + 50; // 25 пикселей на строку + запас

    const ctx = canvas.getContext('2d');

    // Фон
    ctx.fillStyle = '#fdfdfd';
    ctx.fillRect(0, 0, canvas.width, canvas.height);

    // Рамка
    ctx.strokeStyle = '#ccc';
    ctx.lineWidth = 1;
    ctx.strokeRect(10, 10, canvas.width - 20, canvas.height - 20);

    // Логотип заведения (убираем логотип, оставляем только текст)
    ctx.font = 'bold 30px Arial';
    ctx.textAlign = 'center';
    ctx.fillStyle = '#333'; // Темно-серый цвет
    ctx.fillText('ШАРЕДА', canvas.width / 2, 50);

    // Данные чека
    ctx.font = '14px Arial';
    ctx.textAlign = 'start';
    ctx.fillStyle = '#333'; // Темно-серый цвет
    ctx.fillText(checkText, 20, 100);

    // Линия внизу
    ctx.beginPath();
    ctx.moveTo(20, canvas.height - 50);
    ctx.lineTo(canvas.width - 20, canvas.height - 50);
    ctx.strokeStyle = '#ccc';
    ctx.stroke();

    // Преобразуем в изображение
    const imageURL = canvas.toDataURL('image/png');

    // Создаем элемент изображения
    const img = document.createElement('img');
    img.src = imageURL;
    img.alt = 'Чек';
    img.style.maxWidth = '100%';
    img.style.border = '1px solid #ccc';
    img.style.boxShadow = '0 2px 5px rgba(0,0,0,0.1)';

    // Добавляем чек на страницу
    const checkContainer = document.createElement('div');
    checkContainer.className = 'check-container';
    checkContainer.innerHTML = `
        <h3>Электронный чек</h3>
        <p>Распечатайте или сохраните чек.</p>
    `;
    checkContainer.appendChild(img);

    // Добавляем контейнер с чеком в интерфейс
    const contentArea = document.getElementById('content-area');
    contentArea.insertBefore(checkContainer, contentArea.firstChild);
}
