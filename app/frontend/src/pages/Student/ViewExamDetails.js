import { useState } from "react";
import { ChevronLeft, ChevronRight } from "lucide-react";
import { useNavigate } from "react-router-dom";
import { Table, TableHeader, TableRow, TableHead, TableBody, TableCell } from "../../components/ui/table";
import { Card, CardHeader, CardTitle, CardContent } from "../../components/ui/card";
import { Button } from "../../components/ui/button";

export default function ViewExamDetails() {
  const [examDetails, setExamDetails] = useState({
    exam_title: "Sample Exam",
    course_name: "Sample Course",
    grade: 89,
  });

  const navigate = useNavigate();

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
            <CardTitle className="mb-2">Exam Details</CardTitle>
          </CardHeader>
          <CardContent className="flex-1">
            <div className="flex justify-end mb-4">
              <Button
                onClick={() => navigate('/ReportGradeStudent')}
                className="bg-primary text-white flex items-center"
              >
                <ChevronRight className="w-4 h-4 mr-1" />
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
          </CardContent>
        </Card>
      </div>
    </div>
  );
}
