// src/App.js
import React from 'react';
import { BrowserRouter as Router, Routes, Route } from 'react-router-dom';
import './css/App.css';

// Import components
import Layout from './components/Layout';
import StudentLayout from './components/StudentLayout';
import ProtectedRoute from './ProtectedRoute';
import NotFound from './components/NotFound';
import Unauthorized from './pages/Unauthorized';
import Home from './pages/Home';
import OMRProcessing from './components/OMRProcessing';
import OMRProcessingUpload from './components/OMRProcessingUpload';

// Import Instructor pages
import Dashboard from './pages/Instructor/Dashboard';
import AccountSettings from './pages/Instructor/AccountSettings';
import Classes from './pages/Instructor/Classes';
import ClassManagement from './pages/Instructor/ClassManagement';
import ExamDetails from './pages/Instructor/ExamDetails';
import NewClass from './pages/Instructor/NewClass';
import NewExam from './pages/Instructor/NewExam';
import ExamBoard from './pages/Instructor/Examboard';
import ExamControls from './pages/Instructor/ExamControls';
import ManualExamKey from './pages/Instructor/ManualExamKey';
import ConfirmExamKey from './pages/Instructor/ConfirmExamKey';
import NotificationPreferences from './pages/Instructor/NotificationPreferences';
import UploadExamKey from './pages/Instructor/UploadExamKey';
import UploadExams from './pages/Instructor/UploadExams';
import ReviewExams from './pages/Instructor/ReviewExams';
import ViewExam from './pages/Instructor/ViewExam';
import Reports from './pages/Instructor/Reports';
import ViewReport from './pages/Instructor/ViewReport';

// Import Student pages
import StudentDashboard from './pages/Student/StudentDashboard';
import StudentAccountSettings from './pages/Student/StudentAccountSettings';
import StudentNotificationPreferences from './pages/Student/StudentNotificationPreferences';
import StudentGradeReport from './pages/Student/StudentGradeReport';
import ViewExamDetails from './pages/Student/ViewExamDetails';
import SubmitReport from './pages/Student/SubmitReport';
import StudentReportsDashboard from './pages/Student/StudentReportsDashboard';

function App() {
  return (
    <Router>
      <div className="App">
        <Routes>
          <Route path="/Home" element={<Home />} />
          <Route path="/unauthorized" element={<Unauthorized />} />
          {/* Role-based Redirect */}
          <Route path="/" element={<ProtectedRoute />} />

          {/* Instructor Routes */}
          <Route path="/Dashboard" element={<ProtectedRoute roles={['Instructor']}><Layout><Dashboard /></Layout></ProtectedRoute>} />
          <Route path="/AccountSettings" element={<ProtectedRoute roles={['Instructor']}><Layout><AccountSettings /></Layout></ProtectedRoute>} />
          <Route path="/Classes" element={<ProtectedRoute roles={['Instructor']}><Layout><Classes /></Layout></ProtectedRoute>} />
          <Route path="/ClassManagement/:class_id" element={<ProtectedRoute roles={['Instructor']}><Layout><ClassManagement /></Layout></ProtectedRoute>} />
          <Route path="/ExamDetails/:exam_id" element={<ProtectedRoute roles={['Instructor']}><Layout><ExamDetails /></Layout></ProtectedRoute>} />
          <Route path="/New-Class" element={<ProtectedRoute roles={['Instructor']}><Layout><NewClass /></Layout></ProtectedRoute>} />
          <Route path="/NewExam" element={<ProtectedRoute roles={['Instructor']}><Layout><NewExam /></Layout></ProtectedRoute>} />
          <Route path="/ExamBoard" element={<ProtectedRoute roles={['Instructor']}><Layout><ExamBoard /></Layout></ProtectedRoute>} />
          <Route path="/ExamControls" element={<ProtectedRoute roles={['Instructor']}><Layout><ExamControls /></Layout></ProtectedRoute>} />
          <Route path="/ManualExamKey" element={<ProtectedRoute roles={['Instructor']}><Layout><ManualExamKey /></Layout></ProtectedRoute>} />
          <Route path="/UploadExamKey" element={<ProtectedRoute roles={['Instructor']}><Layout><UploadExamKey /></Layout></ProtectedRoute>} />
          <Route path="/ConfirmExamKey" element={<ProtectedRoute roles={['Instructor']}><Layout><ConfirmExamKey /></Layout></ProtectedRoute>} />
          <Route path="/UploadExams/:exam_id" element={<ProtectedRoute roles={['Instructor']}><Layout><UploadExams /></Layout></ProtectedRoute>} />
          <Route path="/OMRProcessing" element={<ProtectedRoute><Layout><OMRProcessing /></Layout></ProtectedRoute>} />
          <Route path="/OMRProcessingUpload" element={<ProtectedRoute><Layout><OMRProcessingUpload /></Layout></ProtectedRoute>} />
          <Route path="/ReviewExams" element={<ProtectedRoute roles={['Instructor']}><Layout><ReviewExams /></Layout></ProtectedRoute>} />
          <Route path="/ViewExam" element={<ProtectedRoute roles={['Instructor']}><Layout><ViewExam /></Layout></ProtectedRoute>} />
          <Route path="/NotificationPreferences" element={<ProtectedRoute roles={['Instructor']}><Layout><NotificationPreferences /></Layout></ProtectedRoute>} />
          <Route path="/Reports" element={<ProtectedRoute roles={['Instructor']}><Layout><Reports /></Layout></ProtectedRoute>} />
          <Route path="/ViewReport/:report_id" element={<ProtectedRoute roles={['Instructor']}><Layout><ViewReport /></Layout></ProtectedRoute>} />

          {/* Student Routes */}
          <Route path="/StudentDashboard" element={<ProtectedRoute roles={['Student']}><StudentLayout><StudentDashboard /></StudentLayout></ProtectedRoute>} />
          <Route path="/StudentGradeReport" element={<ProtectedRoute roles={['Student']}><StudentLayout><StudentGradeReport /></StudentLayout></ProtectedRoute>} />
          <Route path="/StudentAccountSettings" element={<ProtectedRoute roles={['Student']}><StudentLayout><StudentAccountSettings /></StudentLayout></ProtectedRoute>} />
          <Route path="/StudentNotificationPreferences" element={<ProtectedRoute roles={['Student']}><StudentLayout><StudentNotificationPreferences /></StudentLayout></ProtectedRoute>} />
          <Route path="/ViewExamDetails" element={<ProtectedRoute roles={['Student']}><StudentLayout><ViewExamDetails /></StudentLayout></ProtectedRoute>} />
          <Route path="SubmitReport" element={<ProtectedRoute roles={['Student']}><StudentLayout><SubmitReport /></StudentLayout></ProtectedRoute>} />
          <Route path="/StudentReportsDashboard" element={<ProtectedRoute roles={['Student']}><StudentLayout><StudentReportsDashboard /></StudentLayout></ProtectedRoute>} />

          {/* Fallback for unmatched routes */}
          <Route path="*" element={<NotFound />} />
        </Routes>
      </div>
    </Router>
  );
}

export default App;
