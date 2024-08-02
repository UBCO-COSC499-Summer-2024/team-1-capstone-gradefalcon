import { useEffect, useState } from "react";
import { ChevronLeft, ChevronRight } from "lucide-react";
import { useNavigate, useLocation } from "react-router-dom";
import { useAuth0 } from "@auth0/auth0-react";
import { Card, CardHeader, CardTitle, CardContent, CardDescription } from "../../components/ui/card";
import { Button } from "../../components/ui/button";
import { AspectRatio } from "../../components/ui/aspect-ratio"; // Import the AspectRatio component

export default function ViewExamDetails() {
  const { user, getAccessTokenSilently } = useAuth0();
  const [examDetails, setExamDetails] = useState({
    exam_title: "Sample Exam",
    course_name: "Sample Course",
    grade: 89,
  });
  const [canViewExam, setCanViewExam] = useState(false);
  const [canViewAnswers, setCanViewAnswers] = useState(false);

  const navigate = useNavigate();
  const location = useLocation();
  const { exam_id } = location.state;

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

    fetchStudentExamDetails();
  }, [getAccessTokenSilently, user.sub, exam_id]);

  return (
    <div className="flex flex-col gap-4 h-screen">
      <div className="flex justify-between items-center w-full mb-4">
        <Button className="bg-primary text-white flex items-center" onClick={() => navigate(-1)}>
          <ChevronLeft className="w-4 h-4" />
        </Button>
      </div>
      <div className="flex-1 flex gap-4">
        <Card className="bg-white border rounded h-full w-1/2">
          <CardHeader className="flex justify-between px-6 py-4">
            <CardTitle className="mb-2">Exam Details</CardTitle>
          </CardHeader>
          <CardContent className="flex-1">
            <div className="flex justify-end mb-4">
              <Button onClick={() => navigate("/ReportGradeStudent")} className="bg-primary text-white flex items-center">
                <ChevronRight className="w-4 h-4 mr-1" />
                Report
              </Button>
            </div>
            <div className="space-y-4">
              <div>
                <CardDescription>Exam Name:</CardDescription>
                <div>{examDetails.exam_title}</div>
              </div>
              <div>
                <CardDescription>Course Name:</CardDescription>
                <div>{examDetails.course_name}</div>
              </div>
              <div>
                <CardDescription>Grade:</CardDescription>
                <div>{examDetails.grade}</div>
              </div>
            </div>
          </CardContent>
        </Card>
        <div className="w-1/2 flex flex-col gap-4">
          <Card className="bg-white border rounded h-1/2">
            <CardHeader className="flex justify-between px-6 py-4">
              <CardTitle className="mb-2">Correct Solution Key</CardTitle>
            </CardHeader>
            <CardContent className="flex-1">
              <AspectRatio ratio={16 / 9}>
                <div className="bg-gray-200 flex items-center justify-center">
                  {/* Placeholder content for the solution key */}
                  Correct Solution Key Content
                </div>
              </AspectRatio>
            </CardContent>
          </Card>
          <Card className="bg-white border rounded h-1/2">
            <CardHeader className="flex justify-between px-6 py-4">
              <CardTitle className="mb-2">Student's Attempt</CardTitle>
            </CardHeader>
            <CardContent className="flex-1">
              <AspectRatio ratio={16 / 9}>
                <div className="bg-gray-200 flex items-center justify-center">
                  {/* Placeholder content for the student's attempt */}
                  Student's Attempt Content
                </div>
              </AspectRatio>
            </CardContent>
          </Card>
        </div>
      </div>
    </div>
  );
}
