import React from 'react';
import '../../css/App.css';
import '../../css/NotificationPreferences.css';

const NotificationPreferences = () => {
  const handleSubmit = (event) => {
    event.preventDefault();
    const emailNotifications = document.getElementById('email-notifications').checked;
    const smsNotifications = document.getElementById('sms-notifications').checked;
    const pushNotifications = document.getElementById('push-notifications').checked;

    // Handle the form submission logic here
    console.log({
      emailNotifications,
      smsNotifications,
      pushNotifications,
    });
  };

  return (
      <div className="App">
        <div className="main-content">
          <header>
            <h2>Notification Preferences</h2>
          </header>
          <section className="notification-preferences">
            <form onSubmit={handleSubmit}>
              <div className="control-item">
                <span>Email Notifications</span>
                <label className="switch">
                  <input type="checkbox" id="email-notifications" data-testid="toggle-email-notifications" />
                  <span className="slider"></span>
                </label>
              </div>
              
              <div className="control-item">
                <span>SMS Notifications</span>
                <label className="switch">
                  <input type="checkbox" id="sms-notifications" data-testid="toggle-sms-notifications" />
                  <span className="slider"></span>
                </label>
              </div>

              <div className="control-item">
                <span>Push Notifications</span>
                <label className="switch">
                  <input type="checkbox" id="push-notifications" data-testid="toggle-push-notifications" />
                  <span className="slider"></span>
                </label>
              </div>
              
              <button type="submit" className="btn save-changes-btn" data-testid="save-changes-btn">Save changes</button>
            </form>
          </section>
        </div>
      </div>
  );
};

export default NotificationPreferences;