import { Stores } from "../constants";
import { AddImageDTO } from "../interfaces";
import {openDatabase} from "../db";

let db: IDBDatabase;



export function AddImage(dto: AddImageDTO): Promise<{ success: boolean; message: string; data?: any }> {
  return new Promise(async (resolve) => {
    try {
      db = await openDatabase("add image");
      const transaction = db.transaction(Stores.Images, "readwrite");
      const store = transaction.objectStore(Stores.Images);

      const query = store.add({id: Date.now(), file: dto.dataUrl});

      query.onsuccess = () => {
        resolve({
          success: true,
          message: "Image added successfully.",
          data: query.result,
        });

        db.close();
      };

      query.onerror = () => {
        resolve({
          success: false,
          message: "Error while trying to add image.",
        });
        db.close();
      };
    } catch (error) {
      if (error instanceof Error) {
        resolve({
          success: false,
          message: error.message,
        });
      } else {
        resolve({
          success: false,
          message: "An unknown error occurred.",
        });
      }
    }
  });
}

