const DB_NAME = 'simulador-permiso-b';
const DB_VERSION = 1;
const STORE_SIMULATIONS = 'simulations';
const STORE_SETTINGS = 'settings';

let dbPromise;

export function openDatabase() {
  if (dbPromise) return dbPromise;

  dbPromise = new Promise((resolve, reject) => {
    const request = indexedDB.open(DB_NAME, DB_VERSION);

    request.onupgradeneeded = () => {
      const db = request.result;
      if (!db.objectStoreNames.contains(STORE_SIMULATIONS)) {
        const store = db.createObjectStore(STORE_SIMULATIONS, { keyPath: 'id' });
        store.createIndex('updatedAt', 'updatedAt');
        store.createIndex('createdAt', 'createdAt');
        store.createIndex('studentName', 'studentName');
      }
      if (!db.objectStoreNames.contains(STORE_SETTINGS)) {
        db.createObjectStore(STORE_SETTINGS, { keyPath: 'key' });
      }
    };

    request.onsuccess = () => resolve(request.result);
    request.onerror = () => reject(request.error);
  });

  return dbPromise;
}

function transaction(storeName, mode = 'readonly') {
  return openDatabase().then((db) => db.transaction(storeName, mode).objectStore(storeName));
}

export async function putSimulation(simulation) {
  const store = await transaction(STORE_SIMULATIONS, 'readwrite');
  return new Promise((resolve, reject) => {
    const request = store.put(simulation);
    request.onsuccess = () => resolve(simulation);
    request.onerror = () => reject(request.error);
  });
}

export async function getSimulation(id) {
  const store = await transaction(STORE_SIMULATIONS);
  return new Promise((resolve, reject) => {
    const request = store.get(id);
    request.onsuccess = () => resolve(request.result || null);
    request.onerror = () => reject(request.error);
  });
}

export async function deleteSimulation(id) {
  const store = await transaction(STORE_SIMULATIONS, 'readwrite');
  return new Promise((resolve, reject) => {
    const request = store.delete(id);
    request.onsuccess = () => resolve(true);
    request.onerror = () => reject(request.error);
  });
}

export async function listSimulations() {
  const store = await transaction(STORE_SIMULATIONS);
  return new Promise((resolve, reject) => {
    const request = store.getAll();
    request.onsuccess = () => {
      const rows = request.result || [];
      rows.sort((a, b) => new Date(b.updatedAt || b.createdAt) - new Date(a.updatedAt || a.createdAt));
      resolve(rows);
    };
    request.onerror = () => reject(request.error);
  });
}

export async function putSetting(key, value) {
  const store = await transaction(STORE_SETTINGS, 'readwrite');
  return new Promise((resolve, reject) => {
    const request = store.put({ key, value });
    request.onsuccess = () => resolve(value);
    request.onerror = () => reject(request.error);
  });
}

export async function getSetting(key) {
  const store = await transaction(STORE_SETTINGS);
  return new Promise((resolve, reject) => {
    const request = store.get(key);
    request.onsuccess = () => resolve(request.result?.value ?? null);
    request.onerror = () => reject(request.error);
  });
}

export function makeId(prefix = 'sim') {
  const random = crypto.getRandomValues(new Uint32Array(2));
  return `${prefix}_${Date.now().toString(36)}_${Array.from(random).map((n) => n.toString(36)).join('')}`;
}
