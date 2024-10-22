// src/App.js
import React, { useState } from "react";
import {
  BrowserRouter as Router,
  Routes,
  Route,
  Navigate,
} from "react-router-dom";

import Layout from "./components/Layout/Layout"; // Import Layout with Header, Footer
import routes from "./routes/routes"; // Import the route configuration
import "bootstrap/dist/css/bootstrap.min.css"; // Import Bootstrap globally
import Login from "./pages/Login/Login"; // Import your login component

const App = () => {
  const [isAuthenticated, setIsAuthenticated] = useState(false); // Track login status

  return (
    <Router>
      <div className="App">
        <Routes>
          {/* Login Route */}
          <Route
            path="/login"
            element={<Login setIsAuthenticated={setIsAuthenticated} />}
          />

          {/* Protected Routes */}
          {routes.map((route) => (
            <Route
              key={route.path}
              path={route.path}
              element={
                isAuthenticated ? (
                  <Layout setIsAuthenticated={setIsAuthenticated}>
                    <route.element />
                  </Layout>
                ) : (
                  <Navigate to="/login" />
                )
              }
            />
          ))}
        </Routes>
      </div>
    </Router>
  );
};

export default App;
