import React, { useEffect, useState } from "react";
import { useLocation, useNavigate, useParams } from "react-router-dom";
import "../../css/App.css";

const ViewExam = () => {
  const location = useLocation();
  const navigate = useNavigate();
  const { student_id, exam_id } = location.state || {};
  const [examFileId, setExamFileId] = useState("");
  const [imageSrc, setImageSrc] = useState("");

  // send the student_id and exam_id to a backend function
  // backend function reads the csv file, matches the student_id and returns exam file id
  // frontend fetches the exam file id and displays the exam file

  useEffect(() => {
    const fetchExam = async () => {
      if (!student_id) {
        console.log("Student ID is missing");
        return;
      }
      try {
        const response = await fetch(`/api/exam/searchExam/${student_id}`);
        if (!response.ok) {
          throw new Error(`Error: ${response.statusText}`);
        }
        // console.log("response", response);
        const data = await response.json();

        const responseImage = await fetch("/api/exam/fetchImage", {
          method: "POST",
          headers: {
            "Content-Type": "application/json",
          },
          body: JSON.stringify({ file_name: examFileId }),
        });
        // const data2 = await responseImage.json();
        // console.log(data2);
        const blob = await responseImage.blob();
        const url = URL.createObjectURL(blob);
        setImageSrc(url);

        setExamFileId(data.file_id);
      } catch (error) {
        console.error("Failed to fetch exam:", error);
      }
    };

    fetchExam();
  }, [student_id, examFileId]);

  return (
    <div className="App">
      <div className="main-content">
        <h1>View Exam</h1>

        {imageSrc ? (
          <img
            src={imageSrc}
            alt="Student Answers"
            style={{
              maxWidth: "30%",
              height: "auto",
            }}
          />
        ) : (
          <p>Loading image...</p>
        )}
        <div>
          <button className="save-changes-btn" onClick={() => navigate(-1)}>
            Go Back
          </button>
        </div>
      </div>
    </div>
  );
};

export default ViewExam;
