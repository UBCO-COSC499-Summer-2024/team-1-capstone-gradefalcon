import React, { useEffect, useState } from "react";
import "../../css/App.css";
import "../../css/Examboard.css";

const ExamBoard = () => {
  const [classData, setClassData] = useState([]);
  const [error, setError] = useState(null);

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
        } else {
          setError("Failed to fetch class data");
        }
      } catch (error) {
        setError("Error fetching class data: " + error.message);
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

  if (error) {
    return <div data-testid="error-message">{error}</div>;
  }

  if ((classData.classes || []).length === 0) {
    return <div data-testid="no-exams">No exams available</div>;
  }

  return (
    <>
      <div className="App">
        <div className="main-content">
          <header>
            <h2 data-testid="header">Exam Board</h2>
          </header>
          <section className="exam-list" data-testid="exam-list">
            {Object.entries(groupedExams).map(
              ([courseId, { course_name, class_id, exams }]) => (
                <div key={courseId} data-testid={`course-${courseId}`}>
                  <h3 data-testid={`course-header-${courseId}`}>
                    {courseId} {course_name}
                  </h3>
                  {exams.map((exam, index) => (
                    <div key={index} className="exam-item" data-testid={`exam-${index}-${courseId}`}>
                      <p>{exam}</p>
                      <Link to="/UploadExams" className="grade-exam-btn" data-testid={`grade-btn-${index}-${courseId}`}>
                        Grade Exam
                      </Link>
                    </div>
                  ))}
                  <a href={`./NewExam/${class_id}`} className="create-new-btn" data-testid={`create-new-${courseId}`}>
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
