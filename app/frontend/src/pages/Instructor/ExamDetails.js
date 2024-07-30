import React, { useEffect, useState } from "react";
import { useParams, useNavigate } from "react-router-dom";
import { Button } from "../../components/ui/button";
import { Card, CardHeader, CardTitle, CardContent } from "../../components/ui/card";
import { Table, TableHeader, TableRow, TableHead, TableBody, TableCell } from "../../components/ui/table";
import { ScrollArea } from "../../components/ui/scroll-area";
import { ChevronLeftIcon } from "@heroicons/react/20/solid";

const ExamDetails = () => {
  const { exam_id } = useParams();
  const navigate = useNavigate();
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
      </div>

      <div className="grid gap-4 lg:grid-cols-1">
        <Card className="bg-white border rounded">
          <CardHeader className="flex justify-between px-6 py-4">
            <div>
              <CardTitle className="mb-2">Exam Details</CardTitle>
            </div>
          </CardHeader>
          <CardContent>
            <div>Course: {examData.course_name} ({examData.course_id})</div>
            <div>Total Questions: {examData.total_questions}</div>
            <div>Total Marks: {examData.total_marks}</div>
            <div>Mean: {examData.mean}</div>
            <div>High: {examData.high}</div>
            <div>Low: {examData.low}</div>
            <div>Upper Quartile: {examData.upper_quartile}</div>
            <div>Lower Quartile: {examData.lower_quartile}</div>
            <div>Page Count: {examData.page_count}</div>
            <div>File Size: {examData.file_size}</div>
          </CardContent>
        </Card>

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
    </div>
  );
};

export default ExamDetails;
