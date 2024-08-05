import "@testing-library/jest-dom";
import { render, screen, within } from "@testing-library/react";
import { MemoryRouter, Routes, Route } from "react-router-dom";
import RecipePage from "./RecipePage";
import * as RecipesLogic from "../logic/RecipesLogic";

const TestRecipeNameText = "Test Category Name";
const TestIngredients = ["Test Ingredient 1", "TestIngredient 2", "Test Ingredient 3"]
const TestInstructionsText = "Test Instructions"
const randomRecipeId = Date.now();
const randomCategoryId = Date.now();

it("should render the data about the recipe", async () => {

  const getRecipeSpy = jest.spyOn(RecipesLogic, "GetRecipeById");
  getRecipeSpy.mockImplementation(
    () =>
      new Promise((res) => {
        res({
          success: true,
          message: "",
          data: { 
            name: TestRecipeNameText,
            ingredients: TestIngredients,
            description: "Test Description",
            instructions: TestInstructionsText,
            categoryId: Number(randomCategoryId),
            imageDataUrl: undefined,
          },
        });
      })
  );
  
  render(
    <MemoryRouter initialEntries={[`/recipe/${randomRecipeId}`]}>
      <Routes>
        <Route path="/recipe/:recipeId" element={<RecipePage />} />
      </Routes>
    </MemoryRouter>
  );
  
  expect(getRecipeSpy).toHaveBeenCalledWith({ id: randomRecipeId });

  const heading = await screen.findByRole("heading", { level: 1, name: TestRecipeNameText });
  expect(heading).toBeInTheDocument();

  const ingredientsList = await screen.findByTestId("ingredients-list")
  const { getAllByRole } = within(ingredientsList)
  const ingredients = getAllByRole("listitem") 
  const ingredientTexts = ingredients.map(ingredient => ingredient.textContent?.trim())
  expect(ingredientTexts).toEqual(TestIngredients)

  const instructions = await screen.findByText(TestInstructionsText)
  expect(instructions).toBeInTheDocument()

});

