import React, { useEffect, useState } from "react";
import { useLocation, useNavigate } from "react-router-dom";
import { Progress } from "../../components/ui/progress"; // Importing the Progress component from Shadcn UI
import { Button } from "../../components/ui/button"; // Importing the Button component from Shadcn UI
import "../../css/App.css";
import { useAuth0 } from "@auth0/auth0-react";

const ViewExam = () => {
  const { isAuthenticated, getAccessTokenSilently } = useAuth0();
  const location = useLocation();
  const navigate = useNavigate();
  const { student_id, front_page, back_page } = location.state || {};
  const [frontSrc, setFrontSrc] = useState("");
  const [backSrc, setBackSrc] = useState("");
  const [loadingProgress, setLoadingProgress] = useState({ front: 0, back: 0 });

  useEffect(() => {
    const fetchExam = async () => {
      const token = await getAccessTokenSilently(); // Get the token
      if (!student_id) {
        console.log("Student ID is missing");
        return;
      }
      try {
        const loadImage = async (side, file_name, setSrc) => {
          const response = await fetch("/api/exam/fetchImage", {
            method: "POST",
            headers: {
              "Content-Type": "application/json",
              "Authorization": `Bearer ${token}`,
            },
            body: JSON.stringify({ side, file_name }),
          });

          let blob = await response.blob();
          let url = URL.createObjectURL(blob);

          const image = new Image();
          image.src = url;

          image.onload = () => {
            setSrc(url);
            setLoadingProgress((prev) => ({
              ...prev,
              [side]: 100,
            }));
          };

          image.onerror = () => {
            console.error(`Failed to load ${side} image.`);
          };

          const reader = new FileReader();
          reader.onloadstart = () => setLoadingProgress((prev) => ({
            ...prev,
            [side]: 0,
          }));

          reader.onprogress = (e) => {
            if (e.lengthComputable) {
              const progress = (e.loaded / e.total) * 100;
              setLoadingProgress((prev) => ({
                ...prev,
                [side]: progress,
              }));
            }
          };

          reader.onloadend = () => {
            setLoadingProgress((prev) => ({
              ...prev,
              [side]: 100,
            }));
          };

          reader.readAsDataURL(blob);
        };

        await loadImage("front", front_page, setFrontSrc);
        await loadImage("back", back_page, setBackSrc);
      } catch (error) {
        console.error("Failed to fetch exam:", error);
      }
    };

    fetchExam();
  }, [student_id, front_page, back_page, getAccessTokenSilently, isAuthenticated]);

  return (
    <div className="App">
      <div className="main-content">
        <div className="flex flex-col items-center mt-8 space-y-8">
          {!frontSrc && (
            <div className="flex flex-col items-center">
              <p>Loading front page...</p>
              <Progress value={loadingProgress.front} className="w-80" style={{ '--progress-bar-color': 'hsl(var(--primary))' }} />
            </div>
          )}
          {frontSrc && (
            <img
              src={frontSrc}
              alt="Student ID"
              style={{
                maxWidth: "30%",
                height: "auto",
                marginBottom: "1rem",
              }}
            />
          )}

          {!backSrc && (
            <div className="flex flex-col items-center">
              <p>Loading back page...</p>
              <Progress value={loadingProgress.back} className="w-80" style={{ '--progress-bar-color': 'hsl(var(--primary))' }} />
            </div>
          )}
          {backSrc && (
            <img
              src={backSrc}
              alt="Student Answers"
              style={{
                maxWidth: "30%",
                height: "auto",
                marginBottom: "1rem",
              }}
            />
          )}

          <Button onClick={() => navigate(-1)} className="save-changes-btn">
            Go Back
          </Button>
        </div>
      </div>
    </div>
  );
};

export default ViewExam;


