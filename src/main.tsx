import React from "react";
import { createBrowserRouter, RouterProvider } from "react-router-dom";
// import { onAuthStateChanged } from "firebase/auth";
import "./pomodoro.scss";
import "./To-do.scss";
import "./expenseTracker.scss";
import "./weather.scss";
// import SignUp from "./signUp";
import App from "./Homepage";
import Focus from "./focusTab";
import Todo from "./To-do-Page";
import ExpenseTracker from "./expenseTracker";
import Weather from "./Weather";
import Contact from "./contact";
import NotFound from "./404.tsx";
import ReactDOM from "react-dom/client";
import "./index.scss";
import Ui from "./Ui.tsx";
const router = createBrowserRouter([
  {
    path: "/",
    element: (
      <>
        <header>
          <Ui />
        </header>
        <main>
          <App />
        </main>
        <Contact />
      </>
    ),
  },
  {
    path: "/focus",
    element: (
      <>
        <header>
          <Ui />
        </header>
        <main>
          <Focus />
        </main>
        <Contact />
      </>
    ),
  },
  {
    path: "/todo",
    element: (
      <>
        <header>
          <Ui />
        </header>
        <main>
          <Todo />
        </main>
        <Contact />
      </>
    ),
  },
  {
    path: "/expense-tracker",
    element: (
      <>
        <header>
          <Ui />
        </header>
        <main>
          <ExpenseTracker />
        </main>
        <Contact />
      </>
    ),
  },
  {
    path: "/weather",
    element: (
      <>
        <header>
          <Ui />
        </header>
        <main>
          <Weather />
        </main>
        <Contact />
      </>
    ),
  },
  {
    path: "*",
    element: (
      <>
        <header>
          <Ui />
        </header>
        <main>
          <NotFound />
        </main>
        <Contact />
      </>
    ),
  },
]);
function detectColorScheme() {
  let theme = "dark";
  if (localStorage.getItem("theme")) {
    if (localStorage.getItem("theme") === "light") {
      theme = "light";
    }
  } else if (window.matchMedia) {
    if (window.matchMedia("(prefers-color-scheme: light)").matches) {
      theme = "light";
    }
  }
  document.documentElement.setAttribute("data-theme", theme);
}
detectColorScheme();
ReactDOM.createRoot(document.getElementById("root")!).render(
  <React.StrictMode>
    <RouterProvider router={router} />
  </React.StrictMode>
);
