import "@testing-library/jest-dom";
import { render, screen, waitFor } from "@testing-library/react";
import { MemoryRouter } from "react-router-dom";
import HomePage from "./Homepage";
import { act } from "react";
import { showToast } from "../Components/Toast";
import userEvent from "@testing-library/user-event";

const FavoriteRecipesText = "Favorite Recipes Text";
const CategoriesText = "Categories Text";
jest.mock("../Components/Lists/FavoriteRecipes", () => ({
  FavoriteRecipes: () => <>{FavoriteRecipesText}</>,
}));
jest.mock("../Components/Lists/Categories", () => ({
  Categories: () => <>{CategoriesText}</>,
}));

describe("Home page render tests", () => {
  it("should render the buttons", async () => {
    render(
      <MemoryRouter>
        <HomePage />
      </MemoryRouter>
    );

    await act(() => {
      showToast("test message", "info");
    });

    const FavoritesButton = screen.getByRole("button", { name: "Favorites" });
    const CategoriesButton = screen.getByRole("button", { name: "Categories" });

    expect(FavoritesButton).toBeInTheDocument();
    expect(CategoriesButton).toBeInTheDocument();
  });

  test("Categories component should be rendered initially, favorites button should render the Favorites component when clicked, and Categories should be rendered after categories button clicked", async () => {
    const user = userEvent.setup();

    render(
      <MemoryRouter>
        <HomePage />
      </MemoryRouter>
    );

    await act(() => {
      showToast("test message", "info");
    });

    expect(screen.getByText(CategoriesText)).toBeInTheDocument();

    const FavoritesButton = screen.getByRole("button", { name: "Favorites" });
    expect(FavoritesButton).toBeInTheDocument();
    await user.click(FavoritesButton);
    await waitFor(() => {
      expect(screen.getByText(FavoriteRecipesText)).toBeInTheDocument();
    });

    const CategoriesButton = screen.getByRole("button", { name: "Categories" });
    await user.click(CategoriesButton);
    await waitFor(() => {
      expect(screen.getByText(CategoriesText)).toBeInTheDocument();
    });
  });
});
