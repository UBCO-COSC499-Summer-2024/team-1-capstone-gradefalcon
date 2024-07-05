import React, { useEffect, useState } from 'react';
import '../../css/App.css'; 

const StudentGradeReport = () => {
  const [grades, setGrades] = useState([
    { title: 'Midterm 1', status: 'missing', score: 0, total: 7 },
    { title: 'Midterm 2', status: 'submitted', score: 13, total: 15 },
    { title: 'Final', status: 'submitted', score: 14, total: 20 }
  ]);

  const calculateTotalPercentage = () => {
    const totalScore = grades.reduce((sum, grade) => sum + grade.score, 0);
    const totalPossible = grades.reduce((sum, grade) => sum + grade.total, 0);
    return ((totalScore / totalPossible) * 100).toFixed(2);
  };

  return (
    <div className="main-content">
      <header>
        <h2>Grade Report</h2> {/* Updated header text */}
        <div className="header-actions">
          <select>
            <option value="course1">Course 1</option>
            <option value="course2">Course 2</option>
          </select>
          <button>Print Grades</button>
        </div>
      </header>
      <section className="grade-table">
        <div className="grade-table-header">
          <span>Examination</span>
          <span>Status</span>
          <span>Score</span>
        </div>
        {grades.map((grade, index) => (
          <div key={index} className="grade-table-row">
            <span>{grade.title}</span>
            <span className={`status ${grade.status}`}>{grade.status}</span>
            <span>{grade.score} / {grade.total}</span>
          </div>
        ))}
      </section>
      <div className="total-percentage">
        Total: {calculateTotalPercentage()}%
      </div>
    </div>
  );
};

export default StudentGradeReport;

