<!DOCTYPE html>
<html lang="en">
<head>
    <meta charset="UTF-8">
    <meta name="viewport" content="width=device-width, initial-scale=1.0">
    <title>GradeFalcon Notification Preferences</title>
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
                <li><a href="ExamBoard.html">Exam Board</a></li>
                <li><a href="GradeReport.html">Grade Report</a></li>
                <li><a href="Classes.html">Classes</a></li>
                <li><a href="AccountSettings.html">Account Settings</a></li>
                <li><a href="NotificationPreferences.html">Notification Preferences</a></li>
                <li><a href="Logout.html">Logout</a></li>
            </ul>
        </nav>
    </div>
    <div class="main-content">
        <header>
            <h2>Notification Preferences</h2>
        </header>
        <section class="notification-preferences">
            <form>
                <div class="control-item">
                    <span>Email Notifications</span>
                    <label class="switch">
                        <input type="checkbox" id="email-notifications">
                        <span class="slider"></span>
                    </label>
                </div>
                
                <div class="control-item">
                    <span>SMS Notifications</span>
                    <label class="switch">
                        <input type="checkbox" id="sms-notifications">
                        <span class="slider"></span>
                    </label>
                </div>

                <div class="control-item">
                    <span>Push Notifications</span>
                    <label class="switch">
                        <input type="checkbox" id="push-notifications">
                        <span class="slider"></span>
                    </label>
                </div>
                
                <button type="submit" class="btn save-changes-btn">Save changes</button>
            </form>
        </section>
    </div>
</body>
</html>