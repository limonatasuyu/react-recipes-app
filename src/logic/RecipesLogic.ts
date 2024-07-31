import {
  AddRecipeDTO,
  GetRecipeDTO,
  UpdateRecipeDTO,
  DeleteRecipeDTO,
  RecipeData,
} from "../interfaces";
import { Stores } from "../constants";
import { openDatabase } from "../db";

let db: IDBDatabase;

export function GetAllRecipes(): Promise<
  | { success: false; message: string }
  | { success: true; message: string; data: RecipeData[] }
> {
  return new Promise(async (resolve) => {
    try {
      db = await openDatabase("get all recipes");
      const transaction = db.transaction(Stores.Recipes, "readonly");
      const store = transaction.objectStore(Stores.Recipes);
      const query = store.getAll();

      query.onsuccess = () => {
        resolve({
          success: true,
          message: "Recipes retrieved successfully.",
          data: query.result,
        });
        db.close();
      };

      query.onerror = () => {
        resolve({
          success: false,
          message: "Error while trying to get recipes.",
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

export function GetRecipeById(dto: GetRecipeDTO): Promise<
  | { success: false; message: string }
  | {
      success: true;
      message: string;
      data: {
        name: string;
        ingredients: string[];
        description: string;
        instructions: string;
        categoryId: number;
        imageDataUrl?: string;
      };
    }
> {
  return new Promise(async (resolve) => {
    try {
      db = await openDatabase("get recipe");
      const transaction = db.transaction(Stores.Recipes, "readonly");
      const store = transaction.objectStore(Stores.Recipes);
      const query = store.get(dto.id);

      query.onsuccess = () => {
        resolve({
          success: true,
          message: "Recipe retrieved successfully.",
          data: query.result,
        });
        db.close();
      };

      query.onerror = () => {
        resolve({
          success: false,
          message: "Error while trying to get data.",
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

export function GetFavoriteRecipes(): Promise<any> {
  return new Promise(async (resolve) => {
    try {
      db = await openDatabase("get favorite recipes");
      const transaction = db.transaction(Stores.Recipes, "readonly");
      const store = transaction.objectStore(Stores.Recipes);
      const isFavoriteIndex = store.index("isFavorite");
      const query = isFavoriteIndex.getAll(["true"]);

      query.onsuccess = () => {
        resolve({
          success: true,
          message: "Favorite recipes retrieved successfully.",
          data: query.result,
        });
        db.close();
      };

      query.onerror = () => {
        resolve({
          success: false,
          message: "Error while trying to get data.",
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

export function UpdateRecipe(dto: UpdateRecipeDTO): Promise<any> {
  return new Promise(async (resolve) => {
    try {
      db = await openDatabase("update recipe");
      const transaction = db.transaction(Stores.Recipes, "readwrite");
      const store = transaction.objectStore(Stores.Recipes);
      const query = store.get(dto.id);

      query.onsuccess = () => {
        const recipe = query.result;
        if (recipe) {
          recipe.name = dto.name;
          recipe.ingredients = dto.ingredients;
          recipe.description = dto.description;
          recipe.categoryId = dto.categoryId;
          recipe.isFavorite = dto.isFavorite;
          store.put(recipe);

          resolve({
            success: true,
            message: "Recipe updated successfully.",
          });
        } else {
          resolve({
            success: false,
            message: "Recipe not found.",
          });
        }
        db.close();
      };

      query.onerror = () => {
        resolve({
          success: false,
          message: "Error while trying to update recipe.",
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

export function AddRecipe(dto: AddRecipeDTO): Promise<any> {
  return new Promise(async (resolve) => {
    try {
      db = await openDatabase("add recipe");
      const transaction = db.transaction(Stores.Recipes, "readwrite");
      const store = transaction.objectStore(Stores.Recipes);
      const id = Date.now();
      const query = store.add({ ...dto, id: id, isFavorite: false });

      query.onsuccess = () => {
        resolve({
          success: true,
          message: "Recipe added successfully.",
          data: query.result,
        });
        db.close();
      };

      query.onerror = () => {
        resolve({
          success: false,
          message: "Error while adding data.",
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

export function DeleteRecipe(dto: DeleteRecipeDTO): Promise<any> {
  return new Promise(async (resolve) => {
    try {
      db = await openDatabase("delete recipe");
      const transaction = db.transaction(Stores.Recipes, "readwrite");
      const store = transaction.objectStore(Stores.Recipes);
      const query = store.get(dto.id);

      query.onsuccess = () => {
        store.delete(dto.id);
        resolve({
          success: true,
          message: "Recipe deleted successfully.",
        });
        db.close();
      };

      query.onerror = () => {
        resolve({
          success: false,
          message: "Error while trying to delete data.",
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
