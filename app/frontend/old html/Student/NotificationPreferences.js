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
                <li><a href="GradeReport.html">Grade Report</a></li>
                <li><a href="AccountSettings.html">Account Settings</a></li>
                <li><a href="NotificationPreferences.html">Notification Preferences</a></li>
                <li><a href="Logout.html">Logout</a></li>
        </nav>
    </div>
    <div class="main-content">
        <header>
            <h2>Welcome, Adam!</h2>
        </header>
        <section class="notification-preferences">
            <h3>Notification Preferences</h3>
            <form>
                <div class="control-item">
                    <span>Grade Release Notification</span>
                    <label class="switch">
                        <input type="checkbox">
                        <span class="slider"></span>
                    </label>
                </div>
                
                <div class="control-item">
                    <span>Email</span>
                    <label class="switch">
                        <input type="checkbox">
                        <span class="slider"></span>
                    </label>
                </div>

                <div class="control-item">
                    <span>Text</span>
                    <label class="switch">
                        <input type="checkbox">
                        <span class="slider"></span>
                    </label>
                </div>
                
                <button type="submit" class="btn save-changes-btn">Save changes</button>
            </form>
        </section>
    </div>
</body>
</html>