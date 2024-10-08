import React from 'react';
import '../../css/App.css';

const StudentNotificationPreferences = () => {
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
    <>
      <style>
        {`
          .notification-preferences {
            background-color: white;
            border-radius: 5px;
            padding: 20px;
            box-shadow: 0 1px 3px rgba(0, 0, 0, 0.1);
            box-sizing: border-box;
          }
          .control-item {
            display: flex;
            justify-content: flex-start;
            align-items: center;
            margin-bottom: 10px;
          }
          .control-item span {
            flex: 1;
          }
          .btn {
            background-color: #4CAF50;
            color: white;
            border: none;
            padding: 10px 20px;
            border-radius: 5px;
            cursor: pointer;
            margin-top: 10px;
          }
          .btn:hover {
            background-color: #45a049;
          }
          .switch {
            position: relative;
            display: inline-block;
            width: 30px;
            height: 17px;
            margin-left: 5px;
          }
          .switch input {
            opacity: 0;
            width: 0;
            height: 0;
          }
          .slider {
            position: absolute;
            cursor: pointer;
            top: 0;
            left: 0;
            right: 0;
            bottom: 0;
            background-color: #ccc;
            transition: .4s;
            border-radius: 17px;
          }
          .slider:before {
            position: absolute;
            content: "";
            height: 13px;
            width: 13px;
            left: 2px;
            bottom: 2px;
            background-color: white;
            transition: .4s;
            border-radius: 50%;
          }
          input:checked + .slider {
            background-color: #4CAF50;
          }
          input:checked + .slider:before {
            transform: translateX(13px);
          }
        `}
      </style>
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
                  <input type="checkbox" id="email-notifications" />
                  <span className="slider"></span>
                </label>
              </div>

              <div className="control-item">
                <span>SMS Notifications</span>
                <label className="switch">
                  <input type="checkbox" id="sms-notifications" />
                  <span className="slider"></span>
                </label>
              </div>

              <div className="control-item">
                <span>Push Notifications</span>
                <label className="switch">
                  <input type="checkbox" id="push-notifications" />
                  <span className="slider"></span>
                </label>
              </div>

              <button type="submit" className="btn save-changes-btn">Save changes</button>
            </form>
          </section>
        </div>
      </div>
    </>
  );
};

export default StudentNotificationPreferences;