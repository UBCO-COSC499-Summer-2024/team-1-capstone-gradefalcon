import { useEffect, useState } from "react";
import { ChevronLeft, FlagIcon } from "lucide-react";
import { useNavigate, useLocation } from "react-router-dom";
import { useAuth0 } from "@auth0/auth0-react";
import { Table, TableHeader, TableRow, TableHead, TableBody, TableCell } from "../../components/ui/table";
import { Card, CardHeader, CardTitle, CardContent } from "../../components/ui/card";
import { Button } from "../../components/ui/button";

export default function ViewExamDetails() {
  const { user, getAccessTokenSilently } = useAuth0();
  const [examDetails, setExamDetails] = useState({
    exam_title: "Sample Exam",
    course_name: "Sample Course",
    grade: 89,
  });
  const [canViewExam, setCanViewExam] = useState(false);
  const [canViewAnswers, setCanViewAnswers] = useState(false);
  const [frontSrc, setFrontSrc] = useState("");
  const [backSrc, setBackSrc] = useState("");
  const [answers, setAnswers] = useState([]);

  const navigate = useNavigate();
  const location = useLocation();
  const { exam_id } = location.state;

  // NOTE FOR FRONTEND:
  // You can access canViewExam and canViewAnswers states so that
  // you can conditionally render the exam and answers based on the values.

  useEffect(() => {
    const fetchStudentExamDetails = async () => {
      try {
        const token = await getAccessTokenSilently();
        const response = await fetch(`/api/exam/getStudentAttempt/${exam_id}`, {
          method: "GET",
          headers: {
            "Content-Type": "application/json",
            Authorization: `Bearer ${token}`,
          },
          credentials: "include",
        });
        if (response.ok) {
          const data = await response.json();
          setExamDetails(data.exam);
          setCanViewExam(data.exam.viewing_options.canViewExam);
          setCanViewAnswers(data.exam.viewing_options.canViewAnswers);
        } else {
          console.error("Failed to fetch exam details");
        }
        
      } catch (err) {
        console.error("Error fetching exam details:", err);
      }
    };

    const fetchStudentExam = async () => {
      try {
        const token = await getAccessTokenSilently();
        const front_page_response = await fetch(`/api/exam/fetchStudentExam/${exam_id}`, {
          method: "POST",
          headers: {
            "Content-Type": "application/json",
            Authorization: `Bearer ${token}`,
          },
          credentials: "include",
          body: JSON.stringify({ page: "front_page.png" }),
        });
        if (front_page_response.ok) {
          let blob = await front_page_response.blob();
          let url = URL.createObjectURL(blob);
          setFrontSrc(url);
        } else {
          console.error("Failed to fetch exam details");
        }

        const back_page_response = await fetch(`/api/exam/fetchStudentExam/${exam_id}`, {
          method: "POST",
          headers: {
            "Content-Type": "application/json",
            Authorization: `Bearer ${token}`,
          },
          credentials: "include",
          body: JSON.stringify({ page: "back_page.png" }),
        });
        if (back_page_response.ok) {
          let blob = await back_page_response.blob();
          let url = URL.createObjectURL(blob);
          setBackSrc(url);
        } else {
          console.error("Failed to fetch exam details");
        }   
      } catch (err) {
        console.error("Error fetching exam:", err);
      }
    };

    const fetchSolution = async () => {
      try {
        const token = await getAccessTokenSilently();
        const response = await fetch(`/api/exam/fetchSolution/${exam_id}`, {
          method: "POST",
          headers: {
            "Content-Type": "application/json",
            Authorization: `Bearer ${token}`,
          },
          credentials: "include",
        });
        if (response.ok) {
          const data = await response.json();
          console.log("data", data);
          setAnswers(data);
        } else {
          console.error("Failed to fetch answers");
        }
      } catch (err) {
        console.error("Error fetching answers:", err);
      }
    };

    fetchStudentExamDetails();
    fetchStudentExam();
    fetchSolution();
  }, [getAccessTokenSilently, user.sub, exam_id]);

  return (
    <div className="flex flex-col gap-4 h-screen">
      <div className="flex justify-between items-center w-full mb-4">
        <Button className="bg-primary text-white flex items-center" onClick={() => navigate(-1)}>
          <ChevronLeft className="w-4 h-4" />
        </Button>
      </div>
      <div className="flex-1">
        <Card className="bg-white border rounded h-full">
          <CardHeader className="flex justify-between px-6 py-4">
            <CardTitle className="mb-2">Exam Details</CardTitle>
          </CardHeader>
          <CardContent className="flex-1">
            <div className="flex justify-end mb-4">
              <Button onClick={() => navigate("/SubmitReport")} className="bg-primary text-white flex items-center">
                <FlagIcon className="w-4 h-4 mr-1" />
                Report
              </Button>
            </div>
            <Table>
              <TableHeader>
                <TableRow>
                  <TableHead>Exam Name</TableHead>
                  <TableHead>Course Name</TableHead>
                  <TableHead>Grade</TableHead>
                </TableRow>
              </TableHeader>
              <TableBody>
                <TableRow>
                  <TableCell>{examDetails.exam_title}</TableCell>
                  <TableCell>{examDetails.course_name}</TableCell>
                  <TableCell>{examDetails.grade}</TableCell>
                </TableRow>
              </TableBody>
            </Table>
        {canViewExam ? (
          <div style={{ display: "flex", gap: "20px" }}>
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
              <p>Loading front image...</p>
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
              <p>Loading back image...</p>
            )}
          </div>
        ) : (
          <p>Instructor has chosen not to show your attempt</p>
        )}
        {canViewAnswers ? (
              <div className="mt-4">
                <h3 className="text-lg font-bold mb-2">Solutions</h3>
                <Table>
                  <TableHeader>
                    <TableRow>
                      <TableHead>Question</TableHead>
                      <TableHead>Answer</TableHead>
                    </TableRow>
                  </TableHeader>
                  <TableBody>
                    {answers.map((answer, index) => (
                      <TableRow key={index}>
                        <TableCell>{index+1}</TableCell>
                        <TableCell>{answer}</TableCell>
                      </TableRow>
                    ))}
                  </TableBody>
                </Table>
              </div>
            ) : <p>Instructor has chosen not to show the correct answers for this exam</p>}
          </CardContent>
        </Card>
      </div>
    </div>
  );
}
