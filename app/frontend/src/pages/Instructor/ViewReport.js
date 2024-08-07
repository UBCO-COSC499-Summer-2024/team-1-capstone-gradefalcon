import React, { useState, useEffect } from "react";
import { Badge } from "../../components/ui/badge";
import { Label } from "../../components/ui/label";
import { Textarea } from "../../components/ui/textarea";
import { TooltipProvider, Tooltip, TooltipTrigger, TooltipContent } from "../../components/ui/tooltip";
import { Button } from "../../components/ui/button";
import { Input } from "../../components/ui/input";
import {  ArrowDownLeftIcon, ChevronLeftIcon } from "@heroicons/react/20/solid";
import { Card, CardHeader, CardTitle, CardContent } from "../../components/ui/card";
import { useToast } from "../../components/ui/use-toast";
import { Toaster } from "../../components/ui/toaster";
import { useNavigate, useParams } from "react-router-dom";
import { useAuth0 } from "@auth0/auth0-react";

const ViewReport = () => {
  const [report, setReport] = useState(null);
  const [grade, setGrade] = useState("");
  const [reply, setReply] = useState("");
  const [frontSrc, setFrontSrc] = useState("");
  const [backSrc, setBackSrc] = useState("");
  const [originalFront, setOriginalFront] = useState("");
  const [originalBack, setOriginalBack] = useState("");
  const navigate = useNavigate();
  const { report_id } = useParams(); // Get report_id from route params
  const { getAccessTokenSilently } = useAuth0(); // Get the token

  useEffect(() => {
    // Fetch the report data from the API
    const fetchReport = async () => {
      try {
        const token = await getAccessTokenSilently();
        const response = await fetch(`/api/reports/${report_id}`, {
          method: "GET",
          headers: {
            "Content-Type": "application/json",
            "Authorization": `Bearer ${token}`, // Include the token in the request
          },
          credentials: "include",
        });
        if (response.ok) {
          const data = await response.json();
          setReport(data);
          setGrade(data.grade || "");

          // Fetch images related to the report
          await fetchImages(data.student_id, data.exam_id, token);
        } else {
          console.error("Failed to fetch report");
        }
      } catch (error) {
        console.error("Error fetching report:", error);
      }
    };

    fetchReport();
  }, [report_id, getAccessTokenSilently]);

  const fetchImages = async (student_id, exam_id, token) => {
    try {
      const path = `../../uploads/Students/exam_id_${exam_id}/student_id_${student_id}/`;

      const frontPageResponse = await fetch("/api/exam/fetchImage", {
        method: "POST",
        headers: {
          "Content-Type": "application/json",
          Authorization: `Bearer ${token}`,
        },
        body: JSON.stringify({ side: "front", file_name: `${path}front_page.png` }),
      });
      const frontBlob = await frontPageResponse.blob();
      setFrontSrc(URL.createObjectURL(frontBlob));

      const backPageResponse = await fetch("/api/exam/fetchImage", {
        method: "POST",
        headers: {
          "Content-Type": "application/json",
          Authorization: `Bearer ${token}`,
        },
        body: JSON.stringify({ side: "back", file_name: `${path}back_page.png` }),
      });
      const backBlob = await backPageResponse.blob();
      setBackSrc(URL.createObjectURL(backBlob));

      const originalFrontResponse = await fetch("/api/exam/fetchImage", {
        method: "POST",
        headers: {
          "Content-Type": "application/json",
          Authorization: `Bearer ${token}`,
        },
        body: JSON.stringify({ side: "front", file_name: `${path}original_front_page.png` }),
      });
      const originalFrontBlob = await originalFrontResponse.blob();
      setOriginalFront(URL.createObjectURL(originalFrontBlob));

      const originalBackResponse = await fetch("/api/exam/fetchImage", {
        method: "POST",
        headers: {
          "Content-Type": "application/json",
          Authorization: `Bearer ${token}`,
        },
        body: JSON.stringify({ side: "back", file_name: `${path}original_back_page.png` }),
      });
      const originalBackBlob = await originalBackResponse.blob();
      setOriginalBack(URL.createObjectURL(originalBackBlob));
    } catch (error) {
      console.error("Error fetching images:", error);
    }
  };

  const handleGradeChange = (e) => {
    setGrade(e.target.value);
  };

  const handleReplyChange = (e) => {
    setReply(e.target.value);
  };

  const handleReplySubmit = async (e) => {
    e.preventDefault();

    try {
      const token = await getAccessTokenSilently();
      
      // Call the changeGrade API to update the grade
      const changeGradeResponse = await fetch("/api/exam/changeGrade", {
        method: "POST",
        headers: {
          "Content-Type": "application/json",
          Authorization: `Bearer ${token}`,
        },
        body: JSON.stringify({
          student_id: report.student_id,
          exam_id: report.exam_id,
          grade,
        }),
      });

      if (!changeGradeResponse.ok) {
        console.error("Failed to change grade");
        return;
      }

      // Handle the reply submission and close the report
      const replyResponse = await fetch(`/api/reports/${report_id}/reply`, {
        method: "PUT",
        headers: {
          "Content-Type": "application/json",
          Authorization: `Bearer ${token}`,
        },
        body: JSON.stringify({ reply_text: reply }),
      });

      if (replyResponse.ok) {
        navigate("/reports"); // Redirect to the reports page after closing the report
      } else {
        console.error("Failed to submit reply");
      }
    } catch (error) {
      console.error("Error submitting reply:", error);
    }
  };
  
  // Reopen the report
  const handleReopenReport = async () => {
    try {
      const token = await getAccessTokenSilently();
      const response = await fetch(`/api/reports/${report_id}/reopen`, {
        method: "PUT",
        headers: {
          "Content-Type": "application/json",
          Authorization: `Bearer ${token}`,
        },
      });
  
      if (response.ok) {
        // Fetch the updated report data to reflect the new status
        const updatedReport = await response.json();
        setReport(updatedReport);
      } else {
        console.error("Failed to reopen the report");
      }
    } catch (error) {
      console.error("Error reopening the report:", error);
    }
  };
  

  // const handleDeleteReport = async () => {
  //   try {
  //     const token = await getAccessTokenSilently();
  //     const response = await fetch(`/api/reports/${report_id}`, {
  //       method: "DELETE",
  //       headers: {
  //         "Content-Type": "application/json",
  //         Authorization: `Bearer ${token}`,
  //       },
  //     });
  //     if (response.ok) {
  //       navigate("/reports"); // Redirect to the reports page after deletion
  //     } else {
  //       console.error("Failed to delete report");
  //     }
  //   } catch (error) {
  //     console.error("Error deleting report:", error);
  //   }
  // };

  if (!report) return <div>Loading...</div>;

  return (
    <main className="flex flex-col gap-4 p-2">
      <div className="w-full mx-auto grid flex-1 auto-rows-max gap-8">
      <div className="flex items-center justify-between gap-4">
        <div className="flex items-center gap-4">
          <Button
            variant="outline"
            size="icon"
            className="h-10 w-10"
            onClick={() => navigate(-1)}
          >
            <ChevronLeftIcon className="h-4 w-4" />
            <span className="sr-only">Back</span>
          </Button>
          <h1 className="text-2xl font-semibold">Report</h1>
        </div>
        
        {report && report.status === "Closed" && (
          <Button
            variant="outline"
            onClick={handleReopenReport}
            className="gap-2"
          >
            Reopen Report
          </Button>
        )}
      </div>
        <div className="grid flex-1 gap-4 overflow-auto p-4 md:grid-cols-2 lg:grid-cols-3">
          <div className="grid gap-8 md:grid-cols-1 lg:grid-cols-1">
            <div className="grid auto-rows-max items-start gap-8">
              <Card className="bg-white border rounded-lg p-6">
                <CardHeader>
                  <CardTitle>Student Details</CardTitle>
                </CardHeader>
                <CardContent>
                  <div className="grid gap-6">
                    <div className="grid gap-3">
                      <Label htmlFor="student-name">Student Name</Label>
                      <Label id="student-name" className="text-gray-500">{report.student_name}</Label>
                    </div>
                    <div className="grid gap-3">
                      <Label htmlFor="student-id">Student ID</Label>
                      <Label id="student-id" className="text-gray-500">{report.student_id}</Label>
                    </div>
                  </div>
                </CardContent>
              </Card>

              <Card className="bg-white border rounded-lg p-6">
                <CardHeader>
                  <CardTitle>Report</CardTitle>
                </CardHeader>
                <CardContent>
                  <div className="grid gap-6">
                    <div className="grid gap-3">
                      <div className="flex items-center">
                        <Input
                          id="grade"
                          type="number"
                          value={grade}
                          onChange={handleGradeChange}
                          placeholder="grade to be edited"
                          className="w-20"
                        />
                        <Label htmlFor="total-marks">
                          / <span className="text-gray-500">{report.total_marks}</span>
                        </Label>
                      </div>
                    </div>
                    <div className="grid gap-3">
                      <Label htmlFor="content">Student's complaint</Label>
                      <Textarea
                        id="student report"
                        value={report.report_text}
                        className="min-h-[9.5rem]"
                        disabled
                      />
                    </div>
                  </div>
                </CardContent>
              </Card>
            </div>
          </div>

          <div className="relative flex h-full min-h-[50vh] flex-col rounded-xl bg-muted/50 p-4 lg:col-span-2">
            <Badge variant="outline" className="absolute right-3 top-3">
              Exam
            </Badge>

            <div className="flex-1" />
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
            <div style={{ display: "flex", gap: "20px", marginTop: "20px" }}>
              {originalFront ? (
                <img
                  src={originalFront}
                  alt="Original Exam Front Page"
                  style={{
                    maxWidth: "50%",
                    height: "auto",
                  }}
                />
              ) : (
                <p>No original front image found</p>
              )}
              {originalBack ? (
                <img
                  src={originalBack}
                  alt="Original Exam Back Page"
                  style={{
                    maxWidth: "50%",
                    height: "auto",
                  }}
                />
              ) : (
                <p>No original back image found</p>
              )}
            </div>
            <form onSubmit={handleReplySubmit} className="relative overflow-hidden rounded-lg border bg-background focus-within:ring-1 focus-within:ring-ring mt-4">
              <Label htmlFor="message" className="sr-only">
                Message
              </Label>
              <Textarea
                id="message"
                value={reply}
                onChange={handleReplyChange}
                placeholder="Respond to report..."
                className="min-h-12 resize-none border-0 p-3 shadow-none focus-visible:ring-0"
                disabled={report && report.status === "Closed"}  // Disable if the report is closed
              />
              <div className="flex items-center p-3 pt-0">
                <TooltipProvider>
                  <Button type="submit" className="ml-auto gap-2 mt-2" 
                  disabled={report && report.status === "Closed"}  // Disable if the report is closed
                  >
                    Respond & Close Report
                    <ArrowDownLeftIcon className="size-3.5" />
                  </Button>
                </TooltipProvider>
              </div>
            </form>
            {/* <div className="mt-4 flex gap-2">
              <Button variant="destructive" onClick={handleDeleteReport}>
                Delete Report
              </Button>
            </div> */}
          </div>
        </div>
      </div>
    </main>
  );
};

export default ViewReport;
