import { RecipeData } from "../interfaces";
import { Link } from "react-router-dom";

export function RecipeCard({
  data,
  handleEdit,
  handleDelete,
  handleFavorite,
  className = ""
}: {
  data: RecipeData;
  handleEdit: () => void;
  handleDelete: () => void;
  handleFavorite: () => void;
  className?: string;
}) {
  return (
    <Link
      className={`flex items-center justify-between bg-[#d24309] border border-[#d24309] border-2 rounded-md max-w-3xl mx-auto p-4 mb-8 ${className}`}
      to={`/recipe/${data.id}`}
      key={data.id}
    >
      <div className="w-24 h-24 bg-white rounded-md flex justify-center items-center">
        <img
          src={data.imageDataUrl ?? "placeHolderFood.png"}
          alt="food"
          className="w-24 h-auto"
        />
      </div>
      <div className="ml-4">
        <h2 className="text-white font-bold text-xl">{data.name}</h2>
        <p className="text-white">
          {(data.description ?? data.instructions).slice(0, 60)}...
        </p>
      </div>
      <div className="flex items-center gap-2 mr-2">
        <button
          onClick={(event) => {
            event.preventDefault();
            handleEdit();
          }}
          className="hover:bg-[#ff5a19] rounded transition-colors duration-300"
        >
          <img src="edit-icon.png" alt="edit icon" className="w-12 h-12" />
        </button>
        <button
          onClick={(event) => {
            event.preventDefault();
            handleDelete();
          }}
          className="hover:bg-[#ff5a19] rounded transition-colors duration-300 p-1"
        >
          <img src="delete-icon.png" alt="delete icon" className="w-10 h-10" />
        </button>
        <button
          onClick={(event) => {
            event.preventDefault();
            handleFavorite();
          }}
          className="rounded transition-colors duration-300"
        >
          <img
            src={
              data.isFavorite
                ? "favorite-icon-yellow.png"
                : "favorite-icon-white.png"
            }
            alt="favorite icon"
            className="w-10 h-10 mb-1"
          />
        </button>
      </div>
    </Link>
  );
}
