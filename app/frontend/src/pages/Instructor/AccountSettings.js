import React, { useState } from 'react';
import '../../css/App.css';
import { Card, CardContent, CardFooter, CardHeader, CardTitle } from '../../components/ui/card';
import { Button } from '../../components/ui/button';
import { Input } from '../../components/ui/input';

const AccountSettings = () => {
  const [username, setUsername] = useState('Dr. Pepper');
  const [oldPassword, setOldPassword] = useState('');
  const [newPassword, setNewPassword] = useState('');
  const [confirmPassword, setConfirmPassword] = useState('');

  const handleInputChange = (e, setState) => {
    const value = e.target.value;
    const sanitizedValue = value.replace(/[^a-zA-Z0-9\s.,!?-]/g, ''); // restricts string altering characters
    setState(sanitizedValue);
  };

  const handleSubmit = () => {
    if (newPassword !== confirmPassword) {
      alert('New passwords do not match');
      return;
    }
    // Backend call for saving changes
  };

  const handleDeleteAccount = () => {
    // Backend call for deleting account
  };

  return (
    <div className="App">
      <div className="main-content">
        <header>
          <h2 data-testid="header" className="text-green-700">Account Settings</h2>
        </header>
        <section className="account-settings">
          <Card className="mb-4">
            <CardHeader>
              <CardTitle>Account Information</CardTitle>
            </CardHeader>
            <CardContent>
              <div className="user-info">
                <p>User ID: 75826488</p> {/* dummy input, will be retrieved with SQL query when implemented */}
                <label htmlFor="username">Username</label>
                <Input
                  type="text"
                  id="username"
                  value={username}
                  onChange={(e) => handleInputChange(e, setUsername)}
                  data-testid="username-input"
                />
                <p>*A GradeFalcon Employee will never ask for your password*</p>
              </div>
            </CardContent>
          </Card>
          <Card className="mb-4">
            <CardHeader>
              <CardTitle>Change Password</CardTitle>
            </CardHeader>
            <CardContent>
              <div className="change-password">
                <label htmlFor="old-password">Old Password</label>
                <Input
                  type="password"
                  id="old-password"
                  placeholder="Old Password"
                  value={oldPassword}
                  onChange={(e) => handleInputChange(e, setOldPassword)}
                  data-testid="old-password-input"
                />
                <label htmlFor="new-password">New Password</label>
                <Input
                  type="password"
                  id="new-password"
                  placeholder="New Password"
                  value={newPassword}
                  onChange={(e) => handleInputChange(e, setNewPassword)}
                  data-testid="new-password-input"
                />
                <label htmlFor="confirm-password">Confirm New Password</label>
                <Input
                  type="password"
                  id="confirm-password"
                  placeholder="Confirm New Password"
                  value={confirmPassword}
                  onChange={(e) => handleInputChange(e, setConfirmPassword)}
                  data-testid="confirm-password-input"
                />
              </div>
            </CardContent>
            <CardFooter className="flex justify-end">
              <Button
                variant="solid"
                className="save-changes-btn mr-2"
                onClick={handleSubmit}
                data-testid="save-changes-btn"
              >
                Save changes
              </Button>
              <Button
                variant="outline"
                className="delete-account-btn"
                onClick={handleDeleteAccount}
                data-testid="delete-account-btn"
              >
                Delete Account
              </Button>
            </CardFooter>
          </Card>
        </section>
      </div>
    </div>
  );
};

export default AccountSettings;
