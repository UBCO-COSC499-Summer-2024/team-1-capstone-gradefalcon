import React, { useEffect, useState } from "react";
import "../../css/App.css";
import "../../css/Examboard.css";
import { useNavigate } from "react-router-dom";

const ExamBoard = () => {
  const [classData, setClassData] = useState([]);
  const [userName, setUserName] = useState("");
  const [userID, setUserID] = useState("");

  const navigate = useNavigate();

  useEffect(() => {
    const fetchSessionInfo = async () => {
      try {
        const response = await fetch("/api/session-info", {
          method: "GET",
          headers: {
            "Content-Type": "application/json",
          },
          credentials: "include",
        });
        if (response.ok) {
          const data = await response.json();
          setUserName(data.userName);
          setUserID(data.userId);
        } else {
          console.error("Failed to fetch session info");
        }
      } catch (error) {
        console.error("Error fetching session info:", error);
      }
    };

    const fetchClassData = async () => {
      try {
        const response = await fetch(`/api/exam/ExamBoard`, {
          method: "POST",
          headers: {
            "Content-Type": "application/json",
          },
          credentials: "include",
        });
        if (response.ok) {
          const data = await response.json();
          setClassData(data);
          console.log(data);
        } else {
          console.error("Failed to fetch class data");
        }
      } catch (error) {
        console.error("Error fetching class data:", error);
      }
    };

    fetchSessionInfo();
    fetchClassData();
  }, []);

  const groupedExams = (classData.classes || []).reduce((acc, current) => {
    const { course_id, course_name, exam_title, class_id, exam_id } = current;
    if (!acc[course_id]) {
      acc[course_id] = {
        course_name,
        class_id,
        exams: [],
      };
    }
    acc[course_id].exams.push({ exam_title, exam_id });
    return acc;
  }, {});

  return (
    <>
      <div className="App">
        <div className="main-content">
          <header>
            <h2>Exam Board</h2>
          </header>
          <section className="exam-list">
            {Object.entries(groupedExams).map(
              ([courseId, { course_name, class_id, exams }]) => (
                <div key={courseId}>
                  <h3>{courseId} {course_name}</h3>
                  {exams.map((exam, index) => (
                    <div key={index} className="exam-item">
                      <p>{exam.exam_title}</p>
                      <button 
                        onClick={() => navigate("/UploadExams", {
                          state: {
                            className: course_name,
                            userName: userName,
                            userID: userID,
                            examTitle: exam.exam_title,
                            examID: exam.exam_id
                          }
                        })}
                        className="grade-exam-btn"
                      >
                        Grade Exam
                      </button>
                    </div>
                  ))}
                  <button 
                    onClick={() => navigate(`/NewExam/${class_id}`, {
                      state: {
                        className: course_name,
                        userName: userName,
                        userID: userID,
                      }
                    })}
                    className="create-new-btn"
                  >
                    Create New
                  </button>
                </div>
              )
            )}
          </section>
        </div>
      </div>
    </>
  );
};

export default ExamBoard;
