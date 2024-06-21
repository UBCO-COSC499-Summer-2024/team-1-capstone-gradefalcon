import React, { useEffect, useState } from "react";
import { BrowserRouter as Router, Routes, Route, useLocation} from "react-router-dom";
import "./css/App.css";
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
import ExamBoard from "./pages/Instructor/ExamBoard";
import ExamControls from "./pages/Instructor/ExamControls";
import ManualExamKey from "./pages/Instructor/ManualExamKey";
import NotificationPreferences from "./pages/Instructor/NotificationPreferences";
import UploadExamKey from "./pages/Instructor/UploadExamKey";
import AdminDashboard from "./pages/Administator/AdminDashboard";
import UserManagement from "./pages/Administator/UserManagment";

// Layout component to conditionally render NavBar
const Layout = ({ children }) => {
  const location = useLocation();
  const shouldDisplayNavBar =
    location.pathname !== "/" && location.pathname !== "/login" && location.pathname !== "/signup" && location.pathname !== "/adminDashboard" && location.pathname !== "/userManagement";

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
            <Route path="/" element={<Signup />} />
            <Route path="/Login" element={<Login />} />
            <Route path="/Dashboard"element={ <ProtectedRoute> <Dashboard /></ProtectedRoute>}/>
            <Route path="/AdminDashboard" element={<ProtectedRoute> <AdminDashboard /></ProtectedRoute>}/>
            <Route path="/UserManagement" element={<ProtectedRoute><UserManagement /></ProtectedRoute>}/>
            <Route path="/Signup" element={<Signup />} />
            <Route path="/AccountSettings" element={<AccountSettings />} />
            <Route path="/Classes" element={<Classes />} />
            <Route path="/New-Class" element={<NewClass />} />
            <Route path="/ClassManagement/:class_id" element={<ClassManagement />} />
            <Route path="/NewExam" element={<NewExam />} />
            <Route path="/ExamBoard" element={<ExamBoard />} />
            <Route path="/ExamControls" element={<ExamControls />} />
            <Route path="/ManualExamKey" element={<ManualExamKey />} />
            <Route path="/NotificationPreferences" element={<NotificationPreferences />} />
            <Route path="/UploadExamKey" element={<UploadExamKey />} />
            {/* <Route path="/Schedule" element={<Schedule />} /> Schedule plugin is brocken ->will fix */}
            <Route path="*" element={<NotFound />} />
          </Routes>
        </Layout>
      </div>
    </Router>
  );
}
export default App;
