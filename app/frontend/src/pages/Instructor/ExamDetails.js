import React, { useEffect, useState } from "react";
import { useParams } from "react-router-dom";
import { Button } from "../../components/ui/button";
import { Card, CardHeader, CardTitle, CardContent } from "../../components/ui/card";
import { Table, TableHeader, TableRow, TableHead, TableBody, TableCell } from "../../components/ui/table";
import { ScrollArea } from "../../components/ui/scroll-area";
import { Tooltip, TooltipTrigger, TooltipContent, TooltipProvider } from "../../components/ui/tooltip";
import { ChevronLeftIcon } from "@heroicons/react/20/solid";
import { FileIcon } from "lucide-react";

const ExamDetails = () => {
  const { exam_id } = useParams();
  const [examData, setExamData] = useState(null);
  const [loading, setLoading] = useState(true);
  const [error, setError] = useState(null);

  useEffect(() => {
    const fetchExamData = async () => {
      try {
        const response = await fetch(`/api/exam/getExamDetails/${exam_id}`);
        if (response.ok) {
          const data = await response.json();
          setExamData(data);
        } else {
          setError("Failed to fetch exam data");
        }
      } catch (error) {
        setError("Error fetching exam data");
      } finally {
        setLoading(false);
      }
    };

    fetchExamData();
  }, [exam_id]);

  const exportToCSV = () => {
    let csvContent = "Student ID,Student Name,Grade\r\n";
    examData.studentResults.forEach((result) => {
      csvContent += `${result.student_id},${result.student_name},${result.grade}\r\n`;
    });

    const blob = new Blob([csvContent], { type: "text/csv;charset=utf-8;" });
    const url = URL.createObjectURL(blob);

    const link = document.createElement("a");
    if (link.download !== undefined) {
      link.setAttribute("href", url);
      link.setAttribute("download", `${examData.exam_title}_results.csv`);
      link.style.visibility = "hidden";
      document.body.appendChild(link);
      link.click();
      document.body.removeChild(link);
    }
  };

  if (loading) {
    return <div>Loading...</div>;
  }

  if (error) {
    return <div>{error}</div>;
  }

  return (
    <div className="mx-auto grid max-w-[70rem] flex-1 auto-rows-max gap-8">
      <div className="flex items-center gap-4">
        <Button variant="outline" size="icon" className="h-10 w-10" onClick={() => window.history.back()}>
          <ChevronLeftIcon className="h-4 w-4" />
          <span className="sr-only">Back</span>
        </Button>
        <h1 className="flex-1 shrink-0 whitespace-nowrap text-xl font-semibold tracking-tight sm:grow-0">
          {examData.exam_title}
        </h1>
        <div className="flex items-center gap-2 ml-auto">
          <TooltipProvider>
            <Tooltip delayDuration={0}>
              <TooltipTrigger asChild>
                <Button size="sm" variant="outline" className="h-8 gap-1" onClick={exportToCSV}>
                  <FileIcon className="h-4 w-4" />
                  <span className="sr-only sm:not-sr-only sm:whitespace-nowrap">Export</span>
                </Button>
              </TooltipTrigger>
              <TooltipContent>
                Export results as a CSV file.
              </TooltipContent>
            </Tooltip>
          </TooltipProvider>
        </div>
      </div>

      <Card className="bg-white border rounded">
        <CardHeader className="flex justify-between px-6 py-4">
          <div>
            <CardTitle className="mb-2">Student Results</CardTitle>
          </div>
        </CardHeader>
        <CardContent>
          <ScrollArea className="h-80">
            <Table>
              <TableHeader>
                <TableRow>
                  <TableHead>Student ID</TableHead>
                  <TableHead>Student Name</TableHead>
                  <TableHead>Grade</TableHead>
                </TableRow>
              </TableHeader>
              <TableBody>
                {examData.studentResults.map((result) => (
                  <TableRow key={result.student_id}>
                    <TableCell>{result.student_id}</TableCell>
                    <TableCell>{result.student_name}</TableCell>
                    <TableCell>{result.grade}</TableCell>
                  </TableRow>
                ))}
              </TableBody>
            </Table>
          </ScrollArea>
        </CardContent>
      </Card>
    </div>
  );
};

export default ExamDetails;
