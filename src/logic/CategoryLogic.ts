import { Stores } from "../constants";
import {
  AddCategoryDTO,
  DeleteCategoryDTO,
  GetCategoryDTO,
  UpdateCategoryDTO,
} from "../interfaces";
import { openDatabase } from "../db";

let db: IDBDatabase;

export function GetCategoriesSelect(): Promise<
  | { success: false; message: string }
  | { success: true; message: string; data: { id: number; name: string }[] }
> {
  return new Promise(async (resolve) => {
    try {
      const db = await openDatabase("get categories");
      const transaction = db.transaction(Stores.Categories, "readonly");

      const store = transaction.objectStore(Stores.Categories);

      const categoriesRequest = store.getAll();

      categoriesRequest.onsuccess = async () => {
        const categories = categoriesRequest.result.map((i) => ({
          id: Number(i.id),
          name: String(i.name),
        }));

        resolve({
          success: true,
          message: "Categories fetched successfully.",
          data: categories,
        });

        db.close();
      };

      categoriesRequest.onerror = () => {
        resolve({
          success: false,
          message: "Error while trying to fetch categories.",
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

export function UpdateCategory(
  dto: UpdateCategoryDTO
): Promise<{ success: boolean; message: string }> {
  return new Promise(async (resolve) => {
    try {
      const db = await openDatabase("update category");
      const transaction = db.transaction(
        [Stores.Categories, Stores.Images],
        "readwrite"
      );
      const categoryStore = transaction.objectStore(Stores.Categories);
      const imageStore = transaction.objectStore(Stores.Images);
      const categoryRequest = categoryStore.get(dto.id);

      categoryRequest.onsuccess = () => {
        const category = categoryRequest.result;
        if (!category) {
          resolve({
            success: false,
            message: "Category not found.",
          });
          db.close();
          return;
        }

        category.name = dto.name;
        if (category.imageId) {
          const imageRequest = imageStore.get(category.imageId);

          imageRequest.onsuccess = () => {
            if (imageRequest.result.dataUrl !== dto.imageDataUrl) {
              imageStore.delete(category.imageId);

              const imageId = Date.now();
              imageStore.add({ id: imageId, dataUrl: dto.imageDataUrl });
              category.imageId = imageId;
            }

            categoryStore.put(category);
            resolve({
              success: true,
              message: "Category updated successfully.",
            });
            db.close();
          };

          imageRequest.onerror = () => {
            resolve({
              success: false,
              message:
                "Error while trying to get the image related to category",
            });
            db.close();
          };
        } else {
          if (dto.imageDataUrl) {
            const imageId = Date.now();
            const imageRequest = imageStore.add({
              id: imageId,
              dataUrl: dto.imageDataUrl,
            });
            imageRequest.onsuccess = () => {
              category.imageId = imageId;
              categoryStore.put(category);
              resolve({
                success: true,
                message: "Category updated successfully.",
              });
              db.close();
            };
            imageRequest.onerror = () => {
              resolve({
                success: false,
                message: "Error while adding the image related to category",
              });
              db.close();
            };
          } else {
            categoryStore.put(category);
            resolve({
              success: true,
              message: "Category updated successfully.",
            });
            db.close();
          }
        }
      };

      categoryRequest.onerror = () => {
        resolve({
          success: false,
          message: "Error while trying to update Category.",
        });
        db.close();
      };
    } catch (error) {
      resolve({
        success: false,
        message:
          error instanceof Error ? error.message : "An unknown error occurred.",
      });
    }
  });
}

export function GetCategory(
  dto: GetCategoryDTO
): Promise<{ success: boolean; message: string; data?: any }> {
  return new Promise(async (resolve) => {
    try {
      const db = await openDatabase("get category");
      const transaction = db.transaction(
        [Stores.Categories, Stores.Images],
        "readonly"
      );
      const categoryStore = transaction.objectStore(Stores.Categories);
      const imageStore = transaction.objectStore(Stores.Images);
      const categoryRequest = categoryStore.get(dto.id);

      categoryRequest.onsuccess = () => {
        if (!categoryRequest.result.imageId) {
          resolve({
            success: true,
            message: "Category retrieved successfully",
            data: { name: categoryRequest.result.name },
          });
          return;
        }

        const imageRequest = imageStore.get(categoryRequest.result.imageId);

        imageRequest.onsuccess = () => {
          resolve({
            success: true,
            message: "Category retrieved successfully.",
            data: {
              name: categoryRequest.result.name,
              imageDataUrl: imageRequest.result.dataUrl,
            },
          });
        };

        imageRequest.onerror = () => {
          resolve({
            success: false,
            message: "Error while trying to get image related to category",
          });
        };
      };
      categoryRequest.onerror = () => {
        resolve({
          success: false,
          message: "Error while trying to fetch category.",
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

export function GetCategories(): Promise<{
  success: boolean;
  message: string;
  data?: any;
}> {
  return new Promise(async (resolve) => {
    try {
      const db = await openDatabase("get categories");
      const transaction = db.transaction(
        [Stores.Categories, Stores.Images],
        "readonly"
      );

      const categoryStore = transaction.objectStore(Stores.Categories);
      const imageStore = transaction.objectStore(Stores.Images);

      const categoriesRequest = categoryStore.getAll();

      categoriesRequest.onsuccess = async () => {
        const categories = categoriesRequest.result;

        const categoriesWithImages = await Promise.all(
          categories.map(async (category) => {
            if (!category.imageId) {
              return category;
            }
            const imageRequest = imageStore.get(category.imageId);

            return new Promise((resolve) => {
              imageRequest.onsuccess = () => {
                const image = imageRequest.result;
                resolve({
                  ...category,
                  imageDataUrl: image ? image.dataUrl : null,
                });
              };

              imageRequest.onerror = () => {
                resolve({ ...category, imageDataUrl: null });
              };
            });
          })
        );

        resolve({
          success: true,
          message: "Categories fetched successfully.",
          data: categoriesWithImages,
        });

        db.close();
      };

      categoriesRequest.onerror = () => {
        resolve({
          success: false,
          message: "Error while trying to fetch categories.",
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

export function AddCategory(
  dto: AddCategoryDTO
): Promise<{ success: boolean; message: string; data?: any }> {
  return new Promise(async (resolve) => {
    try {
      db = await openDatabase("add category");
      const transaction = db.transaction(
        [Stores.Categories, Stores.Images],
        "readwrite"
      );
      const categoryStore = transaction.objectStore(Stores.Categories);
      if (!dto.imageDataUrl) {
        const categoryAddRequest = categoryStore.add({
          id: Date.now(),
          name: dto.name,
        });

        categoryAddRequest.onsuccess = () => {
          resolve({
            success: true,
            message: "Category added successfully.",
          });
          db.close();
        };

        categoryAddRequest.onerror = () => {
          resolve({
            success: false,
            message: "Error while trying to add category.",
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
        const categoryAddRequest = categoryStore.add({
          id: Date.now(),
          name: dto.name,
          imageId: imageId,
        });

        categoryAddRequest.onsuccess = () => {
          resolve({
            success: true,
            message: "Category added successfully.",
          });
          db.close();
        };

        categoryAddRequest.onerror = () => {
          resolve({
            success: false,
            message: "Error while trying to add category.",
          });
          db.close();
        };
      };

      imageAddRequest.onerror = () => {
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

export function DeleteCategory(
  dto: DeleteCategoryDTO
): Promise<{ success: boolean; message: string }> {
  return new Promise(async (resolve) => {
    try {
      db = await openDatabase("delete category");
      const transaction = db.transaction(
        [Stores.Categories, Stores.Recipes, Stores.Images],
        "readwrite"
      );
      const recipeStore = transaction.objectStore(Stores.Recipes);
      const categoryIndex = recipeStore.index("categoryId");
      const categoryStore = transaction.objectStore(Stores.Categories);
      const categoryQuery = categoryStore.get(dto.id);

      categoryQuery.onsuccess = () => {
        const recipesQuery = categoryIndex.getAll([dto.id]);
        recipesQuery.onsuccess = async () => {
          
          const imageStore = transaction.objectStore(Stores.Images)
          await Promise.all(
            recipesQuery.result.map(async (recipe) => {
              await deleteRecipe(recipe.id, recipeStore, imageStore);
            })
          );

          categoryStore.delete(dto.id);

          resolve({
            success: true,
            message: "Category deleted successfully.",
          });
          db.close();
        };

        recipesQuery.onerror = () => {
          resolve({
            success: false,
            message: "Error while trying to delete category.",
          });
          db.close();
        };
      };

      categoryQuery.onerror = () => {
        resolve({
          success: false,
          message: "Error while trying to delete category.",
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

function deleteRecipe(id: number, recipeStore: IDBObjectStore, imageStore: IDBObjectStore) {

  return new Promise(async (resolve) => {
    try {
      const recipeQuery = recipeStore.get(id);

      recipeQuery.onsuccess = () => {
        if (!recipeQuery.result.imageId) {
          recipeStore.delete(id);
          resolve({
            success: true,
            message: "Recipe deleted successfully.",
          });
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
          recipeStore.delete(id);
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
