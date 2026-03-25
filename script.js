// Настройки базы данных
const DB_NAME = "BarManagerDB1";
const DB_VERSION = 6;

// Каталог товаров (вложенная структура)
const PRODUCT_CATALOG = {
  Корень: {
      Бар:{
          Алкоголь:{
              Водка:[{ name:"Водка в АС", price:"850" },{ name:"Белуга", price:"1200" },{ name:"Беленькая", price:"650" }],
              Пиво:[{ name:"Стелла безалкогольное", price:"150" },{ name:"Миллер", price:"250" },{ name:"Хадыженское", price:"220" }]
          },
          Безалкогольные:{
              Напитки:[{ name:"Кола", price:"100" },{ name:"Фанта", price:"100" }]
          }
      }
   }
};

let db;
let currentTable = null;
let categoryPath = ['Корень'];

const openRequest = indexedDB.open(DB_NAME, DB_VERSION);
openRequest.onupgradeneeded = function(event) {
    db = event.target.result;

    if (!db.objectStoreNames.contains('table1')) {
        const table1 = db.createObjectStore('table1', { keyPath:'id', autoIncrement:true });
        table1.createIndex('name', 'name', { unique:false });
        table1.createIndex('quantity', 'quantity', { unique:false });
        table1.createIndex('isDone', 'isDone', { unique:false });
        table1.createIndex('timestamp', 'timestamp', { unique:false });
        table1.createIndex('note', 'note', { unique:false });
        table1.createIndex('isNote', 'isNote', { unique:false });
    }

    if (!db.objectStoreNames.contains('table2')) {
        const table2 = db.createObjectStore('table2', { keyPath:'id', autoIncrement:true });
        table2.createIndex('name', 'name', { unique:false });
        table2.createIndex('quantity', 'quantity', { unique:false });
        table2.createIndex('isDone', 'isDone', { unique:false });
        table2.createIndex('timestamp', 'timestamp', { unique:false });
        table2.createIndex('note', 'note', { unique:false });
        table2.createIndex('isNote', 'isNote', { unique:false });
    }
};
openRequest.onsuccess = function(event) {
   db = event.target.result;
   initUI();
};
openRequest.onerror = function(event) {
   console.error("Ошибка открытия базы данных:", event.target.errorCode);
};

function initUI() {
   document.querySelectorAll('.table-btn').forEach(btn => btn.addEventListener('click', () => showTableInterface(btn.dataset.table)));
   simulateTableSelection();
}

function showTableInterface(tableName) {
   currentTable = tableName;
   categoryPath = ['Корень'];
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
               <thead><tr><th>Товар</th><th>Кол-во</th><th>Цена</th><th>Сумма</th><th>Отдал</th><th></th></tr></thead>
               <tbody></tbody>
            </table>
            <div class="notes-block">
               <h3>Заметка к столу</h3>
               <textarea id="note-textarea" placeholder="Введите заметку..." rows="4"></textarea>
               <div class="note-actions">
                  <button id="note-save-btn" class="note-save note-btn">Сохранить</button>
                  <button id="note-delete-btn" class="note-delete note-btn">Удалить</button>
               </div>
            </div>
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
   initNotesBlock();
   updateCurrentTableSum();
}

