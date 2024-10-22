// src/components/Sidebar/Sidebar.jsx
import React from "react";
import { Link } from "react-router-dom";

const Sidebar = () => {
  return (
    <div className="sidebar">
      <ul className="nav flex-column">
        <li className="nav-item">
          <Link className="nav-link" to="/">
            Home
          </Link>
        </li>
        <li className="nav-item">
          <Link className="nav-link" to="/user">
            Users
          </Link>
        </li>
        {/* Add more home page-specific navigation links here if necessary */}
      </ul>
    </div>
  );
};

export default Sidebar;
