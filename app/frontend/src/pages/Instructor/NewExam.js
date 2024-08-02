import React, { useState, useEffect } from "react";
import { Link, useParams, useLocation, useNavigate } from "react-router-dom";
import "../../css/App.css";
import { Button } from "../../components/ui/button";
import {
  Card,
  CardHeader,
  CardTitle,
  CardContent,
  CardDescription,
} from "../../components/ui/card";
import { Label } from "../../components/ui/label";
import { Input } from "../../components/ui/input";
import {
  Select,
  SelectItem,
  SelectContent,
  SelectValue,
  SelectTrigger,
} from "../../components/ui/select";
import { ChevronLeftIcon, ExclamationCircleIcon } from "@heroicons/react/20/solid";
import { Form } from "../../components/ui/form";
import { Alert, AlertDescription, AlertTitle } from "../../components/ui/alert";
import { useAuth0 } from "@auth0/auth0-react";

const NewExam = () => {
  const { getAccessTokenSilently } = useAuth0(); // Get the token
  const [examTitle, setExamTitle] = useState("");
  const [selectedCourseId, setselectedCourseId] = useState(0);
  const [courses, setCourses] = useState([]);
  const [template, setTemplate] = useState("100mcq");
  const [showAlert, setShowAlert] = useState(false); // State to manage alert visibility
  const params = useParams();
  const navigate = useNavigate();
  const location = useLocation();
  const class_id = params.class_id || "defaultClassId"; // Set default class_id if not provided

  useEffect(() => {
    const fetchClassData = async () => {
      try {
        const token = await getAccessTokenSilently(); // Get the token
        const response = await fetch(`/api/exam/ExamBoard`, {
          method: "POST",
          headers: {
            "Content-Type": "application/json",
            Authorization: `Bearer ${token}`, // Include the token in the request
          },
          credentials: "include",
        });
        if (response.ok) {
          const data = await response.json();
          console.log(getUniqueClassData(data));
          setCourses(getUniqueClassData(data)); // Set the courses state with the fetched data
        } else {
          console.error("Failed to fetch class data");
        }
      } catch (error) {
        console.error("Error fetching class data: " + error.message);
      }
    };

    fetchClassData();
  }, [getAccessTokenSilently]);

  function getUniqueClassData(classData) {
    const uniqueClasses = (classData.classes || []).reduce((acc, current) => {
      if (!acc.has(current.class_id)) {
        acc.set(current.class_id, current.course_name);
      }
      return acc;
    }, new Map());

    const uniqueClassData = Array.from(uniqueClasses, ([classId, courseName]) => ({
      classId,
      courseName,
    }));

    return uniqueClassData;
  }

  const handleCourseChange = (value) => {
    setselectedCourseId(value);
  };

  const handleInputChange = (event) => {
    const value = event.target.value;
    // blocks chars that could cause error (i.e " ')
    const sanitizedValue = value.replace(/[^a-zA-Z0-9\s.,!?-]/g, "");
    setExamTitle(sanitizedValue);
  };

  const handleTemplateChange = (event) => {
    setTemplate(event.target.value);
  };

  const isFormValid = () => {
    return examTitle.trim() !== "" && selectedCourseId !== 0; // Simple validation check
  };

  const handleButtonClick = (event) => {
    if (!isFormValid()) {
      event.preventDefault();
      setShowAlert(true);
    } else {
      setShowAlert(false);
    }
  };

  // useEffect(() => {
  //   if (location.state) {
  //     setCourseId(location.state.courseID); // Set courseID from state
  //     setTemplate(location.state.template); // Set Template from state
  //     setCourses(location.state.courses); // Set courses from state
  //     console.log(location.state.courses);
  //   }
  // }, [location.state]);

  return (
    <div className="mx-auto grid max-w-[70rem] flex-1 auto-rows-max gap-8">
      <div className="flex items-center gap-4">
        <Button
          variant="outline"
          size="icon"
          className="h-10 w-10"
          onClick={() => window.history.back()}
        >
          <ChevronLeftIcon className="h-4 w-4" />
          <span className="sr-only">Back</span>
        </Button>
        <h1 className="flex-1 shrink-0 whitespace-nowrap text-xl font-semibold tracking-tight sm:grow-0">
          Create Exam
        </h1>
        <div className="hidden items-center gap-2 md:ml-auto md:flex"></div>
      </div>

      {showAlert && (
        <Alert className="mb-4">
          <ExclamationCircleIcon className="h-4 w-4" />
          <AlertTitle>Heads up!</AlertTitle>
          <AlertDescription>Please fill in all required fields before proceeding.</AlertDescription>
        </Alert>
      )}

      <div className="grid gap-8 md:grid-cols-2 lg:grid-cols-2">
        <div className="grid auto-rows-max items-start gap-8">
          <Card className="bg-white border rounded-lg p-6">
            <CardHeader>
              <CardTitle>Exam Details</CardTitle>
              <CardDescription>The following details will define the exam details</CardDescription>
            </CardHeader>
            <CardContent>
              <div className="grid gap-6">
                <div className="grid gap-3">
                  <Label htmlFor="exam-title">Exam Name</Label>
                  <Input
                    id="exam-title"
                    type="text"
                    className="w-full"
                    placeholder="Enter exam title"
                    value={examTitle}
                    onChange={handleInputChange}
                    data-testid="exam-title-input"
                    required
                  />
                </div>
              </div>
            </CardContent>
          </Card>
        </div>

        <div className="grid auto-rows-max items-start gap-4 lg:col-span-1 lg:gap-8">
          <Card className="bg-white border rounded md:w-2/3">
            <CardHeader>
              <CardTitle>Select Course</CardTitle>
            </CardHeader>
            <CardContent>
              <div className="grid gap-6">
                <div className="grid gap-3">
                  <Label htmlFor="course">Course</Label>
                  <Select onValueChange={handleCourseChange}>
                    <SelectTrigger id="course" aria-label="Select course">
                      <SelectValue placeholder="Select course" />
                    </SelectTrigger>
                    <SelectContent>
                      {courses.map((course) => (
                        <SelectItem id={course.classId} value={course.classId}>
                          {course.courseName}
                        </SelectItem>
                      ))}
                    </SelectContent>
                  </Select>
                </div>
              </div>
            </CardContent>
          </Card>
        </div>
      </div>

      <div className="grid gap-8 md:grid-cols-2 lg:grid-cols-2">
        <div className="grid auto-rows-max items-start gap-8">
          <Card className="bg-white border rounded-lg p-6">
            <CardHeader className="flex justify-between px-6 py-4">
              <CardTitle className="mb-2">Upload Exam Options</CardTitle>
            </CardHeader>
            <CardContent>
              <Form>
                <div className="grid gap-6">
                  <div className="grid gap-3">
                    <Label htmlFor="answer-key">Answer Key</Label>
                    <div className="flex gap-4 mt-1">
                      <Button asChild size="sm">
                        <Link
                          to={isFormValid() ? "/UploadExamKey" : "#"}
                          state={{ examTitle: examTitle, classID: selectedCourseId }} // Pass examTitle as state
                          data-testid="upload-answer-key-btn"
                          onClick={handleButtonClick}
                        >
                          Upload Answer Key
                        </Link>
                      </Button>
                      <Button asChild size="sm">
                        <Link
                          to={isFormValid() ? "/ManualExamKey" : "#"}
                          state={{ examTitle: examTitle, classID: selectedCourseId }}
                          data-testid="manual-answer-key-btn"
                          onClick={handleButtonClick}
                        >
                          Manually Select Answers
                        </Link>
                      </Button>
                    </div>
                  </div>
                </div>
              </Form>
            </CardContent>
          </Card>
        </div>
      </div>
    </div>
  );
};

export default NewExam;
