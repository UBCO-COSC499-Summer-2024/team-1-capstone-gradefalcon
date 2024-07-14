import React from "react";
import { BrowserRouter as Router, Routes, Route } from "react-router-dom";
import { Auth0Provider } from "@auth0/auth0-react";
import NavBar from "../src/components/NavBar";
import NotFound from "./components/NotFound";
import ProtectedRoute from "../src/components/ProtectedRoute";
import "./css/App.css";

// Import pages
// instructor pages
import Dashboard from "./pages/Instructor/Dashboard";
import AccountSettings from "./pages/AccountSettings";
import Classes from "./pages/Instructor/Classes";
import ClassManagement from "./pages/Instructor/ClassManagement";
import NewClass from "./pages/Instructor/NewClass";
import NewExam from "./pages/Instructor/NewExam";
import Examboard from "./pages/Instructor/Examboard";
import ExamControls from "./pages/Instructor/ExamControls";
import ManualExamKey from "./pages/Instructor/ManualExamKey";
import NotificationPreferences from "./pages/Instructor/NotificationPreferences";
import UploadExamKey from "./pages/Instructor/UploadExamKey";
// admin pages
import AdminDashboard from "./pages/Administator/AdminDashboard";
import UserManagement from "./pages/Administator/UserManagment";
// student pages 
import StudentDashboard from "./pages/Student/StudentDashboard";
import StudentAccountSettings from "./pages/Student/StudentAccountSettings";
import StudentNotificationPreferences from "./pages/Student/StudentNotificationPreferences";
import StudentGradeReport from "./pages/Student/StudentGradeReport";

const Layout = ({ children }) => {
  return (
    <>
      <NavBar />
      {children}
    </>
  );
};

function App() {
  return (
    <Auth0Provider
      domain="dev-yqcwuih0t2m7u447.us.auth0.com"
      clientId="l6wTyOrnzVr4OzzGlfeYc4L74TvUVHfj"
      redirectUri={window.location.origin}
      audience="https://gradefalcon.com/api"
    >
      <Router>
        <div className="App">
          <Layout>
            <Routes>
              <Route path="/" element={<ProtectedRoute component={Dashboard} roles={["Instructor", "Admin", "Student"]} />} />
              <Route path="/Dashboard" element={<ProtectedRoute component={Dashboard} roles={["Instructor", "Admin", "Student"]} />} />
              <Route path="/AdminDashboard" element={<ProtectedRoute component={AdminDashboard} roles={["Admin"]} />} />
              <Route path="/UserManagement" element={<ProtectedRoute component={UserManagement} roles={["Admin"]} />} />
              <Route path="/AccountSettings" element={<ProtectedRoute component={AccountSettings} roles={["Instructor", "Admin", "Student"]} />} />
              <Route path="/Classes" element={<ProtectedRoute component={Classes} roles={["Instructor"]} />} />
              <Route path="/New-Class" element={<ProtectedRoute component={NewClass} roles={["Instructor"]} />} />
              <Route path="/ClassManagement/:class_id" element={<ProtectedRoute component={ClassManagement} roles={["Instructor"]} />} />
              <Route path="/NewExam" element={<ProtectedRoute component={NewExam} roles={["Instructor"]} />} />
              <Route path="/Examboard" element={<ProtectedRoute component={ExamBoard} roles={["Instructor"]} />} />
              <Route path="/ExamControls" element={<ProtectedRoute component={ExamControls} roles={["Instructor"]} />} />
              <Route path="/ManualExamKey" element={<ProtectedRoute component={ManualExamKey} roles={["Instructor"]} />} />
              <Route path="/NotificationPreferences" element={<ProtectedRoute component={NotificationPreferences} roles={["Instructor", "Admin", "Student"]} />} />
              <Route path="/UploadExamKey" element={<ProtectedRoute component={UploadExamKey} roles={["Instructor"]} />} />
              <Route path="/StudentDashboard" element={<ProtectedRoute component={StudentDashboard} roles={["Student"]} />} />
              <Route path="/StudentGradeReport" element={<ProtectedRoute component={StudentGradeReport} roles={["Student"]} />} />
              <Route path="/StudentAccountSettings" element={<ProtectedRoute component={StudentAccountSettings} roles={["Student"]} />} />
              <Route path="/StudentNotificationPreferences" element={<ProtectedRoute component={StudentNotificationPreferences} roles={["Student"]} />} />
              <Route path="*" element={<NotFound />} />
            </Routes>
          </Layout>
        </div>
      </Router>
    </Auth0Provider>
  );
}

export default App;
