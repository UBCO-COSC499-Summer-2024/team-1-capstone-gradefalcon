import React, { useState, useEffect } from "react";
import { Link, useParams, useNavigate, useLocation } from "react-router-dom";
import "../../css/App.css";
import { Button } from "../../components/ui/button";
import { Input } from "../../components/ui/input";
import { Card, CardHeader, CardTitle, CardContent, CardDescription } from "../../components/ui/card";
import { useToast } from "../../components/ui/use-toast";
import { ToastProvider, ToastViewport } from "../../components/ui/toast";
import { Select, SelectTrigger, SelectValue, SelectContent, SelectItem } from "../../components/ui/select";

const NewExamForm = ({ setIsDialogOpen, onExamCreated }) => {
  const [examTitle, setExamTitle] = useState("");
  const [courses, setCourses] = useState([]);
  const [selectedCourse, setSelectedCourse] = useState("");
  const params = useParams();
  const location = useLocation();
  const navigate = useNavigate();
  const { toast } = useToast();

  const handleInputChange = (event) => {
    const value = event.target.value;
    const sanitizedValue = value.replace(/[^a-zA-Z0-9\s.,!?-]/g, "");
    setExamTitle(sanitizedValue);
  };

  const handleCourseChange = (value) => {
    setSelectedCourse(value);
  };

  const isFormValid = () => {
    return examTitle.trim() !== "" && selectedCourse !== "";
  };

  const handleSubmit = async (e) => {
    e.preventDefault();
    if (!isFormValid()) {
      alert('Please enter an exam title and select a course.');
      return;
    }
    try {
      const response = await fetch("/api/exam/create", {
        method: "POST",
        headers: {
          "Content-Type": "application/json",
        },
        body: JSON.stringify({
          examTitle,
          courseId: selectedCourse,
          class_id: params.class_id,
        }),
      });

      if (response.ok) {
        const data = await response.json();
        toast({
          title: "Exam created successfully",
          description: "The exam has been created successfully.",
          variant: "default"
        });
        onExamCreated(data); // Notify parent component about the new exam
        setIsDialogOpen(false); // Close the dialog
      } else {
        console.error("Failed to create exam");
        toast({
          title: "An error occurred",
          description: "An error occurred while creating the exam. Please try again.",
          variant: "destructive"
        });
      }
    } catch (error) {
      console.error("Error creating exam:", error);
      toast({
        title: "An error occurred",
        description: "An error occurred while creating the exam. Please try again.",
        variant: "destructive"
      });
    }
  };

  useEffect(() => {
    const fetchCourses = async () => {
      try {
        const response = await fetch("/api/class/getAllCourses");  // Updated endpoint
        const data = await response.json();
        setCourses(data);
      } catch (error) {
        console.error("Error fetching courses:", error);
      }
    };

    fetchCourses();
  }, []);

  return (
    <ToastProvider>
      <form onSubmit={handleSubmit}>
        <Card className="p-4">
          <CardHeader>
            <CardTitle>Create New Exam</CardTitle>
            <CardDescription>Enter the details for the new exam and upload the answer key.</CardDescription>
          </CardHeader>
          <CardContent>
            <div className="mb-4">
              <label htmlFor="exam-title" className="block text-sm font-medium text-gray-700">Exam Title:</label>
              <Input
                type="text"
                id="exam-title"
                className="input-field mt-1 block w-full"
                placeholder="Enter exam title"
                value={examTitle}
                onChange={handleInputChange}
                data-testid="exam-title-input"
                required
              />
            </div>
            <div className="mb-4">
              <label htmlFor="course-select" className="block text-sm font-medium text-gray-700">Select Course:</label>
              <Select onValueChange={handleCourseChange} value={selectedCourse} required>
                <SelectTrigger className="mt-1 block w-full">
                  <SelectValue placeholder="Select a course" />
                </SelectTrigger>
                <SelectContent>
                  {courses.map((course) => (
                    <SelectItem key={course.class_id} value={course.class_id}>
                      {course.course_name}
                    </SelectItem>
                  ))}
                </SelectContent>
              </Select>
            </div>
            <div className="mb-4">
              <label htmlFor="answer-key" className="block text-sm font-medium text-gray-700">Answer Key:</label>
              <div className="flex gap-4 mt-1">
                <Button asChild size="sm">
                  <Link to="/UploadExamKey" data-testid="upload-answer-key-btn">
                    Upload Answer Key
                  </Link>
                </Button>
                <Button asChild size="sm">
                  <Link to={isFormValid() ? "/ManualExamKey" : "#"} state={{ examTitle: examTitle, classID: params.class_id }} data-testid="manual-answer-key-btn">
                    Manually Select Answers
                  </Link>
                </Button>
              </div>
            </div>
            <div className="flex gap-4 mt-4">
              <Button type="submit" size="sm">
                <span>Create Exam</span>
              </Button>
            </div>
          </CardContent>
        </Card>
        <ToastViewport />
      </form>
    </ToastProvider>
  );
};

export default NewExamForm;
