import React, { useEffect, useState } from 'react';
import ReactDOM from 'react-dom/client';
import './index.css';
import HomePage from './Homepage';
import Layout from "./Layout";
import { createHashRouter, RouterProvider } from "react-router-dom";
import { InitDB } from "./db";

const router = createHashRouter([
  {
    path: "/",
    element: <Layout />,
    children: [
      {
        path: "/",
        element: <HomePage />,
      },
    ],
  },
], { basename: "/" })

const root = ReactDOM.createRoot(
  document.getElementById("root") as HTMLElement
);

const App = () => {
  const [isDBReady, setIsDBReady] = useState(false)

  const handleInitDB = async () => {
    const status = await InitDB();
    setIsDBReady(Boolean(status));
  };


  useEffect(() => {
    handleInitDB()
  }, [])

  if (!isDBReady) return <>Loading..</>
  return <RouterProvider router={router} />
}

root.render(<App/>);

