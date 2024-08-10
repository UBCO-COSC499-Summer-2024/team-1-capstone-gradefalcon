import React, { useEffect, useState } from "react";
import { useNavigate } from "react-router-dom";
import { useAuth0 } from "@auth0/auth0-react";
import { Button } from "../../components/ui/button";
import { Card, CardHeader, CardTitle, CardContent } from "../../components/ui/card";
import { Textarea } from "../../components/ui/textarea";
import { ArrowUpRightIcon, ChevronLeftIcon, ExclamationCircleIcon } from "@heroicons/react/24/solid";
import { Badge } from "../../components/ui/badge";
import { Label } from "../../components/ui/label";
import { TooltipProvider } from "../../components/ui/tooltip";
import { Select, SelectTrigger, SelectValue, SelectContent, SelectItem } from "../../components/ui/select";
import { useToast } from "../../components/ui/use-toast";
import { Toaster } from "../../components/ui/toaster";
import { Alert, AlertDescription, AlertTitle } from "../../components/ui/alert";

const SubmitReport = () => {
  const navigate = useNavigate();
  const { getAccessTokenSilently } = useAuth0();
  const [exams, setExams] = useState([]);
  const [selectedExam, setSelectedExam] = useState(null);
  const [grade, setGrade] = useState("");
  const [reportText, setReportText] = useState("");
  const [totalMarks, setTotalMarks] = useState("");
  const [frontSrc, setFrontSrc] = useState("");
  const [backSrc, setBackSrc] = useState("");
  const [isSubmitted, setIsSubmitted] = useState(false);
  const [showAlert, setShowAlert] = useState(false);
  const [error, setError] = useState("");
  const [studentReports, setStudentReports] = useState([]);
  const { toast } = useToast();

  useEffect(() => {
    const fetchExamsAndReports = async () => {
      try {
        const token = await getAccessTokenSilently();

        // Fetch the exams
        const examsResponse = await fetch(`/api/exam/student/exams`, {
          method: "GET",
          headers: {
            "Content-Type": "application/json",
            Authorization: `Bearer ${token}`,
          },
          credentials: "include",
        });
        if (examsResponse.ok) {
          const data = await examsResponse.json();
          setExams(data.exams);
        } else {
          console.error("Failed to fetch exams");
        }

        // Fetch the reports
        const reportsResponse = await fetch(`/api/reports/student-reports`, {
          method: "GET",
          headers: {
            "Content-Type": "application/json",
            Authorization: `Bearer ${token}`,
          },
          credentials: "include",
        });
        if (reportsResponse.ok) {
          const reportData = await reportsResponse.json();
          setStudentReports(reportData);
        } else {
          console.error("Failed to fetch student reports");
        }
      } catch (err) {
        console.error("Error fetching exams or reports:", err);
      }
    };

    fetchExamsAndReports();
  }, [getAccessTokenSilently]);

  const handleExamChange = async (value) => {
    try {
      const token = await getAccessTokenSilently();
      const response = await fetch(`/api/exam/getStudentAttempt/${value}`, {
        method: "GET",
        headers: {
          "Content-Type": "application/json",
          Authorization: `Bearer ${token}`,
        },
        credentials: "include",
      });

      if (response.ok) {
        const data = await response.json();
        setSelectedExam(data.exam);
        setGrade(data.exam.grade);
        setTotalMarks(data.exam.total_marks);

      } else {
        console.error("Failed to fetch exam details");
      }

      const frontPageResponse = await fetch(`/api/exam/fetchStudentExam/${value}`, {
        method: "POST",
        headers: {
          "Content-Type": "application/json",
          Authorization: `Bearer ${token}`,
        },
        credentials: "include",
        body: JSON.stringify({ page: "front_page.png" }),
      });
      if (frontPageResponse.ok) {
        const blob = await frontPageResponse.blob();
        const url = URL.createObjectURL(blob);
        setFrontSrc(url);
      } else {
        setFrontSrc(null);
        console.error("No front image found");
      }

      const backPageResponse = await fetch(`/api/exam/fetchStudentExam/${value}`, {
        method: "POST",
        headers: {
          "Content-Type": "application/json",
          Authorization: `Bearer ${token}`,
        },
        credentials: "include",
        body: JSON.stringify({ page: "back_page.png" }),
      });
      if (backPageResponse.ok) {
        const blob = await backPageResponse.blob();
        const url = URL.createObjectURL(blob);
        setBackSrc(url);
      } else {
        setBackSrc(null);
        console.error("No back image found");
      }
    } catch (error) {
      console.error("Error fetching exam details or images:", error);
    }
  };

  const handleReportSubmit = async (event) => {
    event.preventDefault();

    if (!selectedExam) {
      setError("Please select an exam.");
      setShowAlert(true);
      return;
    }

    if (!reportText.trim()) {
      setError("Please enter a message.");
      setShowAlert(true);
      return;
    }

    // Check if there's a pending report for this exam
    const pendingReport = studentReports.find(
      (report) => report.exam_id === selectedExam.exam_id && report.status === "Pending"
    );

    if (pendingReport) {
      setError("You already have a pending report for this exam.");
      setShowAlert(true);
      return;
    }

    try {
      const token = await getAccessTokenSilently();
      const response = await fetch("/api/reports/submit", {
        method: "POST",
        headers: {
          "Content-Type": "application/json",
          Authorization: `Bearer ${token}`,
        },
        body: JSON.stringify({
          exam_id: selectedExam.exam_id,
          report_text: reportText,
        }),
      });

      if (response.ok) {
        setIsSubmitted(true);
        toast({
          title: "Success",
          description: "Report submitted successfully.",
        });
        setTimeout(() => {
          navigate("/studentReportsDashboard");
        }, 1000);
      } else {
        console.error("Failed to submit report");
      }
    } catch (error) {
      console.error("Error submitting report:", error);
    }
  };

  return (
    <>
      <main className="flex flex-col gap-4 p-2">
        <div className="w-full mx-auto grid flex-1 auto-rows-max gap-8">
          <div className="flex items-center gap-4">
            <Button
              variant="outline"
              size="icon"
              className="h-10 w-10"
              onClick={() => window.history.back()}
            >
              <ChevronLeftIcon className="h-4 w-4" />
              <span className="sr-only">Back</span>
            </Button>
            <h1 className="text-2xl font-semibold">Make a Report</h1>
          </div>

          {showAlert && (
            <div className="w-full flex justify-center">
              <div className="grid gap-8 md:grid-cols-1 lg:grid-cols-1 max-w-2xl">
                <Alert className="mb-4">
                  <ExclamationCircleIcon className="h-4 w-4" />
                  <AlertTitle>Heads up!</AlertTitle>
                  <AlertDescription>{error}</AlertDescription>
                </Alert>
              </div>
            </div>
          )}

          <div className="grid flex-1 gap-4 overflow-auto p-4 md:grid-cols-2 lg:grid-cols-3">
            <div className="grid gap-8 md:grid-cols-1 lg:grid-cols-1">
              <div className="grid auto-rows-max items-start gap-8">
                <Card className="bg-white border rounded-lg p-6">
                  <CardHeader>
                    <CardTitle>Select Exam</CardTitle>
                  </CardHeader>
                  <CardContent>
                    <div className="grid gap-3">
                      <Label htmlFor="exam">Exam</Label>
                      <Select onValueChange={handleExamChange}>
                        <SelectTrigger id="exam" aria-label="Select exam">
                          <SelectValue placeholder="Select exam" />
                        </SelectTrigger>
                        <SelectContent>
                          {exams.map((exam) => (
                            <SelectItem key={exam.exam_id} value={exam.exam_id}>
                              {exam.exam_title}
                            </SelectItem>
                          ))}
                        </SelectContent>
                      </Select>
                    </div>
                  </CardContent>
                </Card>

                {selectedExam && (
                  <Card className="bg-white border rounded-lg p-6">
                    <CardHeader>
                      <CardTitle>Report</CardTitle>
                    </CardHeader>
                    <CardContent>
                      <div className="grid gap-6">
                        <div className="grid gap-3">
                          <Label htmlFor="grade">Grade</Label>
                          <Label id="grade">{grade} /<span className="text-gray-500">{totalMarks}</span></Label>  {/* */}
                        </div>
                        <div className="grid gap-3">
                          <Label htmlFor="content">Message</Label>
                          <Textarea
                            id="content"
                            placeholder="comments..."
                            className="min-h-[9.5rem]"
                            value={reportText}
                            onChange={(e) => setReportText(e.target.value)}
                            disabled={isSubmitted}
                          />
                          <TooltipProvider>
                            <Button
                              type="submit"
                              size="sm"
                              className="ml-auto gap-1.5"
                              onClick={handleReportSubmit}
                              disabled={isSubmitted}
                            >
                              Submit
                              <ArrowUpRightIcon className="h-3.5 w-3.5" />
                            </Button>
                          </TooltipProvider>
                        </div>
                      </div>
                    </CardContent>
                  </Card>
                )}
              </div>
            </div>

            {selectedExam && (
              <div className="relative flex h-full min-h-[50vh] flex-col rounded-xl bg-muted/50 p-4 lg:col-span-2">
                <Badge variant="outline" className="absolute right-3 top-3">
                  Exam
                </Badge>

                <div style={{ display: "flex", gap: "20px" }}>
                {frontSrc ? (
                  <img
                    src={frontSrc}
                    alt="Student Exam Front Page"
                    style={{
                      maxWidth: "50%",
                      height: "auto",
                    }}
                  />
                ) : (
                  <p>No front image found</p>
                )}
                {backSrc ? (
                  <img
                    src={backSrc}
                    alt="Student Exam Back Page"
                    style={{
                      maxWidth: "50%",
                      height: "auto",
                    }}
                  />
                ) : (
                  <p>No back image found</p>
                )}
              </div>
              </div>
            )}
          </div>
        </div>
      </main>
      <Toaster /> {/* Adding the Toaster component */}
    </>
  );
};

export default SubmitReport;
