import React, { useState } from "react";
import { useNavigate } from "react-router-dom";
import { ToastContainer, toast } from "react-toastify";
import "react-toastify/dist/ReactToastify.css";
import newspaperBg from "../../assets/images/newspaper-bg.png";

const Login = ({ setIsAuthenticated }) => {
  const [username, setUsername] = useState("");
  const [password, setPassword] = useState("");
  const navigate = useNavigate();

  const handleSubmit = (e) => {
    e.preventDefault();

    // Simple validation for login (admin/admin)
    if (username === "admin" && password === "admin") {
      toast.success("Login successful!");
      setIsAuthenticated(true); // Mark the user as authenticated

      // Redirect to home page after successful login
      setTimeout(() => {
        navigate("/"); // Redirect to the home page
      }, 1000); // Delay for toast
    } else {
      toast.error("Invalid username or password.");
    }
  };

  return (
    <div className="container-fluid h-100">
      <div className="row h-100">
        {/* Newspaper section */}
        <div className="col-xxl-8 p-0">
          <img
            src={newspaperBg}
            alt="Newspaper"
            className="img-fluid h-100"
            style={{ objectFit: "cover" }}
          />
        </div>

        {/* Login form section */}
        <div className="col-md-4  bg-white p-2 mt-5">
          <div className="login-container w-100 m-10 mt-5">
            <h2 className="text-center mb-4 logo text-danger display-2">
              ePaper
            </h2>
            <form onSubmit={handleSubmit} className="mt-5">
              <div className="mb-3">
                <input
                  type="text"
                  className="form-control"
                  placeholder="Username"
                  value={username}
                  onChange={(e) => setUsername(e.target.value)}
                  required
                />
              </div>
              <div className="mb-3">
                <input
                  type="password"
                  className="form-control"
                  placeholder="*******"
                  value={password}
                  onChange={(e) => setPassword(e.target.value)}
                  required
                />
              </div>
              <div className="row">
                <div className="col-md-12 text-center">
                  <button type="submit" className="login_btn bg-gray-300">
                    Submit
                  </button>
                </div>
              </div>
            </form>
            <ToastContainer />
          </div>
        </div>
      </div>
    </div>
  );
};

export default Login;
