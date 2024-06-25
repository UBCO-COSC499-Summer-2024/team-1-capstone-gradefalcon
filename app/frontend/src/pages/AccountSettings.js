import React, { useState, useEffect } from 'react';
import { useAuth0 } from "@auth0/auth0-react";
import '../../css/App.css';

const AccountSettings = () => {
  const { user, getAccessTokenSilently } = useAuth0();
  const [username, setUsername] = useState(user ? user.name : '');
  const [oldPassword, setOldPassword] = useState('');
  const [newPassword, setNewPassword] = useState('');
  const [confirmPassword, setConfirmPassword] = useState('');

  useEffect(() => {
    if (user) {
      setUsername(user.name);
    }
  }, [user]);

  const handleInputChange = (e, setState) => {
    const value = e.target.value;
    const sanitizedValue = value.replace(/[^a-zA-Z0-9\s.,!?-]/g, ''); // restricts string altering characters
    setState(sanitizedValue);
  };

  const handleSubmit = async () => {
    if (newPassword !== confirmPassword) {
      alert('New passwords do not match');
      return;
    }
    try {
      const token = await getAccessTokenSilently({
        audience: 'https://dev-yqcwuih0t2m7u447.us.auth0.com/api/v2/',
        scope: 'update:users',
      });

      const response = await fetch(`https://dev-yqcwuih0t2m7u447.us.auth0.com/api/v2/users/${user.sub}`, {
        method: 'PATCH',
        headers: {
          Authorization: `Bearer ${token}`,
          'Content-Type': 'application/json',
        },
        body: JSON.stringify({
          name: username,
          password: newPassword,
        }),
      });

      if (response.ok) {
        alert('Profile updated successfully');
      } else {
        alert('Failed to update profile');
      }
    } catch (error) {
      console.error('Error:', error);
      alert('Error updating profile');
    }
  };

  const handleDeleteAccount = async () => {
    try {
      const token = await getAccessTokenSilently({
        audience: 'https://dev-yqcwuih0t2m7u447.us.auth0.com/api/v2/',
        scope: 'delete:users',
      });

      const response = await fetch(`https://dev-yqcwuih0t2m7u447.us.auth0.com/api/v2/users/${user.sub}`, {
        method: 'DELETE',
        headers: {
          Authorization: `Bearer ${token}`,
        },
      });

      if (response.ok) {
        alert('Account deleted successfully');
        // Redirect or perform additional actions after account deletion
      } else {
        alert('Failed to delete account');
      }
    } catch (error) {
      console.error('Error:', error);
      alert('Error deleting account');
    }
  };

  return (
    <div className="App">
      <div className="main-content">
        <header>
          <h2 data-testid="header">Account Settings</h2>
        </header>
        <section className="account-settings">
          <div className="user-info">
            <p>User ID: {user ? user.sub : ''}</p>
            <label htmlFor="username">Username</label>
            <input
              type="text"
              id="username"
              value={username}
              onChange={(e) => handleInputChange(e, setUsername)}
              data-testid="username-input"
            />
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
