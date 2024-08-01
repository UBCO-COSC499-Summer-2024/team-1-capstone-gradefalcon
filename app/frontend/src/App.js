import React, { useEffect, useState } from "react";
import {
  BrowserRouter as Router,
  Routes,
  Route,
  useLocation,
} from "react-router-dom";
import "./css/App.css";


// Import components
import Layout from '../src/components/Layout';
import ProtectedRoute from "./ProtectedRoute";
import { Auth0Provider, useAuth0 } from "@auth0/auth0-react";

// Import components
// Import pages
// Instructor pages
import OMRProcessing from "../src/components/OMRProcessing";
import OMRProcessingUpload from "../src/components/OMRProcessingUpload";
// Import Instructor pages

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
import Reports from "./pages/Instructor/Reports"; 
import ViewReport from "./pages/Instructor/ViewReport"; 
// Student pages
import ReviewExams from "./pages/Instructor/ReviewExams";
import ViewExam from "./pages/Instructor/ViewExam";
//student pages
import StudentDashboard from "./pages/Student/StudentDashboard";
import StudentAccountSettings from "./pages/Student/StudentAccountSettings";
import StudentNotificationPreferences from "./pages/Student/StudentNotificationPreferences";
import StudentGradeReport from "./pages/Student/StudentGradeReport";


function App() {
  return (
    <Router>
      <div className="App">
        <Layout>
          <Routes>
            <Route path="/Login" element={<Login />} />
            <Route path="/" element={<ProtectedRoute><Dashboard/></ProtectedRoute>} />
            <Route path="/Dashboard"element={ <ProtectedRoute> <Dashboard /></ProtectedRoute>}/>
            <Route path="/AccountSettings" element={ <ProtectedRoute> <AccountSettings /> </ProtectedRoute> } />
            <Route path="/Classes" element={ <ProtectedRoute> <Classes /> </ProtectedRoute> } />
            <Route path="/New-Class" element={ <ProtectedRoute> <NewClass /> </ProtectedRoute> } />
            <Route path="/ClassManagement/:class_id" element={ <ProtectedRoute> <ClassManagement /> </ProtectedRoute> }/>
            <Route path="/ExamDetails/:exam_id" element={ <ProtectedRoute> <ExamDetails /> </ProtectedRoute> } />
            <Route path="/NewExam/:class_id" element={ <ProtectedRoute> <NewExam /> </ProtectedRoute> } />
            <Route path="/ExamBoard" element={ <ProtectedRoute> <ExamBoard /> </ProtectedRoute> } />
            <Route path="/ExamControls" element={ <ProtectedRoute> <ExamControls /> </ProtectedRoute> } />
            <Route path="/ManualExamKey" element={ <ProtectedRoute> <ManualExamKey /> </ProtectedRoute> } />
            <Route path="/UploadExamKey" element={ <ProtectedRoute> <UploadExamKey /> </ProtectedRoute> } />
            <Route path="/ConfirmExamKey" element={ <ProtectedRoute> <ConfirmExamKey /> </ProtectedRoute> } />
            <Route path="/UploadExams/:exam_id" element={ <ProtectedRoute> <UploadExams /> </ProtectedRoute> } />
            <Route path="/OMRProcessing" element={ <ProtectedRoute> <OMRProcessing /> </ProtectedRoute> } />
            <Route path="/OMRProcessingUpload" element={ <ProtectedRoute> <OMRProcessingUpload /> </ProtectedRoute> } /> {/* Add the new route */}
            <Route path="/ReviewExams" element={ <ProtectedRoute> <ReviewExams /> </ProtectedRoute> } />
            <Route path="/ViewExam" element={<ProtectedRoute><ViewExam /></ProtectedRoute>} />
            <Route path="/NotificationPreferences" element={ <ProtectedRoute> <NotificationPreferences /> </ProtectedRoute> } />
            <Route path= "/StudentDashboard" element={  <ProtectedRoute> <StudentDashboard /> </ProtectedRoute> } />
            <Route path="/Reports" element={ <ProtectedRoute> <Reports /> </ProtectedRoute> } />
            <Route path="/ViewReport" element={ <ProtectedRoute> <ViewReport /> </ProtectedRoute> } />
            <Route
              path="/StudentGradeReport"
              element={ <ProtectedRoute> <StudentGradeReport /> </ProtectedRoute> }
            />
            <Route
              path="/StudentAccountSettings"
              element={ <ProtectedRoute> <StudentAccountSettings /> </ProtectedRoute> }
            />
            <Route
              path="/StudentNotificationPreferences"
              element={ <ProtectedRoute> <StudentNotificationPreferences /> </ProtectedRoute> }
            />
            <Route path="*" element={<NotFound />} />
          </Routes>
        </Layout>
      </div>
    </Router>
  );
}

export default App;
