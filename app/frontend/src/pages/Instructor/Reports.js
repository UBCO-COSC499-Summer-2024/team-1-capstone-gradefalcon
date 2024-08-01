import React from 'react';
import { Link, useNavigate } from "react-router-dom";
import { Button } from "../../components/ui/button";
import { Card, CardHeader, CardTitle, CardContent, CardDescription } from "../../components/ui/card";
import { Table, TableHeader, TableRow, TableHead, TableBody, TableCell } from "../../components/ui/table";
import { ScrollArea } from "../../components/ui/scroll-area";
import { ChevronLeftIcon } from "@heroicons/react/20/solid";

const Reports = () => {
  return (
    <main className="flex flex-col gap-4 p-6">
    <div className="flex justify-between items-center w-full mb-4">
    <div className="flex-1">
      <Card className="bg-white border rounded h-full">
        <CardHeader className="flex justify-between px-6 py-4">
          <div className="flex justify-between items-center">
            <CardTitle className="mb-2"> Reports</CardTitle>
          </div>
          <CardDescription>View reports made by students.</CardDescription>
        </CardHeader>
        <CardContent className="flex-1">
          <ScrollArea className="h-80">
            <Table>
              <TableHeader>
                <TableRow>
                  <TableHead>Student Name</TableHead>
                  <TableHead>Student ID</TableHead>
                  <TableHead>Exam Name</TableHead>
                  <TableHead>Grade</TableHead>
                </TableRow>
              </TableHeader>
              <TableBody>
                {/* {reports.map((report, index) => (
                  <TableRow key={index}>
                    <TableCell>{report.studentName}</TableCell>
                    <TableCell>{report.studentId}</TableCell>
                    <TableCell>{report.examName}</TableCell>
                    <TableCell>{report.grade}</TableCell>
                  </TableRow>
                ))} */}
              </TableBody>
            </Table>
          </ScrollArea>
        </CardContent>
      </Card>
    </div>
    </div>
    </main>
  );
};

export default Reports;
