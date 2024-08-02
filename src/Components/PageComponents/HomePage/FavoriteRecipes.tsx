import { RecipeData } from "../../../interfaces";
import { RecipeCard } from "../../RecipeCard";
import { useState } from "react";
import Modal from "../../Modal";
import { showToast } from "../../Toast";
import { AddRecipeForm } from "../AllRecipes/AddRecipeForm";
import { EditRecipeForm } from "../AllRecipes/EditRecipeForm";
import { DeleteRecipe, UpdateRecipe } from "../../../logic/RecipesLogic";

export function FavoriteRecipes({
  data,
  handleMutation,
}: {
  data: RecipeData[];
  handleMutation: () => void;
}) {
  const [modalType, setModalType] = useState<"Edit" | "Add" | "Delete" | null>(
    null
  );
  const [selectedRecipeId, setSelectedRecipeId] = useState<number | null>(null);

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
    <div
      className={`flex justify-center mt-8 2xl:w-[80%] ${
        data.length ? "" : "w-full"
      }`}
    >
      {data.length ? (
        <div className="flex flex-col w-full items-center">
          {data.map((i: RecipeData) => (
            <RecipeCard
              data={i}
              handleEdit={() => {
                setModalType("Edit");
                setSelectedRecipeId(i.id);
              }}
              handleDelete={() => {
                setModalType("Delete");
                setSelectedRecipeId(i.id);
              }}
              handleFavorite={() => handleFavorite(i)}
              className="min-w-[60%]"
              key={i.id}
            />
          ))}
        </div>
      ) : (
        <div className="flex items-center">
          <p className="text-center font-bold text-4xl">No Favorites Found</p>
        </div>
      )}

      <Modal
        title={`${modalType} Recipe`}
        onClose={handleCloseModal}
        isOpen={Boolean(modalType)}
      >
        {modalType === "Add" && (
          <AddRecipeForm
            handleClose={handleCloseModal}
            mutate={handleMutation}
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
