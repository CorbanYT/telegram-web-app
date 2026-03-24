// --- Настройки БД ---
const DB_NAME = "BarTablesDB";
const DB_VERSION = 1; // Если изменим структуру, нужно увеличить версию

// --- Данные каталога товаров ---
const CATALOG = {
    Пиво: [
        { name: "Стела безалкогольная", price: 150 },
        { name: "Миллер", price: 250 },
        { name: "Хадыженское", price: 220 }
     ],
     Водка: [
         { name: "Белуга", price: 1200 },
         { name: "Беленькая", price: 650 }
     ]
};

let db; // Ссылка на открытую БД
let currentTable = null; // Текущий стол (table1 или table2)
let currentCategory = null; // Текущая категория (Пиво или Водка)
let selectedProduct = null; // Выбранный товар для добавления

// --- Открытие БД и создание структуры ---
const request = indexedDB.open(DB_NAME, DB_VERSION);

request.onupgradeneeded = function(event) {
     db = event.target.result;
     // Создаем хранилища для каждого стола, если их нет
     if (!db.objectStoreNames.contains('table1')) {
         db.createObjectStore('table1', { keyPath: 'id', autoIncrement:true });
     }
     if (!db.objectStoreNames.contains('table2')) {
         db.createObjectStore('table2', { keyPath: 'id', autoIncrement:true });
     }
};

request.onsuccess = function(event) {
     db = event.target.result;
     initUI(); // Инициализируем интерфейс после открытия БД
};

request.onerror = function(event) {
     console.error("Ошибка БД:", event.target.errorCode);
};

// --- Инициализация интерфейса ---
function initUI() {
     document.querySelectorAll('.table-btn').forEach(btn => {
         btn.addEventListener('click', () => showTableInterface(btn.dataset.table));
     });
 }

// --- Показать интерфейс конкретного стола ---
function showTableInterface(tableName) {
     currentTable = tableName; // Запоминаем текущий стол

     const contentArea = document.getElementById('content-area');
     contentArea.innerHTML = `
         <div class="menu-column">
             <h2>Категории</h2>
             <button class="category-btn" data-category="Пиво">Пиво</button>
             <button class="category-btn" data-category="Водка">Водка</button>
             
             <div class="product-list" id="product-list">
                 <!-- Список товаров появится здесь -->
             </div>
         </div>
         
         <div class="check-column">
             <h2>Список заказов (Стол ${currentTable})</h2>
             <table class="order-table" id="order-table">
                 <thead>
                     <tr><th>Товар</th><th>Кол-во</th><th>Цена</th><th>Сумма</th><th></th></tr>
                 </thead>
                 <tbody>
                     <!-- Строки заказа появятся здесь -->
                 </tbody>
             </table>
             <div class="action-btns">
                 <button class="btn-delete">Удалить выбранный товар</button>
                 <button class="btn-clear">Очистить весь стол</button>
             </div>
         </div>
     `;

     // Слушатели категорий
     document.querySelectorAll('.category-btn').forEach(btn => {
         btn.addEventListener('click', () => showProducts(btn.dataset.category));
     });

     // Слушатели кнопок действий
     document.querySelector('.btn-delete').addEventListener('click', deleteSelectedOrder);
     document.querySelector('.btn-clear').addEventListener('click', clearTable);

     // Показываем товары первой категории по умолчанию и загружаем заказ
     showProducts('Пиво');
     displayOrders();
 }

// --- Показать список товаров категории ---
function showProducts(category) {
     currentCategory = category; // Запоминаем категорию

     const productList = document.getElementById('product-list');
     productList.innerHTML = ''; // Очищаем список

     document.querySelectorAll('.category-btn').forEach(btn => btn.classList.remove('active'));
     document.querySelector(`[data-category="${category}"]`).classList.add('active');

     CATALOG[category].forEach(item => {
          const div = document.createElement('div');
          div.className = 'product-item';
          div.textContent = `${item.name} — ${item.price} ₽`;
          div.dataset.name = item.name; // Сохраняем имя для обработки клика
          div.addEventListener('click', () => selectProduct(item));
          productList.appendChild(div);
      });
 }

