import React, { useEffect, useState } from "react";
import { Link } from "react-router-dom";
import { ArrowUpRight, Plus } from "lucide-react";
import { Button } from "../../components/ui/button";
import { Card, CardHeader, CardTitle, CardContent } from "../../components/ui/card";
import '../../css/App.css';

const ExamBoard = () => {
  const [classData, setClassData] = useState([]);
  const [error, setError] = useState(null);

  useEffect(() => {
    const fetchClassData = async () => {
      try {
        const response = await fetch(`/api/exam/ExamBoard`, {
          method: "POST",
          headers: {
            "Content-Type": "application/json",
          },
          credentials: "include",
        });
        if (response.ok) {
          const data = await response.json();
          setClassData(data); // Set the class data state with the fetched data
        } else {
          setError("Failed to fetch class data");
        }
      } catch (error) {
        setError("Error fetching class data: " + error.message);
      }
    };

    fetchClassData();
  }, []);

  // Transform classData.classes into a structure that groups exams by course_id
  // Check if classData.classes is null and provide a fallback empty array
  const groupedExams = (classData.classes || []).reduce((acc, current) => {
    const { course_id, course_name, exam_title, class_id, exam_id } = current;
    if (!acc[course_id]) {
      acc[course_id] = {
        course_name,
        class_id,
        exams: [],
      };
    }
    acc[course_id].exams.push({ exam_title, exam_id });
    return acc;
  }, {});

  if (error) {
    return <div data-testid="error-message">{error}</div>;
  }

  if ((classData.classes || []).length === 0) {
    return <div data-testid="no-exams">No exams available</div>;
  }
  
  return (
    <main className="flex flex-col gap-4 p-6">
      <div className="w-full">
        <Card className="bg-white border rounded">
          <CardHeader className="flex justify-between px-6 py-4">
            <div>
              <CardTitle className="mb-2">Exam Board</CardTitle>
            </div>
          </CardHeader>
          <CardContent>
            <div className="grid gap-4">
              {Object.entries(groupedExams).map(
                ([courseId, { course_name, class_id, exams }]) => (
                  <Card key={courseId} data-testid={`course-${courseId}`} className="bg-white border rounded">
                    <CardHeader className="flex justify-between px-6 py-4">
                      <div>
                        <CardTitle className="mb-2">
                          {courseId} {course_name}
                        </CardTitle>
                      </div>
                      <Button asChild size="sm" className="ml-auto gap-1">
                        <Link 
                          to={`/NewExam/${class_id}`} className="create-new-btn" data-testid={`create-new-${courseId}`}
                        >
                          Create New
                          <Plus className="h-4 w-4" />
                        </Link>  
                      </Button>
                    </CardHeader>
                    <CardContent>
                      <div className="flex flex-col gap-4">
                        {exams.map((exam, index) => (
                          <div key={index} className="flex justify-between items-center" data-testid={`exam-${index}-${courseId}`}>
                            <p className="font-medium">{exam.exam_title}</p>
                            <Button asChild size="sm" className="ml-auto gap-1">
                              <Link 
                                to={`/UploadExams/${exam.exam_id}`} 
                                className="grade-exam-btn" 
                                data-testid={`grade-btn-${index}-${exam.exam_id}`}>
                                Grade Exam
                                <ArrowUpRight className="h-4 w-4" />
                              </Link>
                            </Button>
                          </div>
                        ))}
                      </div>
                    </CardContent>
                  </Card>
                )
              )}
            </div>
          </CardContent>
        </Card>
      </div>
    </main>
  );
};

export default ExamBoard;
