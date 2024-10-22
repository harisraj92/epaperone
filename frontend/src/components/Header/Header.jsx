import React from "react";
import { NavLink } from "react-router-dom";
import { useNavigate } from "react-router-dom"; // Updated import
import { FontAwesomeIcon } from "@fortawesome/react-fontawesome";
import { faBars, faSignOutAlt } from "@fortawesome/free-solid-svg-icons";

const Header = () => {
  const navigate = useNavigate(); // Use useNavigate instead of useHistory

  const handleLogout = () => {
    // Perform logout operations here (e.g., clearing tokens)

    // Redirect to the login page
    navigate("/login"); // Use navigate for programmatic navigation
  };

  return (
    <header>
      {/* Fixed navbar */}
      <nav className="navbar bd-navbar navbar-expand-md fixed-top bg-gray-500 mb-3">
        <div className="container">
          <a className="navbar-brand logo text-white" href="#">
            eNEWSpaper
          </a>
          <button
            className="navbar-toggler"
            type="button"
            data-bs-toggle="collapse"
            data-bs-target="#navbarCollapse"
            aria-controls="navbarCollapse"
            aria-expanded="false"
            aria-label="Toggle navigation"
          >
            <span className="navbar-toggler-icon" />
          </button>
          <div className="collapse navbar-collapse" id="navbarCollapse">
            <ul className="navbar-nav me-auto mb-2 mb-md-0">
              <li className="nav-item">
                <NavLink
                  to="/"
                  className={({ isActive }) =>
                    isActive ? "nav-link active" : "nav-link"
                  }
                >
                  Home
                </NavLink>
              </li>
              <li className="nav-item">
                <NavLink
                  to="/NewsPaperEditor"
                  className={({ isActive }) =>
                    isActive ? "nav-link active" : "nav-link"
                  }
                >
                  Design Layout
                </NavLink>
              </li>
            </ul>
            <div className="d-flex align-items-center">
              <button
                className="btn bg-gray-100"
                onClick={handleLogout}
                title="Logout"
              >
                <FontAwesomeIcon
                  icon={faSignOutAlt}
                  className="text-xl text-red-600"
                />
              </button>
            </div>
          </div>
        </div>
      </nav>
    </header>
  );
};

export default Header;
