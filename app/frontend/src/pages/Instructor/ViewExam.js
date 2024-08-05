import React, { useEffect, useState } from "react";
import { useLocation, useNavigate } from "react-router-dom";
import "../../css/App.css";
import ExamViewDialog from "../../components/ExamViewDialog";
import { useAuth0 } from "@auth0/auth0-react";

const ViewExam = () => {
  const { isAuthenticated, getAccessTokenSilently } = useAuth0();
  const location = useLocation();
  const navigate = useNavigate();
  let { student_id, exam_id, front_page, back_page, original_front_page, original_back_page } = location.state || {};
  const [frontSrc, setFrontSrc] = useState("");
  const [backSrc, setBackSrc] = useState("");
  const [originalBack, setOriginalBack] = useState("");
  const [originalFront, setOriginalFront] = useState("");

  useEffect(() => {
    const fetchExam = async () => {
      const token = await getAccessTokenSilently();
      if (!student_id) {
        console.log("Student ID is missing");
        return;
      }
      try {
        const path = `../../uploads/Students/exam_id_${exam_id}/student_id_${student_id}/`;
        if (front_page === undefined || back_page === undefined) {
          // Them being undefined we are accessing them after the results have been saved
          // This means the images will be accessed from the uploads folder and not the omr
          front_page = path + "front_page.png";
          back_page = path + "back_page.png";
          original_back_page = path + "original_back_page.png";
          original_front_page = path + "original_front_page.png";
        }

        console.log("original_back_page", original_back_page);
        console.log("original_front_page", original_front_page);
        console.log("front_page", front_page);
        console.log("back_page", back_page);

        const back_page_response = await fetch("/api/exam/fetchImage", {
          method: "POST",
          headers: {
            "Content-Type": "application/json",
            Authorization: `Bearer ${token}`,
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
            Authorization: `Bearer ${token}`,
          },
          body: JSON.stringify({ side: "front", file_name: front_page }),
        });
        blob = await front_page_response.blob();
        url = URL.createObjectURL(blob);
        setFrontSrc(url);

        const original_back_page_response = await fetch("/api/exam/fetchImage", {
          method: "POST",
          headers: {
            "Content-Type": "application/json",
            Authorization: `Bearer ${token}`,
          },
          body: JSON.stringify({ side: "back", file_name: original_back_page }),
        });
        blob = await original_back_page_response.blob();
        url = URL.createObjectURL(blob);
        setOriginalBack(url);

        const original_front_page_response = await fetch("/api/exam/fetchImage", {
          method: "POST",
          headers: {
            "Content-Type": "application/json",
            Authorization: `Bearer ${token}`,
          },
          body: JSON.stringify({ side: "front", file_name: original_front_page }),
        });
        blob = await original_front_page_response.blob();
        url = URL.createObjectURL(blob);
        setOriginalFront(url);
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
        <ExamViewDialog frontSrc={frontSrc} backSrc={backSrc} buttonText={"View Scanned Exams"} />
        <ExamViewDialog frontSrc={originalFront} backSrc={originalBack} buttonText={"View Original Exams"} />
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
