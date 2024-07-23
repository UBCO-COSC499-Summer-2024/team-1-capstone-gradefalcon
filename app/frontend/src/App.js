import React, { useEffect, useState } from "react";
import {
  BrowserRouter as Router,
  Routes,
  Route,
  useLocation,
} from "react-router-dom";
import "./css/App.css";

// Import components
import NavBar from "../src/components/NavBar";
import ProtectedRoute from "./ProtectedRoute";
import Logout from "./pages/Logout";
import OMRProcessing from "../src/components/OMRProcessing";
import OMRProcessingUpload from "../src/components/OMRProcessingUpload";
// Import Instructor pages
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
import ConfirmExamKey from "./pages/Instructor/ConfirmExamKey";
import NotificationPreferences from "./pages/Instructor/NotificationPreferences";
import UploadExamKey from "./pages/Instructor/UploadExamKey";
import UploadExams from "./pages/Instructor/UploadExams";
import ReviewExams from "./pages/Instructor/ReviewExams";
import ViewExam from "./pages/Instructor/ViewExam";
//admin pages
import AdminDashboard from "./pages/Administator/AdminDashboard";
import UserManagement from "./pages/Administator/UserManagment";
//student pages
import StudentDashboard from "./pages/Student/StudentDashboard";
import StudentAccountSettings from "./pages/Student/StudentAccountSettings";
import StudentNotificationPreferences from "./pages/Student/StudentNotificationPreferences";
import StudentGradeReport from "./pages/Student/StudentGradeReport";

// Layout component to conditionally render NavBar
const Layout = ({ children }) => {
  const location = useLocation();
  const shouldDisplayNavBar =
    location.pathname !== "/" &&
    location.pathname !== "/*" &&
    location.pathname !== "/login" &&
    location.pathname !== "/signup" &&
    location.pathname !== "/AdminDashboard" &&
    location.pathname !== "/userManagement" &&
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
          <Routes>
            <Route path="/" element={<Login />} />
            <Route path="/Login" element={<Login />} />
            <Route
              path="/Dashboard"
              element={
                <ProtectedRoute>
                  {" "}
                  <Dashboard />
                </ProtectedRoute>
              }
            />
            <Route
              path="/AdminDashboard"
              element={
                <ProtectedRoute>
                  {" "}
                  <AdminDashboard />
                </ProtectedRoute>
              }
            />
            <Route
              path="/UserManagement"
              element={
                <ProtectedRoute>
                  <UserManagement />
                </ProtectedRoute>
              }
            />
            <Route path="/Signup" element={<Signup />} />
            <Route path="/Logout" element={<Logout />} />
            <Route path="/AccountSettings" element={<AccountSettings />} />
            <Route path="/Classes" element={<Classes />} />
            <Route path="/New-Class" element={<NewClass />} />
            <Route
              path="/ClassManagement/:class_id"
              element={<ClassManagement />}
            />
            <Route path="/NewExam/:class_id" element={<NewExam />} />
            <Route path="/ExamBoard" element={<ExamBoard />} />
            <Route path="/ExamControls" element={<ExamControls />} />
            <Route path="/ManualExamKey" element={<ManualExamKey />} />
            <Route path="/UploadExamKey" element={<UploadExamKey />} />
            <Route path="/ConfirmExamKey" element={<ConfirmExamKey />} />
            <Route path="/UploadExams/:exam_id" element={<UploadExams />} />
            <Route path="/OMRProcessing" element={<OMRProcessing />} />
            <Route
              path="/OMRProcessingUpload"
              element={<OMRProcessingUpload />}
            />{" "}
            {/* Add the new route */}
            <Route path="/ReviewExams" element={<ReviewExams />} />
            <Route path="/ViewExam" element={<ViewExam />} />
            <Route
              path="/NotificationPreferences"
              element={<NotificationPreferences />}
            />
            <Route
              path="/StudentDashboard"
              element={
                <ProtectedRoute>
                  <StudentDashboard />
                </ProtectedRoute>
              }
            />
            <Route
              path="/StudentGradeReport"
              element={<StudentGradeReport />}
            />
            <Route
              path="/StudentAccountSettings"
              element={<StudentAccountSettings />}
            />
            <Route
              path="/StudentNotificationPreferences"
              element={<StudentNotificationPreferences />}
            />
            {/* <Route path="/Schedule" element={<Schedule />} /> Schedule plugin is brocken ->will fix */}
            <Route path="*" element={<NotFound />} />
          </Routes>
        </Layout>
      </div>
    </Router>
  );
}
export default App;
