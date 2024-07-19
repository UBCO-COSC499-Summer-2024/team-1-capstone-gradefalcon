// src/Instructor/AccountSettings.js
import React, { useState } from 'react';
import { Link, useNavigate } from 'react-router-dom';
import '../../css/App.css';
import {
  Home,
  ClipboardCheck,
  Users,
  LineChart,
  Settings,
  BookOpen
} from "lucide-react";
import { Button } from "../../components/ui/button";
import {
  DropdownMenu,
  DropdownMenuTrigger,
  DropdownMenuContent,
  DropdownMenuLabel,
  DropdownMenuSeparator,
  DropdownMenuItem
} from "../../components/ui/dropdown-menu";
import { Card, CardHeader, CardTitle, CardContent, CardDescription } from "../../components/ui/card";

const AccountSettings = () => {
  const [username, setUsername] = useState('Dr. Pepper');
  const [oldPassword, setOldPassword] = useState('');
  const [newPassword, setNewPassword] = useState('');
  const [confirmPassword, setConfirmPassword] = useState('');
  const navigate = useNavigate();

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
    // Implement the backend API call here
  };

  const handleDeleteAccount = () => {
    // Backend call for deleting account
    // Implement the backend API call here
  };

  const handleLogout = async () => {
    try {
      const response = await fetch("/api/auth/logout", {
        method: "POST",
        headers: {
          "Content-Type": "application/json",
        },
      });
      if (response.ok) {
        alert("Logged out");
        navigate("/");
      } else {
        console.error("Logout failed");
      }
    } catch (error) {
      console.error("Error:", error);
    }
  };

  return (
    <div className="flex min-h-screen">
      <aside className="sidebar">
        <div className="logo">
          <ClipboardCheck className="h-6 w-6" />
          <span className="ml-2">GradeFalcon</span>
        </div>
        <nav className="flex flex-col gap-4">
          <Link to="/Dashboard" className="nav-item" data-tooltip="Dashboard">
            <Home className="icon" />
            <span>Dashboard</span>
          </Link>
          <Link to="/Examboard" className="nav-item" data-tooltip="Exam Board">
            <BookOpen className="icon" />
            <span>Exam Board</span>
          </Link>
          <Link to="/Classes" className="nav-item" data-tooltip="Classes">
            <Users className="icon" />
            <span>Classes</span>
          </Link>
        </nav>
        <div className="mt-auto flex items-center gap-2">
          <DropdownMenu>
            <DropdownMenuTrigger asChild>
              <div className="nav-item" data-tooltip="My Account">
                <Settings className="icon" />
                <span>My Account</span>
              </div>
            </DropdownMenuTrigger>
            <DropdownMenuContent align="end">
              <DropdownMenuLabel>My Account</DropdownMenuLabel>
              <DropdownMenuSeparator />
              <DropdownMenuItem asChild>
                <Link to="/AccountSettings">Account Settings</Link>
              </DropdownMenuItem>
              <DropdownMenuItem asChild>
                <Link to="/NotificationPreferences">Notification Preferences</Link>
              </DropdownMenuItem>
              <DropdownMenuSeparator />
              <DropdownMenuItem asChild onClick={handleLogout}>
                <span>Logout</span>
              </DropdownMenuItem>
            </DropdownMenuContent>
          </DropdownMenu>
        </div>
      </aside>
      <div className="main-content flex-1 p-8 bg-gradient-to-r from-gradient-start to-gradient-end">
        <main className="flex flex-col gap-4">
          <Card className="bg-white border rounded">
            <CardHeader className="flex justify-between px-6 py-4">
              <CardTitle className="text-3xl font-bold mb-4">Account Settings</CardTitle>
            </CardHeader>
            <CardContent>
              <div className="account-settings">
                <div className="user-info mb-4">
                  <p>User ID: 75826488</p> {/* dummy input, will be retrieved with SQL query when implemented */}
                  <label htmlFor="username" className="block text-sm font-medium text-gray-700">Username</label>
                  <input
                    type="text"
                    id="username"
                    value={username}
                    onChange={(e) => handleInputChange(e, setUsername)}
                    className="input-field mt-1 block w-full"
                    data-testid="username-input"
                  />
                  <p>*A GradeFalcon Employee will never ask for your password*</p>
                </div>
                <div className="change-password">
                  <label htmlFor="old-password" className="block text-sm font-medium text-gray-700">Old Password</label>
                  <input
                    type="password"
                    id="old-password"
                    placeholder="Old Password"
                    value={oldPassword}
                    onChange={(e) => handleInputChange(e, setOldPassword)}
                    className="input-field mt-1 block w-full"
                    data-testid="old-password-input"
                  />
                  <label htmlFor="new-password" className="block text-sm font-medium text-gray-700">New Password</label>
                  <input
                    type="password"
                    id="new-password"
                    placeholder="New Password"
                    value={newPassword}
                    onChange={(e) => handleInputChange(e, setNewPassword)}
                    className="input-field mt-1 block w-full"
                    data-testid="new-password-input"
                  />
                  <label htmlFor="confirm-password" className="block text-sm font-medium text-gray-700">Confirm New Password</label>
                  <input
                    type="password"
                    id="confirm-password"
                    placeholder="Confirm New Password"
                    value={confirmPassword}
                    onChange={(e) => handleInputChange(e, setConfirmPassword)}
                    className="input-field mt-1 block w-full"
                    data-testid="confirm-password-input"
                  />
                  <Button size="sm" className="green-button mt-4" onClick={handleSubmit} data-testid="save-changes-btn">
                    Save changes
                  </Button>
                  <Button size="sm" className="red-button mt-2" onClick={handleDeleteAccount} data-testid="delete-account-btn">
                    Delete Account
                  </Button>
                </div>
              </div>
            </CardContent>
          </Card>
        </main>
      </div>
    </div>
  );
};

export default AccountSettings;
