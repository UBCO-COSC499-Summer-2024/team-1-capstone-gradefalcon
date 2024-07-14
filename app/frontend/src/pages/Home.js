import React from 'react';
import { useLogto } from '@logto/react';
import '../css/Home.css'; // Assuming you have a similar CSS file for styling
import logo from "../assets/logo.png"; // Logo for your home page

const Home = () => {
  const { signIn, signOut, isAuthenticated } = useLogto();

  return (
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
            <div className="text-wrapper">Welcome to the Home Page</div>
          </div>
          <div>
            {isAuthenticated ? (
              <button onClick={() => signOut('http://localhost:3000/')} className="button" aria-label="signout">
                Sign Out
              </button>
            ) : (
              <button onClick={() => signIn('http://localhost:3000/Dashboard')} className="button" aria-label="signin">
                Sign In
              </button>
            )}
          </div>
        </div>
      </div>
    </div>
  );
};

export default Home;
