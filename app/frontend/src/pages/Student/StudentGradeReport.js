import React from 'react';
import '../../css/style.css'; 

const StudentGradeReport = () => {
  return (
    <div className="main-content">
      <header>
        <h2>Grade Report</h2>
      </header>
      <section className="charts">
        <div className="chart">
          <h3>Graphic Fundamentals - Final Exam</h3>
          <div className="placeholder">Graph will be inserted here</div>
        </div>
        <div className="chart">
          <h3>Graphic Fundamentals - Midterm 1</h3>
          <div className="placeholder">Graph will be inserted here</div>
        </div>
        <div className="chart">
          <h3>Advanced Web Designs - Final Exam</h3>
          <div className="placeholder">Graph will be inserted here</div>
        </div>
        <div className="chart">
          <h3>Advanced Web Design - Midterm 1</h3>
          <div className="placeholder">Graph will be inserted here</div>
        </div>
      </section>
    </div>
  );
};

export default StudentGradeReport;