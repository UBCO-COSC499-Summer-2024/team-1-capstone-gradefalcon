import React, { useState, useEffect } from "react";
import { Link, useParams, useNavigate, useLocation } from "react-router-dom";
import '../../css/App.css';
import { Button } from "../../components/ui/button";
import { Card, CardHeader, CardTitle, CardContent, CardDescription } from "../../components/ui/card";

const NewExam = () => {
  const [examTitle, setExamTitle] = useState("");
  const [userName, setUserName] = useState("");
  const [userID, setUserID] = useState("");
  const [className, setClassName] = useState("");
  const [courseId, setCourseId] = useState("");
  const params = useParams();
  const location = useLocation();
  const class_id = params.class_id;
  const navigate = useNavigate();

  const handleInputChange = (event) => {
    const value = event.target.value;
    const sanitizedValue = value.replace(/[^a-zA-Z0-9\s.,!?-]/g, "");
    setExamTitle(sanitizedValue);
  };

  const isFormValid = () => {
    return examTitle.trim() !== "";
  };

  const handleLogout = async () => {
    try {
      const response = await fetch("/api/auth/logout", {
        method: "POST",
        headers: {
          "Content-Type": "application/json",
        },
      });
      if (response.ok) {
        alert("Logged out");
        navigate("/");
      } else {
        console.error("Logout failed");
      }
    } catch (error) {
      console.error("Error:", error);
    }
  };

  const handleUploadClick = (e) => {
    if (!isFormValid()) {
      e.preventDefault();
      alert('Please enter an exam title before uploading the answer key.');
    }
  };

  useEffect(() => {
    if (location.state) {
      setUserName(location.state.userName);
      setUserID(location.state.userID);
      setClassName(location.state.className);
      setCourseId(location.state.courseID);  // Set courseID from state
    }
  }, [location.state]);

  return (
    <main className="flex flex-col gap-4 p-8 bg-gradient-to-r from-gradient-start to-gradient-end">
      <div>
        <h1 className="text-3xl font-bold mb-4">Create New Exam</h1>
        <div className="grid gap-4 lg:grid-cols-1">
          <Card className="bg-white border rounded">
            <CardHeader className="flex justify-between px-6 py-4">
              <div>
                <CardTitle className="mb-2">General</CardTitle>
                <CardDescription>*The following details will be printed on the exam*</CardDescription>
              </div>
              <Button asChild size="sm" className="ml-auto gap-1">
                <span onClick={() => window.history.back()}>Back</span>
              </Button>
            </CardHeader>
            <CardContent>
              <form>
                <div className="mb-4">
                  <label htmlFor="exam-title" className="block text-sm font-medium text-gray-700">Exam Title:</label>
                  <input
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
                  <label htmlFor="answer-key" className="block text-sm font-medium text-gray-700">Answer Key:</label>
                  <div className="flex gap-4 mt-1">
                    <Button asChild size="sm" >
                      <Link to="/UploadExamKey" data-testid="upload-answer-key-btn" onClick={handleUploadClick}>
                        Upload Answer Key
                      </Link>
                    </Button>
                    <Button asChild size="sm" >
                      <Link to={isFormValid() ? "/ManualExamKey" : "#"} state={{ examTitle: examTitle, classID: class_id }} data-testid="manual-answer-key-btn">
                        Manually Select Answers
                      </Link>
                    </Button>
                  </div>
                </div>
              </form>
            </CardContent>
          </Card>
        </div>
      </div>
    </main>
  );
};

export default NewExam;
