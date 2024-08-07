import React, { useState, useEffect } from "react";
import { ChevronLeft, Flag } from "lucide-react";
import { useNavigate } from "react-router-dom";
import { Table, TableHeader, TableRow, TableHead, TableBody, TableCell } from "../../components/ui/table";
import { Card, CardHeader, CardTitle, CardContent } from "../../components/ui/card";
import { Button } from "../../components/ui/button";
import { Badge } from "../../components/ui/badge";
import { useAuth0 } from "@auth0/auth0-react";
import { Tooltip, TooltipTrigger, TooltipContent, TooltipProvider } from "../../components/ui/tooltip";

export default function StudentReportsDashboard() {
  const { getAccessTokenSilently } = useAuth0();
  const [submittedReports, setSubmittedReports] = useState([]);
  const navigate = useNavigate();

  useEffect(() => {
    // Fetch the student's submitted reports
    const fetchStudentReports = async () => {
      try {
        const token = await getAccessTokenSilently();
        const response = await fetch("/api/student-reports", {
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
        return "default"; // Can adjust color variant as needed
      case "Pending":
        return "secondary";
      default:
        return "default";
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
                  <TableHead>Report Status</TableHead>
                  <TableHead>Class Name</TableHead>
                  <TableHead>Exam Name</TableHead>
                </TableRow>
              </TableHeader>
              <TableBody>
                {submittedReports.map((report, index) => (
                  <TableRow key={index}>
                    <TableCell>
                      <Badge variant={getStatusColor(report.status)}>
                        {report.status}
                      </Badge>
                    </TableCell>
                    <TableCell>{report.course_name}</TableCell> {/* Ensure backend returns 'course_name' */}
                    <TableCell>{report.exam_title}</TableCell> {/* Ensure backend returns 'exam_title' */}
                  </TableRow>
                ))}
              </TableBody>
            </Table>
          </CardContent>
        </Card>
      </div>
    </div>
  );
}
