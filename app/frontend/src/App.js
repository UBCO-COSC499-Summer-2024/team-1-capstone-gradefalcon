import React, { useEffect, useState } from "react";
import { BrowserRouter as Router, Routes, Route, useLocation } from 'react-router-dom';
import logo from "./assets/logo.png";
import "./css/App.css";
import "./css/style.css";
import NavBar from "./NavBar";
// Import pages
import Dashboard from './pages/Instructor/Dashboard';
import NotFound from './pages/NotFound';
import InstructorSignup from './pages/Instructor/Signup';

// Layout component to conditionally render NavBar
const Layout = ({ children }) => {
  const location = useLocation();
  const shouldDisplayNavBar = location.pathname !== '/';

  return (
    <>
      {shouldDisplayNavBar && <NavBar />}
      {children}
    </>
  );
};

function App() {
  const [message, setMessage] = useState("");

  useEffect(() => {
    fetch("/api/")
      .then(res => res.json())
      .then(res => setMessage(res.message))
      .catch(console.error);
  }, []);
  

  return (
    <Router>
      <div className="App">
        
        {/* <header className="App-header">
          <img src={logo} className="App-logo" alt="logo" />
          <p>{message || "Loading..."}</p>
          <p>
            Welcome to GradeFalcon, an optical marking system for grading bubble sheets.
          </p>
        </header> */}
        <Layout>
        <Routes>
          <Route path="/" element={<InstructorSignup />} />
          <Route path="/dashboard" element={<Dashboard />} />
          <Route path="/signup" element={<InstructorSignup />} />
          <Route path="*" element={<NotFound />} />
        </Routes>
        </Layout>
      </div>
    </Router>
  );
}
export default App;
