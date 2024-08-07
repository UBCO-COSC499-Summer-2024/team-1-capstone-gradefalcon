import { useState, useEffect } from "react";
import { Search } from "lucide-react"; // Import Search icon
import { Card, CardHeader, CardTitle, CardContent, CardDescription } from "../../components/ui/card";
import { ScrollArea } from "../../components/ui/scroll-area";
import { Input } from "../../components/ui/input";
import { useAuth0 } from "@auth0/auth0-react";
import { Table, TableHeader, TableRow, TableHead, TableBody, TableCell } from "../../components/ui/table"; // Import table components
import { Badge } from "../../components/ui/badge"; // Import Badge component
import { Tabs, TabsContent, TabsList, TabsTrigger } from "../../components/ui/tabs"; // Import Tabs components

export default function StudentDashboard() {
  const { getAccessTokenSilently } = useAuth0();
  const [courses, setCourses] = useState([]);
  const [exams, setExams] = useState([]);
  const [filteredExams, setFilteredExams] = useState([]);
  const [examSearchTerm, setExamSearchTerm] = useState("");
  const [filter, setFilter] = useState("all"); // State to manage the active tab

  useEffect(() => {
    const fetchCourses = async () => {
      try {
        const token = await getAccessTokenSilently();
        const response = await fetch(`/api/class/student/courses`, {
          method: "GET",
          headers: {
            "Content-Type": "application/json",
            Authorization: `Bearer ${token}`,
          },
          credentials: "include",
        });
        if (response.ok) {
          const data = await response.json();
          setCourses(data);
        } else {
          console.error("Failed to fetch courses");
        }
      } catch (err) {
        console.error("Error fetching courses:", err);
      }
    };

    const fetchExams = async () => {
      try {
        const token = await getAccessTokenSilently();
        const response = await fetch(`/api/exam/student/exams`, {
          method: "GET",
          headers: {
            "Content-Type": "application/json",
            Authorization: `Bearer ${token}`,
          },
          credentials: "include",
        });
        if (response.ok) {
          const data = await response.json();
          setExams(data.exams);
          setFilteredExams(data.exams); // Initialize filteredExams with the fetched data
        } else {
          console.error("Failed to fetch exams");
        }
      } catch (err) {
        console.error("Error fetching exams:", err);
      }
    };

    fetchCourses();
    fetchExams();
  }, [getAccessTokenSilently]);

  useEffect(() => {
    setFilteredExams(
      exams.filter((exam) => {
        const matchesSearchTerm = exam.exam_title?.toLowerCase().includes(examSearchTerm.toLowerCase());
        if (filter === "all") return matchesSearchTerm;
        return matchesSearchTerm && exam.course_id === filter;
      })
    );
  }, [examSearchTerm, exams, filter]);

  const getExamStatusColor = (status) => {
    return status ? "default" : "destructive"; // "default" for graded, "destructive" for not graded
  };

  return (
    <div className="flex flex-col gap-4 h-screen">
      <div className="flex-1">
        <Card className="bg-white border rounded h-full">
          <CardHeader className="flex justify-between px-6 py-4">
            <div className="flex justify-between items-center">
              <CardTitle className="mb-2">Exam Board</CardTitle>
            </div>
            <CardDescription>Recent exams from your classes.</CardDescription>
          </CardHeader>
          <CardContent className="flex-1">
            <div className="relative mb-4">
              <Search className="absolute left-2.5 top-2.5 h-4 w-4 text-muted-foreground" />
              <Input
                type="search"
                placeholder="Search exams..."
                className="w-full pl-8"
                value={examSearchTerm}
                onChange={(e) => setExamSearchTerm(e.target.value)}
              />
            </div>
            <Tabs value={filter} onValueChange={setFilter} className="w-full">
              <TabsList className="grid w-full grid-cols-3">
                <TabsTrigger value="all">All</TabsTrigger>
                {courses.map((course) => (
                  <TabsTrigger key={course.class_id} value={course.course_id}>
                    {course.course_name}
                  </TabsTrigger>
                ))}
              </TabsList>
              <TabsContent value={filter}>
                <ScrollArea className="h-80">
                  <Table>
                    <TableHeader>
                      <TableRow>
                        <TableHead>Exam Name</TableHead>
                        <TableHead className="hidden sm:table-cell">Course</TableHead>
                        <TableHead>Status</TableHead>
                      </TableRow>
                    </TableHeader>
                    <TableBody>
                      {filteredExams.length > 0 ? (
                        filteredExams.map((exam, index) => (
                          <TableRow key={index} className="hover:bg-gray-100 cursor-pointer">
                            <TableCell>
                              <span className="font-bold">{exam.exam_title}</span>
                            </TableCell>
                            <TableCell className="hidden sm:table-cell">{exam.course_id}</TableCell>
                            <TableCell>
                              <Badge variant={getExamStatusColor(exam.graded)}>
                                {exam.graded ? "Graded" : "Not graded"}
                              </Badge>
                            </TableCell>
                          </TableRow>
                        ))
                      ) : (
                        <TableRow>
                          <TableCell colSpan={3} className="text-center text-muted-foreground">
                            No exams available.
                          </TableCell>
                        </TableRow>
                      )}
                    </TableBody>
                  </Table>
                </ScrollArea>
              </TabsContent>
            </Tabs>
          </CardContent>
        </Card>
      </div>
    </div>
  );
}


