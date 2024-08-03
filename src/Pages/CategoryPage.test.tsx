import "@testing-library/jest-dom";
import { render, screen } from "@testing-library/react";
import { MemoryRouter } from "react-router-dom";
import CategoryPage from "./CategoryPage";
import { act } from "react";
import { showToast } from "../Components/Toast";


test("should render the recipes component", async () => {
  render(
    <MemoryRouter>
      <CategoryPage />
    </MemoryRouter>
  );

  await act(() => {
    showToast("test message", "info");
  });

});
