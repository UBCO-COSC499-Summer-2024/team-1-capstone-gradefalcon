import React, { useEffect, useState } from "react";
import { useLocation, useNavigate, useParams } from "react-router-dom";
import "../../css/App.css";
import { useAuth0 } from "@auth0/auth0-react";

const ViewExam = () => {
  const { user, isAuthenticated, getAccessTokenSilently } = useAuth0();
  const location = useLocation();
  const navigate = useNavigate();
  const { student_id, exam_id, front_page, back_page } = location.state || {};
  const [examFileId, setExamFileId] = useState("");
  const [frontSrc, setFrontSrc] = useState("");
  const [backSrc, setBackSrc] = useState("");

  // send the student_id and exam_id to a backend function
  // backend function reads the csv file, matches the student_id and returns exam file id
  // frontend fetches the exam file id and displays the exam file

  useEffect(() => {
    const fetchExam = async () => {
      const token = await getAccessTokenSilently(); // Get the token
      if (!student_id) {
        console.log("Student ID is missing");
        return;
      }
      try {
        // const response = await fetch(`/api/exam/searchExam/${student_id}`);
        // if (!response.ok) {
        //   throw new Error(`Error: ${response.statusText}`);
        // }
        // // console.log("response", response);
        // const data = await response.json();

        const back_page_response = await fetch("/api/exam/fetchImage", {
          method: "POST",
          headers: {
            "Content-Type": "application/json",
            "Authorization": `Bearer ${token}`,
          },
          body: JSON.stringify({ side: "back", file_name: back_page }),
        });
        // const data2 = await responseImage.json();
        // console.log(data2);
        let blob = await back_page_response.blob();
        let url = URL.createObjectURL(blob);
        setBackSrc(url);

        const front_page_response = await fetch("/api/exam/fetchImage", {
          method: "POST",
          headers: {
            "Content-Type": "application/json",
            "Authorization": `Bearer ${token}`,
          },
          body: JSON.stringify({ side: "front", file_name: front_page }),
        });
        // const data2 = await responseImage.json();
        // console.log(data2);
        blob = await front_page_response.blob();
        url = URL.createObjectURL(blob);
        setFrontSrc(url);

        // setExamFileId(front_page);
      } catch (error) {
        console.error("Failed to fetch exam:", error);
      }
    };

    fetchExam();
  }, [student_id, examFileId, getAccessTokenSilently, isAuthenticated]);

  return (
    <div className="App">
      <div className="main-content">
        <h1>View Exam</h1>

        {backSrc ? (
          <img
            src={backSrc}
            alt="Student Answers"
            style={{
              maxWidth: "30%",
              height: "auto",
            }}
          />
        ) : (
          <p>Loading image...</p>
        )}
        {frontSrc ? (
          <img
            src={frontSrc}
            alt="Student ID"
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
