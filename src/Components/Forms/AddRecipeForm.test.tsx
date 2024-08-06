import "@testing-library/jest-dom";
import { render, screen, act, waitFor } from "@testing-library/react";
import { showToast } from "../Toast";
import { AddRecipeForm } from "./AddRecipeForm";
import * as CategoryLogic from "../../logic/CategoryLogic";
import { userEvent } from "@testing-library/user-event";
import * as RecipesLogic from "../../logic/RecipesLogic";

const nameErrorText = "Please provide the name of the food.";
const ingredientsErrorText = "Please provide at least one ingredient.";
const instructionsErrorText = "Please provide the instructions.";
const categoryErrorText = "Please select a category.";

it("Should give validation errors when needed", async () => {
  const mockMutate = jest.fn();
  const mockHandleClose = jest.fn();
  const SpyGetCategoriesSelect = jest.spyOn(
    CategoryLogic,
    "GetCategoriesSelect"
  );

  SpyGetCategoriesSelect.mockImplementation(() => {
    return new Promise((res) => {
      res({success: true, message: "", data: [
        { id: 1, name: "Test Category 1" },
        { id: 2, name: "Test Category 2" },
      ]});
    });
  });

  const user = await userEvent.setup()
  render(<AddRecipeForm handleClose={mockHandleClose} mutate={mockMutate} />);
  
  await waitFor(async () => expect(SpyGetCategoriesSelect).toHaveBeenCalled())
  await act(() => {
    showToast("Test Message", "info");
  });
  
  const textInputs = screen.getAllByRole("textbox");
  
  for (let input of textInputs) await user.clear(input)

  const submitButton = screen.getByRole("button", {name: "Submit"})
  await user.click(submitButton);

  expect(screen.getByText(nameErrorText)).toBeInTheDocument()
  expect(screen.getByText(ingredientsErrorText)).toBeInTheDocument()
  expect(screen.getByText(instructionsErrorText)).toBeInTheDocument()
  expect(screen.getByText(categoryErrorText)).toBeInTheDocument()

  const nameInput = screen.getByLabelText("Recipe Name") 
  expect(nameInput).toBeInTheDocument()

  await user.type(nameInput, "Some Text")
  expect(screen.queryByText(nameErrorText)).not.toBeInTheDocument()

  await user.clear(nameInput)
  expect(screen.getByText(nameErrorText)).toBeInTheDocument()


  const ingredientsInput = screen.getByLabelText("Ingredients")
  expect(ingredientsInput).toBeInTheDocument()
  await user.type(ingredientsInput, "Some Text")
  expect(screen.getByText(ingredientsErrorText)).toBeInTheDocument()
  
  await user.keyboard("{enter}")
  expect(screen.queryByText(ingredientsErrorText)).not.toBeInTheDocument()

  const ingredientBoxes = screen.getAllByTestId("ingredient-box")
  const ingredientBox = ingredientBoxes.find(i => i.textContent?.match("Some Text"))
  expect(ingredientBox).toBeInTheDocument()
  await userEvent.click(ingredientBox as Element)
  expect(screen.getByText(ingredientsErrorText)).toBeInTheDocument()
  

  const instructionsInput = screen.getByLabelText("Instructions")
  await user.type(instructionsInput, "Some Text")
  expect(screen.queryByText(instructionsErrorText)).not.toBeInTheDocument()

  const categoriesInput = screen.getByLabelText("Category")
  expect(categoriesInput).toBeInTheDocument()
  await user.selectOptions(categoriesInput, "Test Category 1")
  expect(screen.queryByText(categoryErrorText)).not.toBeInTheDocument()
  

});


