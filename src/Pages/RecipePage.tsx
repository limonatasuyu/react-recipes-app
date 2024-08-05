import { useEffect, useState } from "react";
import { showToast } from "../Components/Toast";
import { RecipeData } from "../interfaces";
import { GetRecipeById } from "../logic/RecipesLogic";
import { useParams } from "react-router-dom";

export default function RecipePage() {
  const { recipeId } = useParams();
  const [recipe, setRecipe] = useState<RecipeData | null>(null);
  const [loadState, setLoadState] = useState<"loading" | "success" | "error">(
    "loading"
  );

  useEffect(() => {
    GetRecipeById({ id: Number(recipeId) }).then((result) => {
      if (result.success) {
        setRecipe(result.data as RecipeData);
        showToast(result.message, "success");
        setLoadState("success");
                const recentRecipes = localStorage.getItem("recentRecipes");
        let recentRecipesArray = recentRecipes ? JSON.parse(recentRecipes).filter((i: any) => i.index < 10) : [];
        const recipeExists = recentRecipesArray.find((i: any) => Number(i.recipeId) === Number(recipeId))
        let updatedRecentRecipes; 
        if (!recipeExists) updatedRecentRecipes = [{ recipeId, index: 0 }, ...recentRecipesArray.map((i: any) => ({...i, index: i.index + 1}))];       
        else updatedRecentRecipes = [{ recipeId, index: 0 }, ...recentRecipesArray.filter((i: any) => Number(i.recipeId) !== Number(recipeId)).map((i: any) => ({...i, index: i.index + 1}))] 

        if (JSON.stringify(updatedRecentRecipes) !== recentRecipes) {
          localStorage.setItem("recentRecipes", JSON.stringify(updatedRecentRecipes));
        }
        return;
      }
      showToast(result.message, "error");
      setLoadState("error");
    });
  }, [recipeId]);

  if (loadState === "loading") return <p>Loading..</p>;
  if (loadState === "error" || recipe === null)
    return (
      <h1 className="mt-8 w-full px-4 text-center">
        Couldn't found the recipe
      </h1>
    );

  return (
  <div className="mt-8 w-full px-4 pb-2">
  <h1 className="font-bold text-4xl text-center mb-8">{recipe.name}</h1>
  <div className="flex flex-col items-center bg-orange-600 border border-orange-600 rounded-lg max-w-3xl mx-auto p-6 shadow-lg">
    <img
      src={recipe.imageDataUrl ?? "placeHolderFood.png"}
      alt={recipe.name}
      className="w-64 h-64 rounded-lg mb-6 object-cover"
    />
    <div className="text-white text-center w-full">
      <h2 className="font-bold text-2xl mb-4">Ingredients</h2>
      <ul className="mb-8 space-y-2" data-testid="ingredients-list">
        {recipe.ingredients.map((ingredient, index) => (
          <li key={index} className="mb-2">
            {ingredient}
          </li>
        ))}
      </ul>
      <h2 className="font-bold text-2xl mb-4">Instructions</h2>
      <p className="whitespace-pre-line leading-relaxed">{recipe.instructions}</p>
    </div>
  </div>
</div>

  );
}
