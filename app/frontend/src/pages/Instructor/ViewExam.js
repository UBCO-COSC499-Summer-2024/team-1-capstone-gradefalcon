import React, { useEffect, useState } from "react";
import { useLocation, useNavigate } from "react-router-dom";
import "../../css/App.css";
import ExamViewDialog from "../../components/ExamViewDialog";
import { ChevronLeftIcon } from "@heroicons/react/20/solid";
import { Button } from "../../components/ui/button";
import { useAuth0 } from "@auth0/auth0-react";
import { Input } from "../../components/ui/input";
import { Label } from "../../components/ui/label";
import { useToast } from "../../components/ui/use-toast";

import {
  AlertDialog,
  AlertDialogAction,
  AlertDialogCancel,
  AlertDialogContent,
  AlertDialogDescription,
  AlertDialogFooter,
  AlertDialogHeader,
  AlertDialogTitle,
  AlertDialogTrigger,
} from "../../components/ui/alert-dialog";

const ViewExam = () => {
  const { isAuthenticated, getAccessTokenSilently } = useAuth0();
  const location = useLocation();
  const navigate = useNavigate();
  let { student_id, exam_id, front_page, back_page, original_front_page, original_back_page, student_name, grade, total_marks } =
    location.state || {};
  const [frontSrc, setFrontSrc] = useState("");
  const [backSrc, setBackSrc] = useState("");
  const [originalBack, setOriginalBack] = useState("");
  const [originalFront, setOriginalFront] = useState("");
  const [editableGrade, setEditableGrade] = useState(grade);
  const [displayGrade, setDisplayGrade] = useState(grade);
  const [error, setError] = useState("");

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

  const handleSave = async () => {
    if (editableGrade < 0 || editableGrade > total_marks) {
      setError(`Grade must be between 0 and ${total_marks}`);
      return;
    }

    const token = await getAccessTokenSilently();
    const response = await fetch("/api/exam/changeGrade", {
      method: "POST",
      headers: {
        "Content-Type": "application/json",
        Authorization: `Bearer ${token}`,
      },
      body: JSON.stringify({ student_id: student_id, exam_id: exam_id, grade: editableGrade }),
    });
    const data = await response.json();
    console.log("Data:", data);
    console.log("Saved grade:", editableGrade);
    setDisplayGrade(editableGrade);
  };

  return (
    <div className="App">
      <div className="main-content">
        <Button variant="outline" size="icon" className="h-10 w-10" onClick={() => window.history.back()}>
          <ChevronLeftIcon className="h-4 w-4" />
          <span className="sr-only">Back</span>
        </Button>
        <h1>View Exam</h1>
        <p>Name: {student_name}</p>
        <p>ID: {student_id}</p>
        <p>Grade: {displayGrade}</p>
        <ExamViewDialog frontSrc={frontSrc} backSrc={backSrc} buttonText={"View Scanned Exams"} />
        <ExamViewDialog frontSrc={originalFront} backSrc={originalBack} buttonText={"View Original Exams"} />

        <AlertDialog>
          <AlertDialogTrigger>
            <Button variant="destructive">Change score</Button>
          </AlertDialogTrigger>
          <AlertDialogContent>
            <AlertDialogHeader>
              <AlertDialogTitle>Changing grade</AlertDialogTitle>
              <AlertDialogDescription>
                You are now changing the grade for {student_name} with ID: {student_id}. This will be recorded.
              </AlertDialogDescription>
            </AlertDialogHeader>
            <Input type="number" value={editableGrade} onChange={(e) => setEditableGrade(e.target.value)} min={0} max={total_marks} />
            {error && <p style={{ color: "red" }}>{error}</p>}
            {/* Still need to add some frontend validation to make this prettier though it still works */}
            <AlertDialogFooter>
              <AlertDialogCancel>Cancel</AlertDialogCancel>
              <AlertDialogAction onClick={handleSave}>Save</AlertDialogAction>
            </AlertDialogFooter>
          </AlertDialogContent>
        </AlertDialog>
      </div>
    </div>
  );
};

export default ViewExam;
