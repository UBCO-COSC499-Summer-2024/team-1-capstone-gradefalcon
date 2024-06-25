import React, { useState } from "react";
import { useNavigate } from "react-router-dom";
import '../css/Login.css';
import logo from "../assets/logo.png";

const Login = () => {
  const [email, setEmail] = useState("");
  const [password, setPassword] = useState("");
  const navigate = useNavigate(); 

  const handleSubmit = async (event) => {
    event.preventDefault();
    try {
      const response = await fetch("api/auth/login", {
        method: "POST",
        headers: {
          "Content-Type": "application/json",
        },
        body: JSON.stringify({ email, password }),
        credentials: 'include',
      });

      if (response.ok) {
        const data = await response.json();
        localStorage.setItem("token", data.token);
        console.log("Login successful, role:", data.role); // Debugging log
        
        // Redirect to the appropriate dashboard based on the role
        if (data.role === 'instructor') {
          navigate("/Dashboard");
        } else if (data.role === 'student') {
          navigate("/student-dashboard");
        } else if (data.role === 'admin') {
          navigate("/AdminDashboard");
        }
      } else {
        console.error("Login failed");
      }
    } catch (error) {
      console.error("Error:", error);
    }
  };

  return (
    <form onSubmit={handleSubmit}>
      <div className="container">
        <div className="form-box">
          <div>
            <img src={logo} alt="Logo" className="logo"/>
          </div>
          <div className="content">
            <div className="copy">
              <div className="text-wrapper">Log in to your account</div>
            </div>
            <div>
              <label>Email</label>
              <input
                type="email"
                className="input-box"
                value={email}
                onChange={(e) => setEmail(e.target.value)}
                required
              />
            </div>
            <div>
              <label>Password</label>
              <input
                type="password"
                className="input-box"
                value={password}
                onChange={(e) => setPassword(e.target.value)}
                required
              />
            </div>
            <button type="submit" className="button">
              Login
            </button>
          </div>
        </div>
      </div>
    </form>
  );
};

export default Login;
