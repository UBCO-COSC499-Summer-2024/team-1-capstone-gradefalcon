import React, { useState, useEffect } from "react";
import { ChevronLeft } from "lucide-react";
import { useNavigate } from "react-router-dom";
import { Table, TableHeader, TableRow, TableHead, TableBody, TableCell } from "../../components/ui/table";
import { Card, CardHeader, CardTitle, CardContent } from "../../components/ui/card";
import { Button } from "../../components/ui/button";
import { Badge } from "../../components/ui/badge";
import { useAuth0 } from "@auth0/auth0-react";
import { ScrollArea } from "../../components/ui/scroll-area";
import { Input } from "../../components/ui/input";
import { Select, SelectTrigger, SelectValue, SelectContent, SelectItem } from "../../components/ui/select";

export default function StudentReportsDashboard() {
  const { getAccessTokenSilently, user } = useAuth0();
  const [submittedReports, setSubmittedReports] = useState([
    { exam_name: "Sample Exam 1", course_name: "Sample Course 1", status: "Approved" },
    { exam_name: "Sample Exam 2", course_name: "Sample Course 2", status: "Pending" },
    { exam_name: "Sample Exam 3", course_name: "Sample Course 3", status: "Declined" },
  ]);

  const [classes, setClasses] = useState([]);
  const [selectedClass, setSelectedClass] = useState(null);
  const [exams, setExams] = useState([]);
  const [selectedExam, setSelectedExam] = useState(null);
  const [examDetails, setExamDetails] = useState(null); // New state for exam details
  const [courseSearchTerm, setCourseSearchTerm] = useState("");
  const [filteredCourses, setFilteredCourses] = useState([]);
  const [examSearchTerm, setExamSearchTerm] = useState("");
  const [filteredExams, setFilteredExams] = useState([]);
  const [reportTopic, setReportTopic] = useState(null); // New state for report topic
  const [reportAnswers, setReportAnswers] = useState({}); // New state for report answers
  const navigate = useNavigate();

  useEffect(() => {
    const fetchClasses = async () => {
      try {
        const token = await getAccessTokenSilently();
        const response = await fetch("/api/class/student/courses", {
          method: "GET",
          headers: {
            "Content-Type": "application/json",
            "Authorization": `Bearer ${token}`,
          },
        });
        if (response.ok) {
          const data = await response.json();
          setClasses(data);
          setFilteredCourses(data);
        } else {
          console.error("Failed to fetch classes");
        }
      } catch (error) {
        console.error("Error fetching classes:", error);
      }
    };

    fetchClasses();
  }, [getAccessTokenSilently]);

  useEffect(() => {
    setFilteredCourses(classes.filter((course) =>
      course.course_name?.toLowerCase().includes(courseSearchTerm.toLowerCase())
    ));
  }, [courseSearchTerm, classes]);

  const handleClassClick = async (classItem) => {
    try {
      const token = await getAccessTokenSilently();
      const response = await fetch(`/api/exam/getExamsFromClassID/${classItem.class_id}`, {
        method: "GET",
        headers: {
          "Content-Type": "application/json",
          "Authorization": `Bearer ${token}`,
        },
      });
      if (response.ok) {
        const data = await response.json();
        setSelectedClass(classItem);
        setExams(data.exams || []);
        setFilteredExams(data.exams || []);
      } else {
        console.error("Failed to fetch exams");
      }
    } catch (error) {
      console.error("Error fetching exams:", error);
    }
  };

  const handleExamClick = async (exam) => {
    try {
      const token = await getAccessTokenSilently();
      const response = await fetch(`/api/exam/getExamDetails/${exam.exam_id}`, {
        method: "GET",
        headers: {
          "Content-Type": "application/json",
          "Authorization": `Bearer ${token}`,
        },
      });
      if (response.ok) {
        const data = await response.json();
        setSelectedExam(exam);
        setExamDetails(data); // Set the fetched exam details
      } else {
        console.error("Failed to fetch exam details");
      }
    } catch (error) {
      console.error("Error fetching exam details:", error);
    }
  };

  const handleReportTopicChange = (value) => {
    setReportTopic(value);
    setReportAnswers({ topic: value });
  };

  const handleAnswerChange = (question, answer) => {
    setReportAnswers((prev) => ({ ...prev, [question]: answer }));
  };

  const generateReportString = () => {
    let reportString = "";
    switch (reportTopic) {
      case "Clarification on Exam Questions":
        reportString = `I didn't understand ${reportAnswers.question}. I need more information about what was expected in the answer, specifically ${reportAnswers.part}.`;
        break;
      case "Grading and Scoring Issues":
        reportString = `I believe there is a grading error in ${reportAnswers.question}. ${reportAnswers.reason}`;
        break;
      case "Feedback on Performance":
        reportString = `I want feedback on how to improve my answers for ${reportAnswers.questions}. ${reportAnswers.typeOfFeedback}`;
        break;
      case "Technical and Exam Environment Issues":
        reportString = `I experienced technical difficulties during the exam. ${reportAnswers.issue}, and ${reportAnswers.impact}.`;
        break;
      case "Content and Study Resources":
        reportString = `I need additional resources to understand the material better, specifically ${reportAnswers.topics}. ${reportAnswers.resources}`;
        break;
      case "Time Management and Exam Strategies":
        reportString = `I struggled with managing my time during the exam, particularly ${reportAnswers.aspect}. ${reportAnswers.strategies}`;
        break;
      default:
        reportString = "No topic selected.";
    }
    return reportString;
  };

  const getReportQuestionsByTopic = (topic) => {
    switch (topic) {
      case "Clarification on Exam Questions":
        return [
          { question: "Which question(s) did you find unclear?", key: "question" },
          { question: "What specific part of the question or answer needs clarification?", key: "part" },
        ];
      case "Grading and Scoring Issues":
        return [
          { question: "Which question(s) do you believe have grading errors?", key: "question" },
          { question: "Why do you think there is a mistake?", key: "reason" },
        ];
      case "Feedback on Performance":
        return [
          { question: "Which questions would you like feedback on?", key: "questions" },
          { question: "What type of feedback are you looking for?", key: "typeOfFeedback" },
        ];
      case "Technical and Exam Environment Issues":
        return [
          { question: "What kind of technical difficulties did you face?", key: "issue" },
          { question: "How did the issue impact your exam performance?", key: "impact" },
        ];
      case "Content and Study Resources":
        return [
          { question: "Which topics do you need more resources for?", key: "topics" },
          { question: "What kind of resources are you looking for?", key: "resources" },
        ];
      case "Time Management and Exam Strategies":
        return [
          { question: "Which aspect of time management did you struggle with?", key: "aspect" },
          { question: "What type of strategies are you seeking?", key: "strategies" },
        ];
      default:
        return [];
    }
  };

  const getStatusColor = (status) => {
    switch (status) {
      case "Approved":
        return "default";
      case "Pending":
        return "secondary";
      case "Declined":
        return "destructive";
      default:
        return "default";
    }
  };

  const renderReportQuestions = () => {
    return getReportQuestionsByTopic(reportTopic).map((q, index) => (
      <div key={index} className="mb-4">
        <label className="block text-sm font-medium text-gray-700">{q.question}</label>
        <Input
          type="text"
          className="w-full"
          onChange={(e) => handleAnswerChange(q.key, e.target.value)}
        />
      </div>
    ));
  };

  const renderContent = () => {
    if (selectedExam && examDetails) {
      return (
        <div className="flex flex-col items-center justify-center gap-4 flex-grow">
          <h2 className="text-xl font-semibold">{examDetails.exam_title}</h2>
          <p><strong>Class Name:</strong> {examDetails.course_name}</p>
          <p><strong>Exam Title:</strong> {examDetails.exam_title}</p>
          <p><strong>Date Taken:</strong> {examDetails.date_taken}</p>
          <p><strong>Grade:</strong> {examDetails.grade}</p>
          <div className="w-full max-w-md">
            <h3 className="text-lg font-medium mb-2">Select Report Topic</h3>
            <Select onValueChange={handleReportTopicChange}>
              <SelectTrigger>
                <SelectValue placeholder="Select a topic..." />
              </SelectTrigger>
              <SelectContent>
                <SelectItem value="Clarification on Exam Questions">Clarification on Exam Questions</SelectItem>
                <SelectItem value="Grading and Scoring Issues">Grading and Scoring Issues</SelectItem>
                <SelectItem value="Feedback on Performance">Feedback on Performance</SelectItem>
                <SelectItem value="Technical and Exam Environment Issues">Technical and Exam Environment Issues</SelectItem>
                <SelectItem value="Content and Study Resources">Content and Study Resources</SelectItem>
                <SelectItem value="Time Management and Exam Strategies">Time Management and Exam Strategies</SelectItem>
              </SelectContent>
            </Select>
            {reportTopic && (
              <div className="mt-4">
                {renderReportQuestions()}
              </div>
            )}
            <Button className="mt-4" onClick={() => navigate('/submitReport', { state: { examDetails, reportString: generateReportString(), student: user } })}>
              Create Report
            </Button>
          </div>
        </div>
      );
    } else if (selectedClass) {
      return filteredExams.map((exam, index) => (
        <TableRow key={index} onClick={() => handleExamClick(exam)}>
          <TableCell>{exam.exam_title}</TableCell>
        </TableRow>
      ));
    } else {
      return filteredCourses.map((classItem, index) => (
        <TableRow key={index} onClick={() => handleClassClick(classItem)}>
          <TableCell>{classItem.course_name}</TableCell>
        </TableRow>
      ));
    }
  };

  return (
    <div className="flex flex-col gap-4 h-screen">
      <div className="flex justify-between items-center w-full mb-4">
        <Button
          className="bg-primary text-white flex items-center"
          onClick={() => {
            if (selectedExam) {
              setSelectedExam(null);
              setExamDetails(null); // Clear exam details
            } else {
              setSelectedClass(null);
              setExams([]);
            }
          }}
          disabled={!selectedClass && !selectedExam}
        >
          <ChevronLeft className="w-4 h-4" />
        </Button>
      </div>
      <div className="flex-1">
        <Card className="bg-white border rounded h-full mb-4">
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
                      <Badge variant={`${getStatusColor(report.status)}`}>
                        {report.status}
                      </Badge>
                    </TableCell>
                  </TableRow>
                ))}
              </TableBody>
            </Table>
          </CardContent>
        </Card>

        <Card className="bg-white border rounded h-full">
          <CardHeader className="flex justify-between px-6 py-4">
            <CardTitle className="mb-2">{selectedClass ? 'Exams' : 'Classes'}</CardTitle>
          </CardHeader>
          <CardContent className="flex-1">
            <div className="relative mb-4">
              <Input
                type="search"
                placeholder={`Search ${selectedClass ? 'exams' : 'classes'}...`}
                className="w-full pl-8"
                value={selectedClass ? examSearchTerm : courseSearchTerm}
                onChange={(e) => selectedClass ? setExamSearchTerm(e.target.value) : setCourseSearchTerm(e.target.value)}
              />
            </div>
            <ScrollArea className="h-80">
              <Table>
                <TableHeader>
                  <TableRow>
                    <TableHead>{selectedClass ? 'Exam Title' : 'Class Name'}</TableHead>
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
  );
}
