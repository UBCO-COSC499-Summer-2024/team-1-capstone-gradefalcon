import React from 'react';
import '../css/App.css';
import LogoutButton from './LogoutButton';
export default function NavBar() {
    return (
        <div className="sidebar">
            <div className="logo">
                <h1>GradeFalcon</h1>
            </div>
            <nav>
                <ul>
                    {React.createElement(
                        'li',
                        null,
                        React.createElement('a', { href: '/Dashboard' }, 'Dashboard')
                    )}
                    {React.createElement(
                        'li',
                        null,
                        React.createElement('a', { href: '/Examboard' }, 'Exam Board')
                    )}
                    {React.createElement(
                        'li',
                        null,
                        React.createElement('a', { href: '/GradeReport' }, 'Grade Report')
                    )}
                    {React.createElement(
                        'li',
                        null,
                        React.createElement('a', { href: '/Classes' }, 'Classes')
                    )}
                    {React.createElement(
                        'li',
                        null,
                        React.createElement('a', { href: '/AccountSettings' }, 'Account Settings')
                    )}
                    {React.createElement(
                        'li',
                        null,
                        React.createElement('a', { href: '/NotificationPreferences' }, 'Notification Preferences')
                    )}
                    <li>
                        <LogoutButton></LogoutButton>
                    </li>
                </ul>
            </nav>
        </div>
  );
    }
