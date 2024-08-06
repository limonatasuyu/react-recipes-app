import "@testing-library/jest-dom";
import { render, screen, act, waitFor } from "@testing-library/react";
import { EditCategoryForm } from "./EditCategoryForm";
import * as CategoryLogic from "../../logic/CategoryLogic";
import { showToast } from "../Toast";
import { userEvent } from "@testing-library/user-event";

const InitialCategoryNameText = "Test Category Name";

it("should give validation errors on need", async () => {
  const categoryId = Date.now();
  const mockMutate = jest.fn();
  const mockHandleClose = jest.fn();
  const SpyUpdateCategory = jest.spyOn(CategoryLogic, "UpdateCategory");
  const SpyGetCategory = jest.spyOn(CategoryLogic, "GetCategory");

  SpyUpdateCategory.mockImplementation(() => {
    return new Promise((res) => {
      res({ success: true, message: "" });
    });
  });

  SpyGetCategory.mockImplementation(() => {
    return new Promise((res) => {
      res({
        success: true,
        message: "",
        data: { name: InitialCategoryNameText, id: categoryId },
      });
    });
  });

  const user = await userEvent.setup()

  render(
    <EditCategoryForm
      categoryId={categoryId}
      mutate={mockMutate}
      handleClose={mockHandleClose}
    />
  );
  await waitFor(() =>
    expect(SpyGetCategory).toHaveBeenCalledWith({ id: categoryId })
  );

  await act(() => {
    showToast("Test Message", "info");
  });

  const nameInput = await screen.findByRole("textbox");
  await waitFor(() => expect(nameInput).toHaveValue(InitialCategoryNameText));


  await user.clear(nameInput);

  expect(
    screen.getByText("Please insert a valid category name")
  ).toBeInTheDocument();

  await user.type(nameInput, "S")


  expect(
    screen.queryByText("Please insert a valid category name")
  ).not.toBeInTheDocument();

});


it("Should trigger handleClose and mutate functions if there were no validation errors and submit succeeds after clicking submit", async () => {
  const categoryId = Date.now();
  const user = await userEvent.setup();
  const mockMutate = jest.fn();
  const mockHandleClose = jest.fn();
  const SpyUpdateCategory = jest.spyOn(CategoryLogic, "UpdateCategory");
  const SpyGetCategory = jest.spyOn(CategoryLogic, "GetCategory");

  SpyUpdateCategory.mockImplementation(() => {
    return new Promise((res) => {
      res({ success: true, message: "" });
    });
  });

  SpyGetCategory.mockImplementation(() => {
    return new Promise((res) => {
      res({
        success: true,
        message: "",
        data: { name: InitialCategoryNameText, id: categoryId },
      });
    });
  });

  render(
    <EditCategoryForm
      categoryId={categoryId}
      mutate={mockMutate}
      handleClose={mockHandleClose}
    />
  );
 
  const nameInput = screen.getByRole("textbox");
  expect(nameInput).toBeInTheDocument();
  await user.type(nameInput, "Some Text");

  const submitButton = screen.getByRole("button", { name: "Submit" });
  await user.click(submitButton);
  expect(SpyUpdateCategory).toHaveBeenCalled()
  expect(mockHandleClose).toHaveBeenCalled();
  expect(mockMutate).toHaveBeenCalled();
});

it("Should not trigger handleClose or mutate functions if submit not succeeds after clicking submit", async () => {

  const categoryId = Date.now();
  const user = await userEvent.setup();
  const mockMutate = jest.fn();
  const mockHandleClose = jest.fn();
  const SpyUpdateCategory = jest.spyOn(CategoryLogic, "UpdateCategory");
  const SpyGetCategory = jest.spyOn(CategoryLogic, "GetCategory");

  SpyUpdateCategory.mockImplementation(() => {
    return new Promise((res) => {
      res({ success: false, message: "" });
    });
  });

  SpyGetCategory.mockImplementation(() => {
    return new Promise((res) => {
      res({
        success: true,
        message: "",
        data: { name: InitialCategoryNameText, id: categoryId },
      });
    });
  });

  render(
    <EditCategoryForm
      categoryId={categoryId}
      mutate={mockMutate}
      handleClose={mockHandleClose}
    />
  );

  const nameInput = screen.getByRole("textbox");
  expect(nameInput).toBeInTheDocument();
  await user.type(nameInput, "Some Text");

  const submitButton = screen.getByRole("button", { name: "Submit" });
  await user.click(submitButton);
  
  expect(
    screen.queryByText("Please insert a valid category name")
  ).not.toBeInTheDocument();
  expect(mockHandleClose).not.toHaveBeenCalled();
  expect(mockMutate).not.toHaveBeenCalled();
});
