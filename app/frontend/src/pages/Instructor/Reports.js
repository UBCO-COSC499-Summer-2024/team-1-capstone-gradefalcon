import React, { useState, useEffect } from 'react';
import { useNavigate } from 'react-router-dom'; // Import useNavigate for navigation
import { Button } from "../../components/ui/button";
import { Card, CardHeader, CardTitle, CardContent, CardDescription } from "../../components/ui/card";
import { Table, TableHeader, TableRow, TableHead, TableBody, TableCell } from "../../components/ui/table";
import { ScrollArea } from "../../components/ui/scroll-area";
import { Badge } from "../../components/ui/badge";

const Reports = () => {
  const [reports, setReports] = useState([]);
  const navigate = useNavigate(); // Initialize useNavigate

  useEffect(() => {
    // Fetch the reports data from the API
    const fetchReports = async () => {
      try {
        const response = await fetch("/api/reports");
        if (response.ok) {
          const data = await response.json();
          setReports(data);
        } else {
          console.error("Failed to fetch reports");
        }
      } catch (error) {
        console.error("Error fetching reports:", error);
      }
    };

    fetchReports();
  }, []);

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

  const handleRowClick = (reportId) => {
    navigate(`/viewReport/${reportId}`);
  };

  return (
    <main className="flex flex-col gap-4 p-6">
      <div className="flex-1">
        <Card className="bg-white border rounded h-full">
          <CardHeader className="flex justify-between px-6 py-4">
            <CardTitle className="mb-2">Reports</CardTitle>
            <CardDescription>View reports made by students.</CardDescription>
          </CardHeader>
          <CardContent className="flex-1">
            <ScrollArea className="h-80">
              <Table>
                <TableHeader>
                  <TableRow>
                    <TableHead>Student ID</TableHead>
                    <TableHead>Student Name</TableHead>
                    <TableHead>Class</TableHead>
                    <TableHead>Exam Title</TableHead>
                    <TableHead>Report Status</TableHead>
                  </TableRow>
                </TableHeader>
                <TableBody>
                  {reports.map((report, index) => (
                    <TableRow key={index} onClick={() => handleRowClick(report.report_id)} className="cursor-pointer">
                      <TableCell>{report.student_id}</TableCell>
                      <TableCell>{report.student_name}</TableCell>
                      <TableCell>{report.class_name}</TableCell>
                      <TableCell>{report.exam_title}</TableCell>
                      <TableCell>
                        <Badge variant={getStatusColor(report.status)}>
                          {report.status}
                        </Badge>
                      </TableCell>
                    </TableRow>
                  ))}
                </TableBody>
              </Table>
            </ScrollArea>
          </CardContent>
        </Card>
      </div>
    </main>
  );
};

export default Reports;