it("should trigger mutate and handleClose if submit succeeded", async () => {
  const mockMutate = jest.fn();
  const mockHandleClose = jest.fn();
  const SpyGetCategoriesSelect = jest.spyOn(
    CategoryLogic,
    "GetCategoriesSelect"
  );

  SpyGetCategoriesSelect.mockImplementation(() => {
    return new Promise((res) => {
      res({success: true, message: "", data: [
        { id: 1, name: "Test Category 1" },
        { id: 2, name: "Test Category 2" },
      ]});
    });
  });

  const SpyAddRecipe = jest.spyOn(RecipesLogic, "AddRecipe")
  SpyAddRecipe.mockImplementation(() => {
    return new Promise((res) => {
      res({success: true, message: ""})
    })
  })

  const user = await userEvent.setup()
  render(<AddRecipeForm handleClose={mockHandleClose} mutate={mockMutate} />);
  await waitFor(async () => expect(SpyGetCategoriesSelect).toHaveBeenCalled())
  await act(() => {
    showToast("Test Message", "info");
  });
 
  const nameInput = screen.getByLabelText("Recipe Name") 
  expect(nameInput).toBeInTheDocument()

  await user.type(nameInput, "Some Text")

  const ingredientsInput = screen.getByLabelText("Ingredients")
  expect(ingredientsInput).toBeInTheDocument()
  await user.type(ingredientsInput, "Some Text")
  await user.keyboard("{enter}")

  const instructionsInput = screen.getByLabelText("Instructions")
  await user.type(instructionsInput, "Some Text")

  const categoriesInput = screen.getByLabelText("Category")
  expect(categoriesInput).toBeInTheDocument()
  await user.selectOptions(categoriesInput, "Test Category 1")
  expect(screen.queryByText(categoryErrorText)).not.toBeInTheDocument()
  

  const submitButton = screen.getByRole("button", {name: "Submit"})
  await user.click(submitButton);

  expect(mockHandleClose).toBeCalled()
  expect(mockMutate).toBeCalled()

})


it("should not trigger mutate and handleClose if submit is not succeeded", async () => {
  const mockMutate = jest.fn();
  const mockHandleClose = jest.fn();
  const SpyGetCategoriesSelect = jest.spyOn(
    CategoryLogic,
    "GetCategoriesSelect"
  );

  SpyGetCategoriesSelect.mockImplementation(() => {
    return new Promise((res) => {
      res({success: true, message: "", data: [
        { id: 1, name: "Test Category 1" },
        { id: 2, name: "Test Category 2" },
      ]});
    });
  });

  const SpyAddRecipe = jest.spyOn(RecipesLogic, "AddRecipe")
  SpyAddRecipe.mockImplementation(() => {
    return new Promise((res) => {
      res({success: false, message: ""})
    })
  })

  const user = await userEvent.setup()
  render(<AddRecipeForm handleClose={mockHandleClose} mutate={mockMutate} />);
  await waitFor(async () => expect(SpyGetCategoriesSelect).toHaveBeenCalled())
  await act(() => {
    showToast("Test Message", "info");
  });
 
  const nameInput = screen.getByLabelText("Recipe Name") 
  expect(nameInput).toBeInTheDocument()

  await user.type(nameInput, "Some Text")

  const ingredientsInput = screen.getByLabelText("Ingredients")
  expect(ingredientsInput).toBeInTheDocument()
  await user.type(ingredientsInput, "Some Text")
  await user.keyboard("{enter}")

  const instructionsInput = screen.getByLabelText("Instructions")
  await user.type(instructionsInput, "Some Text")

  const categoriesInput = screen.getByLabelText("Category")
  expect(categoriesInput).toBeInTheDocument()
  await user.selectOptions(categoriesInput, "Test Category 1")
  expect(screen.queryByText(categoryErrorText)).not.toBeInTheDocument()
  

  const submitButton = screen.getByRole("button", {name: "Submit"})
  await user.click(submitButton);

  expect(mockHandleClose).not.toBeCalled()
  expect(mockMutate).not.toBeCalled()

})


it("should trigger handleClose on close button click", async () => {
  const mockMutate = jest.fn();
  const mockHandleClose = jest.fn();
  const SpyGetCategoriesSelect = jest.spyOn(
    CategoryLogic,
    "GetCategoriesSelect"
  );

  SpyGetCategoriesSelect.mockImplementation(() => {
    return new Promise((res) => {
      res({success: true, message: "", data: [
        { id: 1, name: "Test Category 1" },
        { id: 2, name: "Test Category 2" },
      ]});
    });
  });


  const user = await userEvent.setup()
  render(<AddRecipeForm handleClose={mockHandleClose} mutate={mockMutate} />);
  await waitFor(async () => expect(SpyGetCategoriesSelect).toHaveBeenCalled())
  await act(() => {
    showToast("Test Message", "info");
  });
 
  const cancelButton = screen.getByRole("button", {name: "Cancel"})
  await user.click(cancelButton);

  expect(mockHandleClose).toBeCalled()

})

