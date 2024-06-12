import React, { useEffect, useState } from "react";
import logo from "../public/logo.png";
import "./App.css";
import "./style.css"

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
  const [message, setMessage] = useState();
  useEffect(() => {
    fetch("/api/")
      .then(res => res.json())
      .then(res => setMessage(res.message))
      .catch(console.error);
  }, [setMessage]);

  return (
    <Router>
      <div className="App">
        <header className="App-header">
          <img src={logo} className="App-logo" alt="logo" />
          <p>{message || "Loading..."}</p>
          <p>
            Edit <code>src/App.js</code> and save to reload.
          </p>
          <a
            className="App-link"
            href="https://reactjs.org"
            target="_blank"
            rel="noopener noreferrer"
          >
            Learn React
          </a>
        </header>
        <Switch>
          <Route path="/dashboard" component={Dashboard} />
          <Route path="/signup" component={InstructorSignup} />
          {/* <Route path="/account-settings" component={AccountSettings} />
          <Route path="/classes" component={Classes} />
          <Route path="/class-management" component={ClassManagement} />
          <Route path="/examboard" component={Examboard} />
          <Route path="/exam-controls" component={ExamControls} />
          <Route path="/grade-report" component={GradeReport} />
          <Route path="/manual-exam-key" component={ManualExamKey} />
          <Route path="/new-exam" component={NewExam} />
          <Route path="/notification-preferences" component={NotificationPreferences} />
          <Route path="/schedule" component={Schedule} />
          <Route path="/upload-exam-key" component={UploadExamKey} /> */}
          <Route component={NotFound} />
        </Switch>
      </div>
    </Router>
  );
}

export default App;
