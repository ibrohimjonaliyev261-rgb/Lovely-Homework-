// Lovely Homework! - IndexedDB Database Engine
// Full offline & local persistent storage for heavy media (photos, videos, subtitles)

const DB_NAME = 'LovelyHomeworkDB';
const DB_VERSION = 1;

class HomeworkDB {
  constructor() {
    this.db = null;
    this.initPromise = this.init();
  }

  async init() {
    return new Promise((resolve, reject) => {
      const request = indexedDB.open(DB_NAME, DB_VERSION);

      request.onupgradeneeded = (event) => {
        const db = event.target.result;

        // Users store
        if (!db.objectStoreNames.contains('users')) {
          const userStore = db.createObjectStore('users', { keyPath: 'id' });
          userStore.createIndex('role', 'role', { unique: false });
          userStore.createIndex('level', 'level', { unique: false });
          userStore.createIndex('email', 'email', { unique: false });
          userStore.createIndex('status', 'status', { unique: false });
        }

        // Homework store
        if (!db.objectStoreNames.contains('homework')) {
          const hwStore = db.createObjectStore('homework', { keyPath: 'id' });
          hwStore.createIndex('level', 'level', { unique: false });
          hwStore.createIndex('teacherId', 'teacherId', { unique: false });
          hwStore.createIndex('createdAt', 'createdAt', { unique: false });
        }

        // Submissions store
        if (!db.objectStoreNames.contains('submissions')) {
          const subStore = db.createObjectStore('submissions', { keyPath: 'id' });
          subStore.createIndex('homeworkId', 'homeworkId', { unique: false });
          subStore.createIndex('studentId', 'studentId', { unique: false });
          subStore.createIndex('level', 'level', { unique: false });
        }

        // Materials & Video Lessons store
        if (!db.objectStoreNames.contains('materials')) {
          const matStore = db.createObjectStore('materials', { keyPath: 'id' });
          matStore.createIndex('level', 'level', { unique: false });
          matStore.createIndex('category', 'category', { unique: false });
        }

        // Fun Time store (Movies, Cartoons, TV Series)
        if (!db.objectStoreNames.contains('funtime')) {
          const funStore = db.createObjectStore('funtime', { keyPath: 'id' });
          funStore.createIndex('category', 'category', { unique: false });
        }

        // Notifications store
        if (!db.objectStoreNames.contains('notifications')) {
          const notifStore = db.createObjectStore('notifications', { keyPath: 'id' });
          notifStore.createIndex('recipientId', 'recipientId', { unique: false });
          notifStore.createIndex('createdAt', 'createdAt', { unique: false });
        }

        // Settings / Key-Value store
        if (!db.objectStoreNames.contains('settings')) {
          db.createObjectStore('settings', { keyPath: 'key' });
        }
      };

      request.onsuccess = (event) => {
        this.db = event.target.result;
        resolve(this.db);
      };

      request.onerror = (event) => {
        console.error('IndexedDB error:', event.target.error);
        reject(event.target.error);
      };
    });
  }

  async getStore(storeName, mode = 'readonly') {
    await this.initPromise;
    const tx = this.db.transaction(storeName, mode);
    return tx.objectStore(storeName);
  }

  async getAll(storeName) {
    await this.initPromise;
    return new Promise((resolve, reject) => {
      const tx = this.db.transaction(storeName, 'readonly');
      const store = tx.objectStore(storeName);
      const req = store.getAll();
      req.onsuccess = () => resolve(req.result || []);
      req.onerror = () => reject(req.error);
    });
  }

  async get(storeName, id) {
    await this.initPromise;
    return new Promise((resolve, reject) => {
      const tx = this.db.transaction(storeName, 'readonly');
      const store = tx.objectStore(storeName);
      const req = store.get(id);
      req.onsuccess = () => resolve(req.result);
      req.onerror = () => reject(req.error);
    });
  }

  async put(storeName, item) {
    await this.initPromise;
    return new Promise((resolve, reject) => {
      const tx = this.db.transaction(storeName, 'readwrite');
      const store = tx.objectStore(storeName);
      const req = store.put(item);
      req.onsuccess = () => resolve(req.result);
      req.onerror = () => reject(req.error);
    });
  }

  async add(storeName, item) {
    return this.put(storeName, item);
  }

  async delete(storeName, id) {
    await this.initPromise;
    return new Promise((resolve, reject) => {
      const tx = this.db.transaction(storeName, 'readwrite');
      const store = tx.objectStore(storeName);
      const req = store.delete(id);
      req.onsuccess = () => resolve(true);
      req.onerror = () => reject(req.error);
    });
  }

  async clear(storeName) {
    await this.initPromise;
    return new Promise((resolve, reject) => {
      const tx = this.db.transaction(storeName, 'readwrite');
      const store = tx.objectStore(storeName);
      const req = store.clear();
      req.onsuccess = () => resolve(true);
      req.onerror = () => reject(req.error);
    });
  }

  async getSetting(key, defaultValue = null) {
    try {
      const res = await this.get('settings', key);
      return res ? res.value : defaultValue;
    } catch {
      return defaultValue;
    }
  }

  async setSetting(key, value) {
    return this.put('settings', { key, value });
  }

  // Helper query by index
  async getByIndex(storeName, indexName, value) {
    await this.initPromise;
    return new Promise((resolve, reject) => {
      const tx = this.db.transaction(storeName, 'readonly');
      const store = tx.objectStore(storeName);
      const index = store.index(indexName);
      const req = index.getAll(value);
      req.onsuccess = () => resolve(req.result || []);
      req.onerror = () => reject(req.error);
    });
  }

  // Backup export
  async exportAllData() {
    const stores = ['users', 'homework', 'submissions', 'materials', 'funtime', 'notifications', 'settings'];
    const exportObj = {};
    for (const name of stores) {
      exportObj[name] = await this.getAll(name);
    }
    return JSON.stringify(exportObj, null, 2);
  }

  // Backup restore
  async importAllData(jsonData) {
    const data = typeof jsonData === 'string' ? JSON.parse(jsonData) : jsonData;
    for (const [storeName, items] of Object.entries(data)) {
      if (Array.isArray(items)) {
        await this.clear(storeName);
        for (const item of items) {
          await this.put(storeName, item);
        }
      }
    }
    return true;
  }
}

// Global instance
window.appDB = new HomeworkDB();
