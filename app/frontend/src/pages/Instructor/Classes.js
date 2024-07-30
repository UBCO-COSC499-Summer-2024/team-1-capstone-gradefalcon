import React, { useState, useEffect } from "react";
import { Link, useNavigate } from "react-router-dom";
import "../../css/App.css";
import { Button } from "../../components/ui/button";
import { Card, CardHeader, CardTitle, CardContent, CardDescription } from "../../components/ui/card";
import { Table, TableHeader, TableRow, TableHead, TableBody, TableCell } from "../../components/ui/table";
import { ScrollArea } from "../../components/ui/scroll-area";
import { Dialog, DialogTrigger, DialogContent, DialogHeader, DialogTitle, DialogDescription, DialogClose } from "../../components/ui/dialog";
import NewClassForm from "../../components/NewClassForm";
import { ArrowUpRight } from "lucide-react";

const Classes = () => {
  const navigate = useNavigate();
  const [classes, setClasses] = useState([]);
  const [error, setError] = useState(null);

  const fetchClasses = async () => {
    try {
      const response = await fetch("/api/class/classes", {
        method: "POST",
        headers: { "Content-Type": "application/json" },
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

  useEffect(() => {
    fetchClasses();
  }, []);

  return (
    <main className="flex flex-col gap-4">
      <div>
        <h1 className="text-3xl font-bold mb-4">Classes</h1>
        <div className="grid gap-4 lg:grid-cols-1">
          <Card className="bg-white border rounded">
            <CardHeader className="flex justify-between px-6 py-4">
              <div>
                <CardTitle className="mb-2">Your Classes</CardTitle>
                <CardDescription>List of all your classes.</CardDescription>
              </div>
            </CardHeader>
            <CardContent>
              <ScrollArea className="max-h-80">
                <Table>
                  <TableHeader>
                    <TableRow>
                      <TableHead>Class Name</TableHead>
                      <TableHead className="hidden sm:table-cell">Course ID</TableHead>
                      <TableHead className="hidden sm:table-cell"></TableHead>
                    </TableRow>
                  </TableHeader>
                  <TableBody>
                    {classes.map((classItem, index) => (
                      <TableRow key={index}>
                        <TableCell>
                          <div className="font-medium">{classItem.course_name}</div>
                        </TableCell>
                        <TableCell className="hidden sm:table-cell">{classItem.course_id}</TableCell>
                        <TableCell className="hidden sm:table-cell">
                          <Button asChild size="sm" className="ml-auto gap-1">
                            <Link to={`/ClassManagement/${classItem.class_id}`}>
                              Open Course
                              <ArrowUpRight className="h-4 w-4 ml-1" />
                            </Link>
                          </Button>
                        </TableCell>
                      </TableRow>
                    ))}
                  </TableBody>
                </Table>
              </ScrollArea>
            </CardContent>
          </Card>
          <Card className="bg-white border rounded mt-6">
            <CardHeader className="flex justify-between px-6 py-4">
              <div>
                <CardTitle className="mb-2">Create a New Class</CardTitle>
                <CardDescription>Import a CSV file containing the student names and their student IDs in your class.</CardDescription>
              </div>
            </CardHeader>
            <CardContent>
              <Dialog>
                <DialogTrigger asChild>
                  <Button size="sm">
                    Create Class
                  </Button>
                </DialogTrigger>
                <DialogContent>
                  <DialogHeader>
                    <DialogTitle>Create New Class</DialogTitle>
                    <DialogDescription>Enter the details for the new class and import the student list via a CSV file.</DialogDescription>
                  </DialogHeader>
                  <NewClassForm />
                  <DialogClose asChild>
                    <Button variant="ghost">Close</Button>
                  </DialogClose>
                </DialogContent>
              </Dialog>
            </CardContent>
          </Card>
        </div>
      </div>
    </main>
  );
  
};

export default Classes;


