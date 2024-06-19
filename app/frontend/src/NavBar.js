import React from 'react';

export default function NavBar() {
    return (
        <>
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
                            React.createElement('a', { href: '/Schedule' }, 'Schedule')
                        )}
                        {React.createElement(
                            'li',
                            null,
                            React.createElement('a', { href: '/ExamBoard' }, 'Exam Board')
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
                        {React.createElement(
                            'li',
                            null,
                            React.createElement('a', { href: '/Logout' }, 'Logout')
                        )}
                    </ul>
                </nav>
            </div>
            <nav>
                <ul>
                    <li><a href="/Dashboard">Dashboard</a></li>
                    <li><a href="/Schedule">Schedule</a></li>
                    <li><a href="/ExamBoard">Exam Board</a></li>
                    <li><a href="/GradeReport">Grade Report</a></li>
                    <li><a href="/Classes">Classes</a></li>
                    <li><a href="/AccountSettings">Account Settings</a></li>
                    <li><a href="/NotificationPreferences">Notification Preferences</a></li>
                    <li><a href="/Logout">Logout</a></li>
                </ul>
            </nav>
        </>
    );
}
