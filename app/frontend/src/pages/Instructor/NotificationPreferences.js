import React, { useState } from 'react';
import { useNavigate } from 'react-router-dom';
import '../../css/App.css';
import { Button } from "../../components/ui/button";
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
    <main className="flex flex-col gap-4 p-8 bg-gradient-to-r from-gradient-start to-gradient-end">
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
  );
};

export default NotificationPreferences;
