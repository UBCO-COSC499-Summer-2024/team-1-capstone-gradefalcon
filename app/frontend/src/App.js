import React, { useEffect, useState } from "react";
import { BrowserRouter as Router, Routes, Route, useLocation } from 'react-router-dom';
import ProtectedRoute from "./ProtectedRoute";
import logo from "./assets/logo.png";
import "./css/App.css";
import "./css/style.css";
import NavBar from "./NavBar";
// Import pages
import Dashboard from './pages/Instructor/Dashboard';
import NotFound from './pages/NotFound';
import InstructorSignup from './pages/Instructor/Signup';
import Login from './pages/Instructor/Login';
// Layout component to conditionally render NavBar
const Layout = ({ children }) => {
  const location = useLocation();
  const shouldDisplayNavBar = location.pathname !== '/' && location.pathname !== './login';

  return (
    <>
      {shouldDisplayNavBar && <NavBar />}
      {children}
    </>
  );
};

function App() {
  const [message, setMessage] = useState("");
  const [userName, setUserName] = useState("");

  useEffect(() => {
    fetch("/api/session-info")
      .then(res => res.json())
      .then(data => {
        if (data.userName) {
          setUserName(data.userName);
        }
      })
      .catch(console.error);
  }, []);

  return (
    <Router>
      <div className="App">
        {/* <Layout> */}
        <Routes>
          <Route path="/" element={<InstructorSignup />} />
           <Route path="/dashboard" element={<ProtectedRoute><Dashboard /></ProtectedRoute>} />
          <Route path="/signup" element={<InstructorSignup />} />
          <Route path="/login" element={<Login />} />
          <Route path="*" element={<NotFound />} />
        </Routes>
        {/* </Layout> */}
      </div>
    </Router>
  );
}
export default App;
