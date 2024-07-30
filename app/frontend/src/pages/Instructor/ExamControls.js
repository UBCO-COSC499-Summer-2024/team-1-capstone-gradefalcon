import React from "react";
import { useLocation, useNavigate } from "react-router-dom";
import '../../css/App.css';
import { Button } from "../../components/ui/button";
import { Card, CardHeader, CardTitle, CardContent, CardDescription } from "../../components/ui/card";
import { Switch } from "../../components/ui/switch"; // Importing the Shadcn UI Switch component
import { useToast } from "../../components/ui/use-toast"; // Importing the useToast hook
import { Toaster } from "../../components/ui/toaster"; // Importing the Toaster component
import { useAuth0 } from "@auth0/auth0-react"; // Import Auth0

const ExamControls = () => {
  const { getAccessTokenSilently } = useAuth0(); // Get the token
  const location = useLocation();
  const navigate = useNavigate();
  const { classID, examTitle, questions, numQuestions, markingSchemes = [] } = location.state || {};
  const { toast } = useToast();

  const handleConfirm = async (event) => {
    event.preventDefault();
    try {
      const token = await getAccessTokenSilently(); // Get the token
      const response = await fetch("/api/exam/saveQuestions", {
        method: "POST",
        headers: {
          "Content-Type": "application/json",
          "Authorization": `Bearer ${token}`, // Include the token in the request
        },
        body: JSON.stringify({
          classID: classID,
          examTitle: examTitle,
          questions: questions,
          numQuestions: numQuestions,
          markingSchemes: markingSchemes,
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
            description: "Questions and marking schemes saved successfully.",
            type: "success",
          });
        } else {
          console.log("Response was not JSON");
        }
      } else {
        console.error("Failed to save questions and marking schemes");
        toast({
          title: "Error",
          description: "Failed to save questions and marking schemes.",
          type: "error",
        });
      }
    } catch (error) {
      console.error("Error:", error);
      toast({
        title: "Error",
        description: "An error occurred while saving questions and marking schemes.",
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
                    <Switch id="toggle-view-exam" data-testid="toggle-view-exam" />
                  </div>
                  <div className="control-item flex justify-between items-center mb-4">
                    <span>Students can view correct answers</span>
                    <Switch id="toggle-view-answers" data-testid="toggle-view-answers" />
                  </div>
                  <div className="control-item flex justify-between items-center mb-4">
                    <span>Students can see exam statistics</span>
                    <Switch id="toggle-view-stats" data-testid="toggle-view-stats" />
                  </div>
                </div>
                <div className="flex justify-between mt-4">
                  <Button size="sm" variant= "secondary" className="gap-1 green-button" onClick={() => window.history.back()}>
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
