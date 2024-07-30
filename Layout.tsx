import { useState } from "react";
import { Outlet } from "react-router-dom";
import { Link } from "react-router-dom";

export default function Layout() {
  const [isNavigationOpen, setIsNavigationOpen] = useState(false)

  return (
    <div className="w-[99vw] overflow-hidden">
      <div className="flex">
        <div className={`flex flex-col bg-[#d24309] w-40 gap-2 p-2 h-screen fixed ${isNavigationOpen ? ""  : "-ml-40"} shadow-lg shadow-gray-900`}>
          
        <div className="cursor-pointer flex gap-2 items-center justify-center" onClick={() => setIsNavigationOpen(!isNavigationOpen)}>
          <img src="hamburger-icon-white.png" className="w-6 h-6" alt="hamburger icon"/>
        
          <h1 className="text-white text-3xl font-bold text-center">Tasties</h1>
      </div>
          <div className="flex justify-center mt-2 mr-2">
            <img src="/icon.png" alt="hamburger-icon" width="auto" />
          </div>
          <hr />
          <nav className="flex flex-col">
            <Link className="text-white text-xl hover:font-bold" to="/">
              Home
            </Link>
            <Link className="text-white text-xl hover:font-bold" to="/all">
              All Recipes
            </Link>
            <Link
              className="text-white text-xl hover:font-bold"
              to="/shopping-list"
            >
              Shopping List
            </Link>
            <Link
              className="text-white text-xl hover:font-bold"
              to="/meal-planner"
            >
              Meal Planner
            </Link>
          </nav>
        </div>
        <div className="cursor-pointer" onClick={() => setIsNavigationOpen(!isNavigationOpen)}>
          <img src="hamburger-icon-orange.png" className="w-6 h-6 mt-6 ml-6" alt="hamburger icon"/>
        </div>
        <Outlet />
      </div>
    </div>
  );
}
