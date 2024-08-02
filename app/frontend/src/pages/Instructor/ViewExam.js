import React, { useEffect, useState } from "react";
import { useLocation, useNavigate } from "react-router-dom";
import "../../css/App.css";
import { useAuth0 } from "@auth0/auth0-react";

const ViewExam = () => {
  const { isAuthenticated, getAccessTokenSilently } = useAuth0();
  const location = useLocation();
  const navigate = useNavigate();
  let { student_id, exam_id, front_page, back_page } = location.state || {};
  const [frontSrc, setFrontSrc] = useState("");
  const [backSrc, setBackSrc] = useState("");

  useEffect(() => {
    const fetchExam = async () => {
      const token = await getAccessTokenSilently();
      if (!student_id) {
        console.log("Student ID is missing");
        return;
      }
      try {
        if (front_page === undefined || back_page === undefined) {
          front_page = `../../../../../uploads/Students/exam_id_${exam_id}/student_id_${student_id}/front_page.png`;
          back_page = `../../../../../uploads/Students/exam_id_${exam_id}/student_id_${student_id}/back_page.png`;
        }
        const back_page_response = await fetch("/api/exam/fetchImage", {
          method: "POST",
          headers: {
            "Content-Type": "application/json",
            "Authorization": `Bearer ${token}`,
          },
          body: JSON.stringify({ side: "back", file_name: back_page }),
        });
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
        blob = await front_page_response.blob();
        url = URL.createObjectURL(blob);
        setFrontSrc(url);
      } catch (error) {
        console.error("Failed to fetch exam:", error);
      }
    };

    fetchExam();
  }, [student_id, getAccessTokenSilently, isAuthenticated]);

  return (
    <div className="App">
      <div className="main-content">
        <h1>View Exam</h1>
        <div className="image-container">
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
        </div>
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