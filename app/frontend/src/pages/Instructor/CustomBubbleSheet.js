import React, { useState } from "react";
import { Button } from "../../components/ui/button";
import { Input } from "../../components/ui/input";
import { Label } from "../../components/ui/label";
import { useAuth0 } from "@auth0/auth0-react"; // Import Auth0
import { Card, CardHeader, CardTitle, CardContent, CardDescription } from "../../components/ui/card";

const CustomBubbleSheet = () => {
  const { getAccessTokenSilently } = useAuth0(); // Get the token
  const [numQuestions, setNumQuestions] = useState(10);
  const [numOptions, setNumOptions] = useState(4);

  const handleGeneratePDF = async () => {
    try {
      const token = await getAccessTokenSilently(); // Get the token
      const response = await fetch("/api/exam/generateCustomBubbleSheet", {
        method: "POST",
        headers: {
          "Content-Type": "application/json",
          "Authorization": `Bearer ${token}`, // Include the token in the request
        },
        body: JSON.stringify({ numQuestions, numOptions }),
      });

      if (!response.ok) {
        throw new Error("Failed to generate PDF");
      }

      const blob = await response.blob();
      const url = window.URL.createObjectURL(new Blob([blob]));
      const link = document.createElement("a");
      link.href = url;
      link.setAttribute("download", "custom_bubble_sheet.pdf");
      document.body.appendChild(link);
      link.click();
      link.parentNode.removeChild(link);
    } catch (error) {
      console.error("Error generating PDF:", error);
    }
  };

  return (
    <div className="flex flex-row justify-center items-center gap-8 w-full">
      <Card className="bg-white border rounded-lg p-6 w-full md:w-1/2">
        <CardHeader className="flex justify-between px-6 py-4">
          <CardTitle>Create Custom Bubble Sheet</CardTitle>
          <CardDescription>Enter the number of questions (limit: 252) and the number of options per question (limit: 5) you would like.</CardDescription>
        </CardHeader>
        <CardContent>
            <div className="p-8 max-w-xl mx-auto">
                <h1 className="text-3xl font-bold mb-6"></h1>
                <div className="mb-4">
            <Label htmlFor="num-questions" className="block text-sm font-medium text-gray-700">
            Number of Questions
            </Label>
            <Input
            type="number"
            id="num-questions"
            value={numQuestions}
            onChange={(e) => setNumQuestions(parseInt(e.target.value, 10))}
            min={5}
            max={252}
            className="mt-1 block w-full"
            />
        </div>
        <div className="mb-6">
            <Label htmlFor="num-options" className="block text-sm font-medium text-gray-700">
            Number of Options per Question
            </Label>
            <Input
            type="number"
            id="num-options"
            value={numOptions}
            onChange={(e) => setNumOptions(parseInt(e.target.value, 10))}
            min={2}
            max={26}
            className="mt-1 block w-full"
            />
        </div>
            <Button onClick={handleGeneratePDF} className="mt-4">
              Generate PDF
            </Button>
          </div>
        </CardContent>
      </Card>
    </div>
  );
};

export default CustomBubbleSheet;
