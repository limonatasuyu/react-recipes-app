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

export interface UpdateRecipeDTO {
  id: number;
  name: string;
  ingredients: string[];
  description?: string;
  instructions: string;
  categoryId: number;
  isFavorite: boolean;
  imageDataUrl?: string;
}

export interface DeleteRecipeDTO {
  id: number
}


export interface AddImageDTO {
  dataUrl: string;  
}

