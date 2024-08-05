import "@testing-library/jest-dom";
import { render, screen } from "@testing-library/react";
import { MemoryRouter, Routes, Route } from "react-router-dom";
import CategoryPage from "./CategoryPage";
import * as CategoryLogic from "../logic/CategoryLogic";
import * as RecipesLogic from "../logic/RecipesLogic";
import { RecipeData } from "../interfaces";

const TestCategoryNameText = "Test Category Name";
const mockRecipeCount = Math.floor(Math.random() * 30);

const RecipeCardText = "Test Recipe Name"
const GetRecipesByCategoryIdMock = (): Promise<{
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
          name: RecipeCardText,
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

it("should render the categorie's name as the title", async () => {
  const randomCategoryId = Date.now();

  const getCategorySpy = jest.spyOn(CategoryLogic, "GetCategory");
  getCategorySpy.mockImplementation(
    () =>
      new Promise((res) => {
        res({
          success: true,
          message: "",
          data: { name: TestCategoryNameText },
        });
      })
  );
  
  render(
    <MemoryRouter initialEntries={[`/category/${randomCategoryId}`]}>
      <Routes>
        <Route path="/category/:categoryId" element={<CategoryPage />} />
      </Routes>
    </MemoryRouter>
  );

  const heading = await screen.findByRole("heading", { level: 1, name: TestCategoryNameText });

  expect(getCategorySpy).toHaveBeenCalledWith({ id: randomCategoryId });
  expect(heading).toBeInTheDocument();
});

it("should render as much as recipes as it took from the db", async () => {
  const randomCategoryId = Date.now();  

  const SpyGetRecipesByCategoryId = jest.spyOn(RecipesLogic, "GetRecipesByCategoryId")
  SpyGetRecipesByCategoryId.mockImplementation(GetRecipesByCategoryIdMock);
  const getCategorySpy = jest.spyOn(CategoryLogic, "GetCategory");
  getCategorySpy.mockImplementation(
    () =>
      new Promise((res) => {
        res({
          success: true,
          message: "",
          data: { name: TestCategoryNameText },
        });
      })
  );

  render(
    <MemoryRouter initialEntries={[`/category/${randomCategoryId}`]}>
      <Routes>
        <Route path="/category/:categoryId" element={<CategoryPage />} />
      </Routes>
    </MemoryRouter>
  );

  expect(SpyGetRecipesByCategoryId).toBeCalledWith({id: randomCategoryId})
  expect(await screen.findAllByText(new RegExp(RecipeCardText))).toHaveLength(
    mockRecipeCount
  );

})
