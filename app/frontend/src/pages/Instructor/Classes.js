import React, { useState, useEffect } from "react";
import { Link, useNavigate } from "react-router-dom";
import "../../css/App.css";
import { Button } from "../../components/ui/button";
import { Card, CardHeader, CardTitle, CardContent, CardDescription } from "../../components/ui/card";
import { Table, TableHeader, TableRow, TableHead, TableBody, TableCell } from "../../components/ui/table";
import { ScrollArea } from "../../components/ui/scroll-area";
import { Dialog, DialogTrigger, DialogContent, DialogHeader, DialogTitle, DialogDescription, DialogClose } from "../../components/ui/dialog";
import NewClassForm from "../../components/NewClassForm";
import { ArrowUpRight, MoreVertical } from "lucide-react";
import { Checkbox } from "../../components/ui/checkbox";
import { DropdownMenu, DropdownMenuTrigger, DropdownMenuContent, DropdownMenuItem } from "../../components/ui/dropdown-menu";
import { useToast } from "../../components/ui/use-toast"; // Importing the useToast hook
import { Toaster } from "../../components/ui/toaster"; // Importing the Toaster component

const Classes = () => {
  const navigate = useNavigate();
  const [classes, setClasses] = useState([]);
  const [selectedClasses, setSelectedClasses] = useState([]);
  const [allSelected, setAllSelected] = useState(false);
  const [error, setError] = useState(null);
  const { toast } = useToast(); // Using the toast hook

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

  const handleDeleteFromBoard = (classId) => {
    setClasses(prevData => {
      const updatedClasses = prevData.filter(classItem => classItem.class_id !== classId);
      return updatedClasses;
    });
    toast({
      title: 'Deleted successfully',
    });
  };

  const handleDeleteSelected = () => {
    setClasses(prevData => {
      const updatedClasses = prevData.filter(classItem => !selectedClasses.includes(classItem.class_id));
      return updatedClasses;
    });
    setSelectedClasses([]);
    setAllSelected(false);
    toast({
      title: 'Deleted selected classes successfully',
    });
  };

  const handleArchiveSelected = () => {
    // Implement archiving logic here
    console.log("Archiving selected classes:", selectedClasses);
    // Reset selection after archiving
    setSelectedClasses([]);
    setAllSelected(false);
    toast({
      title: 'Archived selected classes successfully',
    });
  };

  const handleSelectAll = () => {
    if (allSelected) {
      setSelectedClasses([]);
    } else {
      const allClassIds = classes.map(classItem => classItem.class_id);
      setSelectedClasses(allClassIds);
    }
    setAllSelected(!allSelected);
  };

  const handleSelectClass = (classId) => {
    if (selectedClasses.includes(classId)) {
      setSelectedClasses(selectedClasses.filter(id => id !== classId));
    } else {
      setSelectedClasses([...selectedClasses, classId]);
    }
  };

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
                      <TableHead>
                        <Checkbox
                          checked={allSelected}
                          onCheckedChange={handleSelectAll}
                        />
                      </TableHead>
                      <TableHead>Class Name</TableHead>
                      <TableHead className="hidden sm:table-cell">Course ID</TableHead>
                      <TableHead className="hidden sm:table-cell">Actions</TableHead>
                      <TableHead>
                        <DropdownMenu>
                          <DropdownMenuTrigger asChild>
                            <Button variant="ghost" size="icon">
                              <MoreVertical className="h-4 w-4" />
                            </Button>
                          </DropdownMenuTrigger>
                          <DropdownMenuContent>
                            <DropdownMenuItem onClick={handleDeleteSelected}>Delete Selected</DropdownMenuItem>
                            <DropdownMenuItem onClick={handleArchiveSelected}>Archive Selected</DropdownMenuItem>
                          </DropdownMenuContent>
                        </DropdownMenu>
                      </TableHead>
                    </TableRow>
                  </TableHeader>
                  <TableBody>
                    {classes.map((classItem, index) => (
                      <TableRow key={index}>
                        <TableCell>
                          <Checkbox
                            checked={selectedClasses.includes(classItem.class_id)}
                            onCheckedChange={() => handleSelectClass(classItem.class_id)}
                          />
                        </TableCell>
                        <TableCell>
                          <div className="font-medium">{classItem.course_name}</div>
                        </TableCell>
                        <TableCell className="hidden sm:table-cell">{classItem.course_id}</TableCell>
                        <TableCell>
                          <Button asChild size="sm" className="ml-auto gap-1">
                            <Link to={`/ClassManagement/${classItem.class_id}`}>
                              Open Course
                              <ArrowUpRight className="h-4 w-4 ml-1" />
                            </Link>
                          </Button>
                        </TableCell>
                        <TableCell>
                          <DropdownMenu>
                            <DropdownMenuTrigger asChild>
                              <Button variant="ghost" size="icon">
                                <MoreVertical className="h-4 w-4" />
                              </Button>
                            </DropdownMenuTrigger>
                            <DropdownMenuContent>
                              <DropdownMenuItem onClick={() => handleDeleteFromBoard(classItem.class_id)}>Delete</DropdownMenuItem>
                              <DropdownMenuItem>Archive</DropdownMenuItem>
                            </DropdownMenuContent>
                          </DropdownMenu>
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
      <Toaster /> {/* Adding the Toaster component */}
    </main>
  );
};

export default Classes;

