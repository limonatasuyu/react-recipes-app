export interface CategoryData {
  id: number;
  name: string;
  imageDataUrl: string;
}

export interface RecipeData {
  id: number;
  name: string;
  ingredients: string[];
  description?: string;
  instructions: string;
  categoryId: number;
  imageDataUrl: string;
  isFavorite: 0 | 1;
}

export interface UpdateCategoryDTO {name: string, imageDataUrl: string | null, id: number}

export interface AddCategoryDTO { name: string; imageDataUrl: string | null}

export interface GetCategoryDTO { id: number; }

export interface DeleteCategoryDTO { id: number; }

export interface AddRecipeDTO {
  name: string;
  ingredients: string[];
  description?: string;
  instructions: string;
  categoryId: number;
  imageDataUrl?: string;
}

export interface GetRecipeDTO {
  id: number;
}

export interface GetRecipesDTO {
  ids: number[];
}

export interface UpdateRecipeDTO {
  id: number;
  name: string;
  ingredients: string[];
  description?: string;
  instructions: string;
  categoryId: number;
  isFavorite: 0 | 1;
  imageDataUrl?: string;
}

export interface DeleteRecipeDTO {
  id: number
}


export interface AddImageDTO {
  dataUrl: string;  
}

export interface GetRecipesByCategoryIdDTO { id: number }
