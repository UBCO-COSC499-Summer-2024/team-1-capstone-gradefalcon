import { useState } from "react";
import { ChevronLeft } from "lucide-react";
import { useNavigate } from "react-router-dom";
import { Table, TableHeader, TableRow, TableHead, TableBody, TableCell } from "../../components/ui/table";
import { Card, CardHeader, CardTitle, CardContent } from "../../components/ui/card";
import { Button } from "../../components/ui/button";
import { Badge } from "../../components/ui/badge"; // Import the Badge component

export default function StudentReportsSubmitted() {
  const [submittedReports, setSubmittedReports] = useState([
    { exam_name: "Sample Exam 1", course_name: "Sample Course 1", status: "Approved" },
    { exam_name: "Sample Exam 2", course_name: "Sample Course 2", status: "Pending" },
    { exam_name: "Sample Exam 3", course_name: "Sample Course 3", status: "Declined" }, // Added sample data for Declined
  ]);

  const navigate = useNavigate();

  const getStatusColor = (status) => {
    switch (status) {
      case "Approved":
        return "bg-[hsl(var(--primary))]"; // Using the theme color for Approved
      case "Pending":
        return "bg-yellow-500";
      case "Declined":
        return "bg-red-500";
      default:
        return "bg-gray-500";
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
                  <TableHead>Exam Name</TableHead>
                  <TableHead>Course Name</TableHead>
                  <TableHead>Status</TableHead>
                </TableRow>
              </TableHeader>
              <TableBody>
                {submittedReports.map((report, index) => (
                  <TableRow key={index}>
                    <TableCell>{report.exam_name}</TableCell>
                    <TableCell>{report.course_name}</TableCell>
                    <TableCell>
                      <Badge className={`text-white ${getStatusColor(report.status)}`}>
                        {report.status}
                      </Badge>
                    </TableCell>
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
