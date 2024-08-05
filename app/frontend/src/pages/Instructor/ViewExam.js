import React, { useEffect, useState } from "react";
import { useLocation, useNavigate } from "react-router-dom";
import "../../css/App.css";
import { useAuth0 } from "@auth0/auth0-react";
import { Button } from "../../components/ui/button";
import { ChevronLeftIcon } from "@heroicons/react/20/solid"; 

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
    <main className="flex flex-col gap-4 p-2">
      <div className="w-full mx-auto flex items-center gap-8">
        <Button
          variant="outline"
          size="icon"
          className="h-10 w-10"
          onClick={() => navigate(-1)}
        >
          <ChevronLeftIcon className="h-4 w-4" />
          <span className="sr-only">Back</span>
        </Button>
        <h1 className="flex-1 text-3xl font-semibold tracking-tight">View Exam</h1>
      </div>
      <div className="main-content flex justify-center">
        <div className="image-container flex flex-col items-center gap-4">
          {frontSrc ? (
            <img
              src={frontSrc}
              alt="Front Page"
              style={{
                maxWidth: "30%",
                height: "auto",
              }}
            />
          ) : (
            <p>Loading front page image...</p>
          )}
          {backSrc ? (
            <img
              src={backSrc}
              alt="Back Page"
              style={{
                maxWidth: "30%",
                height: "auto",
              }}
            />
          ) : (
            <p>Loading back page image...</p>
          )}
        </div>
      </div>
    </main>
  );
};

export default ViewExam;