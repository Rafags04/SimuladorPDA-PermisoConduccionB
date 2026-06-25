const DB_NAME = 'simulador_permiso_b_db';
const DB_VERSION = 5;

let dbPromise;

export function makeId(prefix = 'id') {
  return `${prefix}_${Date.now().toString(36)}_${Math.random().toString(36).slice(2, 10)}`;
}

export function openDatabase() {
  if (dbPromise) return dbPromise;

  dbPromise = new Promise((resolve, reject) => {
    if (!('indexedDB' in window)) {
      reject(new Error('IndexedDB no está disponible en este navegador.'));
      return;
    }

    const request = indexedDB.open(DB_NAME, DB_VERSION);

    request.onupgradeneeded = () => {
      const db = request.result;

      if (!db.objectStoreNames.contains('simulations')) {
        const store = db.createObjectStore('simulations', { keyPath: 'id' });
        store.createIndex('updatedAt', 'updatedAt');
        store.createIndex('studentId', 'studentId');
      } else {
        const store = request.transaction.objectStore('simulations');
        if (!store.indexNames.contains('studentId')) store.createIndex('studentId', 'studentId');
      }

      if (!db.objectStoreNames.contains('students')) {
        const store = db.createObjectStore('students', { keyPath: 'id' });
        store.createIndex('name', 'name');
        store.createIndex('updatedAt', 'updatedAt');
      }

      if (!db.objectStoreNames.contains('settings')) {
        db.createObjectStore('settings', { keyPath: 'key' });
      }
    };

    request.onsuccess = () => resolve(request.result);
    request.onerror = () => reject(request.error);
    request.onblocked = () => reject(new Error('La base de datos está bloqueada por otra pestaña abierta.'));
  });

  return dbPromise;
}

function tx(storeName, mode = 'readonly') {
  return openDatabase().then((db) => db.transaction(storeName, mode).objectStore(storeName));
}

function requestToPromise(request) {
  return new Promise((resolve, reject) => {
    request.onsuccess = () => resolve(request.result);
    request.onerror = () => reject(request.error);
  });
}

export async function putSimulation(simulation) {
  const store = await tx('simulations', 'readwrite');
  await requestToPromise(store.put(simulation));
  return simulation;
}

export async function getSimulation(id) {
  const store = await tx('simulations');
  return requestToPromise(store.get(id));
}

export async function deleteSimulation(id) {
  const store = await tx('simulations', 'readwrite');
  return requestToPromise(store.delete(id));
}

export async function listSimulations() {
  const store = await tx('simulations');
  const rows = await requestToPromise(store.getAll());
  return rows.sort((a, b) => String(b.updatedAt || '').localeCompare(String(a.updatedAt || '')));
}

export async function putStudent(student) {
  const store = await tx('students', 'readwrite');
  await requestToPromise(store.put(student));
  return student;
}

export async function getStudent(id) {
  const store = await tx('students');
  return requestToPromise(store.get(id));
}

export async function deleteStudent(id) {
  const store = await tx('students', 'readwrite');
  return requestToPromise(store.delete(id));
}

export async function listStudents() {
  const store = await tx('students');
  const rows = await requestToPromise(store.getAll());
  return rows.sort((a, b) => String(a.name || '').localeCompare(String(b.name || ''), 'es'));
}

export async function putSetting(key, value) {
  const store = await tx('settings', 'readwrite');
  return requestToPromise(store.put({ key, value }));
}

export async function getSetting(key, fallback = null) {
  const store = await tx('settings');
  const row = await requestToPromise(store.get(key));
  return row ? row.value : fallback;
}