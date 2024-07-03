import React, { useEffect, useState } from "react";
import "../../css/App.css";
import "../../css/Examboard.css";
import { Link } from "react-router-dom";

const ExamBoard = () => {
  const [classData, setClassData] = useState([]);

  useEffect(() => {
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
          setClassData(data); // Set the class data state with the fetched data
          console.log(data);
        } else {
          console.error("Failed to fetch class data");
        }
      } catch (error) {
        console.error("Error fetching class data:", error);
      }
    };

    fetchClassData();
  }, []);

  // Transform classData.classes into a structure that groups exams by course_id
  // Check if classData.classes is null and provide a fallback empty array
  const groupedExams = (classData.classes || []).reduce((acc, current) => {
    const { course_id, course_name, exam_title, class_id } = current;
    if (!acc[course_id]) {
      acc[course_id] = {
        course_name,
        class_id,
        exams: [],
      };
    }
    acc[course_id].exams.push(exam_title);
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
                    <p>{exam}</p>
                    <Link to="/UploadExams" className="grade-exam-btn">
                      Grade Exam
                    </Link>
                  </div>
                  ))}
                  <a href={`./NewExam/${class_id}`} class="create-new-btn">
                    Create New
                  </a>
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
