<!DOCTYPE html>
<html lang="en">
<head>
    <meta charset="UTF-8">
    <meta name="viewport" content="width=device-width, initial-scale=1.0">
    <title>GradeFalcon Notification Preferences</title>
    <link rel="stylesheet" href="../style.css">
</head>
<body>
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
