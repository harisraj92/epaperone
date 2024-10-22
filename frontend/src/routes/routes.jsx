// src/routes/routes.js

import Home from "../pages/Home/Home";
import NewsPaperEditor from "../pages/NewsPaperEditor/NewsPaperEditor";
import Login from "../pages/Login/Login";

const routes = [
  {
    path: "/",
    element: Home,
    exact: true,
  },
  {
    path: "/newspapereditor/",
    element: NewsPaperEditor,
  },
  {
    path: "/newspapereditor/:newsid/:pageid",
    element: NewsPaperEditor,
  },
  {
    path: "/login",
    element: Login,
  },
  // Add more routes as needed
];

export default routes;
