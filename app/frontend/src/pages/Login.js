import React from "react";
import { useAuth0 } from "@auth0/auth0-react";
import '../css/Login.css';
import logo from "../assets/logo.png";

const Login = () => {
  const { loginWithRedirect } = useAuth0();

  return (
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