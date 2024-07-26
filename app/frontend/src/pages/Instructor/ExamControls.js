import React from "react";
import { useLocation, useNavigate } from "react-router-dom";
import '../../css/App.css';
import { Button } from "../../components/ui/button";
import { Card, CardHeader, CardTitle, CardContent, CardDescription } from "../../components/ui/card";
import { Switch } from "../../components/ui/switch"; // Importing the Shadcn UI Switch component
import { useToast } from "../../components/ui/use-toast"; // Importing the useToast hook
import { Toaster } from "../../components/ui/toaster"; // Importing the Toaster component

const ExamControls = () => {
  const location = useLocation();
  const navigate = useNavigate();
  const { classID, examTitle, questions, numQuestions } = location.state || {};
  const { toast } = useToast();

  const handleConfirm = async (event) => {
    event.preventDefault();
    try {
      const response = await fetch("/api/exam/saveQuestions", {
        method: "POST",
        headers: {
          "Content-Type": "application/json",
        },
        body: JSON.stringify({
          classID: classID,
          examTitle: examTitle,
          questions: questions,
          numQuestions: numQuestions,
        }),
      });
      console.log(response);
      
      if (response.ok) {
        const contentType = response.headers.get("Content-Type");
        if (contentType && contentType.indexOf("application/json") !== -1) {
          const data = await response.json();
          console.log(data);
          toast({
            title: "Success",
            description: "Questions saved successfully.",
            type: "success",
          });
        } else {
          console.log("Response was not JSON");
        }
      } else {
        console.error("Failed to save questions");
        toast({
          title: "Error",
          description: "Failed to save questions.",
          type: "error",
        });
      }
    } catch (error) {
      console.error("Error:", error);
      toast({
        title: "Error",
        description: "An error occurred while saving questions.",
        type: "error",
      });
    }
    navigate("/ExamBoard"); // Navigation to ExamBoard page
  };

  return (
    <>
      <main className="flex flex-col gap-4 p-8 bg-gradient-to-r from-gradient-start to-gradient-end">
        <div>
          <h1 className="text-3xl font-bold mb-4">Create New Exam</h1>
          <h2 className="text-xl mb-4">{examTitle}</h2>
          <div className="grid gap-4 lg:grid-cols-1">
            <Card className="bg-white border rounded">
              <CardHeader className="px-6 py-4">
                <CardTitle className="mb-2">Exam Controls</CardTitle>
                <CardDescription>Manage exam settings for students.</CardDescription>
              </CardHeader>
              <CardContent>
                <div className="controls">
                  <div className="control-item flex justify-between items-center mb-4">
                    <span>Students can view their exam</span>
                    <Switch id="toggle-view-exam" />
                  </div>
                  <div className="control-item flex justify-between items-center mb-4">
                    <span>Students can view correct answers</span>
                    <Switch id="toggle-view-answers" />
                  </div>
                  <div className="control-item flex justify-between items-center mb-4">
                    <span>Students can see exam statistics</span>
                    <Switch id="toggle-view-stats" />
                  </div>
                </div>
                <div className="flex justify-between mt-4">
                  <Button size="sm" className="gap-1 green-button" onClick={() => window.history.back()}>
                    Back
                  </Button>
                  <Button size="sm" className="gap-1 green-button" onClick={handleConfirm}>
                    Confirm
                  </Button>
                </div>
              </CardContent>
            </Card>
          </div>
        </div>
      </main>
      <Toaster /> {/* Adding the Toaster component */}
    </>
  );
};

export default ExamControls;

