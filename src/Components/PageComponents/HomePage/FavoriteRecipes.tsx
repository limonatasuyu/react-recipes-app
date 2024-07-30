import { Link } from "react-router-dom";
import { RecipeData } from "../../../interfaces";

export function FavoriteRecipes({ data }: { data: RecipeData[] }) {
  return (
    <div
      className={`flex justify-center 2xl:w-[80%] ${
        data.length ? "" : "w-full"
      }`}
    >
      {data.length ? (
        <div
          className={`cursor-pointer flex flex-wrap justify-center sm:justify-start lg:grid lg:grid-cols-4 2xl:grid-cols-3 ${
            data.length < 3 ? "" : "sm:grid sm:grid-cols-3"
          } md:grid-cols-4 h-fit`}
        >
          {data.map((i: RecipeData) => (
            <Link
              key={i.id}
              to={`/${i.id}`}
              className="group w-[75%] mr-4 p-4 block sm:w-full sm:mr-0 h-fit"
            >
              <img
                src={"placeHolderFood.png" /*i.imgUrl*/}
                alt="food"
                className="w-inherit"
              />
              <div className="group-hover:opacity-50 bg-[#d24309] text-white text-center py-4">
                {i.id}
              </div>
            </Link>
          ))}
        </div>
      ) : (
        <div className="flex items-center">
          <p className="text-center font-bold text-4xl">No Favorites Found</p>
        </div>
      )}
    </div>
  );
}
