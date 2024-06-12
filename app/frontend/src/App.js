import React, { useEffect, useState } from "react";
import logo from "./assets/logo.png";
import "./css/App.css";
import "./css/style.css"
import { BrowserRouter as Router, Switch, Route } from 'react-router-dom';

import Dashboard from './pages/Instructor/Dashboard';
import NotFound from './pages/NotFound';
import InstructorSignup from './pages/Instructor/Signup';
// import Examboard from '../old html/Examboard';
// import ExamControls from '../old html/ExamControls';
// import GradeReport from '../old html/GradeReport';
// import ManualExamKey from '../old html/ManualExamKey';
// import NewExam from '../old html/NewExam';
// import NotificationPreferences from '../old html/NotificationPreferences';
// import Schedule from '../old html/Schedule';
// import UploadExamKey from '../old html/UploadExamKey';
// import AccountSettings from '../old html/AccountSettings';
// import Classes from '../old html/Classes';
// import ClassManagement from '../old html/ClassManagement';

function App() {
  const [message, setMessage] = useState("");
  
  useEffect(() => {
    fetch("/api/")
      .then(res => res.json())
      .then(res => setMessage(res.message))
      .catch(console.error);
  }, []);

  return (
    <Router>
      <div className="App">
        <header className="App-header">
          <img src={logo} className="App-logo" alt="logo" />
          <p>{message || "Loading..."}</p>
          <p>
            Welcome to GradeFalcon, an optical marking system for grading bubble sheets.
          </p>
        </header>
        <Switch>
          <Route exact path="/" component={InstructorSignup} />
          <Route path="/dashboard" component={Dashboard} />
          <Route path="/signup" component={InstructorSignup} />
          <Route component={NotFound} />
        </Switch>
      </div>
    </Router>
  );
}

export default App;