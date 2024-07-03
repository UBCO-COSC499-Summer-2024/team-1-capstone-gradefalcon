import React, { useEffect, useState } from "react";
import { BrowserRouter as Router, Routes, Route, useLocation} from "react-router-dom";
import "./css/App.css";
import NavBar from "../src/components/NavBar";
import ProtectedRoute from "./ProtectedRoute";

// Import pages
import Dashboard from "./pages/Instructor/Dashboard";
import NotFound from "./components/NotFound";
import Signup from "./pages/Signup";
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
//admin pages
import AdminDashboard from "./pages/Administator/AdminDashboard";
import UserManagement from "./pages/Administator/UserManagment";
//student pages 
import StudentDashboard from "./pages/Student/StudentDashboard";
import StudentAccountSettings from "./pages/Student/StudentAccountSettings";
import StudentNotificationPreferences from "./pages/Student/StudentNotificationPreferences";
import StudentGradeReport from "./pages/Student/StudentGradeReport";



import ProtectedRoute from "./ProtectedRoute";

//import student pages 

import Dashboard_student from "./pages/Student/Dashboard_student";
import AccountSettings_student from "./pages/Student/AccountSettings_student";
import NotificationPreferences_student from "./pages/Student/NotificationPreferences_student";
import GradeReport_student from "./pages/Student/GradeReport_student";




// Layout component to conditionally render NavBar
function Layout({ children }) {
  const location = useLocation();
  const shouldDisplayNavBar =
  location.pathname !== "/" && location.pathname !== "/*" && location.pathname !== "/login" && location.pathname !== "/signup" && location.pathname !== "/AdminDashboard" && location.pathname !== "/userManagement";

  return (
    <>{shouldDisplayNavBar && <NavBar />}{children}</>
  );
}

function App() {
  const [message, setMessage] = useState("");
  const [userName, setUserName] = useState("");

  useEffect(() => {
    fetch("/api/session-info")
      .then((res) => res.json())
      .then((data) => {
        if (data.userName) {
          setUserName(data.userName);
        }
      })
      .catch(console.error);
  }, []);

  return (
    <Router>
      <div className="App">
        <Layout>
<<<<<<< HEAD
        <Routes>
          <Route path="/" element={<InstructorSignup />} />

           <Route path="/Dashboard" element={<ProtectedRoute><Dashboard /></ProtectedRoute>} />
          <Route path="/Signup" element={<InstructorSignup />} />
=======
          <Route path="/login" element={<Login />} />
           <Route path="/dashboard" element={<ProtectedRoute><Dashboard /></ProtectedRoute>} />
          <Route path="/signup" element={<InstructorSignup />} />

          <Route path="/AccountSettings" element={<AccountSettings />} />
          <Route path="/Classes" element={<Classes />} />
          <Route path="/ClassManagement" element={<ClassManagement />} />
          <Route path="/NewExam" element={<NewExam />} />
          <Route path="/Examboard" element={<ExamBoard />} />
          <Route path="/ExamControls" element={<ExamControls />} />
          <Route path="/ManualExamKey" element={<ManualExamKey />} />
          <Route path="/NotificationPreferences" element={<NotificationPreferences />} />
          <Route path="/UploadExamKey" element={<UploadExamKey />} />
          <Route path="/Dashboard_student" element={<ProtectedRoute><Dashboard_student /></ProtectedRoute>} />
          <Route path="/GradeReport_student" element={<GradeReport_student />} />
          <Route path="/AccountSettings_student" element={<AccountSettings_student />} />
          <Route path="/NotificationsPreferences_student" element={<NotificationPreferences_student />} />


          {/* <Route path="/Schedule" element={<Schedule />} /> Schedule plugin is brocken ->will fix */}
          <Route path="*" element={<NotFound />} />
        </Routes>
=======
          <Routes>
            <Route path="/" element={<Login />} />
            <Route path="/Login" element={<Login />} />
            <Route path="/Dashboard"element={ <ProtectedRoute> <Dashboard /></ProtectedRoute>}/>
            <Route path="/AdminDashboard" element={<ProtectedRoute> <AdminDashboard /></ProtectedRoute>}/>
            <Route path="/UserManagement" element={<ProtectedRoute><UserManagement /></ProtectedRoute>}/>
            <Route path="/Signup" element={<Signup />} />
            <Route path="/AccountSettings" element={<AccountSettings />} />
            <Route path="/Classes" element={<Classes />} />
            <Route path="/New-Class" element={<NewClass />} />
            <Route path="/ClassManagement/:class_id" element={<ClassManagement />} />
            <Route path="/NewExam/:class_id" element={<NewExam />} />
            <Route path="/ExamBoard" element={<ExamBoard />} />
            <Route path="/ExamControls" element={<ExamControls />} />
            <Route path="/ManualExamKey" element={<ManualExamKey />} />
            <Route path="/UploadExamKey" element={<UploadExamKey />} />
            <Route path="/UploadExams" element={<UploadExams />} />
            <Route path="/NotificationPreferences" element={<NotificationPreferences />} />
            <Route path="/StudentDashboard" element={<ProtectedRoute><StudentDashboard /></ProtectedRoute>} />
            <Route path="/StudentGradeReport" element={<StudentGradeReport />} />
            <Route path="/StudentAccountSettings" element={<StudentAccountSettings />} />
            <Route path="/StudentNotificationPreferences" element={<StudentNotificationPreferences />} />
            {/* <Route path="/Schedule" element={<Schedule />} /> Schedule plugin is brocken ->will fix */}
            <Route path="*" element={<NotFound />} />

          </Routes>
>>>>>>> 04e41c127d3ef49272424422b352a9371e3081c2
        </Layout>
      </div>
    </Router>
  );
}
export default App;
