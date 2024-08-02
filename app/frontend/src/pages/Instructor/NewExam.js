import React, { useState, useEffect } from "react";
import { Link, useNavigate } from "react-router-dom";
import "../../css/App.css";
import { Button } from "../../components/ui/button";
import { Card, CardHeader, CardTitle, CardContent, CardDescription } from "../../components/ui/card";
import { Label } from "../../components/ui/label";
import { Input } from "../../components/ui/input";
import { Select, SelectItem, SelectContent, SelectValue, SelectTrigger } from "../../components/ui/select";
import { Tabs, TabsList, TabsTrigger, TabsContent } from "../../components/ui/tabs";
import { RadioGroup, RadioGroupItem } from "../../components/ui/radio-group";
import { Alert, AlertDescription, AlertTitle } from "../../components/ui/alert";
import { ChevronRightIcon, ChevronLeftIcon, ExclamationCircleIcon } from "@heroicons/react/20/solid";
import { useAuth0 } from "@auth0/auth0-react";
import CustomBubbleSheet from "../../components/CustomBubbleSheet";  // Importing the CustomBubbleSheet component

const NewExam = () => {
  const { getAccessTokenSilently } = useAuth0();
  const [examTitle, setExamTitle] = useState("");
  const [courseId, setCourseId] = useState("");
  const [selectedClassId, setSelectedClassId] = useState(""); 
  const [template, setTemplate] = useState("100mcq");
  const [classes, setClasses] = useState([]);
  const [showAlert, setShowAlert] = useState(false);
  const [error, setError] = useState(null);
  const [isCustomTemplate, setIsCustomTemplate] = useState(false);
  const [currentTab, setCurrentTab] = useState("details"); // Track current tab
  const navigate = useNavigate();

  useEffect(() => {
    fetchClasses(); // Fetch classes when component mounts
  }, []);

  const fetchClasses = async () => {
    try {
      const token = await getAccessTokenSilently();
      const response = await fetch("/api/class/classes", {
        method: "POST",
        headers: {
          "Content-Type": "application/json",
          "Authorization": `Bearer ${token}`,
        },
        credentials: "include",
      });
      if (response.ok) {
        const data = await response.json();
        setClasses(data);
      } else {
        setError("Failed to fetch classes");
      }
    } catch (error) {
      setError("Error fetching classes");
    }
  };

  const handleInputChange = (event) => {
    setExamTitle(event.target.value.replace(/[^a-zA-Z0-9\s.,!?-]/g, ""));
  };

  const handleTemplateChange = (value) => {
    setTemplate(value);
    setIsCustomTemplate(value === "custom");
  };

  const handleClassChange = (value) => {
    setSelectedClassId(value);
    setCourseId(value);
  };

  const isFormValid = () => {
    return examTitle.trim() !== "" && courseId !== "" && template !== "";
  };

  const handleNext = () => {
    if (currentTab === "details") setCurrentTab("template");
    if (currentTab === "template") setCurrentTab("upload");
  };

  const handleBack = () => {
    if (currentTab === "upload") setCurrentTab("template");
    else if (currentTab === "template") setCurrentTab("details");
  };

  const handleButtonClick = (event) => {
    if (!isFormValid()) {
      event.preventDefault();
      setShowAlert(true);
    } else {
      setShowAlert(false);
    }
  };

  return (
    <main className="flex flex-col gap-4 p-2">
      <div className="w-full mx-auto flex items-center gap-8">
        <Button
          variant="outline"
          size="icon"
          className="h-10 w-10"
          onClick={() => window.history.back()}
        >
          <ChevronLeftIcon className="h-4 w-4" />
          <span className="sr-only">Back</span>
        </Button>
        <h1 className="text-3xl font-semibold">
          Create Exam
        </h1>
      </div>

      <Tabs defaultValue={currentTab} value={currentTab} onValueChange={setCurrentTab}>
      <div className="w-full text-center">

      {showAlert && (
        <Alert className="mb-4">
          <ExclamationCircleIcon className="h-4 w-4" />
          <AlertTitle>Heads up!</AlertTitle>
          <AlertDescription>Please fill in all required fields before proceeding.</AlertDescription>
        </Alert>
      )}

      {error && (
        <Alert className="mb-4">
          <ExclamationCircleIcon className="h-4 w-4" />
          <AlertTitle>Error!</AlertTitle>
          <AlertDescription>{error}</AlertDescription>
        </Alert>
      )}

        <TabsList className="inline-block">
          <TabsTrigger value="details">Exam Details</TabsTrigger>
          <TabsTrigger value="template">Select Template</TabsTrigger>
          <TabsTrigger value="upload">Upload Exam Key</TabsTrigger>
        </TabsList>
      </div>

        {/* Exam Details Tab */}
          <TabsContent value="details">
          <div className="w-full flex justify-center">
          <div className="grid gap-8 md:grid-cols-1 lg:grid-cols-1 max-w-2xl"> 
              <Card className="bg-white border rounded-lg p-8">
                <CardHeader>
                  <CardTitle>Exam Details</CardTitle>
                  <CardDescription>Set the name of the exam and select the course</CardDescription>
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
                        required
                      />
                    </div>
                    <div className="grid gap-3">
                      <Label htmlFor="class">Class</Label>
                      <Select onValueChange={handleClassChange}>
                        <SelectTrigger id="class" aria-label="Select class">
                          <SelectValue placeholder="Select class" />
                        </SelectTrigger>
                        <SelectContent>
                          {classes.map((cls) => (
                            <SelectItem key={cls.class_id} value={cls.class_id}>
                              {cls.course_name}
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
        </TabsContent>

        {/* Select Template Tab */}
        <TabsContent value="template">
        <div className="w-full flex justify-center">
        <div className="grid gap-8 md:grid-cols-1 lg:grid-cols-1 w-2/3"> 
          <Card className="bg-white border rounded-lg p-6 w-full">
              <CardHeader>
                <CardTitle>Select Template</CardTitle>
                <CardDescription>Select a template for the exam. You have the option of choosing the default templates or creating a custom template.</CardDescription>
              </CardHeader>
              <CardContent>
              <RadioGroup defaultValue="100mcq" onValueChange={handleTemplateChange}>
                <div className="flex items-center space-x-2">
                  <RadioGroupItem value="100mcq" id="r1" />
                  <Label htmlFor="r1">100 MCQ</Label>
                </div>
                <div className="flex items-center space-x-2">
                  <RadioGroupItem value="200mcq" id="r2" />
                  <Label htmlFor="r2">200 MCQ</Label>
                </div>
                <div className="flex items-center space-x-2">
                  <RadioGroupItem value="custom" id="r3" />
                  <Label htmlFor="r3">Custom Template</Label>
                </div>
              </RadioGroup>
                {isCustomTemplate && (
                  <CustomBubbleSheet  courseId={courseId} examTitle={examTitle} classId= {selectedClassId} />  // Display the CustomBubbleSheet component if custom template is selected
                )}
              </CardContent>
            </Card>
          </div>
          </div>
        </TabsContent>

        {/* Upload Exam Key Tab */}
        <TabsContent value="upload">
        <div className="w-full flex justify-center">
        <div className="grid gap-8 md:grid-cols-1 lg:grid-cols-1 w-1/3">
             <Card className="bg-white border rounded-lg p-6 w-full">
              <CardHeader className="flex justify-between px-6 py-4">
                <CardTitle className="mb-2">Upload Exam Key</CardTitle>
                <CardDescription>Choose how you would like to create the exam key</CardDescription>
              </CardHeader>
              <CardContent>
                <div className="grid gap-3">
                  <Button asChild size="sm" className="px-2 py-1">
                    <Link
                      to={isFormValid() ? "/ManualExamKey" : "#"}
                      state={{ examTitle: examTitle, classID: courseId, template }}
                      onClick={handleButtonClick}
                    >
                      Manually Select Answers
                    </Link>
                  </Button>
                  <Button asChild size="sm" variant= "secondary" className="px-2 py-1">
                    <Link
                      to={isFormValid() ? "/UploadExamKey" : "#"}
                      state={{ examTitle: examTitle, classID: courseId, template }}
                      onClick={handleButtonClick}
                    >
                      Upload Answer Key
                    </Link>
                  </Button>
                </div>
              </CardContent>
            </Card>
          </div>
          </div>
        </TabsContent>
      </Tabs>

      {/* Navigation Buttons */}
      <div className="w-full flex justify-center p-4 gap-x-80">
        <Button onClick={handleBack} variant="outline" disabled={currentTab === "details"}>
          <ChevronLeftIcon className="h-4 w-4" />
        </Button>
        <Button onClick={handleNext} disabled={currentTab === "upload"}>
          <ChevronRightIcon className="h-4 w-4" />
        </Button>
      </div>
    </main>
  );
};

export default NewExam;
