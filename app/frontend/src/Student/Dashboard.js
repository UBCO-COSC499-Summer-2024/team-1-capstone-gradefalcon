<!DOCTYPE html>
<html lang="en">
<head>
    <meta charset="UTF-8">
    <meta name="viewport" content="width=device-width, initial-scale=1.0">
    <title>GradeFalcon Dashboard</title>
    <link rel="stylesheet" href="../style.css">
</head>
<body>
    <div class="sidebar">
        <div class="logo">
            <h1>GradeFalcon</h1>
        </div>
        <nav>
            <ul>
                <li><a href="Dashboard.html">Dashboard</a></li>
                <li><a href="Schedule.html">Schedule</a></li>
                <li><a href="GradeReport.html">Grade Report</a></li>
                <li><a href="AccountSettings.html">Account Settings</a></li>
                <li><a href="NotificationPreferences.html">Notification Preferences</a></li>
                <li><a href="Logout.html">Logout</a></li>
            </ul>
        </nav>
    </div>
    <div class="main-content">
        <header>
            <h2>Welcome, Adam!</h2>
        </header>
        <section class="courses">
            <h3>Enrolled Courses</h3>
            <div class="course-card" style="background-color: #E9D8FD;">
                <h4>Graphic Fundamentals - ART101</h4>
                <p></p>
                <p>Monday & Wednesday</p>
                <p>9:00 AM - 10:30 AM</p>
                <p>Design Studio A</p>
            </div>
            <div class="course-card" style="background-color: #FEEBC8;">
                <h4>Advanced Web Design - ITD201</h4>
                <p></p>
                <p>Tuesday & Thursday</p>
                <p>1:30 PM - 3:00 PM</p>
                <p>Computer Lab 3</p>
            </div>
            <div class="course-card" style="background-color: #BEE3F8;">
                <h4>User Experience Research - UXD301</h4>
                <p></p>
                <p>Monday & Saturday</p>
                <p>11:00 AM - 12:30 PM</p>
                <p>Design Lab 2</p>
            </div>
            <div class="course-card" style="background-color: #C6F6D5;">
                <h4>3D Animation Techniques - ANI301</h4>
                <p></p>
                <p>Wednesday</p>
                <p>2:00 PM - 5:00 PM</p>
                <p>Animation Studio</p>
            </div>
        </section>
        <section class="exam-board">
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
                        <td class="status completed">Completed</td>
                    </tr>
                    <tr>
                        <td>Digital Illustration</td>
                        <td>ART103</td>
                        <td>Feb 5, 2024</td>
                        <td>2:00 PM</td>
                        <td>Computer Lab 2</td>
                        <td class="status completed">Completed</td>
                    </tr>
                    <tr>
                        <td>UX/UI Design Principles</td>
                        <td>UXD301</td>
                        <td>Mar 10, 2024</td>
                        <td>1:00 PM</td>
                        <td>Design Lab 1</td>
                        <td class="status upcoming">Upcoming</td>
                    </tr>
                </tbody>
            </table>
        </section>
        <section class="charts">
            <h3>Performance Charts</h3>
            <div class="chart">
                <h4>Title</h4>
                <!-- Chart content goes here -->
            </div>
            <div class="chart">
                <h4>Title</h4>
                <!-- Chart content goes here -->
            </div>
        </section>
    </div>
</body>
</html>
