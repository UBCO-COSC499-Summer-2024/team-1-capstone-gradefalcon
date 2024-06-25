import React from 'react';
import LogoutButton from './LogoutButton';

const NavBar = () => {
  return (
    <div className="sidebar">
      <div className="logo">
        <h1>GradeFalcon</h1>
      </div>
      <nav>
        <ul>
          <li>
            <a href="/dashboard">Dashboard</a>
          </li>
          <li>
            <a href="/schedule">Schedule</a>
          </li>
          <li>
            <a href="/examBoard">Exam Board</a>
          </li>
          <li>
            <a href="/gradeReport">Grade Report</a>
          </li>
          <li>
            <a href="/classes">Classes</a>
          </li>
          <li>
            <a href="/accountSettings">Account Settings</a>
          </li>
          <li>
            <a href="/notificationPreferences">Notification Preferences</a>
          </li>
          <li>
            <LogoutButton />
          </li>
        </ul>
      </nav>
    </div>
  );
};

export default NavBar;
