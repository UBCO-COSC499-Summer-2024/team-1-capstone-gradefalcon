import React from 'react';
import '../../css/App.css';
import '../../css/ExamControls.css';

const ExamControls = () => {
  return (

    <div className="App">
        <div className="main-content">
          <header>
            <h2>Create New Exam</h2>
          </header>
          <section className="exam-controls">
            <button className="back-button" onClick={() => window.history.back()}>&larr;</button>




            <div className="controls">
              <div className="control-item">
                <span>Students can view their exam</span>
                <label className="switch">
                  <input type="checkbox" data-testid="toggle-view-exam" />
                  <span className="slider"></span>
                </label>
              </div>
              <div className="control-item">
                <span>Students can view correct answers</span>
                <label className="switch">
                  <input type="checkbox" data-testid="toggle-view-answers" />
                  <span className="slider"></span>
                </label>
              </div>
              <div className="control-item">
                <span>Students can see exam statistics</span>
                <label className="switch">
                  <input type="checkbox" data-testid="toggle-view-stats" />
                  <span className="slider"></span>
                </label>
              </div>
            </div>
            <a href="./ExamBoard" className="btn" data-testid="confirm-btn">Confirm</a>
          </section>
        </div>
      </div>
  );
};

export default ExamControls;