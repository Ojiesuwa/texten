"use client";

import { emitDBChange } from "./dbEvent"; // make sure this is correctly pathed

const DB_NAME = "MyCustomDB";
const DB_VERSION = 3;

function openDB(): Promise<IDBDatabase> {
  return new Promise((resolve, reject) => {
    const request = indexedDB.open(DB_NAME, DB_VERSION);

    request.onupgradeneeded = () => {
      const db = request.result;
      if (!db.objectStoreNames.contains("files")) {
        db.createObjectStore("files", { keyPath: "id" });
      }
    };

    request.onsuccess = () => resolve(request.result);
    request.onerror = () => reject(request.error);
  });
}

function generateId(): string {
  return crypto.randomUUID();
}

export async function storeFile(file: Blob): Promise<string> {
  const db = await openDB();
  const id = generateId();

  return new Promise((resolve, reject) => {
    const tx = db.transaction("files", "readwrite");
    const store = tx.objectStore("files");
    const request = store.add({ id, file });

    request.onsuccess = () => {
      emitDBChange();
      resolve(id);
    };
    request.onerror = () => reject(request.error);
  });
}

export async function fetchFileById(id: string): Promise<Blob | null> {
  const db = await openDB();

  return new Promise((resolve, reject) => {
    const tx = db.transaction("files", "readonly");
    const store = tx.objectStore("files");
    const request = store.get(id);

    request.onsuccess = () => {
      const result = request.result;
      resolve(result ? result.file : null);
    };
    request.onerror = () => reject(request.error);
  });
}

export async function storeDocument(
  collectionName: string,
  data: any
): Promise<string> {
  const db = await openDB();
  const id = generateId();

  return new Promise((resolve, reject) => {
    if (!db.objectStoreNames.contains(collectionName)) {
      const version = db.version + 1;
      db.close();
      const req = indexedDB.open(DB_NAME, version);
      req.onupgradeneeded = () => {
        const upgradedDB = req.result;
        upgradedDB.createObjectStore(collectionName, { keyPath: "id" });
      };
      req.onsuccess = () => {
        const newDB = req.result;
        const tx = newDB.transaction(collectionName, "readwrite");
        const store = tx.objectStore(collectionName);
        store.add({ ...data, id });
        tx.oncomplete = () => {
          emitDBChange();
          resolve(id);
        };
        tx.onerror = () => reject(tx.error);
      };
    } else {
      const tx = db.transaction(collectionName, "readwrite");
      const store = tx.objectStore(collectionName);
      store.add({ ...data, id });
      tx.oncomplete = () => {
        emitDBChange();
        resolve(id);
      };
      tx.onerror = () => reject(tx.error);
    }
  });
}

export async function getDocumentById(
  collectionName: string,
  id: string
): Promise<any | null> {
  const db = await openDB();

  return new Promise((resolve, reject) => {
    const tx = db.transaction(collectionName, "readonly");
    const store = tx.objectStore(collectionName);
    const request = store.get(id);

    request.onsuccess = () => resolve(request.result || null);
    request.onerror = () => reject(request.error);
  });
}

export async function getCollection(collectionName: string): Promise<any[]> {
  const db = await openDB();

  return new Promise((resolve, reject) => {
    const tx = db.transaction(collectionName, "readonly");
    const store = tx.objectStore(collectionName);
    const request = store.getAll();

    request.onsuccess = () => resolve(request.result);
    request.onerror = () => reject(request.error);
  });
}

export async function deleteDocument(
  collectionName: string,
  id: string
): Promise<void> {
  const db = await openDB();

  return new Promise((resolve, reject) => {
    const tx = db.transaction(collectionName, "readwrite");
    const store = tx.objectStore(collectionName);
    const request = store.delete(id);

    request.onsuccess = () => {
      emitDBChange();
      resolve();
    };
    request.onerror = () => reject(request.error);
  });
}

export async function updateDocument<T = any>(
  collectionName: string,
  id: string,
  updates: Partial<T>
): Promise<void> {
  const db = await openDB();

  return new Promise((resolve, reject) => {
    const tx = db.transaction(collectionName, "readwrite");
    const store = tx.objectStore(collectionName);

    const getRequest = store.get(id);
    getRequest.onsuccess = () => {
      const existing = getRequest.result;
      if (!existing) {
        reject(
          new Error(`Document with id '${id}' not found in '${collectionName}'`)
        );
        return;
      }

      const updated = { ...existing, ...updates };
      const putRequest = store.put(updated);

      putRequest.onsuccess = () => {
        emitDBChange();
        resolve();
      };
      putRequest.onerror = () => reject(putRequest.error);
    };

    getRequest.onerror = () => reject(getRequest.error);
  });
}
export async function deleteFile(id: string): Promise<void> {
  const db = await openDB();

  return new Promise((resolve, reject) => {
    const tx = db.transaction("files", "readwrite");
    const store = tx.objectStore("files");
    const request = store.delete(id);

    request.onsuccess = () => {
      emitDBChange();
      resolve();
    };
    request.onerror = () => reject(request.error);
  });
}

export const checkIndexedDBUsage = async () => {
  if ("storage" in navigator && "estimate" in navigator.storage) {
    const { usage, quota } = await navigator.storage.estimate();

    console.log(`Used: ${usage} bytes`);
    console.log(`Quota: ${quota} bytes`);

    const percentageUsed = ((usage ?? 0 / (quota ?? 0)) * 100).toFixed(2);
    console.log(
      `You are using approximately ${percentageUsed}% of your storage quota.`
    );
    return { usage, quota };
  } else {
    console.log("StorageManager API not supported on this browser.");
  }
};
