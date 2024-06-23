// src/Student/AccountSettings_student.js
import React from 'react';
import '../../css/style.css';

const AccountSettings_student = () => {
  return (
    <div className="App">
      <div className="main-content">
        <header>
          <h2>Account Settings</h2>
        </header>
        <section className="account-settings">
          <div className="user-info">
            <p>User ID: 75826488</p>
            <label htmlFor="username">Username</label>
            <input type="text" id="username" defaultValue="Dr. Pepper" />
            <p>*A GradeFalcon Employee will never ask for your password*</p>
          </div>
          <div className="change-password">
            <label htmlFor="old-password">Old Password</label>
            <input type="password" id="old-password" placeholder="Old Password" />
            <label htmlFor="new-password">New Password</label>
            <input type="password" id="new-password" placeholder="New Password" />
            <label htmlFor="confirm-password">Confirm New Password</label>
            <input type="password" id="confirm-password" placeholder="Confirm New Password" />
            <button className="save-changes-btn">Save changes</button>
            <button className="delete-account-btn">Delete Account</button>
          </div>
        </section>
      </div>
    </div>
  );
};
export default AccountSettings_student;