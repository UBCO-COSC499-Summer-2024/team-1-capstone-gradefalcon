import React, { useEffect, useState } from "react";
import { BrowserRouter as Router, Routes, Route, useLocation} from "react-router-dom";
import "./css/App.css";
import NavBar from "../src/components/NavBar";
import ProtectedRoute from "./ProtectedRoute";
import { Auth0Provider } from "@auth0/auth0-react";
// Import pages
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
//student pages 
import StudentDashboard from "./pages/Student/StudentDashboard";
import StudentAccountSettings from "./pages/Student/StudentAccountSettings";
import StudentNotificationPreferences from "./pages/Student/StudentNotificationPreferences";
import StudentGradeReport from "./pages/Student/StudentGradeReport";



// Layout component to conditionally render NavBar
const Layout = ({ children }) => {
  const location = useLocation();
  const shouldDisplayNavBar =
   location.pathname !== "/login";

  return (
    <>{shouldDisplayNavBar && <NavBar />}{children}</>
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
    <Auth0Provider
    domain="dev-1wzrc3nphnk4w01y.ca.auth0.com"
    clientId="zUtm0FsUWaknfcSxpx3cyhFHNjIuVpoI"
    redirectUri={window.location.origin}
  >
    <Router>
      <div className="App">
        <Layout>
          <Routes>
            <Route path="/login" element={<Login />} />
            <Route path="/" element={<Dashboard />} />
            <Route path="/Dashboard"element={  <Dashboard />}/>
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
            <Route path="*" element={<NotFound />} />

          </Routes>
        </Layout>
      </div>
    </Router>
    </Auth0Provider>
  );
}
export default App;
