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
  image: File;
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
  image: File;
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
  imgId: number;
  categoryId: number;
  isFavorite: boolean;
}

export interface DeleteRecipeDTO {
  id: number
}


export interface AddImageDTO {
  dataUrl: string;  
}
/*
export interface GetImageDTO {
  imgId: number
}
*/
