// NavBar.js
import React from 'react';
import "../css/style.css"; // Ensure this import is present
import DarkModeToggle from '../pages/DarkModeToggle';

const NavBar = () => {
  return (
    <div className="sidebar">
      <div className="logo">
        <h1>GradeFalcon</h1>
      </div>
      <nav>
        <ul>
          <li><a href="/Dashboard">Dashboard</a></li>
          <li><a href="/Schedule">Schedule</a></li>
          <li><a href="/ExamBoard">Exam Board</a></li>
          <li><a href="/GradeReport">Grade Report</a></li>
          <li><a href="/Classes">Classes</a></li>
          <li><a href="/AccountSettings">Account Settings</a></li>
          <li><a href="/NotificationPreferences">Notification Preferences</a></li>
          <li><a href="/Logout">Logout</a></li>
        </ul>
      </nav>
      <div className="dark-mode-toggle">
        <DarkModeToggle />
      </div>
    </div>
  );
};

export default NavBar;


