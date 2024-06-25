import React from "react";
import { BrowserRouter as Router, Routes, Route, useLocation } from "react-router-dom";
import { Auth0Provider, withAuthenticationRequired } from "@auth0/auth0-react";
import NavBar from "../src/components/NavBar";
import NotFound from "./components/NotFound";
import "./css/App.css";
// Import pages
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
          <Route path="/" element={<ProtectedRoute component={Dashboard} />} />
          <Route path="/Dashboard" element={<ProtectedRoute component={Dashboard} />} />
          <Route path="/AdminDashboard" element={<ProtectedRoute component={AdminDashboard} />} />
          <Route path="/UserManagement" element={<ProtectedRoute component={UserManagement} />} />
          <Route path="/AccountSettings" element={<ProtectedRoute component={AccountSettings} />} />
          <Route path="/Classes" element={<ProtectedRoute component={Classes} />} />
          <Route path="/New-Class" element={<ProtectedRoute component={NewClass} />} />
          <Route path="/ClassManagement/:class_id" element={<ProtectedRoute component={ClassManagement} />} />
          <Route path="/NewExam" element={<ProtectedRoute component={NewExam} />} />
          <Route path="/Examboard" element={<ProtectedRoute component={Examboard} />} />
          <Route path="/ExamControls" element={<ProtectedRoute component={ExamControls} />} />
          <Route path="/ManualExamKey" element={<ProtectedRoute component={ManualExamKey} />} />
          <Route path="/NotificationPreferences" element={<ProtectedRoute component={NotificationPreferences} />} />
          <Route path="/UploadExamKey" element={<ProtectedRoute component={UploadExamKey} />} />
          <Route path="/StudentDashboard" element={<ProtectedRoute component={StudentDashboard} />} />
          <Route path="/StudentGradeReport" element={<ProtectedRoute component={StudentGradeReport} />} />
          <Route path="/StudentAccountSettings" element={<ProtectedRoute component={StudentAccountSettings} />} />
          <Route path="/StudentNotificationPreferences" element={<ProtectedRoute component={StudentNotificationPreferences} />} />
          <Route path="*" element={<NotFound />} />
          </Routes>
        </Layout>
      </div>
    </Router>
        
    </Auth0Provider>
  );
}

export default App;
