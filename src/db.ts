import { DBName, version,  Stores } from "./constants";

let request: IDBOpenDBRequest;
let db: IDBDatabase;

export function openDatabase(purpose: string): Promise<IDBDatabase> {
  return new Promise((resolve, reject) => {
    const request = indexedDB.open(DBName, version);

    request.onsuccess = () => {
      resolve(request.result);
    };

    request.onerror = () => {
      const error = request.error;
      reject(new Error(`Error connecting to database to ${purpose}: ${error?.message || "Unknown error"}`));
    };

  });
}

export function InitDB() {
  return new Promise((resolve) => {
    request = indexedDB.open(DBName, version);

    request.onupgradeneeded = () => {
      db = request.result;
      if (!db.objectStoreNames.contains(Stores.Recipes)) {
        const store = db.createObjectStore(Stores.Recipes, { keyPath: "id" });
        store.createIndex("isFavorite", ["isFavorite"], { unique: false });
      }

      if (!db.objectStoreNames.contains(Stores.Categories)) {
        db.createObjectStore(Stores.Categories, { keyPath: "id" });
      }

      if (!db.objectStoreNames.contains(Stores.Images)) {
        db.createObjectStore(Stores.Images, { keyPath: "id" })
      }
    };

    request.onsuccess = () => {
      db = request.result;
      //version = db.version;
      resolve(true);
      db.close();
    };

    request.onerror = () => resolve(false);
  });
}
