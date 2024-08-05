import "@testing-library/jest-dom";
import { render, screen, act, waitFor } from "@testing-library/react";
import { MemoryRouter } from "react-router-dom";
import { RecipeData } from "../interfaces";
import * as RecipesLogic /*{ GetAllRecipes }*/ from "../logic/RecipesLogic";
import AllRecipesPage from "./AllRecipesPage";

const RecipeCardText = "Recipe Card Text";
jest.mock("../Components/RecipeCard", () => ({
  RecipeCard: () => <div>{RecipeCardText}</div>,
}));

jest.mock("../Components/Toast", () => ({ showToast: () => {} }));

const mockRecipeCount = Math.floor(Math.random() * 30);

const GetAllRecipesMock = (): Promise<{
  message: string;
  success: true;
  data: RecipeData[];
}> => {
  return new Promise((res) => {
    let recipes: any[] = [];
    for (let i = 1; i <= mockRecipeCount; i++) {
      recipes = [
        ...recipes,
        {
          id: i,
          name: "Test Recipe Name",
          ingredients: ["Test Ingredient"],
          description: "Test Description",
          instructions: "Test Instructions",
          categoryId: 1,
          imageDataUrl: undefined,
          isFavorite: 0,
        },
      ];
    }
    res({ message: "", success: true, data: recipes as RecipeData[] });
  });
};
it("should render buttons", async () => {
  render(
    <MemoryRouter>
      <AllRecipesPage />
    </MemoryRouter>
  );

  const addNewButton = screen.getByRole("button", { name: /Add New Recipe/ });
  expect(addNewButton).toBeInTheDocument();
});

it("should render as many recipes as there are in the IndexedDB", async () => {
 
  const SpyGetAllRecipes = jest.spyOn(RecipesLogic, "GetAllRecipes");
  SpyGetAllRecipes.mockImplementation(GetAllRecipesMock);
   render(
    <MemoryRouter>
      <AllRecipesPage />
    </MemoryRouter>
  );

  
  expect(SpyGetAllRecipes).toBeCalled()
  expect(await screen.findAllByText(new RegExp(RecipeCardText))).toHaveLength(
    mockRecipeCount
  );
});
