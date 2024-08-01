import React, { useEffect, useState } from "react";
import {
  BrowserRouter as Router,
  Routes,
  Route,
} from "react-router-dom";
import "./css/App.css";

// Import components
import Layout from '../src/components/Layout';
import StudentLayout from '../src/components/StudentLayout';
import ProtectedRoute from "./ProtectedRoute";
import { Auth0Provider, useAuth0 } from "@auth0/auth0-react";

// Import pages
// Instructor pages
import OMRProcessing from "../src/components/OMRProcessing";
import OMRProcessingUpload from "../src/components/OMRProcessingUpload";
import Dashboard from "./pages/Instructor/Dashboard";
import NotFound from "./components/NotFound";
import Login from "./pages/Login"; 
import AccountSettings from "./pages/Instructor/AccountSettings";
import Classes from "./pages/Instructor/Classes";
import ClassManagement from "./pages/Instructor/ClassManagement";
import ExamDetails from "./pages/Instructor/ExamDetails";
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

// Student pages
import StudentDashboard from "./pages/Student/StudentDashboard";
import StudentAccountSettings from "./pages/Student/StudentAccountSettings";
import StudentNotificationPreferences from "./pages/Student/StudentNotificationPreferences";
import StudentGradeReport from "./pages/Student/StudentGradeReport";

function App() {
  return (
    <Router>
      <div className="App">
        <Routes>
          <Route path="/Login" element={<Login />} />
          <Route path="/" element={<ProtectedRoute><Layout><Dashboard/></Layout></ProtectedRoute>} />
          <Route path="/Dashboard" element={<ProtectedRoute><Layout><Dashboard /></Layout></ProtectedRoute>} />
          <Route path="/AccountSettings" element={<ProtectedRoute><Layout><AccountSettings /></Layout></ProtectedRoute>} />
          <Route path="/Classes" element={<ProtectedRoute><Layout><Classes /></Layout></ProtectedRoute>} />
          <Route path="/New-Class" element={<ProtectedRoute><Layout><NewClass /></Layout></ProtectedRoute>} />
          <Route path="/ClassManagement/:class_id" element={<ProtectedRoute><Layout><ClassManagement /></Layout></ProtectedRoute>} />
          <Route path="/ExamDetails/:exam_id" element={<ProtectedRoute><Layout><ExamDetails /></Layout></ProtectedRoute>} />
          <Route path="/NewExam/:class_id" element={<ProtectedRoute><Layout><NewExam /></Layout></ProtectedRoute>} />
          <Route path="/ExamBoard" element={<ProtectedRoute><Layout><ExamBoard /></Layout></ProtectedRoute>} />
          <Route path="/ExamControls" element={<ProtectedRoute><Layout><ExamControls /></Layout></ProtectedRoute>} />
          <Route path="/ManualExamKey" element={<ProtectedRoute><Layout><ManualExamKey /></Layout></ProtectedRoute>} />
          <Route path="/UploadExamKey" element={<ProtectedRoute><Layout><UploadExamKey /></Layout></ProtectedRoute>} />
          <Route path="/ConfirmExamKey" element={<ProtectedRoute><Layout><ConfirmExamKey /></Layout></ProtectedRoute>} />
          <Route path="/UploadExams/:exam_id" element={<ProtectedRoute><Layout><UploadExams /></Layout></ProtectedRoute>} />
          <Route path="/OMRProcessing" element={<ProtectedRoute><Layout><OMRProcessing /></Layout></ProtectedRoute>} />
          <Route path="/OMRProcessingUpload" element={<ProtectedRoute><Layout><OMRProcessingUpload /></Layout></ProtectedRoute>} />
          <Route path="/ReviewExams" element={<ProtectedRoute><Layout><ReviewExams /></Layout></ProtectedRoute>} />
          <Route path="/ViewExam" element={<ProtectedRoute><Layout><ViewExam /></Layout></ProtectedRoute>} />
          <Route path="/NotificationPreferences" element={<ProtectedRoute><Layout><NotificationPreferences /></Layout></ProtectedRoute>} />
          <Route path="/StudentDashboard" element={<ProtectedRoute><StudentLayout><StudentDashboard /></StudentLayout></ProtectedRoute>} />
          <Route path="/StudentGradeReport" element={<ProtectedRoute><StudentLayout><StudentGradeReport /></StudentLayout></ProtectedRoute>} />
          <Route path="/StudentAccountSettings" element={<ProtectedRoute><StudentLayout><StudentAccountSettings /></StudentLayout></ProtectedRoute>} />
          <Route path="/StudentNotificationPreferences" element={<ProtectedRoute><StudentLayout><StudentNotificationPreferences /></StudentLayout></ProtectedRoute>} />
          <Route path="*" element={<NotFound />} />
        </Routes>
      </div>
    </Router>
  );
}

export default App;
