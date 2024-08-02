import React, { useState, useEffect } from 'react';
import { useNavigate } from "react-router-dom";
import { Button } from "../../components/ui/button";
import { Card, CardHeader, CardTitle, CardContent, CardDescription } from "../../components/ui/card";
import { Table, TableHeader, TableRow, TableHead, TableBody, TableCell } from "../../components/ui/table";
import { ScrollArea } from "../../components/ui/scroll-area";
import { ChevronLeftIcon, BellIcon } from "@heroicons/react/20/solid";
import { useAuth0 } from "@auth0/auth0-react";

const Reports = () => {
  const { getAccessTokenSilently } = useAuth0();
  const [classes, setClasses] = useState([]);
  const [selectedClass, setSelectedClass] = useState(null);
  const [exams, setExams] = useState([]);
  const [students, setStudents] = useState([]);
  const [messages, setMessages] = useState([]);
  const navigate = useNavigate();

  useEffect(() => {
    const fetchClasses = async () => {
      try {
        const token = await getAccessTokenSilently();
        const response = await fetch("/api/class/classes", {
          method: "POST",
          headers: {
            "Content-Type": "application/json",
            "Authorization": `Bearer ${token}`,
          },
        });
        if (response.ok) {
          const data = await response.json();
          setClasses(data);
        } else {
          console.error("Failed to fetch classes");
        }
      } catch (error) {
        console.error("Error fetching classes:", error);
      }
    };

    const fetchMessages = async () => {
      try {
        const token = await getAccessTokenSilently();
        const response = await fetch("/api/class/unreadMessages", {
          method: "GET",
          headers: {
            "Content-Type": "application/json",
            "Authorization": `Bearer ${token}`,
          },
        });
        if (response.ok) {
          const messages = await response.json();
          console.log("Unread Messages:", messages); // Debugging
          setMessages(messages);
        } else {
          console.error("Failed to fetch unread messages");
        }
      } catch (error) {
        console.error("Error fetching unread messages:", error);
      }
    };

    fetchClasses();
    fetchMessages();
  }, [getAccessTokenSilently]);

  const handleBack = () => {
    if (students.length > 0) {
      setStudents([]);
    } else {
      setSelectedClass(null);
      setExams([]);
    }
  };

  const handleClassClick = async (classItem) => {
    console.log("Selected Class:", classItem); // Debugging
    try {
      const token = await getAccessTokenSilently();
      const response = await fetch(`/api/class/classWithExams/${classItem.class_id}`, {
        method: "POST",
        headers: {
          "Content-Type": "application/json",
          "Authorization": `Bearer ${token}`,
        },
      });
      if (response.ok) {
        const data = await response.json();
        console.log("Class Management Data:", data); // Debugging
        setSelectedClass(classItem);
        setExams(data.exams || []); // Ensure exams is always an array
      } else {
        console.error("Failed to fetch exams");
      }
    } catch (error) {
      console.error("Error fetching exams:", error);
    }
  };

  const handleExamClick = async (exam) => {
    console.log("Selected Exam:", exam); // Debugging
    try {
      const token = await getAccessTokenSilently();
      const response = await fetch(`/api/exam/getStudentsByExamID/${exam.exam_id}`, {
        method: "GET",
        headers: {
          "Content-Type": "application/json",
          "Authorization": `Bearer ${token}`,
        },
      });
      if (response.ok) {
        const data = await response.json();
        console.log("Students Data:", data); // Debugging
        setStudents(data.students || []); // Ensure students is always an array
      } else {
        console.error("Failed to fetch students");
      }
    } catch (error) {
      console.error("Error fetching students:", error);
    }
  };

  const renderContent = () => {
    if (students.length > 0) {
      return students.map((student, index) => (
        <TableRow key={index}>
          <TableCell>
            {student.name} {messages.some(msg => msg.sender_id === student.student_id) && <BellIcon className="text-red-500 h-4 w-4" />}
          </TableCell>
          <TableCell>
            <Button onClick={() => navigate(`/ViewReport`, { state: { student } })}>
              View Report
            </Button>
          </TableCell>
        </TableRow>
      ));
    } else if (selectedClass) {
      return exams.map((exam, index) => (
        <TableRow key={index} onClick={() => handleExamClick(exam)}>
          <TableCell>
            {exam.exam_title} {messages.some(msg => msg.exam_id === exam.exam_id) && <BellIcon className="text-red-500 h-4 w-4" />}
          </TableCell>
        </TableRow>
      ));
    } else {
      return classes.map((classItem, index) => (
        <TableRow key={index} onClick={() => handleClassClick(classItem)}>
          <TableCell>
            {classItem.course_name} {messages.some(msg => msg.class_id === classItem.class_id) && <BellIcon className="text-red-500 h-4 w-4" />}
          </TableCell>
        </TableRow>
      ));
    }
  };

  return (
    <main className="flex flex-col gap-4 p-6">
      <div className="flex justify-between items-center w-full mb-4">
        <Button onClick={handleBack} disabled={!selectedClass && students.length === 0}>
          <ChevronLeftIcon className="h-4 w-4" />
          Back
        </Button>
        <div className="flex-1">
          <Card className="bg-white border rounded h-full">
            <CardHeader className="flex justify-between px-6 py-4">
              <div className="flex justify-between items-center">
                <CardTitle className="mb-2">Reports</CardTitle>
              </div>
              <CardDescription>View reports made by students.</CardDescription>
            </CardHeader>
            <CardContent className="flex-1">
              <ScrollArea className="h-80">
                <Table>
                  <TableHeader>
                    <TableRow>
                      <TableHead>{students.length > 0 ? 'Student Name' : (selectedClass ? 'Exam Title' : 'Class Name')}</TableHead>
                      {students.length > 0 && <TableHead>Actions</TableHead>}
                    </TableRow>
                  </TableHeader>
                  <TableBody>
                    {renderContent()}
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
