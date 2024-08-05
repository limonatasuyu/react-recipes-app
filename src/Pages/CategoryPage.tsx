import { useEffect, useState } from "react";
import Modal from "../Components/Modal";
import { AddRecipeForm } from "../Components/Forms/AddRecipeForm";
import { EditRecipeForm } from "../Components/Forms/EditRecipeForm";
import { showToast } from "../Components/Toast";
import { RecipeData } from "../interfaces";
import {
  DeleteRecipe,
  GetRecipesByCategoryId,
  UpdateRecipe,
} from "../logic/RecipesLogic";
import { useParams } from "react-router-dom";
import { GetCategory } from "../logic/CategoryLogic";
import { RecipeCard } from "../Components/RecipeCard";

export default function AllRecipesPage() {
  const { categoryId } = useParams();
  const [categoryName, setCategoryName] = useState("");
  const [recipes, setRecipes] = useState<RecipeData[]>([]);
  const [modalType, setModalType] = useState<"Edit" | "Add" | "Delete" | null>(
    null
  );
  const [selectedRecipeId, setSelectedRecipeId] = useState<number | null>(null);
  useEffect(() => {
    if (!categoryId) return;
    GetCategory({ id: Number(categoryId) }).then((result) => {
      if (result.success) setCategoryName(result.data.name);
    });
    GetRecipesByCategoryId({ id: Number(categoryId) }).then((result) => {
      if (result.success) {
        setRecipes(result.data);
        showToast(result.message, "success");
        return;
      }
      showToast(result.message, "error");
    });
  }, [categoryId]);

  function handleMutation() {
    if (!categoryId) return;
    GetRecipesByCategoryId({ id: Number(categoryId) }).then((result) => {
      if (result.success) {
        setRecipes(result.data);
        showToast(result.message, "success");
        return;
      }
      showToast(result.message, "error");
    });
  }

  function handleCloseModal() {
    setModalType(null);
    setSelectedRecipeId(null);
  }

  function handleDelete() {
    if (!selectedRecipeId) return;
    DeleteRecipe({ id: selectedRecipeId }).then((result) => {
      if (result.success) {
        handleCloseModal();
        handleMutation();
        showToast(result.message, "success");
        return;
      }
      showToast(result.message, "error");
    });
  }

  function handleFavorite(recipe: RecipeData) {
    UpdateRecipe({ ...recipe, isFavorite: recipe.isFavorite ? 0 : 1 }).then(
      (result) => {
        if (result.success) {
          showToast(result.message, "success");
          handleMutation();
          return;
        }
        showToast(result.message, "error");
      }
    );
  }

  return (
    <div className="mt-8 w-full px-4">
      <h1 className="font-bold text-4xl text-center mb-8">{categoryName}</h1>
      <button
        onClick={() => setModalType("Add")}
        className="group w-full flex items-center justify-between bg-[#d24309] border border-[#d24309] border-2 rounded-md max-w-3xl mx-auto p-4 mb-8"
      >
        <img
          src="placeHolderFood.png"
          alt="food"
          className="w-24 h-24 rounded-md"
        />
        <div className="ml-4">
          <h2 className="text-white font-bold text-xl">Add New Recipe</h2>
          <p className="text-white">Add a new recipe that is...</p>
        </div>
        <img
          src="plus-icon.png"
          alt="plus icon"
          className="mr-2 group-hover:bg-[#ff5a19] rounded transition-colors duration-300"
        />
      </button>
      {recipes.map((i: RecipeData) => (
        <RecipeCard
          data={i}
          key={i.id}
          handleEdit={() => {
            setModalType("Edit");
            setSelectedRecipeId(i.id);
          }}
          handleDelete={() => {
            setModalType("Delete");
            setSelectedRecipeId(i.id);
          }}
          handleFavorite={() => handleFavorite(i)}
        />
      ))}
      <Modal
        title={`${modalType} Recipe`}
        onClose={handleCloseModal}
        isOpen={Boolean(modalType)}
      >
        {modalType === "Add" && (
          <AddRecipeForm
            handleClose={handleCloseModal}
            mutate={handleMutation}
            defaultCategoryId={Number(categoryId)}
          />
        )}
        {selectedRecipeId && modalType === "Edit" && (
          <EditRecipeForm
            recipeId={selectedRecipeId}
            mutate={handleMutation}
            handleClose={handleCloseModal}
          />
        )}
        {selectedRecipeId && modalType === "Delete" && (
          <div>
            <h2 className="text-3xl text-center font-bold mt-4">
              Are you sure you want to delete the recipe ?
            </h2>
            <div className="flex justify-around mt-6">
              <button
                className="rounded-full py-2 px-6 text-white bg-[#d24309] hover:bg-[#b13607] transition-colors duration-300"
                onClick={handleDelete}
              >
                Yes
              </button>
              <button
                className="rounded-full py-2 px-6 text-white bg-gray-400 hover:bg-gray-500 transition-colors duration-300"
                onClick={handleCloseModal}
              >
                Cancel
              </button>
            </div>
          </div>
        )}
      </Modal>
    </div>
  );
}
