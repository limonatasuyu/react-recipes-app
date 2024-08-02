import React, { useEffect, useState } from "react";
import { GetCategories } from "./logic/CategoryLogic";
import { showToast } from "./Components/Toast";
import { Categories } from "./Components/PageComponents/HomePage/Categories";
import { RecentRecipes } from "./Components/PageComponents/HomePage/RecentRecipes";
import { FavoriteRecipes } from "./Components/PageComponents/HomePage/FavoriteRecipes";
import { GetFavoriteRecipes } from "./logic/RecipesLogic";

export default function HomePage() {
  const [activeTab, setActiveTab] = useState<"Categories" | "Favorites">(
    "Categories"
  );

  const [categories, setCategories] = useState([]);
  const [favoriteRecipes, setFavoriteRecipes] = useState([])
  const [recentRecipes, setRecentRecipes] = useState<{recipeId: number, index: number}[]>([])

  useEffect(() => {
    const retrievedRecentRecipes = localStorage.getItem("recentRecipes")
    if (retrievedRecentRecipes) setRecentRecipes(JSON.parse(retrievedRecentRecipes))

    GetCategories().then((result) => {
      if (result.success) {
        setCategories(result.data);
        showToast(result.message, "success");
      } else {
        showToast(result.message, "error");
      }
    });
  
    GetFavoriteRecipes().then((result) => {
      if (result.success) {
        setFavoriteRecipes(result.data);
        showToast(result.message, "success");
      } else {
        showToast(result.message, "error");
      }

    })

  }, []);

  function handleCategoryMutation() {
    GetCategories().then((result) => {
      if (result.success) {
        setCategories(result.data);
        showToast(result.message, "success");
      } else {
        showToast(result.message, "error");
      }
    });
  }
  
  function handleRecipeMutation() {
  
    GetFavoriteRecipes().then((result) => {
      if (result.success) {
        setFavoriteRecipes(result.data);
        showToast(result.message, "success");
      } else {
        showToast(result.message, "error");
      }

    })
  }

  return (
    <div className="w-full">
      <div className="flex gap-2 justify-center w-full mt-10">
        <button
          className={`bg-[#d24309] ${
            activeTab === "Categories" ? "opacity-100" : "opacity-50"
          } p-2 rounded text-white hover:font-bold`}
          onClick={() => setActiveTab("Categories")}
        >
          Categories
        </button>
        <button
          className={`bg-[#d24309] ${
            activeTab === "Favorites" ? "opacity-100" : "opacity-50"
          } p-2 rounded text-white hover:font-bold`}
          onClick={() => setActiveTab("Favorites")}
        >
          Favorites
        </button>
      </div>
      <div className="flex gap-2 justify-between w-[90%]">
        {activeTab === "Categories" ? (
          <Categories data={categories} mutate={handleCategoryMutation}/>
        ) : (
          <FavoriteRecipes data={favoriteRecipes} handleMutation={handleRecipeMutation}/>
        )}
        <RecentRecipes recipeIds={recentRecipes.map(i => Number(i.recipeId))} />
      </div>
    </div>
  );
}