function showCurrentCategoryContent() {
   const productList = document.getElementById('product-list');
   productList.innerHTML = '';
   let currentLevel = PRODUCT_CATALOG;
   for (let part of categoryPath) currentLevel = currentLevel[part];
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
         btn.addEventListener('click', () => { categoryPath.push(key); showCurrentCategoryContent(); });
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
function selectProduct(product) {
   const modalHTML = `
      <div class="modal-overlay">
         <div class="modal-content">
            <h3>Добавить "${product.name}"</h3>
            <p>Цена за единицу:${product.price} ₽</p>
            <div class="quantity-container">
               <button class="qty-btn minus-two">-2</button>
               <button class="qty-btn minus-one">-1</button>
               <input type="number" id="qty-input" min="0.1" step="0.1" value="1" class="modal-quantity">
               <button class="qty-btn plus-one">+1</button>
               <button class="qty-btn plus-two">+2</button>
            </div><br><br>
            <button id="qty-confirm-btn" class="modal-button">Добавить в заказ</button>
         </div>
      </div>`;
   document.body.insertAdjacentHTML('beforeend', modalHTML);
   const input = document.getElementById('qty-input');
   document.querySelectorAll('.qty-btn').forEach(btn => btn.addEventListener('click', () => {
      let currentQty = parseFloat(input.value);
      switch (btn.className.split(' ').pop()) {
         case 'minus-one': currentQty -= 1; break;
         case 'plus-one': currentQty += 1; break;
         case 'minus-two': currentQty -= 2; break;
         case 'plus-two': currentQty += 2; break;
      }
      if (currentQty < 0.1) currentQty = 0.1;
      input.value = currentQty.toFixed(1);
   }));
   document.getElementById('qty-confirm-btn').addEventListener('click', () => {
      const qty = parseFloat(input.value);
      if (isValidQuantity(qty)) addToOrder(product, qty);
      else alert('Некорректное количество!');
      document.querySelector('.modal-overlay').remove();
   });
}
function updateAllTableSums() {
   const tables = ['table1','table2'];
   tables.forEach(async (tableName) => updateButtonSum(tableName, await calculateTableSum(tableName)));
}
function isValidQuantity(qty) {
   return typeof qty === 'number' && !isNaN(qty) && qty >= 0.1;
}
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
function displayOrders() {
    const tbody = document.querySelector('#order-table tbody');
    tbody.innerHTML = '';
    let totalSum = 0;

    const transaction = db.transaction([currentTable], 'readonly');
    const store = transaction.objectStore(currentTable);

    store.getAll().onsuccess = function(event) {
        const orders = event.target.result.sort((a,b) => b.timestamp - a.timestamp);

        orders.forEach(order => {
            const rowTotal = roundPrice(order.pricePerItem * order.quantity);
            totalSum += rowTotal;

            const tr = document.createElement('tr');
            if (order.isDone) tr.classList.add('done'); // <---- вот тут применяем класс done

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

        const totalRow = document.createElement('tr');
        totalRow.className = 'total-row';
        totalRow.innerHTML = `<td colspan='4' style='text-align:center;'><strong>Итого:</strong></td><td colspan='2'><strong>${roundPrice(totalSum)} ₽</strong></td>`;
        tbody.appendChild(totalRow);
    };
}
function roundPrice(price) {
 return Math.round(price * 100) / 100;
}
function deleteOrder(id) {
 const transaction = db.transaction([currentTable], 'readwrite');
 const store = transaction.objectStore(currentTable);
 store.delete(id).onsuccess = () => displayOrders();
 updateCurrentTableSum();
}
function deleteLastOrder() {
 if (!currentTable) return alert('Выберите стол');
 const transaction = db.transaction([currentTable], 'readwrite');
 const store = transaction.objectStore(currentTable);
 store.getAll().onsuccess = function(event) {
 const orders = event.target.result.sort((a,b)=>b.timestamp-a.timestamp);
 if (orders.length===0) return alert('Заказ пуст');
 store.delete(orders[orders.length-1].id).onsuccess=()=>displayOrders();
 updateCurrentTableSum();
 };
}
function clearTable() {
 if (!currentTable) return alert('Выберите стол');
 if (!confirm('Очистить весь стол?')) return;
 const transaction = db.transaction([currentTable], 'readwrite');
 const store = transaction.objectStore(currentTable);
 store.clear().onsuccess=()=>displayOrders();
 clearNote();
 updateCurrentTableSum();
}
function updateButtonSum(tableName, totalSum) {
 const button=document.querySelector(`.table-btn[data-table="${tableName}"]`);
 if(button){
     const span=button.querySelector('.order-sum');
     span.textContent=roundPrice(totalSum);
 }
}
function updateCurrentTableSum() {
 if (!currentTable) return;
 calculateTableSum(currentTable).then(total=>updateButtonSum(currentTable,total));
}
async function calculateTableSum(tableName){
 try{
     const orders=await IDBPromise(tableName,'readonly',store=>store.getAll());
     let totalSum=orders.reduce((sum,o)=>sum+roundPrice(o.pricePerItem*o.quantity),0);
     return totalSum;
 }catch(e){return 0;}
}
function IDBPromise(storeName,mode,operation){
 return new Promise((resolve,reject)=>{
     const transaction=db.transaction(storeName,mode);
     const store=transaction.objectStore(storeName);
     const req=operation(store);
     req.onsuccess=()=>resolve(req.result);
     req.onerror=reject;
 });
}
function simulateTableSelection(){
 const tables=['table1','table2'];
 tables.forEach(tableName=>refreshTableSumWithoutOpening(tableName));
}
function refreshTableSumWithoutOpening(tableName){
 calculateTableSum(tableName).then(total=>updateButtonSum(tableName,total));
}
// --- ЗАМЕТКА ---
async function initNotesBlock(){
 const textarea=document.getElementById('note-textarea');
 const saveBtn=document.getElementById('note-save-btn');
 const deleteBtn=document.getElementById('note-delete-btn');
 loadNote().then(note=>textarea.value=note||'');
 saveBtn.addEventListener('click',saveNote);
 deleteBtn.addEventListener('click',deleteNote);
 addHover(saveBtn,'note-save'); addHover(deleteBtn,'note-delete');
}
async function loadNote(){
 if(!currentTable)return '';
 return new Promise(resolve=>{
     const tx=db.transaction([currentTable],'readonly');
     tx.objectStore(currentTable).get('note').onsuccess=e=>resolve(e.target.result?e.target.result.value:'');
 });
}
function saveNote(){
 if(!currentTable)return alert('Выберите стол');
 const textarea=document.getElementById('note-textarea');
 const noteText=textarea.value.trim();
 const tx=db.transaction([currentTable],'readwrite');
 tx.objectStore(currentTable).put({id:'note',value:noteText});
 alert('Заметка сохранена');
}
function deleteNote(){
 if(!currentTable)return alert('Выберите стол');
 if(!confirm('Удалить заметку?'))return ;
 clearNote();
 alert('Заметка удалена');
}
function clearNote(){
 document.getElementById('note-textarea').value='';
 const tx=db.transaction([currentTable],'readwrite');
 tx.objectStore(currentTable).delete('note');
}
// --- ГАЛОЧКА "ОТДАЛ" ---
function toggleDone(id){
 const tx=db.transaction([currentTable],'readwrite');
 tx.objectStore(currentTable).get(id).onsuccess=e=>{
     const order=e.target.result;
     order.isDone=!order.isDone;
     tx.objectStore(currentTable).put(order);
 };
 displayOrders();
 updateCurrentTableSum();
}
// --- HOVER ---
function addHover(el,cls){el.addEventListener('mouseenter',()=>el.classList.add(cls+'hovered'));el.addEventListener('mouseleave',()=>el.classList.remove(cls+'hovered'));}