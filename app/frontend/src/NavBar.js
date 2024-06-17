export default function NavBar() {
  return (
    <div class="sidebar">
      <div class="logo">
        <h1>GradeFalcon</h1>
      </div>
      <nav>
        <ul>
          <li>
            <a href="/dashboard">Dashboard</a>
          </li>
          <li>
            <a href="/schedule">Schedule</a>
          </li>
          <li>
            <a href="/ExamBoard">Exam Board</a>
          </li>
          <li>
            <a href="GradeReport.html">Grade Report</a>
          </li>
          <li>
            <a href="/classes">Classes</a>
          </li>
          <li>
            <a href="/AccountSettings">Account Settings</a>
          </li>
          <li>
            <a href="/NotificationPreferences">Notification Preferences</a>
          </li>
          <li>
            <a href="Logout.html">Logout</a>
          </li>
        </ul>
      </nav>
    </div>
  );
}
