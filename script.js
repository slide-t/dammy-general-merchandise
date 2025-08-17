<script>
// --- IndexedDB Setup ---
let db;
const request = indexedDB.open("DammyStoreDB", 1);

request.onupgradeneeded = (e) => {
  db = e.target.result;
  if (!db.objectStoreNames.contains("sales")) {
    db.createObjectStore("sales", { keyPath: "id", autoIncrement: true });
  }
  if (!db.objectStoreNames.contains("stock")) {
    db.createObjectStore("stock", { keyPath: "id", autoIncrement: true });
  }
};

request.onsuccess = (e) => {
  db = e.target.result;
  console.log("✅ IndexedDB connected");

  // Load existing data from IndexedDB into your tables
  loadStockFromDB();
  loadSalesFromDB();
};

request.onerror = (e) => {
  console.error("❌ IndexedDB error:", e.target.errorCode);
};

// --- Save to IndexedDB ---
function saveStockToDB(item) {
  const tx = db.transaction("stock", "readwrite");
  tx.objectStore("stock").add(item);
}

function saveSaleToDB(sale) {
  const tx = db.transaction("sales", "readwrite");
  tx.objectStore("sales").add(sale);
}

// --- Load from IndexedDB ---
function loadStockFromDB() {
  const tx = db.transaction("stock", "readonly");
  const store = tx.objectStore("stock");
  store.openCursor().onsuccess = (e) => {
    const cursor = e.target.result;
    if (cursor) {
      addStockRow(cursor.value); // <-- call your existing table-render function
      cursor.continue();
    }
  };
}

function loadSalesFromDB() {
  const tx = db.transaction("sales", "readonly");
  const store = tx.objectStore("sales");
  store.openCursor().onsuccess = (e) => {
    const cursor = e.target.result;
    if (cursor) {
      addSalesRow(cursor.value); // <-- call your existing table-render function
      cursor.continue();
    }
  };
}

// --- Example Hooks (connect to your existing add stock/sales functions) ---
function addNewStock(itemName, qty, price) {
  const item = { itemName, qty, price, date: new Date().toISOString() };
  saveStockToDB(item);
  addStockRow(item); // existing table update
}

function addNewSale(product, qty, amount) {
  const sale = { product, qty, amount, date: new Date().toISOString() };
  saveSaleToDB(sale);
  addSalesRow(sale); // existing table update
}
</script>
