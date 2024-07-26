import React, { useEffect, useState } from "react";
import { useLocation, useNavigate } from "react-router-dom";
import "../../css/App.css";
import Toast from "../../components/Toast";

const ReviewExams = () => {
  const location = useLocation();
  const [toast, setToast] = useState(null);
  const [studentScores, setStudentScores] = useState([]);
  const [totalMarks, setTotalMarks] = useState();
  const [editStudentId, setEditStudentId] = useState(null);
  const [originalScores, setOriginalScores] = useState({});
  const [searchQuery, setSearchQuery] = useState("");
  // const { exam_id } = location.state || {};
  const navigate = useNavigate(); // Initialize useNavigate
  const exam_id = 1; // placeholder

  useEffect(() => {
    //preprocess the data
    const preprocessData = async () => {
      try {
        const response = await fetch("/api/exam/preprocessingCSV");
        if (!response.ok) {
          throw new Error("Network response was not ok");
        }
        // const data = await response.json();
        // console.log("preprocessData", data);
      } catch (error) {
        console.error("Error preprocessing data:", error);
      }
    };

    // Fetch student scores for the exam
    const fetchStudentScores = async () => {
      try {
        const response = await fetch("/api/exam/studentScores");
        if (!response.ok) {
          throw new Error("Network response was not ok");
        }
        const data = await response.json();
        setStudentScores(data); // Update state with fetched data
      } catch (error) {
        console.error("Error fetching student scores:", error);
      }
    };

    // Fetch the max marks for the exam
    const fetchTotalScore = async () => {
      try {
        const response = await fetch(`/api/exam/getScoreByExamId/${exam_id}`);
        if (!response.ok) {
          throw new Error("Network response was not ok");
        }
        const data = await response.json();
        setTotalMarks(data.scores[0]);
      } catch (error) {
        console.error("Error fetching total marks:", error);
      }
    };

    preprocessData();
    fetchStudentScores();
    fetchTotalScore();
  }, []);

  // Function to handle view button click
  const handleViewClick = (studentId) => {
    navigate("/ViewExam", {
      state: { student_id: studentId, exam_id: exam_id },
    });
  };

  // Function to handle manually changing the score
  const handleScoreChange = (e, studentId) => {
    const newScore = e.target.value;
    setStudentScores((currentScores) =>
      currentScores.map((score) =>
        score.StudentID === studentId ? { ...score, Score: newScore } : score
      )
    );
  };

  // Function to handle editing the student score
  const handleEdit = (studentId) => {
    setEditStudentId(studentId);
    const studentScore = studentScores.find((s) => s.StudentID === studentId).Score;
    setOriginalScores((prevScores) => ({
      ...prevScores,
      [studentId]: studentScore,
    }));
  };

  // Function to handle canceling an edit
  const handleCancel = (studentId) => {
    setStudentScores((currentScores) =>
      currentScores.map((score) =>
        score.StudentID === studentId ? { ...score, Score: originalScores[studentId] } : score
      )
    );
    setEditStudentId(null); // Exit edit mode
    setOriginalScores((prevScores) => {
      const newScores = { ...prevScores };
      delete newScores[studentId]; // Remove the original score as it's no longer needed
      return newScores;
    });
  };

  const saveResults = async () => {
    if (editStudentId !== null) {
      alert("Please save or cancel the current edit before saving all results.");
      return;
    }
    try {
      const response = await fetch("/api/exam/saveResults", {
        method: "POST",
        headers: {
          "Content-Type": "application/json",
        },
        body: JSON.stringify({ studentScores, exam_id }),
      });
      if (!response.ok) {
        throw new Error("Network response was not ok");
      }
      const data = await response.json();
      console.log(data);
      setToast({ message: "Results saved! Redirecting...", type: "success" });
      setTimeout(() => {
        navigate("/GradeReport");
      }, 2000);
    } catch (error) {
      console.error("Error saving results:", error);
    }
  };

  const filteredScores = searchQuery
    ? studentScores.filter((student) => student.StudentID.toString().includes(searchQuery))
    : studentScores;

  return (
    <>
      <div className="App">
        <div className="main-content">
          {toast && (
            <>
              <Toast message={toast.message} type={toast.type} onClose={() => setToast(null)} />
            </>
          )}
          <header>
            <h2>Review Exams</h2>
            <input // Step 2: Create search bar
              type="text"
              placeholder="Search by Student ID..."
              value={searchQuery}
              onChange={(e) => setSearchQuery(e.target.value)} // Step 3: Update search query
            />
          </header>
          <table>
            <thead>
              <tr>
                <th>Student Name</th>
                <th>Student ID</th>
                <th>Score/{totalMarks}</th>
                <th>View Exam</th>
              </tr>
            </thead>
            <tbody>
              {filteredScores.map((student, index) => (
                <tr key={index}>
                  <td>{student.StudentName}</td>
                  <td>{student.StudentID}</td>
                  <td>
                    {editStudentId === student.StudentID ? (
                      <input
                        type="number"
                        value={student.Score}
                        max={totalMarks}
                        min="0"
                        onChange={(e) => handleScoreChange(e, student.StudentID)}
                      />
                    ) : (
                      student.Score
                    )}

                    {editStudentId === student.StudentID ? (
                      <>
                        <button onClick={() => setEditStudentId(null)}>Save</button>
                        <button onClick={() => handleCancel(student.StudentID)}>Cancel</button>
                      </>
                    ) : (
                      <button onClick={() => handleEdit(student.StudentID)}>Edit</button>
                    )}
                  </td>
                  <td>
                    <button onClick={() => handleViewClick(student.StudentID)}>View</button>
                  </td>
                </tr>
              ))}
            </tbody>
          </table>
          <button className="save-changes-btn" onClick={() => saveResults()}>
            Save Results
          </button>
        </div>
      </div>
    </>
  );
};

export default ReviewExams;
