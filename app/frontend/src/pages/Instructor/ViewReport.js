import React, { useState, useEffect } from "react";
import { Badge } from "../../components/ui/badge";
import { Label } from "../../components/ui/label";
import { Textarea } from "../../components/ui/textarea";
import { TooltipProvider, Tooltip, TooltipTrigger, TooltipContent } from "../../components/ui/tooltip";
import { Button } from "../../components/ui/button";
import { Input } from "../../components/ui/input";
import { PaperClipIcon, ArrowDownLeftIcon, ChevronLeftIcon } from "@heroicons/react/20/solid";
import { Card, CardHeader, CardTitle, CardContent } from "../../components/ui/card";
import { useNavigate, useParams } from "react-router-dom";

const ViewReport = () => {
  const [report, setReport] = useState(null);
  const [grade, setGrade] = useState("");
  const [reply, setReply] = useState("");
  const navigate = useNavigate();
  const { reportId } = useParams(); // Assuming reportId is passed in the route

  useEffect(() => {
    // Fetch the report data from the API
    const fetchReport = async () => {
      try {
        const response = await fetch(`/api/reports/${reportId}`);
        if (response.ok) {
          const data = await response.json();
          setReport(data);
          setGrade(data.grade);
        } else {
          console.error("Failed to fetch report");
        }
      } catch (error) {
        console.error("Error fetching report:", error);
      }
    };

    fetchReport();
  }, [reportId]);

  const handleGradeChange = (e) => {
    setGrade(e.target.value);
  };

  const handleReplyChange = (e) => {
    setReply(e.target.value);
  };

  const handleReplySubmit = async (e) => {
    e.preventDefault();

    try {
      // Call the changeGrade API to update the grade
      const changeGradeResponse = await fetch("/api/changeGrade", {
        method: "POST",
        headers: {
          "Content-Type": "application/json",
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

      // Handle the reply submission
      const replyResponse = await fetch(`/api/reports/${reportId}/reply`, {
        method: "PUT",
        headers: {
          "Content-Type": "application/json",
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

  const handleDeleteReport = async () => {
    try {
      const response = await fetch(`/api/reports/${reportId}`, {
        method: "DELETE",
      });
      if (response.ok) {
        navigate("/reports"); // Redirect to the reports page after deletion
      } else {
        console.error("Failed to delete report");
      }
    } catch (error) {
      console.error("Error deleting report:", error);
    }
  };

  if (!report) return <div>Loading...</div>;

  return (
    <main className="flex flex-col gap-4 p-2">
      <div className="w-full mx-auto grid flex-1 auto-rows-max gap-8">
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
          <h1 className="text-2xl font-semibold">
            Report
          </h1>
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
                      <Label id="student-name">{report.student_name}</Label>
                    </div>
                    <div className="grid gap-3">
                      <Label htmlFor="student-id">Student ID</Label>
                      <Label id="student-id">{report.student_id}</Label>
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
                      <Label htmlFor="grade">Grade</Label>
                      <Input
                        id="grade"
                        type="text"
                        value={grade}
                        onChange={handleGradeChange}
                        placeholder="grade to be edited"
                      />
                    </div>
                    <div className="grid gap-3">
                      <Label htmlFor="content">Content</Label>
                      <Textarea
                        id="content"
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
            <form onSubmit={handleReplySubmit} className="relative overflow-hidden rounded-lg border bg-background focus-within:ring-1 focus-within:ring-ring">
              <Label htmlFor="message" className="sr-only">
                Message
              </Label>
              <Textarea
                id="message"
                value={reply}
                onChange={handleReplyChange}
                placeholder="Type your message here..."
                className="min-h-12 resize-none border-0 p-3 shadow-none focus-visible:ring-0"
              />
              <div className="flex items-center p-3 pt-0">
                <TooltipProvider>
                  <Tooltip>
                    <TooltipTrigger asChild>
                      <Button variant="ghost" size="icon">
                        <PaperClipIcon className="size-4" />
                        <span className="sr-only">Attach file</span>
                      </Button>
                    </TooltipTrigger>
                    <TooltipContent side="top">Attach File</TooltipContent>
                  </Tooltip>
                  <Button type="submit" size="sm" className="ml-auto gap-1.5">
                    Reply
                    <ArrowDownLeftIcon className="size-3.5" />
                  </Button>
                </TooltipProvider>
              </div>
            </form>
            <div className="mt-4 flex gap-2">
              <Button variant="destructive" onClick={handleDeleteReport}>
                Delete Report
              </Button>
              <Button variant="outline" onClick={handleReplySubmit}>
                Close Report
              </Button>
            </div>
          </div>
        </div>
      </div>
    </main>
  );
};

export default ViewReport;
