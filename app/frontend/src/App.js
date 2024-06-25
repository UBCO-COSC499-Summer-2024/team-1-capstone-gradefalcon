import React from "react";
import { BrowserRouter as Router, Routes, Route, useLocation } from "react-router-dom";
import { Auth0Provider, withAuthenticationRequired } from "@auth0/auth0-react";
import NavBar from "../src/components/NavBar";
import "./css/App.css";
// Import pages
import Dashboard from "./pages/Instructor/Dashboard";
import NotFound from "./pages/NotFound";
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
//admin pages
import AdminDashboard from "./pages/Administator/AdminDashboard";
import UserManagement from "./pages/Administator/UserManagment";
//student pages 
import StudentDashboard from "./pages/Student/StudentDashboard";
import StudentAccountSettings from "./pages/Student/StudentAccountSettings";
import StudentNotificationPreferences from "./pages/Student/StudentNotificationPreferences";
import StudentGradeReport from "./pages/Student/StudentGradeReport";



const Layout = ({ children }) => {
  // const location = useLocation();
  // const shouldDisplayNavBar =
  //   location.pathname !== "/dashboard" &&
  //   location.pathname !== "/adminDashboard" &&
  //   location.pathname !== "/userManagement";

  return (
    <>
      {
      // shouldDisplayNavBar && 
      <NavBar />}
      {children}
    </>
  );
};
//Auth0
const ProtectedRoute = ({ component }) => {
  const Component = withAuthenticationRequired(component);
  return <Component />;
};

function App() {
  return (
    <Auth0Provider
      domain="dev-yqcwuih0t2m7u447.us.auth0.com"
      clientId="l6wTyOrnzVr4OzzGlfeYc4L74TvUVHfj"
      redirectUri={window.location.origin}
    >
    <Router>
      <div className="App">
        <Layout>
          <Routes>
          <Route path="/" element={<ProtectedRoute><Login /></ProtectedRoute>} />
          <Route path="/Login" element={<ProtectedRoute><Login /></ProtectedRoute>} />
          <Route path="/Dashboard" element={<ProtectedRoute><Dashboard /></ProtectedRoute>} />
          <Route path="/AdminDashboard" element={<ProtectedRoute><AdminDashboard /></ProtectedRoute>} />
          <Route path="/UserManagement" element={<ProtectedRoute><UserManagement /></ProtectedRoute>} />
          <Route path="/Signup" element={<ProtectedRoute><Signup /></ProtectedRoute>} />
          <Route path="/AccountSettings" element={<ProtectedRoute><AccountSettings /></ProtectedRoute>} />
          <Route path="/Classes" element={<ProtectedRoute><Classes /></ProtectedRoute>} />
          <Route path="/New-Class" element={<ProtectedRoute><NewClass /></ProtectedRoute>} />
          <Route path="/ClassManagement/:class_id" element={<ProtectedRoute><ClassManagement /></ProtectedRoute>} />
          <Route path="/NewExam" element={<ProtectedRoute><NewExam /></ProtectedRoute>} />
          <Route path="/Examboard" element={<ProtectedRoute><Examboard /></ProtectedRoute>} />
          <Route path="/ExamControls" element={<ProtectedRoute><ExamControls /></ProtectedRoute>} />
          <Route path="/ManualExamKey" element={<ProtectedRoute><ManualExamKey /></ProtectedRoute>} />
          <Route path="/NotificationPreferences" element={<ProtectedRoute><NotificationPreferences /></ProtectedRoute>} />
          <Route path="/UploadExamKey" element={<ProtectedRoute><UploadExamKey /></ProtectedRoute>} />
          <Route path="/StudentDashboard" element={<ProtectedRoute><StudentDashboard /></ProtectedRoute>} />
          <Route path="/StudentGradeReport" element={<ProtectedRoute><StudentGradeReport /></ProtectedRoute>} />
          <Route path="/StudentAccountSettings" element={<ProtectedRoute><StudentAccountSettings /></ProtectedRoute>} />
          <Route path="/StudentNotificationPreferences" element={<ProtectedRoute><StudentNotificationPreferences /></ProtectedRoute>} />
          <Route path="*" element={<ProtectedRoute><NotFound /></ProtectedRoute>} />
          </Routes>
        </Layout>
      </div>
    </Router>
        
    </Auth0Provider>
  );
}

export default App;
