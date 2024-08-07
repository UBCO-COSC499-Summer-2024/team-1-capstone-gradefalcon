import React, { useState, useEffect } from 'react';
import { useLocation, useNavigate } from "react-router-dom";
import { Button } from "../../components/ui/button";
import { Card, CardHeader, CardTitle, CardContent } from "../../components/ui/card";
import { Input } from "../../components/ui/input";
import { Textarea } from "../../components/ui/textarea";
import { ArrowUpRightIcon, ChevronLeftIcon, PaperClipIcon, TrashIcon } from "@heroicons/react/24/solid";
import { Badge } from "../../components/ui/badge";
import { Label } from "../../components/ui/label";
import { TooltipProvider, Tooltip, TooltipTrigger, TooltipContent } from "../../components/ui/tooltip";
import { useAuth0 } from "@auth0/auth0-react";

const SubmitReport = () => {
  const navigate = useNavigate();
  const { getAccessTokenSilently, user } = useAuth0();
  const location = useLocation();
  const { examDetails, reportString, student } = location.state || {};

  const [messages, setMessages] = useState([]);
  const [newMessage, setNewMessage] = useState('');
  const [studentGrade, setStudentGrade] = useState('No grade available');
  const [hoveredMessage, setHoveredMessage] = useState(null);

  useEffect(() => {
    const fetchMessages = async () => {
      if (examDetails?.exam_id && student?.student_id) {
        try {
          const token = await getAccessTokenSilently();
          const response = await fetch(`/api/reports/messages/${examDetails.exam_id}/${student.student_id}`, {
            method: "GET",
            headers: {
              "Content-Type": "application/json",
              "Authorization": `Bearer ${token}`,
            },
          });
          if (response.ok) {
            const data = await response.json();
            setMessages(data);
          } else {
            console.error("Failed to fetch messages");
          }
        } catch (error) {
          console.error("Error fetching messages:", error);
        }
      }
    };

    const fetchStudentGrade = async () => {
      if (examDetails?.exam_id && student?.student_id) {
        try {
          const token = await getAccessTokenSilently();
          const response = await fetch(`/api/exam/getExamDetails/${examDetails.exam_id}?student_id=${student.student_id}`, {
            method: "GET",
            headers: {
              "Content-Type": "application/json",
              "Authorization": `Bearer ${token}`,
            },
          });
          if (response.ok) {
            const data = await response.json();
            if (data.studentResults.length > 0) {
              setStudentGrade(data.studentResults[0].grade);
            }
          } else {
            console.error("Failed to fetch student grade");
          }
        } catch (error) {
          console.error("Error fetching student grade:", error);
        }
      }
    };

    fetchMessages();
    fetchStudentGrade();
  }, [getAccessTokenSilently, examDetails, student]);

  const handleSendMessage = async (e) => {
    e.preventDefault();
    if (newMessage.trim()) {
      try {
        const token = await getAccessTokenSilently();
        const response = await fetch('/api/reports/messages', {
          method: 'POST',
          headers: {
            "Content-Type": "application/json",
            "Authorization": `Bearer ${token}`,
          },
          body: JSON.stringify({
            sender_id: user.sub,
            sender_type: 'student',
            receiver_id: 'auth0|6696d634bec6c6d1cc3e2274', // Assuming instructor id
            receiver_type: 'instructor',
            exam_id: examDetails.exam_id,
            message_text: newMessage,
          }),
        });
        if (response.ok) {
          const message = await response.json();
          setMessages([...messages, message]);
          setNewMessage('');
        } else {
          console.error('Failed to send message');
        }
      } catch (error) {
        console.error('Error sending message:', error);
      }
    }
  };

  const handleDeleteMessage = async (message_id) => {
    if (window.confirm('Are you sure you want to delete this message?')) {
      try {
        const token = await getAccessTokenSilently();
        const response = await fetch(`/api/reports/messages/${message_id}`, {
          method: 'DELETE',
          headers: {
            "Content-Type": "application/json",
            "Authorization": `Bearer ${token}`,
          },
        });
        if (response.ok) {
          setMessages(messages.filter(message => message.message_id !== message_id));
        } else {
          console.error('Failed to delete message');
        }
      } catch (error) {
        console.error('Error deleting message:', error);
      }
    }
  };

  const imgSrc = `/api/fetchingUpload/Students/exam_id_${examDetails.exam_id}/student_id_1/front_page.png`;

  return (
    <main className="flex flex-col gap-4 p-2">
      <div className="w-full mx-auto grid flex-1 auto-rows-max gap-8">
        <div className="flex items-center gap-4">
          <Button
            variant="outline"
            size="icon"
            className="h-10 w-10"
            onClick={() => navigate(-1)}
          >
            <ChevronLeftIcon className="h-4 w-4" />
            <span className="sr-only">Back</span>
          </Button>
          <h1 className="text-2xl font-semibold">Make a Report</h1>
        </div>
        <div className="grid flex-1 gap-4 overflow-auto p-4 md:grid-cols-2 lg:grid-cols-3">
          <div className="grid gap-8 md:grid-cols-1 lg:grid-cols-1">
            <div className="grid auto-rows-max items-start gap-8">

              <Card className="bg-white border rounded-lg p-6">
                <CardHeader>
                  <CardTitle>Report Details</CardTitle>
                </CardHeader>
                <CardContent>
                  <div className="grid gap-6">
                    <div className="grid gap-3">
                      <Label htmlFor="student-name">Student Name</Label>
                      <Label id="student-name">{student?.name || 'N/A'}</Label>
                    </div>
                    <div className="grid gap-3">
                      <Label htmlFor="student-id">Student ID</Label>
                      <Label id="student-id">{student?.student_id || 'N/A'}</Label>
                    </div>
                    <div className="grid gap-3">
                      <Label htmlFor="class-name">Class Name</Label>
                      <Label id="class-name">{examDetails.course_name || 'N/A'}</Label>
                    </div>
                    <div className="grid gap-3">
                      <Label htmlFor="exam-title">Exam Title</Label>
                      <Label id="exam-title">{examDetails.exam_title || 'N/A'}</Label>
                    </div>
                    <div className="grid gap-3">
                      <Label htmlFor="student-grade">Current Grade</Label>
                      <Input id="student-grade" type="text" value={studentGrade} disabled />
                    </div>
                    <div className="grid gap-3">
                      <Label htmlFor="report-topic">Report Topic</Label>
                      <Textarea id="report-topic" value={reportString || ''} readOnly />
                    </div>
                    <div className="grid gap-3">
                      <h2 className="text-xl font-semibold">Messages</h2>
                      <div className="flex flex-col gap-4 max-h-60 overflow-y-auto">
                        {messages.map((message, index) => (
                          <div
                            key={index}
                            className={`relative p-4 rounded-lg ${message.sender_type === 'instructor' ? 'bg-blue-100 self-end' : 'bg-green-100 self-start'}`}
                            onMouseEnter={() => setHoveredMessage(index)}
                            onMouseLeave={() => setHoveredMessage(null)}
                          >
                            <p className="mb-2"><strong>{message.sender_type === 'instructor' ? 'Instructor' : 'Student'}:</strong></p>
                            <p>{message.message_text}</p>
                            <p className="text-xs text-gray-500">{new Date(message.message_time).toLocaleString()}</p>
                            {hoveredMessage === index && message.sender_id === user.sub && (
                              <button
                                className="absolute top-0 right-0 mt-2 mr-2"
                                onClick={() => handleDeleteMessage(message.message_id)}
                              >
                                <TrashIcon className="h-5 w-5 text-red-500" />
                              </button>
                            )}
                          </div>
                        ))}
                      </div>
                    </div>

                    <div className="grid gap-3 mt-4">
                      <Label htmlFor="message-content">Message</Label>
                      <Textarea
                        id="message-content"
                        placeholder="Type your message here..."
                        className="min-h-[9.5rem]"
                        value={newMessage}
                        onChange={(e) => setNewMessage(e.target.value)}
                      />
                    </div>
                    <Button onClick={handleSendMessage} className="mt-2">
                      Send Message
                    </Button>
                  </div>
                </CardContent>
              </Card>
            </div>
          </div>

          <div className="relative flex h-full min-h-[50vh] flex-col rounded-xl bg-muted/50 p-4 lg:col-span-2">
            <Badge variant="outline" className="absolute right-3 top-3">
              Exam
            </Badge>
            <div className="relative overflow-auto flex-1">
              <img
                src={imgSrc}
                alt="Exam File"
                width="100%"
                style={{ minHeight: '500px' }}
                onError={(e) => { e.target.onerror = null; e.target.src = 'fallback-image-path'; }}
              />
            </div>
          </div>
        </div>
      </div>
    </main>
  );
};

export default SubmitReport;
