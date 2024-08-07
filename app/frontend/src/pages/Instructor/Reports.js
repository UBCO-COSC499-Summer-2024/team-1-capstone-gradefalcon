import React, { useState, useEffect } from 'react';
import { useNavigate } from 'react-router-dom'; // Import useNavigate for navigation
import { Button } from "../../components/ui/button";
import { useAuth0 } from "@auth0/auth0-react";
import { Card, CardHeader, CardTitle, CardContent, CardDescription } from "../../components/ui/card";
import { Table, TableHeader, TableRow, TableHead, TableBody, TableCell } from "../../components/ui/table";
import { ScrollArea } from "../../components/ui/scroll-area";
import { Badge } from "../../components/ui/badge";
import { Tooltip, TooltipTrigger, TooltipContent, TooltipProvider } from "../../components/ui/tooltip";

const Reports = () => {
  const { getAccessTokenSilently } = useAuth0(); // Get the token
  const [reports, setReports] = useState([]);
  const navigate = useNavigate(); // Initialize useNavigate

  useEffect(() => {
    // Fetch the reports data from the API
    const fetchReports = async () => {
      try {
        const token = await getAccessTokenSilently(); // Get the token
        const response = await fetch("/api/reports/instructor-reports", {
          method: "GET",
          headers: {
            "Content-Type": "application/json",
            "Authorization": `Bearer ${token}`, // Include the token in the request
          },
          credentials: "include",
        });
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
  }, [getAccessTokenSilently]);

  console.log(reports);

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

  const handleRowClick = (report_id) => {
    navigate(`/ViewReport/${report_id}`);
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
                    <TableHead>Exam Title</TableHead>
                    <TableHead>Report Date</TableHead>
                    <TableHead>Report Status</TableHead>
                  </TableRow>
                </TableHeader>
                <TableBody>
                {reports.map((report, index) => (
                  <TooltipProvider key={index}>
                    <Tooltip delayDuration={0}>
                      <TooltipTrigger asChild>
                        <TableRow 
                          key={index} 
                          onClick={() => handleRowClick(report.report_id)} 
                          className="cursor-pointer hover:bg-gray-100"
                        >
                          <TableCell>{report.student_id}</TableCell>
                          <TableCell>{report.student_name}</TableCell>
                          <TableCell>{report.exam_title}</TableCell>
                          <TableCell>{new Date(report.report_time).toLocaleDateString()}</TableCell>
                          <TableCell>
                            <Badge variant={getStatusColor(report.status)}>
                              {report.status}
                            </Badge>
                          </TableCell>
                        </TableRow>
                      </TooltipTrigger>
                      <TooltipContent>
                        <p>Click for details</p>
                      </TooltipContent>
                    </Tooltip>
                  </TooltipProvider>
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
