import React from "react";
import { useAuth0 } from "@auth0/auth0-react";
import '../css/Login.css';
import logo from "../assets/logo.png";

const Login = () => {
  const { loginWithRedirect } = useAuth0();

  return (
    <form onSubmit={handleSubmit}>
      <div className="container">
      <style>
        {`
          body {
            justify-content: center;
          }
        `}
      </style>
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
                aria-label="email"
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
                aria-label="password"
                required
              />
            </div>
            <button type="submit" className="button" aria-label="login">
              Login
            </button>
    <div className="container">
      <div className="form-box">
        <div>
          <img src={logo} alt="Logo" className="logo"/>
        </div>
        <div className="content">
          <div className="copy">
            <div className="text-wrapper">Log in to your account</div>
          </div>
          <button onClick={() => loginWithRedirect()} className="button">
            Login
          </button>
          <div className="divider">
            <div className="rectangle" />
            <div className="text-wrapper-3">or continue with</div>
            <div className="rectangle" />
          </div>
          {/* Adjust the sign-up link to use Auth0's sign-up page or a custom sign-up page if you have one */}
          <a href="#" onClick={() => loginWithRedirect({ screen_hint: 'signup' })} className="switch-link">Don't have an account? Sign up</a>
        </div>
      </div>
    </div>
  );
};

export default Login;
