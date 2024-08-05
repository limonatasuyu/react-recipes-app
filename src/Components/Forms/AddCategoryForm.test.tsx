import "@testing-library/jest-dom";
import { render, screen } from "@testing-library/react";
import { userEvent } from "@testing-library/user-event";
import { AddCategoryForm } from "./AddCategoryForm";
import * as CategoryLogic /*{ AddCategory }*/ from "../../logic/CategoryLogic";
import { AddCategoryDTO } from "../../interfaces";
it("Should give validation errors when needed", async () => {
  const user = await userEvent.setup();
  const handleCloseMock = jest.fn();
  const mutateMock = jest.fn();

  render(<AddCategoryForm handleClose={handleCloseMock} mutate={mutateMock} />);

  const nameInput = screen.getByRole("textbox");
  expect(nameInput).toBeInTheDocument();
  await user.clear(nameInput);

  const submitButton = screen.getByRole("button", { name: "Submit" });
  await user.click(submitButton);
  expect(
    screen.getByText("Please insert a valid category name")
  ).toBeInTheDocument();

  await user.type(nameInput, "S");
  expect(
    screen.queryByText("Please insert a valid category name")
  ).not.toBeInTheDocument();

  await user.clear(nameInput);

  expect(
    screen.getByText("Please insert a valid category name")
  ).toBeInTheDocument();
});

it("Should trigger handleClose and mutate functions if there were no validation errors and submit succeeds after clicking submit", async () => {
  const AddCategoryMock = jest.spyOn(CategoryLogic, "AddCategory");
  AddCategoryMock.mockImplementation((dto: AddCategoryDTO): Promise<any> => {
    return new Promise((res) => {
      res({ success: true, message: "", data: {} });
    });
  });

  const user = await userEvent.setup();
  const handleCloseMock = jest.fn();
  const mutateMock = jest.fn();

  render(<AddCategoryForm handleClose={handleCloseMock} mutate={mutateMock} />);

  const nameInput = screen.getByRole("textbox");
  expect(nameInput).toBeInTheDocument();
  await user.type(nameInput, "Some Text");

  const submitButton = screen.getByRole("button", { name: "Submit" });
  await user.click(submitButton);
  expect(handleCloseMock).toHaveBeenCalled();
  expect(mutateMock).toHaveBeenCalled();
});

it("Should not trigger handleClose or mutate functions if submit not succeeds after clicking submit", async () => {
  const AddCategoryMock = jest.spyOn(CategoryLogic, "AddCategory");
  AddCategoryMock.mockImplementation((dto: AddCategoryDTO): Promise<any> => {
    return new Promise((res) => {
      res({ success: false, message: "", data: {} });
    });
  });

  const user = await userEvent.setup();
  const handleCloseMock = jest.fn();
  const mutateMock = jest.fn();

  render(<AddCategoryForm handleClose={handleCloseMock} mutate={mutateMock} />);

  const nameInput = screen.getByRole("textbox");
  expect(nameInput).toBeInTheDocument();
  await user.type(nameInput, "Some Text");

  const submitButton = screen.getByRole("button", { name: "Submit" });
  await user.click(submitButton);

  expect(
    screen.queryByText("Please insert a valid category name")
  ).not.toBeInTheDocument();
  expect(handleCloseMock).not.toHaveBeenCalled();
  expect(mutateMock).not.toHaveBeenCalled();
});

it("should trigger handleClose on click to cancel button", async () => {
  const user = await userEvent.setup();
  const handleCloseMock = jest.fn();
  const mutateMock = jest.fn();

  render(<AddCategoryForm handleClose={handleCloseMock} mutate={mutateMock} />);

  const cancelButton = screen.getByRole("button", { name: "Cancel" });
  await user.click(cancelButton);
  expect(handleCloseMock).toHaveBeenCalled();
});
