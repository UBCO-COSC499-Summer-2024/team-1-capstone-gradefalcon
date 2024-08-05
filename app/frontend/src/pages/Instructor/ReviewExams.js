import React, { useEffect, useState } from "react";
import { useAuth0 } from "@auth0/auth0-react";
import { useLocation, useNavigate } from "react-router-dom";
import { Button } from "../../components/ui/button";
import { Card, CardContent } from "../../components/ui/card";
import { Table, TableHeader, TableBody, TableRow, TableHead, TableCell } from "../../components/ui/table";
import { Input } from "../../components/ui/input";
import { Tooltip, TooltipTrigger, TooltipContent, TooltipProvider } from "../../components/ui/tooltip";
import {EyeIcon} from "@heroicons/react/24/solid";
import { useToast } from "../../components/ui/use-toast";
import { Toaster } from "../../components/ui/toaster";
import "../../css/App.css";

const ReviewExams = () => {
  const { getAccessTokenSilently } = useAuth0();
  const location = useLocation();
  const [studentScores, setStudentScores] = useState([]);
  const [totalMarks, setTotalMarks] = useState();
  const [editStudentId, setEditStudentId] = useState(null);
  const [searchQuery, setSearchQuery] = useState("");
  const [resultsCombined, setResultsCombined] = useState(false);
  const { exam_id } = location.state || {};
  const navigate = useNavigate();
  const { toast } = useToast();

  useEffect(() => {
    const fetchData = async () => {
      try {
        // Preprocess the data
        const preprocessData = async () => {
          const token = await getAccessTokenSilently();
          const response = await fetch("/api/exam/preprocessingCSV", {
            headers: {
              Authorization: `Bearer ${token}`,
            },
          });
          if (!response.ok) {
            throw new Error("Network response was not ok");
          }
          const data = await response.json();
          console.log("preprocessData", data);
        };

        // Fetch student scores for the exam
        const fetchStudentScores = async () => {
          const token = await getAccessTokenSilently();
          const response = await fetch("/api/exam/studentScores", {
            headers: {
              Authorization: `Bearer ${token}`,
            },
          });
          if (!response.ok) {
            throw new Error("Network response was not ok");
          }
          const data = await response.json();
          console.log("data", data);
          setStudentScores(data);
        };

        // Fetch the max marks for the exam
        const fetchTotalScore = async () => {
          const token = await getAccessTokenSilently();
          const response = await fetch(`/api/exam/getScoreByExamId/${exam_id}`, {
            headers: {
              Authorization: `Bearer ${token}`,
            },
          });
          if (!response.ok) {
            throw new Error("Network response was not ok");
          }
          const data = await response.json();
          setTotalMarks(data.scores[0]);
        };

        await preprocessData();
        await fetchStudentScores();
        await fetchTotalScore();

        setResultsCombined(true);
      } catch (error) {
        console.error("Error:", error);
      }
    };

    fetchData();
  }, [getAccessTokenSilently, exam_id]);

  const handleViewClick = (studentId, front_page, back_page) => {
    navigate("/ViewExam", {
      state: {
        student_id: studentId,
        exam_id: exam_id,
        front_page: front_page,
        back_page: back_page,
      },
    });
  };

  const handleScoreChange = (e, studentId) => {
    const newScore = e.target.value;
    setStudentScores((currentScores) =>
      currentScores.map((score) =>
        score.StudentID === studentId ? { ...score, Score: newScore } : score
      )
    );
  };


  const saveStudentExams = async (studentData) => {
    try {
      const token = await getAccessTokenSilently();
      const response = await fetch("/api/exam/saveStudentExams", {
        method: "POST",
        headers: {
          "Content-Type": "application/json",
          Authorization: `Bearer ${token}`,
        },
        body: JSON.stringify({ exam_id: exam_id, data: studentData }),
      });
      if (!response.ok) {
        throw new Error("saveExams Network response was not ok");
      }
      const data = await response.json();
      console.log("saveStudentExams:", data);
    } catch (error) {
      console.error("Error saving student exams:", error);
    }
  };

  const saveResults = async () => {

    try {
      saveStudentExams(studentScores);

      const token = await getAccessTokenSilently();
      const response = await fetch("/api/exam/saveResults", {
        method: "POST",
        headers: {
          "Content-Type": "application/json",
          Authorization: `Bearer ${token}`,
        },
        body: JSON.stringify({ studentScores, exam_id }),
      });
      if (!response.ok) {
        throw new Error("save results Network response was not ok");
      }
      const data = await response.json();
      toast({
        title: "Results saved! Redirecting...",
      });
      setTimeout(() => {
        navigate("/Examboard");
      }, 2000);
    } catch (error) {
      console.error("Error saving results:", error);
    }
  };

  const filteredScores = searchQuery
    ? studentScores.filter((student) => student.StudentID.toString().includes(searchQuery))
    : studentScores;

    return (
      <main className="flex flex-col gap-4 p-6">
        <div className="flex justify-between items-center w-full mb-4">
          <h1 className="text-2xl font-semibold">Review Exams</h1>
          <Input
            type="text"
            placeholder="Search by Student ID..."
            value={searchQuery}
            onChange={(e) => setSearchQuery(e.target.value)}
            className="max-w-xs"
          />
        </div>
        <div className="w-full">
          <Card className="bg-white border rounded">
            <CardContent>
              <Table>
                <TableHeader>
                  <TableRow>
                    <TableHead>Student Name</TableHead>
                    <TableHead>Student ID</TableHead>
                    <TableHead>Score/ {totalMarks}</TableHead>
                    <TableHead>View Exam</TableHead>
                  </TableRow>
                </TableHeader>
                <TableBody>
                  {filteredScores.map((student, index) => (
                    <TableRow key={index}>
                      <TableCell>{student.StudentName}</TableCell>
                      <TableCell>{student.StudentID}</TableCell>
                      <TableCell>
                        <Input
                          type="number"
                          value={student.Score}
                          max={totalMarks}
                          min="0"
                          onChange={(e) => handleScoreChange(e, student.StudentID)}
                          className="w-14 px-2 py-1"
                        />
                      </TableCell>
                      <TableCell>
                        <Button size="icon" variant="ghost" className="flex items-center justify-center hover:text-primary"
                          onClick={() =>handleViewClick(student.StudentID, student.front_page, student.back_page)}
                          >
                            <EyeIcon className="h-6 w-6" />
                        </Button>
                      </TableCell>
                    </TableRow>
                  ))}
                </TableBody>
              </Table>
            </CardContent>
          </Card>
        </div>
        <Button onClick={saveResults} className="mt-4 self-end">
          Save Results
        </Button>
        <Toaster />
      </main>
    );
  };
  

export default ReviewExams;
