// src/Instructor/Dashboard.js
import "../../css/style.css";
import React, { useEffect, useState } from "react";

const Dashboard = () => {
  const [userName, setUserName] = useState("");
  useEffect(() => {
    const fetchSessionInfo = async () => {
      try {
        const response = await fetch("/api/session-info", {
          method: "GET",
          headers: {
            "Content-Type": "application/json",
          },
          credentials: "include", // This ensures cookies are included in the request
        });
        console.log(response);
        if (response.ok) {
          const data = await response.json();
          setUserName(data.userName);
        } else {
          console.error("Failed to fetch session info");
        }
      } catch (error) {
        console.error("Error fetching session info:", error);
      }
    };

    fetchSessionInfo();
  }, []);

  return (
    <div className="App">
      <div className="main-content">
        <header>
          <h2>Welcome, {userName ? userName : "Guest"}!</h2>
        </header>
        <section className="courses">
          <h3>Enrolled Courses</h3>
          <div className="course-card" style={{ backgroundColor: "#E9D8FD" }}>
            <h4>Graphic Fundamentals - ART101</h4>
            <p>Monday & Wednesday</p>
            <p>9:00 AM - 10:30 AM</p>
            <p>Design Studio A</p>
          </div>
          <div className="course-card" style={{ backgroundColor: "#FEEBC8" }}>
            <h4>Advanced Web Design - ITD201</h4>
            <p>Tuesday & Thursday</p>
            <p>1:30 PM - 3:00 PM</p>
            <p>Computer Lab 3</p>
          </div>
          <div className="course-card" style={{ backgroundColor: "#BEE3F8" }}>
            <h4>User Experience Research - UXD301</h4>
            <p>Monday & Saturday</p>
            <p>11:00 AM - 12:30 PM</p>
            <p>Design Lab 2</p>
          </div>
          <div className="course-card" style={{ backgroundColor: "#C6F6D5" }}>
            <h4>3D Animation Techniques - ANI301</h4>
            <p>Wednesday</p>
            <p>2:00 PM - 5:00 PM</p>
            <p>Animation Studio</p>
          </div>
        </section>
        <section className="exam-board">
          <h3>Exam Board</h3>
          <table>
            <thead>
              <tr>
                <th>Exam Name</th>
                <th>Course</th>
                <th>Date</th>
                <th>Time</th>
                <th>Location</th>
                <th>Status</th>
              </tr>
            </thead>
            <tbody>
              <tr>
                <td>Graphic Design Fundamentals</td>
                <td>ART101</td>
                <td>Jan 25, 2024</td>
                <td>10:00 AM</td>
                <td>Design Studio A</td>
                <td className="status completed">Completed</td>
              </tr>
              <tr>
                <td>Digital Illustration</td>
                <td>ART103</td>
                <td>Feb 5, 2024</td>
                <td>2:00 PM</td>
                <td>Computer Lab 2</td>
                <td className="status completed">Completed</td>
              </tr>
              <tr>
                <td>UX/UI Design Principles</td>
                <td>UXD301</td>
                <td>Mar 10, 2024</td>
                <td>1:00 PM</td>
                <td>Design Lab 1</td>
                <td className="status upcoming">Upcoming</td>
              </tr>
            </tbody>
          </table>
        </section>
        <section className="charts">
          <h3>Performance Charts</h3>
          <div className="chart">
            <h4>Title</h4>
            {/* Chart content goes here */}
          </div>
          <div className="chart">
            <h4>Title</h4>
            {/* Chart content goes here */}
          </div>
        </section>
      </div>
    </div>
  );
};

export default Dashboard;
