import React, { useState ,useContext} from "react";
import { motion } from "framer-motion";
import { useNavigate } from "react-router-dom";
import { AuthContext } from "../pages/AuthContext";

import "./Signup.css";

const Signup = () => {
  const [isLogin, setIsLogin] = useState(false);
  const [name, setName] = useState("");
  const [email, setEmail] = useState("");
  const [password, setPassword] = useState("");
  const [message, setMessage] = useState("");
  const [isLoading, setIsLoading] = useState(false);

  const { login } = useContext(AuthContext);

  const navigate = useNavigate();
  const toggleForm = () => setIsLogin(!isLogin);

  const handleSubmit = async (e) => {
    e.preventDefault();
    setIsLoading(true);
    setMessage("");

    const url = isLogin
      ? "http://localhost:5000/api/auth/login"
      : "http://localhost:5000/api/auth/signup";

    const body = isLogin
      ? { email, password }
      : { name, email, password };

    try {
      const res = await fetch(url, {
        method: "POST",
        headers: { "Content-Type": "application/json" },
        body: JSON.stringify(body),
      });

      const data = await res.json();

      if (!res.ok) {
        setMessage(data.msg || "Something went wrong");
        return;
      }

      if (!isLogin) {
        // After successful signup, switch to login mode with the same credentials
        setMessage("✅ Signup successful! Please login with your credentials.");
        setIsLogin(true); // Switch to login form
      } else {
        login(data.token, data.signupId); 
        // Login: save token + signupId
        localStorage.setItem("token", data.token);
        localStorage.setItem("signupId", data.signupId);

        // Check if profile completed - WITH AUTH HEADER
        const checkRes = await fetch(
          `http://localhost:5000/api/auth/check-profile`,
          {
            headers: {
              'Authorization': `Bearer ${data.token}`
            }
          }
        );

        if (!checkRes.ok) {
          throw new Error(`Failed to check profile status: ${checkRes.status}`);
        }

        const checkData = await checkRes.json();

        if (checkData.completed) {
          navigate("/main"); // Profile already completed
        } else {
          navigate("/profile"); // Redirect to complete profile
        }
      }
    } catch (err) {
      console.error(err);
      setMessage("❌ Server error. Please try again.");
    } finally {
      setIsLoading(false);
    }
  };

  return (
    <div className="signup-wrapper">
      <div className="red-glow"></div>
      <motion.div
        className="signup-card"
        initial={{ opacity: 0, scale: 0.9, y: 30 }}
        animate={{ opacity: 1, scale: 1, y: 0 }}
        transition={{ duration: 0.8, ease: "easeOut" }}
      >
        <h2>{isLogin ? "Welcome Back," : "Join The Journey"}</h2>
        <form onSubmit={handleSubmit}>
          {!isLogin && (
            <input
              type="text"
              placeholder="Full Name"
              value={name}
              onChange={(e) => setName(e.target.value)}
              required
              disabled={isLoading}
            />
          )}
          <input
            type="email"
            placeholder="Email"
            value={email}
            onChange={(e) => setEmail(e.target.value)}
            required
            disabled={isLoading}
          />
          <input
            type="password"
            placeholder="Password"
            value={password}
            onChange={(e) => setPassword(e.target.value)}
            required
            disabled={isLoading}
          />
          <button type="submit" disabled={isLoading}>
            {isLoading ? "Processing..." : isLogin ? "Login" : "Sign Up"}
          </button>
        </form>
        {message && <p className="server-msg">{message}</p>}
        <p>
          {isLogin ? "New to our gym?" : "Already have an account?"}{" "}
          <span onClick={toggleForm} style={{ cursor: "pointer", color: "#ff0000", fontWeight: "bold" }}>
            {isLogin ? "Sign Up" : "Login"}
          </span>
        </p>
      </motion.div>
    </div>
  );
};

export default Signup;