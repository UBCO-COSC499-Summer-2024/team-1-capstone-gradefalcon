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

const NotificationPreferences = () => {
  const [emailNotifications, setEmailNotifications] = useState(false);
  const [smsNotifications, setSmsNotifications] = useState(false);
  const [pushNotifications, setPushNotifications] = useState(false);
  const [message, setMessage] = useState('');
  const navigate = useNavigate();

  const handleToggle = (setter) => {
    setter(prev => !prev);
  };

  const handleSubmit = (event) => {
    event.preventDefault();

    // Handle the form submission logic here
    console.log({
      emailNotifications,
      smsNotifications,
      pushNotifications,
    });

    // Assume saving changes successfully
    setMessage('Notification preferences have been saved');
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
          <div>
            <h1 className="text-3xl font-bold mb-4">Notification Preferences</h1>
            {message && <div className="alert">{message}</div>}
            <div className="grid gap-4 lg:grid-cols-1">
              <Card className="bg-white border rounded">
                <CardHeader className="flex justify-between px-6 py-4">
                  <div>
                    <CardTitle className="mb-2">Preferences</CardTitle>
                    <CardDescription>Manage your notification preferences.</CardDescription>
                  </div>
                  <Button asChild size="sm" className="ml-auto gap-1">
                    <span onClick={() => window.history.back()}>Back</span>
                  </Button>
                </CardHeader>
                <CardContent>
                  <form onSubmit={handleSubmit}>
                    <div className="control-item mb-4">
                      <span>Email Notifications</span>
                      <label className="switch">
                        <input type="checkbox" id="email-notifications" checked={emailNotifications} onChange={() => handleToggle(setEmailNotifications)} data-testid="toggle-email-notifications" />
                        <span className="slider round"></span>
                      </label>
                    </div>
                    
                    <div className="control-item mb-4">
                      <span>SMS Notifications</span>
                      <label className="switch">
                        <input type="checkbox" id="sms-notifications" checked={smsNotifications} onChange={() => handleToggle(setSmsNotifications)} data-testid="toggle-sms-notifications" />
                        <span className="slider round"></span>
                      </label>
                    </div>

                    <div className="control-item mb-4">
                      <span>Push Notifications</span>
                      <label className="switch">
                        <input type="checkbox" id="push-notifications" checked={pushNotifications} onChange={() => handleToggle(setPushNotifications)} data-testid="toggle-push-notifications" />
                        <span className="slider round"></span>
                      </label>
                    </div>
                    
                    <Button type="submit" className="green-button mt-4" data-testid="save-changes-btn">
                      Save changes
                    </Button>
                  </form>
                </CardContent>
              </Card>
            </div>
          </div>
        </main>
      </div>
    </div>
  );
};

export default NotificationPreferences;

