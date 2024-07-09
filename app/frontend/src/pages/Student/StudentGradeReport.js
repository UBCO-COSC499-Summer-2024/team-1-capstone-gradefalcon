import React, { useEffect, useState } from 'react';
import axios from 'axios';
import '../../css/App.css';

const StudentGradeReport = () => {
  const [grades, setGrades] = useState([]);
  const [courses, setCourses] = useState([]);
  const [selectedCourse, setSelectedCourse] = useState(null);
  const [loadingCourses, setLoadingCourses] = useState(true);
  const [loadingGrades, setLoadingGrades] = useState(true);
  const [selectedGrade, setSelectedGrade] = useState(null); // For detailed view
  const studentId = 1; // Replace with actual student ID

  useEffect(() => {
    const fetchCourses = async () => {
      setLoadingCourses(true);
      try {
        const response = await axios.get(`/api/courses/student/${studentId}`);
        setCourses(response.data);
        if (response.data.length > 0) {
          setSelectedCourse(response.data[0].class_id); // Select the first course by default
        }
      } catch (error) {
        console.error('Error fetching courses:', error);
      } finally {
        setLoadingCourses(false);
      }
    };

    fetchCourses();
  }, [studentId]);

  useEffect(() => {
    const fetchGrades = async () => {
      setLoadingGrades(true);
      if (selectedCourse) {
        try {
          const response = await axios.get(`/api/exam/grades/${studentId}?classId=${selectedCourse}`);
          setGrades(response.data);
        } catch (error) {
          console.error('Error fetching grades:', error);
        } finally {
          setLoadingGrades(false);
        }
      }
    };

    fetchGrades();
  }, [studentId, selectedCourse]);

  const calculateTotalPercentage = () => {
    const totalScore = grades.reduce((sum, grade) => sum + grade.score, 0);
    const totalPossible = grades.reduce((sum, grade) => sum + grade.total, 0);
    return ((totalScore / totalPossible) * 100).toFixed(2);
  };

  const exportToCSV = () => {
    const csvRows = [];
    csvRows.push(['Examination', 'Status', 'Score', 'Total']);
    grades.forEach(grade => {
      csvRows.push([grade.title, grade.status, grade.score, grade.total]);
    });

    const csvContent = "data:text/csv;charset=utf-8," + csvRows.map(e => e.join(",")).join("\n");
    const encodedUri = encodeURI(csvContent);
    const link = document.createElement("a");
    link.setAttribute("href", encodedUri);
    link.setAttribute("download", "grade_report.csv");
    document.body.appendChild(link);
    link.click();
  };

  const handleGradeClick = (grade) => {
    setSelectedGrade(grade);
  };

  const closeModal = () => {
    setSelectedGrade(null);
  };

  return (
    <div className="main-content">
      <header>
        <h2>Grade Report</h2>
        <div className="header-actions">
          <select onChange={(e) => setSelectedCourse(e.target.value)} value={selectedCourse}>
            {loadingCourses ? (
              <option>Loading courses...</option>
            ) : (
              courses.map((course) => (
                <option key={course.class_id} value={course.class_id}>
                  {course.course_name}
                </option>
              ))
            )}
          </select>
        </div>
      </header>
      {loadingGrades ? (
        <div className="spinner"></div>
      ) : (
        <>
          <section className="grade-table">
            <div className="grade-table-header">
              <span>Examination</span>
              <span>Status</span>
              <span>Score</span>
            </div>
            {grades.map((grade, index) => (
              <div key={index} className="grade-table-row" onClick={() => handleGradeClick(grade)}>
                <span>{grade.title}</span>
                <span className={`status ${grade.status}`}>{grade.status}</span>
                <span>{grade.score} / {grade.total}</span>
              </div>
            ))}
          </section>
          <div className="total-and-export">
            <div className="total-percentage">
              Total: {calculateTotalPercentage()}%
            </div>
            <button onClick={exportToCSV}>Export Grades</button>
          </div>
        </>
      )}

      {selectedGrade && (
        <div className="modal">
          <div className="modal-content">
            <span className="close" onClick={closeModal}>&times;</span>
            <h2>Grade Details</h2>
            <p><strong>Examination:</strong> {selectedGrade.title}</p>
            <p><strong>Status:</strong> {selectedGrade.status}</p>
            <p><strong>Score:</strong> {selectedGrade.score} / {selectedGrade.total}</p>
            {/* Add more detailed information if available */}
          </div>
        </div>
      )}
    </div>
  );
};

export default StudentGradeReport;



