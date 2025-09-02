import React, { useContext } from "react";
import { motion } from "framer-motion";
import { useNavigate } from "react-router-dom";
import "./Navbar.css";
import { AuthContext } from "./pages/AuthContext";

const Navbar = () => {
  const { isLoggedIn, logout, user } = useContext(AuthContext);
  const navigate = useNavigate();

  const handleLogout = () => {
    logout();
    navigate("/");
  };

  const handleLogin = () => {
    navigate("/signup");
  };

  return (
    <motion.nav
      className="navbar"
      initial={{ y: -80, opacity: 0 }}
      animate={{ y: 0, opacity: 1 }}
      transition={{ delay: 2.3, duration: 0.8, ease: "easeOut" }}
    >
      <div className="logo">ATHENIX</div>
      <ul className="nav-links">
        <li><a href="/">Home</a></li>

        {!isLoggedIn && (
          <>
            <li><a href="#plans">Plans</a></li>
            <li><a href="#about">About</a></li>
            <li>
              <motion.button 
                className="login-btn"
                onClick={handleLogin}
                whileHover={{ scale: 1.05 }}
                whileTap={{ scale: 0.95 }}
              >
                Login
              </motion.button>
            </li>
          </>
        )}

        {isLoggedIn && (
          <>
            {/* <li className="user-welcome">Welcome, {user?.name || "User"}!</li> */}
            <li><a href="/main">Profile</a></li>
            <li>
              <motion.button 
                onClick={handleLogout} 
                className="logout-btn"
                whileHover={{ scale: 1.05 }}
                whileTap={{ scale: 0.95 }}
              >
                Logout
              </motion.button>
            </li>
          </>
        )}
      </ul>
    </motion.nav>
  );
};

export default Navbar;