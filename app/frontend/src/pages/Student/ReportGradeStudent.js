import React from 'react';
import { useNavigate } from "react-router-dom";
import { Button } from "../../components/ui/button";
import { Card, CardHeader, CardTitle, CardContent } from "../../components/ui/card";
import { Input } from "../../components/ui/input";
import { Textarea } from "../../components/ui/textarea";
import { ChevronLeft, Paperclip } from "lucide-react";

const ReportGradeStudent = () => {
  const navigate = useNavigate();

  return (
    <main className="flex flex-col gap-4 p-6">
      <div className="flex justify-between items-center w-full mb-4">
        <Button
          className="bg-primary text-white flex items-center"
          onClick={() => navigate(-1)}
        >
          <ChevronLeft className="w-4 h-4" />
        </Button>
      </div>
      <div className="flex-1">
        <Card className="bg-white border rounded h-full">
          <CardHeader className="flex justify-between px-6 py-4">
            <CardTitle className="mb-2">Make a Report</CardTitle>
          </CardHeader>
          <CardContent className="flex-1">
            <div className="mb-4">
              <label htmlFor="grade" className="block text-sm font-medium text-gray-700">
                Grade
              </label>
              <Input
                id="grade"
                type="text"
                placeholder="grade to be edited (remove the placeholder)"
                className="mt-1 block w-full"
              />
            </div>
            <div>
              <label htmlFor="content" className="block text-sm font-medium text-gray-700">
                Content
              </label>
              <Textarea
                id="content"
                rows={4}
                placeholder="Student comments..."
                className="mt-1 block w-full"
              />
            </div>
          </CardContent>
        </Card>
      </div>
      <div className="flex-1">
        <Card className="bg-white border rounded h-full">
          <CardContent className="flex-1">
            <div className="flex items-center space-x-2">
              <Textarea
                rows={4}
                placeholder="Type your message here..."
                className="mt-1 block w-full"
              />
              <Button className="bg-gray-200 text-gray-700 p-2">
                <Paperclip className="w-4 h-4" />
              </Button>
            </div>
          </CardContent>
        </Card>
      </div>
      <div className="flex justify-end mt-4">
        <Button className="bg-primary text-white">
          Submit
        </Button>
      </div>
    </main>
  );
};

export default ReportGradeStudent;
