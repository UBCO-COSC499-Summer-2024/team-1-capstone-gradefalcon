// src/Instructor/AccountSettings.js
import React, { useState } from 'react';
import '../../css/style.css';

const AccountSettings = () => {
  const [username, setUsername] = useState('Dr. Pepper');
  const [oldPassword, setOldPassword] = useState('');
  const [newPassword, setNewPassword] = useState('');
  const [confirmPassword, setConfirmPassword] = useState('');

  const handleInputChange = (e, setState) => {
    const value = e.target.value;
    const sanitizedValue = value.replace(/[^a-zA-Z0-9\s.,!?-]/g, ''); //restricts string altering characters

    setState(sanitizedValue);
  };

  const handleSubmit = () => {
    if (newPassword !== confirmPassword) {
      alert('New passwords do not match');
      return;
    }
    // Backend call for saving changes
    // Implement the backend API call here
    // NOTE: can discord this if you with to impliment in a differant manner

  };

  const handleDeleteAccount = () => {
    // Backend call for deleting account
    // Implement the backend API call here
    // NOTE: can discord this if you with to impliment in a differant manner
  };

  return (
    <div className="App">
      <div className="main-content">
        <header>
          <h2 data-testid="header">Account Settings</h2>
        </header>
        <section className="account-settings">
          <div className="user-info">
            <p>User ID: 75826488</p> {/* //dummy input, will be retrieved with SQL query when implemented */}
            <label htmlFor="username">Username</label>
            <input
              type="text"
              id="username"
              value={username}
              onChange={(e) => handleInputChange(e, setUsername)}
              data-testid="username-input"
            />
            <p>*A GradeFalcon Employee will never ask for your password*</p>
          </div>
          <div className="change-password">
            <label htmlFor="old-password">Old Password</label>
            <input
              type="password"
              id="old-password"
              placeholder="Old Password"
              value={oldPassword}
              onChange={(e) => handleInputChange(e, setOldPassword)}
              data-testid="old-password-input"
            />
            <label htmlFor="new-password">New Password</label>
            <input
              type="password"
              id="new-password"
              placeholder="New Password"
              value={newPassword}
              onChange={(e) => handleInputChange(e, setNewPassword)}
              data-testid="new-password-input"
            />
            <label htmlFor="confirm-password">Confirm New Password</label>
            <input
              type="password"
              id="confirm-password"
              placeholder="Confirm New Password"
              value={confirmPassword}
              onChange={(e) => handleInputChange(e, setConfirmPassword)}
              data-testid="confirm-password-input"
            />
            <button
              className="save-changes-btn"
              onClick={handleSubmit}
              data-testid="save-changes-btn"
            >
              Save changes
            </button>
            <button
              className="delete-account-btn"
              onClick={handleDeleteAccount}
              data-testid="delete-account-btn"
            >
              Delete Account
            </button>
          </div>
        </section>
      </div>
    </div>
  );
};

export default AccountSettings;
