import { useState, ChangeEvent, ChangeEventHandler, useEffect, useCallback } from "react";
import { showToast } from "../Toast";
import { GetRecipeById, UpdateRecipe } from "../../logic/RecipesLogic";
import { AddRecipeDTO } from "../../interfaces";
import { GetCategoriesSelect } from "../../logic/CategoryLogic";

export function EditRecipeForm({
  handleClose,
  mutate,
  recipeId
}: {
  handleClose: any;
  mutate: () => void;
  recipeId: number;
}) {
  const [formValues, setFormValues] = useState<AddRecipeDTO & {isFavorite: 0 | 1}>({
    name: "",
    ingredients: [],
    description: "",
    instructions: "",
    categoryId: null as unknown as number,
    imageDataUrl: undefined,
    isFavorite: 0,
  });
  const [pictureName, setPictureName] = useState("");
  const [isSubmitting, setIsSubmitting] = useState(false);
  const [ingredientInputValue, setIngredientInputValue] = useState("");
  const [categories, setCategories] = useState<{ id: number; name: string }[]>(
    []
  );
  const [formErrors, setFormErrors] = useState<any>({});
  const [touched, setTouched] = useState<any>({});
  
  useEffect(() => {
    GetRecipeById({id: recipeId}).then((result) => {
      if (result.success) {
        setFormValues(result.data as AddRecipeDTO & {isFavorite: 0 | 1})
      }
    })

    GetCategoriesSelect().then((result) => {
      if (result.success) {
        setCategories(result.data);
        return;
      }
      showToast(result.message, "error");
    });
  }, [recipeId]);

  const handleImageChange: ChangeEventHandler<HTMLInputElement> = (
    e: ChangeEvent<HTMLInputElement>
  ) => {
    if (!e.target.files) return;
    const file = e.target.files[0];
    if (file) {
      const reader = new FileReader();
      reader.onloadend = () => {
        setFormValues({ ...formValues, imageDataUrl: reader.result as string });
      };
      reader.readAsDataURL(file);
    }
    setPictureName(e.target.files[0].name);
    e.target.files = null;
  };

  function handleSubmit() {
    setTouched({
      name: true,
      ingredients: true,
      instructions: true,
      category: true,
    });
    if (Object.keys(formErrors).length !== 0) return;

    setIsSubmitting(true);
    document.body.style.cursor = "wait";
    UpdateRecipe({id: recipeId, ...formValues}).then((result) => {
      setIsSubmitting(false);
      if (result.success) {
        handleClose();
        showToast(result.message, "success");
        mutate();
      } else showToast(result.message, "error");
      document.body.style.cursor = "initial";
    });
  }
  
  function handleIngredientAdd() {
    if (ingredientInputValue === "") return;
    setFormValues({
      ...formValues,
      ingredients: [...formValues.ingredients, ingredientInputValue],
    });
    setIngredientInputValue("");
  }
  
  const validate = useCallback(() => {
    const errors: any = {};
    if (!formValues.name.length)
      errors.name = "Please provide the name of the food.";
    if (!formValues.ingredients.length)
      errors.ingredients = "Please provide at least one ingredient.";
    if (!formValues.instructions.length)
      errors.instructions = "Please provide the instructions.";
    if (!formValues.categoryId) errors.category = "Please select a category.";
    setFormErrors(errors);
  }, [formValues]);

  useEffect(() => {
    validate();
  }, [formValues, validate]);

  return (

    <div className="p-6 bg-white rounded-lg shadow-md w-full">
      <div>
        <div className="flex gap-4 items-start">
          <div>
            <div className="h-40 w-40 overflow-hidden border-gray-300 border-2 rounded-lg">
              <img
                src={formValues.imageDataUrl ?? "placeHolder.png"}
                className="w-full h-full object-cover"
                alt="category"
              />
            </div>
            <label
              htmlFor="category-image-input"
              className="flex flex-col items-center mt-4"
            >
              <div className="rounded-full px-4 py-2 text-white bg-[#d24309] hover:bg-[#b13607] cursor-pointer transition-colors duration-300">
                {formValues.imageDataUrl ? "Change" : "Add"} Image
              </div>
              {pictureName && (
                <div className="mt-2 text-sm text-gray-600">{pictureName}</div>
              )}
            </label>
            <input
              id="category-image-input"
              type="file"
              accept="image/png, image/jpeg"
              onChange={handleImageChange}
              className="hidden"
            />
          </div>
          <div className="w-full -mt-2">
            <div>
              <label htmlFor="recipe-name-input" className="block mb-2 font-medium">Recipe Name</label>
              <input
                type="text"
                id="recipe-name-input"
                className="w-full border-gray-300 border-2 rounded-lg py-2 px-3 outline-none focus:border-[#d24309] transition-colors duration-300"
                onChange={(e) => {
                  setFormValues({ ...formValues, name: e.target.value });
                  setTouched({ ...touched, name: true });
                }}
                value={formValues.name}
              />
              <p
                className={`text-red-400 font-bold transition-opacity duration-300 ${
                  formErrors.name && touched.name ? "opacity-100" : "opacity-0"
                }`}
              >
                {formErrors.name}&nbsp;
              </p>
            </div>

            <div>
              <label htmlFor="recipe-description-input" className="block mb-2 font-medium">Description</label>
              <input
                type="text"
                id="recipe-description-input"
                className="w-full border-gray-300 border-2 rounded-lg py-2 px-3 outline-none focus:border-[#d24309] transition-colors duration-300"
                onChange={(e) => {
                  setFormValues({ ...formValues, description: e.target.value });
                  setTouched({ ...touched, description: true });
                }}
                value={formValues.description}
              />
            </div>
          </div>
        </div>
        <div className="flex-1 mt-2">
          <div className="mb-4">
            <label htmlFor="recipe-ingredients-input" className="block mb-2 font-medium">Ingredients</label>
            <div className="flex items-center gap-2 mb-2">
              <input
                type="text"
                id="recipe-ingredients-input"
                className="flex-1 border-gray-300 border-2 rounded-lg py-2 px-3 outline-none focus:border-[#d24309] transition-colors duration-300"
                onChange={(e) => {
                  setIngredientInputValue(e.target.value);
                }}
                value={ingredientInputValue}
                onKeyPress={(e) => e.key === "Enter" && handleIngredientAdd()}
              />
              <button
                className="bg-[#d24309] hover:bg-[#b13607] text-white rounded-lg p-2 transition-colors duration-300"
                onClick={handleIngredientAdd}
                data-testid="add-ingredient-button"
              >
                <img src="plus-icon.png" alt="plus icon" className="w-6" />
              </button>
            </div>

            <div className="flex flex-wrap gap-2 min-h-8">
              {formErrors.ingredients && touched.ingredients && (
                <p className="text-red-400 font-bold">
                  {formErrors.ingredients}
                </p>
              )}
              {formValues.ingredients.map((i, x) => (
                <span
                  data-testid="ingredient-box"
                  className="cursor-pointer hover:bg-gray-400 bg-gray-500 rounded-full text-white px-3 py-1 flex items-center transition-colors duration-300"
                  onClick={() => {
                    const newIngredients = formValues.ingredients.filter(
                      (y) => y !== i
                    );
                    setFormValues({
                      ...formValues,
                      ingredients: newIngredients,
                    });
                    setTouched({ ...touched, ingredients: true });
                  }}
                  key={x}
                >
                  {i} &times;
                </span>
              ))}
            </div>
          </div>

          <div className="mb-4">
            <label htmlFor="recipe-instructions-input" className="block mb-2 font-medium">Instructions</label>
            <textarea
              className="w-full border-gray-300 border-2 rounded-lg py-2 px-3 outline-none focus:border-[#d24309] transition-colors duration-300"
              id="recipe-instructions-input"
              onChange={(e) => {
                setFormValues({ ...formValues, instructions: e.target.value });
                setTouched({ ...touched, instructions: true });
              }}
              value={formValues.instructions}
            />

            <p
              className={`text-red-400 font-bold transition-opacity duration-300 ${
                formErrors.instructions && touched.instructions
                  ? "opacity-100"
                  : "opacity-0"
              }`}
            >
              {formErrors.instructions}&nbsp;
            </p>
          </div>

          <div className="flex flex-col mb-4">
            <label htmlFor="categories" className="block mb-2 font-medium">Category</label>
            <select
              name="categories"
              id="categories"
              className="py-2 px-3 border-gray-300 border-2 rounded-lg outline-none focus:border-[#d24309] transition-colors duration-300"
              onChange={(e) => {
                setFormValues({
                  ...formValues,
                  categoryId: Number(e.target.value),
                });
              }}
            >
              {!formValues.categoryId && (
                <option value={0}>Select A Category</option>
              )}
              {categories.map((i) => (
                <option key={i.id} value={i.id}>
                  {i.name}
                </option>
              ))}
            </select>

            {formErrors.category && touched.category && (
              <p className="text-red-400 font-bold">{formErrors.category}</p>
            )}
          </div>
        </div>
      </div>
      <div className="flex justify-around mt-6">
        <button
          className={`rounded-full py-2 px-6 text-white bg-[#d24309] hover:bg-[#b13607] transition-colors duration-300 ${
            isSubmitting ? "opacity-50" : ""
          }`}
          onClick={handleSubmit}
          disabled={isSubmitting}
        >
          Submit
        </button>
        <button
          className="rounded-full py-2 px-6 text-white bg-gray-400 hover:bg-gray-500 transition-colors duration-300"
          onClick={handleClose}
        >
          Cancel
        </button>
      </div>
    </div>
  );
}

