import React, { useState, useEffect } from "react";
import { ChevronLeft, Flag } from "lucide-react";
import { useNavigate } from "react-router-dom";
import { Table, TableHeader, TableRow, TableHead, TableBody, TableCell } from "../../components/ui/table";
import { Card, CardHeader, CardTitle, CardContent } from "../../components/ui/card";
import { Button } from "../../components/ui/button";
import { Badge } from "../../components/ui/badge";
import { useAuth0 } from "@auth0/auth0-react";
import { Tooltip, TooltipTrigger, TooltipContent, TooltipProvider } from "../../components/ui/tooltip";
import { Dialog, DialogContent, DialogHeader, DialogTitle, DialogDescription } from "../../components/ui/dialog";

export default function StudentReportsDashboard() {
  const { getAccessTokenSilently } = useAuth0();
  const [submittedReports, setSubmittedReports] = useState([]);
  const [selectedReportReplies, setSelectedReportReplies] = useState(null);
  const [selectedReportGrade, setSelectedReportGrade] = useState(null);
  const [totalMarks, setTotalMarks] = useState(null);
  const [isDialogOpen, setIsDialogOpen] = useState(false);
  const navigate = useNavigate();

  useEffect(() => {
    // Fetch the student's submitted reports
    const fetchStudentReports = async () => {
      try {
        const token = await getAccessTokenSilently();
        const response = await fetch("/api/reports/student-reports", {
          method: "GET",
          headers: {
            "Content-Type": "application/json",
            "Authorization": `Bearer ${token}`,
          },
        });
        if (response.ok) {
          const data = await response.json();
          setSubmittedReports(data);
        } else {
          console.error("Failed to fetch student reports");
        }
      } catch (error) {
        console.error("Error fetching student reports:", error);
      }
    };

    fetchStudentReports();
  }, [getAccessTokenSilently]);

  const getStatusColor = (status) => {
    switch (status) {
      case "Closed":
        return "default";
      case "Pending":
        return "secondary";
      default:
        return "default";
    }
  };

  const handleRowClick = async (report_id) => {
    try {
      const token = await getAccessTokenSilently();
      const response = await fetch(`/api/reports/${report_id}`, {
        method: "GET",
        headers: {
          "Content-Type": "application/json",
          "Authorization": `Bearer ${token}`,
        },
      });
      if (response.ok) {
        const data = await response.json();
        setSelectedReportReplies(data.reply_text);
        setSelectedReportGrade(data.grade); 
        setTotalMarks(data.total_marks); 
        setIsDialogOpen(true);
      } else {
        console.error("Failed to fetch report replies");
      }
    } catch (error) {
      console.error("Error fetching report replies:", error);
    }
  };

  return (
    <div className="flex flex-col gap-4 h-screen">
      <div className="flex justify-between items-center w-full mb-4">
        <Button
          className="bg-primary text-white flex items-center"
          onClick={() => navigate(-1)}
        >
          <ChevronLeft className="w-4 h-4" />
        </Button>
        <TooltipProvider>
          <Tooltip delayDuration={0}>
            <TooltipTrigger asChild>
              <Button size="sm" className="gap-1" onClick={() => navigate('/SubmitReport')}>
                <Flag className="h-6 w-6" />
              </Button>
            </TooltipTrigger>
            <TooltipContent>
              <p>Make a Report</p>
            </TooltipContent>
          </Tooltip>
        </TooltipProvider>
      </div>
      <div className="flex-1">
        <Card className="bg-white border rounded h-full">
          <CardHeader className="flex justify-between px-6 py-4">
            <CardTitle className="mb-2">Submitted Reports</CardTitle>
          </CardHeader>
          <CardContent className="flex-1">
            <Table>
              <TableHeader>
                <TableRow>
                  <TableHead>Class Name</TableHead>
                  <TableHead>Exam Name</TableHead>
                  <TableHead>Report Status</TableHead>
                </TableRow>
              </TableHeader>
              <TableBody>
                {submittedReports.map((report, index) => (
                  <TooltipProvider key={index}>
                    <Tooltip>
                      <TooltipTrigger asChild>
                        <TableRow
                          onClick={() => report.status === "Closed" && handleRowClick(report.report_id)}
                          className={report.status === "Closed" ? "cursor-pointer" : ""}
                        >
                          <TableCell>{report.course_name}</TableCell>
                          <TableCell>{report.exam_title}</TableCell>
                          <TableCell>
                            <Badge variant={getStatusColor(report.status)}>
                              {report.status}
                            </Badge>
                          </TableCell>
                        </TableRow>
                      </TooltipTrigger>
                      <TooltipContent>
                        <p>View Response</p>
                      </TooltipContent>
                    </Tooltip>
                  </TooltipProvider>
                ))}
              </TableBody>
            </Table>
          </CardContent>
        </Card>
      </div>

      <Dialog open={isDialogOpen} onOpenChange={setIsDialogOpen}>
        <DialogContent>
          <DialogHeader>
            <DialogTitle>Report Replies</DialogTitle>
            <DialogDescription>
              {selectedReportReplies ? (
                <div>
                  <p><strong>Grade:</strong> {selectedReportGrade}/ <span className="text-gray-500">{totalMarks}</span></p>
                  <p>{selectedReportReplies}</p>
                </div>
              ) : (
                <p>No replies found.</p>
              )}
            </DialogDescription>
          </DialogHeader>
        </DialogContent>
      </Dialog>
    </div>
  );
}
