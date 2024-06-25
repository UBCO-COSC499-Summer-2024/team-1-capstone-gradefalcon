import React from 'react';
import '../../css/AdminDashboard.css';

const AdminDashboard = () => {
  return (
    <div className="App">
      <div className="dashboard-container">
        <aside className="sidebar">
          <h2>Admin Dashboard</h2>
          <nav>
            <ul>
              <li><a href="/website-overview">Website Overview</a></li>
              <li><a href="/userManagement">User Management</a></li>
              <li><a href="/system-preferences">System Preferences</a></li>
              <li><a href="/omr-management">OMR Management</a></li>
            </ul>
          </nav>
        </aside>
        <div className="main-content">
          <header>
            <h2>Welcome, Adam!</h2>
          </header>
          <section className="overview">
            <h3>Website Overview</h3>
            <div className="overview-card" style={{ backgroundColor: '#E9D8FD' }}>
              <h4>Total Users</h4>
              <p>1,234</p>
            </div>
            <div className="overview-card" style={{ backgroundColor: '#FEEBC8' }}>
              <h4>Active Exams</h4>
              <p>56</p>
            </div>
            <div className="overview-card" style={{ backgroundColor: '#BEE3F8' }}>
              <h4>System Health</h4>
              <p>Good</p>
            </div>
            <div className="overview-card" style={{ backgroundColor: '#C6F6D5' }}>
              <h4>Pending Requests</h4>
              <p>12</p>
            </div>
          </section>
        </div>
      </div>
    </div>
  );
};

export default AdminDashboard;
