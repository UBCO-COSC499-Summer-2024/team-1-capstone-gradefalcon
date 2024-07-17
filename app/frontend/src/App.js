import React, { useEffect, useState } from "react";
import { BrowserRouter as Router, Routes, Route, useLocation } from "react-router-dom";
import "./css/App.css";
import NavBar from "../src/components/NavBar";
import ProtectedRoute from "./ProtectedRoute";
import { Auth0Provider } from "@auth0/auth0-react";
// Import components
import Profile from "./components/Profile";
// import pages
// instructor pages
import Dashboard from "./pages/Instructor/Dashboard";
import NotFound from "./components/NotFound";
import Login from "./pages/Login"; 
import AccountSettings from "./pages/Instructor/AccountSettings";
import Classes from "./pages/Instructor/Classes";
import ClassManagement from "./pages/Instructor/ClassManagement";
import NewClass from "./pages/Instructor/NewClass";
import NewExam from "./pages/Instructor/NewExam";
import ExamBoard from "./pages/Instructor/Examboard";
import ExamControls from "./pages/Instructor/ExamControls";
import ManualExamKey from "./pages/Instructor/ManualExamKey";
import NotificationPreferences from "./pages/Instructor/NotificationPreferences";
import UploadExamKey from "./pages/Instructor/UploadExamKey";
import UploadExams from "./pages/Instructor/UploadExams";
// student pages
import StudentDashboard from "./pages/Student/StudentDashboard";
import StudentAccountSettings from "./pages/Student/StudentAccountSettings";
import StudentNotificationPreferences from "./pages/Student/StudentNotificationPreferences";
import StudentGradeReport from "./pages/Student/StudentGradeReport";

// Layout component to conditionally render NavBar
const Layout = ({ children }) => {
  const location = useLocation();
  const shouldDisplayNavBar =
    location.pathname !== "/*" &&
    location.pathname !== "/Login" &&
    location.pathname !== "/signup" &&
    location.pathname !== "/AdminDashboard" &&
    location.pathname !== "/userManagement" &&
    location.pathname !== "/Profile" &&
    location.pathname !== "/Logout";

  return (
    <>
      {shouldDisplayNavBar && <NavBar />}
      {children}
    </>
  );
};

function App() {
  const [message, setMessage] = useState("");
  const [userName, setUserName] = useState("");

  // useEffect(() => {
  //   fetch("/api/session-info")
  //     .then((res) => res.json())
  //     .then((data) => {
  //       if (data.userName) {
  //         setUserName(data.userName);
  //       }
  //     })
  //     .catch(console.error);
  // }, []);

  return (
    <Auth0Provider
      domain={process.env.REACT_APP_AUTH0_DOMAIN}
      clientId={process.env.REACT_APP_AUTH0_CLIENT_ID}
      redirectUri={window.location.origin}
    >
      <Router>
        <div className="App">
          <Layout>
            <Routes>
              <Route path="/Login" element={<Login />} />
              <Route path="/" element={<ProtectedRoute><Dashboard/></ProtectedRoute>} />
              <Route path="/Profile" element={<Profile />} />
              <Route path="/Dashboard" element={<ProtectedRoute><Dashboard /></ProtectedRoute>} />
              <Route path="/AccountSettings" element={<ProtectedRoute><AccountSettings /></ProtectedRoute>} />
              <Route path="/Classes" element={<ProtectedRoute><Classes /></ProtectedRoute>} />
              <Route path="/New-Class" element={<ProtectedRoute><NewClass /></ProtectedRoute>} />
              <Route path="/ClassManagement/:class_id" element={<ProtectedRoute><ClassManagement /></ProtectedRoute>} />
              <Route path="/NewExam/:class_id" element={<ProtectedRoute><NewExam /></ProtectedRoute>} />
              <Route path="/ExamBoard" element={<ProtectedRoute><ExamBoard /></ProtectedRoute>} />
              <Route path="/ExamControls" element={<ProtectedRoute><ExamControls /></ProtectedRoute>} />
              <Route path="/ManualExamKey" element={<ProtectedRoute><ManualExamKey /></ProtectedRoute>} />
              <Route path="/UploadExamKey" element={<ProtectedRoute><UploadExamKey /></ProtectedRoute>} />
              <Route path="/UploadExams" element={<ProtectedRoute><UploadExams /></ProtectedRoute>} />
              <Route path="/NotificationPreferences" element={<ProtectedRoute><NotificationPreferences /></ProtectedRoute>} />
              <Route path="/StudentDashboard" element={<ProtectedRoute><StudentDashboard /></ProtectedRoute>} />
              <Route path="/StudentGradeReport" element={<ProtectedRoute><StudentGradeReport /></ProtectedRoute>} />
              <Route path="/StudentAccountSettings" element={<ProtectedRoute><StudentAccountSettings /></ProtectedRoute>} />
              <Route path="/StudentNotificationPreferences" element={<ProtectedRoute><StudentNotificationPreferences /></ProtectedRoute>} />
              <Route path="*" element={<NotFound />} />
            </Routes>
          </Layout>
        </div>
      </Router>
    </Auth0Provider>
  );
}

export default App;
