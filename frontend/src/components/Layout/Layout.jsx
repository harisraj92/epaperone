// src/components/Layout/Layout.jsx
import React from "react";
import Header from "../Header/Header";
import Footer from "../Footer/Footer";

const Layout = ({ children }) => {
  return (
    <div className="layout">
      <Header />
      <div>
        <main className="content">{children}</main>
      </div>
      <Footer />
    </div>
  );
};

export default Layout;
