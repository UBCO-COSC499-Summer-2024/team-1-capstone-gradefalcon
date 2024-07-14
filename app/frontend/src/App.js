import React, { useEffect, useState } from "react";
import { BrowserRouter as Router, Routes, Route, useLocation} from "react-router-dom";
import "./css/App.css";
import NavBar from "../src/components/NavBar";
import ProtectedRoute from "./ProtectedRoute";
import { LogtoProvider } from '@logto/react';
import { logtoConfig } from './logtoConfig';
// Instructor pages
import Home from "./pages/Home"; 
import Callback from './pages/Callback';
import Dashboard from "./pages/Instructor/Dashboard";
import NotFound from "./components/NotFound";
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
//Admin pages
import AdminDashboard from "./pages/Administator/AdminDashboard";
import UserManagement from "./pages/Administator/UserManagment";
//Student pages 
import StudentDashboard from "./pages/Student/StudentDashboard";
import StudentAccountSettings from "./pages/Student/StudentAccountSettings";
import StudentNotificationPreferences from "./pages/Student/StudentNotificationPreferences";
import StudentGradeReport from "./pages/Student/StudentGradeReport";


// Layout component to conditionally render NavBar
const Layout = ({ children }) => {
  const location = useLocation();
  const shouldDisplayNavBar =
  location.pathname !== "/";

  return (
    <>{shouldDisplayNavBar && <NavBar />}{children}</>
  );
};

function App() {
  const [message, setMessage] = useState("");
  const [userName, setUserName] = useState("");

  useEffect(() => {
    // fetch("/api/session-info")
    //   .then((res) => res.json())
    //   .then((data) => {
    //     if (data.userName) {
    //       setUserName(data.userName);
    //     }
    //   })
    //   .catch(console.error);
  }, []);

  return (
    <LogtoProvider config={logtoConfig}>
    <Router>
      <div className="App">
        <Layout>
          <Routes>
            <Route path="/" element={<Home />} />
            <Route path="/Home" element={<Home />} /> 
            <Route path="/callback" element={<Callback />} />
            <Route path="/Login" element={<Login />} />
            <Route path="/Dashboard"element={ <ProtectedRoute> <Dashboard /></ProtectedRoute>}/>
            <Route path="/AdminDashboard" element={<ProtectedRoute> <AdminDashboard /></ProtectedRoute>}/>
            <Route path="/UserManagement" element={<ProtectedRoute><UserManagement /></ProtectedRoute>}/>
            <Route path="/Signup" element={<Signup />} />
            <Route path="/Logout" element={<Logout/>} />
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
        </Layout>
      </div>
    </Router>
    </LogtoProvider>
  );
}
export default App;
