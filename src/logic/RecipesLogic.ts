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
      const transaction = db.transaction(
        [Stores.Recipes, Stores.Images],
        "readonly"
      );
      const recipeStore = transaction.objectStore(Stores.Recipes);
      const imageStore = transaction.objectStore(Stores.Images);
      const recipeQuery = recipeStore.getAll();

      recipeQuery.onsuccess = async () => {
        const recipes = recipeQuery.result;

        const recipesWithImages = await Promise.all(
          recipes.map(async (recipe) => {
            if (!recipe.imageId) {
              return recipe;
            }
            const imageRequest = imageStore.get(recipe.imageId);

            return new Promise((resolve) => {
              imageRequest.onsuccess = () => {
                const image = imageRequest.result;
                resolve({
                  ...recipe,
                  imageDataUrl: image ? image.dataUrl : null,
                });
              };

              imageRequest.onerror = () => {
                resolve({ ...recipe, imageDataUrl: null });
              };
            });
          })
        );

        resolve({
          success: true,
          message: "Recipes retrieved successfully.",
          data: recipesWithImages,
        });
        db.close();
      };

      recipeQuery.onerror = () => {
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
      const transaction = db.transaction(
        [Stores.Recipes, Stores.Images],
        "readonly"
      );
      const imageStore = transaction.objectStore(Stores.Images);
      const recipeStore = transaction.objectStore(Stores.Recipes);
      const recipeQuery = recipeStore.get(dto.id);

      recipeQuery.onsuccess = () => {
        const recipe = recipeQuery.result;
        if (!recipe.imageId) {
          resolve({
            success: true,
            message: "Recipe retrieved successfully.",
            data: recipeQuery.result,
          });
          db.close();
          return;
        }

        const imageRequest = imageStore.get(recipe.imageId)

        imageRequest.onsuccess = () => {
          resolve({
            success: true,
            message: "Recipe retrieved successfully.",
            data: {...recipe, imageDataUrl: imageRequest.result.dataUrl}, 
          })
          db.close()
        }

        imageRequest.onerror = () => {
          resolve({
            success: false,
            message: "Error while getting the image related to recipe",
          })
          db.close()
        }
      };
      recipeQuery.onerror = () => {
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
      const transaction = db.transaction(
        [Stores.Recipes, Stores.Images],
        "readwrite"
      );
      const imageStore = transaction.objectStore(Stores.Images);
      const recipeStore = transaction.objectStore(Stores.Recipes);
      const recipeRequest = recipeStore.get(dto.id);

      recipeRequest.onsuccess = () => {
        const recipe = recipeRequest.result;
        if (!recipe) {
          resolve({
            success: false,
            message: "Recipe not found.",
          });
          db.close();
          return;
        }

        recipe.name = dto.name;
        recipe.ingredients = dto.ingredients;
        recipe.description = dto.description;
        recipe.categoryId = dto.categoryId;
        recipe.isFavorite = dto.isFavorite;

        if (recipe.imageId) {
          const imageRequest = imageStore.get(recipe.imageId);
          imageRequest.onsuccess = () => {
            if (imageRequest.result.dataUrl !== dto.imageDataUrl) {
              imageStore.delete(recipe.imageId);

              const imageId = Date.now();
              imageStore.add({ id: imageId, dataUrl: dto.imageDataUrl });
              recipe.imageId = imageId;
            }

            recipeStore.put(recipe);

            resolve({
              success: true,
              message: "Recipe updated successfully.",
            });
          };

          imageRequest.onerror = () => {
            resolve({
              success: false,
              message: "Error while changng the image",
            });
            db.close();
          };
          return;
        } else if (dto.imageDataUrl) {
          const imageId = Date.now();
          const imageRequest = imageStore.put({
            id: imageId,
            dataUrl: dto.imageDataUrl,
          });
          imageRequest.onsuccess = () => {
            recipe.imageId = imageId;
            recipeStore.put(recipe);
            resolve({
              success: true,
              message: "Recipe updated successfully",
            });
            db.close();
          };

          imageRequest.onerror = () => {
            resolve({
              success: false,
              message: "Error while adding image related to the category",
            });
            db.close();
          };
          return;
        }
        recipeStore.put(recipe);

        resolve({
          success: true,
          message: "Recipe updated successfully.",
        });
        db.close();
      };

      recipeRequest.onerror = () => {
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
      const transaction = db.transaction(
        [Stores.Recipes, Stores.Images],
        "readwrite"
      );
      const recipeStore = transaction.objectStore(Stores.Recipes);
      const id = Date.now();
      const data = {
        categoryId: dto.categoryId,
        description: dto.description,
        id,
        ingredients: dto.ingredients,
        instructions: dto.instructions,
        isFavorite: false,
        name: dto.name,
      };
      if (!dto.imageDataUrl) {
        const recipeRequest = recipeStore.add(data);

        recipeRequest.onsuccess = () => {
          resolve({
            success: true,
            message: "Recipe added successfully.",
            data: recipeRequest.result,
          });
          db.close();
        };

        recipeRequest.onerror = () => {
          resolve({
            success: false,
            message: "Error while adding data.",
          });
          db.close();
        };
        return;
      }

      const imageStore = transaction.objectStore(Stores.Images);
      const imageId = Date.now();
      const imageAddRequest = imageStore.add({
        id: imageId,
        dataUrl: dto.imageDataUrl,
      });

      imageAddRequest.onsuccess = () => {
        const recipeAddRequest = recipeStore.add({
          ...data,
          imageId,
        });

        recipeAddRequest.onsuccess = () => {
          resolve({
            success: true,
            message: "Recipe Added Successfully",
          });
          db.close();
        };

        recipeAddRequest.onerror = () => {
          resolve({
            success: false,
            message: "Error while trying to add the recipe",
          });
          db.close();
        };
      };

      imageAddRequest.onerror = () => {
        resolve({
          success: false,
          message: "Error while trying to add the image related to the recipe",
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

export function DeleteRecipe(
  dto: DeleteRecipeDTO
): Promise<{ success: boolean; message: string }> {
  return new Promise(async (resolve) => {
    try {
      db = await openDatabase("delete recipe");
      const transaction = db.transaction(
        [Stores.Recipes, Stores.Images],
        "readwrite"
      );
      const imageStore = transaction.objectStore(Stores.Images);
      const recipeStore = transaction.objectStore(Stores.Recipes);
      const recipeQuery = recipeStore.get(dto.id);

      recipeQuery.onsuccess = () => {
        if (!recipeQuery.result.imageId) {
          recipeStore.delete(dto.id);
          resolve({
            success: true,
            message: "Recipe deleted successfully.",
          });
          db.close();
          return;
        }

        const imageQuery = imageStore.get(recipeQuery.result.imageId);
        imageQuery.onerror = () =>
          resolve({
            success: false,
            message: "Error while trying to delete the image related to recipe",
          });

        imageQuery.onsuccess = () => {
          imageStore.delete(imageQuery.result.id);
          recipeStore.delete(dto.id);
          resolve({
            success: true,
            message: "Recipe deleted successfully",
          });
        };
      };

      recipeQuery.onerror = () => {
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
