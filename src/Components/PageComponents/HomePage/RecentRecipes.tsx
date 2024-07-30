import { Link } from "react-router-dom";
import { RecipeData } from "../../../interfaces";

export function RecentRecipes({ data }: { data: RecipeData[] }) {
  return (
    <div className="w-[20%] hidden 2xl:block">
      <h1 className="text-start text-3xl mb-2">Recently Viewed</h1>
      {data.length ? (
        <div className="flex flex-col gap-2">
          {data.map((i: RecipeData) => (
            <Link
              className="flex block bg-[#d24309] border border-[#d24309] border-2 rounded"
              to="/"
            >
              <img src="placeHolderFood.png" alt="food" className="w-20" />
              <div>
                <h2 className="text-white font-bold ml-2">
                  {/*Name of the food*/}
                  {i.name}
                </h2>
                <p className="text-white word-break ml-2">
                  {/*little description of what the food is or the recipes little
                overview ..*/}
                  {(i.description ?? i.instructions).slice(0, 60)}...
                </p>
              </div>
            </Link>
          ))}
        </div>
      ) : (
        <p className="bg-[#d24309] font-bold text-xl text-white rounded p-3">
          No Recently Viewed Recipes Found
        </p>
      )}
    </div>
  );
}