// --- Выбор товара для добавления в заказ ---
function selectProduct(product) {
      selectedProduct = product; // Сохраняем выбранный товар

      // Создаем модальное окно для ввода количества
      const modalHTML = `
          <div class="quantity-modal">
              <div class="quantity-modal-content">
                  <h3>Добавить "${product.name}"</h3>
                  <p>Цена за штуку: ${product.price} ₽</p>
                  <input type="number" id="qty-input" min="1" value="1" style="width:60px; text-align:center;">
                  <br><br>
                  <button id="qty-confirm-btn">Добавить в заказ</button>
              </div>
          </div>
      `;
      document.body.insertAdjacentHTML('beforeend', modalHTML);

      document.getElementById('qty-confirm-btn').addEventListener('click', () => {
          const qty = parseInt(document.getElementById('qty-input').value);
          if (qty > 0) {
              addToOrder(product, qty);
          }
          // Закрываем модальное окно
          document.querySelector('.quantity-modal').remove();
      });
 }

// --- Добавить товар в заказ (в IndexedDB) ---
function addToOrder(product, quantity) {
      const transaction = db.transaction([currentTable], 'readwrite');
      const store = transaction.objectStore(currentTable);
      
      store.add({ name: product.name, pricePerItem: product.price, quantity });
      
      transaction.oncomplete = () => {
          displayOrders(); // Обновляем список на экране
      };
 }

// --- Отобразить список заказов на экране ---
function displayOrders() {
      const tbody = document.querySelector('#order-table tbody');
      tbody.innerHTML = ''; // Очищаем таблицу

      const transaction = db.transaction([currentTable], 'readonly');
      const store = transaction.objectStore(currentTable);
      
      store.getAll().onsuccess = function(event) {
          const orders = event.target.result || [];
          
          let totalSum = 0; // Общая сумма стола

          orders.forEach(order => {
              const rowTotal = order.pricePerItem * order.quantity;
              totalSum += rowTotal;
              
              const tr = document.createElement('tr');
              tr.innerHTML = `
                  <td>${order.name}</td>
                  <td>${order.quantity}</td>
                  <td>${order.pricePerItem} ₽</td>
                  <td>${rowTotal} ₽</td>
                  <td><button class="delete-row-btn" data-id="${order.id}">✖</button></td>
              `;
              tbody.appendChild(tr);
              
              // Слушатель удаления конкретной строки (для красоты)
              tr.querySelector('.delete-row-btn').addEventListener('click', () => deleteOrder(order.id));
          });
          
          // Отображаем общую сумму внизу (можно добавить отдельный элемент)
          const totalRow = document.createElement('tr');
          totalRow.innerHTML = `<td colspan="3" style="text-align:right; font-weight:bold;">Итого:</td><td colspan="2" style="font-weight:bold;">${totalSum} ₽</td>`;
          tbody.appendChild(totalRow);
      };
 }

// --- Удалить конкретный товар из заказа ---
function deleteOrder(id) {
      const transaction = db.transaction([currentTable], 'readwrite');
      const store = transaction.objectStore(currentTable);
      
      store.delete(id).onsuccess = () => displayOrders();
 }

// --- Удалить выбранный товар (из списка чекбоксов или выделенной строки) ---
// В этой реализации удаляем последнюю добавленную запись как пример логики "выбранного"
function deleteSelectedOrder() {
      if (!currentTable) return alert('Выберите стол');
      
      const transaction = db.transaction([currentTable], 'readwrite');
      const store = transaction.objectStore(currentTable);
      
      // Получаем все записи, чтобы найти последнюю (или реализовать выделение)
      store.getAll().onsuccess = function(event) {
          const orders = event.target.result || [];
          if (orders.length === 0) return alert('Заказ пуст');
          
          // Удаляем последнюю добавленную запись (самую "свежую")
          const lastOrder = orders[orders.length - 1];
          
          store.delete(lastOrder.id).onsuccess = () => displayOrders();
      };
 }

// --- Очистить весь стол ---
function clearTable() {
      if (!currentTable) return alert('Выберите стол');
      
      if (!confirm('Вы уверены, что хотите очистить весь стол?')) return;
      
      const transaction = db.transaction([currentTable], 'readwrite');
      const store = transaction.objectStore(currentTable);
      
      store.clear().onsuccess = () => displayOrders();
}
