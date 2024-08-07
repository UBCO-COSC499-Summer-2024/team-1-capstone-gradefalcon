import React, { useEffect, useState } from "react";
import { useNavigate } from "react-router-dom";
import { useAuth0 } from "@auth0/auth0-react";
import { Button } from "../../components/ui/button";
import { Card, CardHeader, CardTitle, CardContent } from "../../components/ui/card";
import { Input } from "../../components/ui/input";
import { Textarea } from "../../components/ui/textarea";
import { ArrowUpRightIcon, ChevronLeftIcon } from "@heroicons/react/24/solid";
import { Badge } from "../../components/ui/badge";
import { Label } from "../../components/ui/label";
import { TooltipProvider, Tooltip, TooltipTrigger, TooltipContent } from "../../components/ui/tooltip";
import { Select, SelectTrigger, SelectValue, SelectContent, SelectItem } from "../../components/ui/select";
import { AspectRatio } from "../../components/ui/aspect-ratio";

const SubmitReport = () => {
  const navigate = useNavigate();
  const { getAccessTokenSilently } = useAuth0();
  const [exams, setExams] = useState([]);
  const [selectedExam, setSelectedExam] = useState(null);
  const [grade, setGrade] = useState("");
  const [reportText, setReportText] = useState("");
  const [frontSrc, setFrontSrc] = useState("");
  const [backSrc, setBackSrc] = useState("");
  const [isSubmitted, setIsSubmitted] = useState(false);

  useEffect(() => {
    // Fetch the exams for the student
    const fetchExams = async () => {
      try {
        const token = await getAccessTokenSilently();
        const response = await fetch(`/api/exam/student/exams`, {
          method: "GET",
          headers: {
            "Content-Type": "application/json",
            Authorization: `Bearer ${token}`,
          },
          credentials: "include",
        });
        if (response.ok) {
          const data = await response.json();
          setExams(data.exams);
        } else {
          console.error("Failed to fetch exams");
        }
      } catch (err) {
        console.error("Error fetching exams:", err);
      }
    };

    fetchExams();
  }, [getAccessTokenSilently]);

  const handleExamChange = async (value) => {
    const exam = exams.find((ex) => ex.exam_id === value);
    if (exam) {
      setSelectedExam(exam);
      setGrade(exam.grade);

      // Fetch the images for the selected exam
      try {
        const token = await getAccessTokenSilently();
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
          console.error("Failed to fetch front page image");
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
          console.error("Failed to fetch back page image");
        }
      } catch (error) {
        console.error("Error fetching exam images:", error);
      }
    }
  };

  const handleReportSubmit = async () => {
    try {
      const token = await getAccessTokenSilently();
      const response = await fetch("/api/report/submit", {
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
        console.log("Report submitted successfully");
      } else {
        console.error("Failed to submit report");
      }
    } catch (error) {
      console.error("Error submitting report:", error);
    }
  };

  return (
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
                        <Label id="grade">{grade}</Label>
                      </div>
                      <div className="grid gap-3">
                        <Label htmlFor="content">Message</Label>
                        <Textarea
                          id="content"
                          placeholder="Student comments..."
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
                    alt="Student Exam Back Page"
                    style={{
                      maxWidth: "30%",
                      height: "auto",
                    }}
                  />
                ) : (
                  <p>Loading back image...</p>
                )}
              </div>
            </div>
          )}
        </div>
      </div>
    </main>
  );
};

export default SubmitReport;
