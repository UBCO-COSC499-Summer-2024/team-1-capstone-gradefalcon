// Layout.js
import React from 'react';
import '@fontsource/inter/latin.css'; // Import the font
import '../css/App.css'; // Import global styles
import NavBar from './NavBar';
import { useLocation } from "react-router-dom";


const Layout = ({ children }) => {
    const location = useLocation();
    const shouldDisplayNavBar =
    location.pathname !== "/" && location.pathname !== "/*" && location.pathname !== "/login" 
    && location.pathname !== "/signup" && location.pathname !== "/AdminDashboard" 
    && location.pathname !== "/userManagement" && location.pathname !== "/Logout";
  return (
    <div 
      lang="en" 
      className="antialiased"
      style={{ 
        '--font-heading': 'Inter', 
        '--font-body': 'Inter' 
      }}
    >
    {/* {shouldDisplayNavBar && <NavBar />} */}
    {children}
    </div>
  );
};

export default Layout;
