import React, { useState } from "react";
import { useNavigate } from "react-router-dom";
import '../../css/Login.css';
import logo from "../../assets/logo.png";

const Login = () => {
  const [email, setEmail] = useState("");
  const [password, setPassword] = useState("");
  const navigate = useNavigate(); 

  const handleSubmit = async (event) => {
    event.preventDefault();
    try {
      const response = await fetch("http://localhost:3000/api/login", {
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
        
        // Redirect to the appropriate dashboard based on the role
        if (data.role === 'instructor') {
          navigate("/dashboard");
        } else if (data.role === 'student') {
          navigate("/student-dashboard");
        } else if (data.role === 'admin') {
          navigate("/adminDashboard");
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
                value={email}
                onChange={(e) => setEmail(e.target.value)}
                required
                className="email-input"
              />
            </div>
            <div>
              <label>Password</label>
              <input
                type="password"
                value={password}
                onChange={(e) => setPassword(e.target.value)}
                required
                className="password-input"
              />
            </div>
            <button type="submit" className="button">
              Login
            </button>
            <div className="divider">
              <div className="rectangle" />
              <div className="text-wrapper-3">or continue with</div>
              <div className="rectangle" />
            </div>
            <button type="button" className="google-button">Google</button>
            <p className="terms">
              By clicking continue, you agree to our <a href="#">Terms of Service</a> and <a href="#">Privacy Policy</a>
            </p>
            <a href="./Signup" className="switch-link">Don't have an account? Sign up</a>
          </div>
        </div>
      </div>
    </form>
  );
};

export default Login;
