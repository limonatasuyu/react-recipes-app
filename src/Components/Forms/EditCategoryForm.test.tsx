import "@testing-library/jest-dom";
import { render, screen, act, waitFor } from "@testing-library/react";
import { EditCategoryForm } from "./EditCategoryForm";
import * as CategoryLogic from "../../logic/CategoryLogic";
import { showToast } from "../Toast";

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
});
