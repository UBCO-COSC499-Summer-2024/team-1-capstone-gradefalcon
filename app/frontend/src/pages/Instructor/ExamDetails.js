import React, { useEffect, useState } from "react";
import { useParams, useNavigate } from "react-router-dom";
import Plot from "react-plotly.js";
import { useAuth0 } from "@auth0/auth0-react";
import { Button } from "../../components/ui/button";
import { Card, CardHeader, CardTitle, CardContent } from "../../components/ui/card";
import { Table, TableHeader, TableRow, TableHead, TableBody, TableCell } from "../../components/ui/table";
import { ScrollArea } from "../../components/ui/scroll-area";
import { Tooltip, TooltipTrigger, TooltipContent, TooltipProvider } from "../../components/ui/tooltip";
import { ChevronLeftIcon } from "@heroicons/react/20/solid";
import { FileIcon, BarChartIcon } from "lucide-react";
import {
  Drawer,
  DrawerClose,
  DrawerContent,
  DrawerDescription,
  DrawerFooter,
  DrawerHeader,
  DrawerTitle,
  DrawerTrigger,
} from "../../components/ui/drawer";
import "../../css/App.css";

const ExamDetails = () => {
  const { user, isAuthenticated, getAccessTokenSilently } = useAuth0();
  const { exam_id } = useParams();
  const [examData, setExamData] = useState(null);
  const [loading, setLoading] = useState(true);
  const [error, setError] = useState(null);

  const navigate = useNavigate();

  useEffect(() => {
    const fetchExamData = async () => {
      try {
        const token = await getAccessTokenSilently();
        const response = await fetch(`/api/exam/getExamDetails/${exam_id}`, {
          method: "GET",
          headers: {
            "Content-Type": "application/json",
            Authorization: `Bearer ${token}`,
          },
          credentials: "include",
        });

        if (response.ok) {
          const data = await response.json();
          setExamData(data);
        } else {
          setError("Failed to fetch exam data");
        }
      } catch (error) {
        setError("Error fetching exam data");
      } finally {
        setLoading(false);
      }
    };

    fetchExamData();
  }, [exam_id, getAccessTokenSilently]);

  const exportToCSV = () => {
    let csvContent = "Student ID,Student Name,Grade\r\n";
    examData.studentResults.forEach((result) => {
      csvContent += `${result.student_id},${result.student_name},${result.grade}\r\n`;
    });

    const blob = new Blob([csvContent], { type: "text/csv;charset=utf-8;" });
    const url = URL.createObjectURL(blob);

    const link = document.createElement("a");
    if (link.download !== undefined) {
      link.setAttribute("href", url);
      link.setAttribute("download", `${examData.exam_title}_results.csv`);
      link.style.visibility = "hidden";
      document.body.appendChild(link);
      link.click();
      document.body.removeChild(link);
    }
  };

  if (loading) {
    return <div>Loading...</div>;
  }

  if (error) {
    return <div>{error}</div>;
  }

  const grades = examData.studentResults.map((result) => result.grade);
  const primaryColor = "#0a8537";
  const minGrade = Math.min(...grades);
  const maxGrade = Math.max(...grades);
  const meanGrade = (grades.reduce((a, b) => a + b, 0) / grades.length).toFixed(2);
  const q1Grade = grades.sort((a, b) => a - b)[Math.floor(grades.length / 4)];
  const medianGrade = grades.sort((a, b) => a - b)[Math.floor(grades.length / 2)];
  const q3Grade = grades.sort((a, b) => a - b)[Math.floor((grades.length * 3) / 4)];

  const layout = {
    width: '70%',
    height: 400,
    margin: {
      l: 100, 
      r: 100,  
      b: 70,  
      t: 100,  
      pad: 4,
    },
    showlegend: false,
    xaxis: {
      title: "Grades",
      zeroline: false,
      tickfont: {
        family: "var(--font-body)", // Use the Inter font defined in your layout
        size: 12,
        color: "hsl(var(--foreground))",
      },
    },
    shapes: [
      {
        type: "line",
        y0: 0,
        y1: 1,
        yref: "paper",
        x0: minGrade,
        x1: minGrade,
        line: {
          color: primaryColor,
          width: 2,
          dash: "dot",
        },
      },
      {
        type: "line",
        y0: 0,
        y1: 1,
        yref: "paper",
        x0: maxGrade,
        x1: maxGrade,
        line: {
          color: primaryColor,
          width: 2,
          dash: "dot",
        },
      },
      {
        type: "line",
        y0: 0,
        y1: 1,
        yref: "paper",
        x0: q1Grade,
        x1: q1Grade,
        line: {
          color: primaryColor,
          width: 2,
          dash: "solid",  // Solid line for Q1
        },
      },
      {
        type: "line",
        y0: 0,
        y1: 1,
        yref: "paper",
        x0: q3Grade,
        x1: q3Grade,
        line: {
          color: primaryColor,
          width: 2,
          dash: "solid",  // Solid line for Q3
        },
      },
      {
        type: "line",
        y0: 0,
        y1: 1,
        yref: "paper",
        x0: meanGrade,
        x1: meanGrade,
        line: {
          color: primaryColor,
          width: 2,
          dash: "dot",
        },
      },
    ],
    annotations: [
      {
        y: 1,
        x: minGrade,
        yref: "paper",
        xref: "x",
        text: `Min: ${minGrade}`,
        showarrow: true,
        arrowhead: 7,
        ax: 0,
        ay: -40,
        textangle: 0,
        font: {
          family: "var(--font-body)",
          size: 12,
          color: "hsl(var(--foreground))",
        },
      },
      {
        y: 1,
        x: maxGrade,
        yref: "paper",
        xref: "x",
        text: `Max: ${maxGrade}`,
        showarrow: true,
        arrowhead: 7,
        ax: 0,
        ay: -40,
        textangle: 0,
        font: {
          family: "var(--font-body)",
          size: 12,
          color: "hsl(var(--foreground))",
        },
      },
      {
        y: 1,
        x: meanGrade,
        yref: "paper",
        xref: "x",
        text: `Mean: ${meanGrade}`,
        showarrow: true,
        arrowhead: 7,
        ax: 0,
        ay: -40,
        textangle: 0,
        font: {
          family: "var(--font-body)",
          size: 12,
          color: "hsl(var(--foreground))",
        },
      },
      {
        y: 1,
        x: q1Grade,
        yref: "paper",
        xref: "x",
        text: `Q1: ${q1Grade}`,
        showarrow: true,
        arrowhead: 7,
        ax: 0,
        ay: -40,
        textangle: 0,
        font: {
          family: "var(--font-body)",
          size: 12,
          color: "hsl(var(--foreground))",
        },
      },
      {
        y: 1,
        x: q3Grade,
        yref: "paper",
        xref: "x",
        text: `Q3: ${q3Grade}`,
        showarrow: true,
        arrowhead: 7,
        ax: 0,
        ay: -40,
        textangle: 0,
        font: {
          family: "var(--font-body)",
          size: 12,
          color: "hsl(var(--foreground))",
        },
      },
    ],
  };

  const data = [
    {
      x: grades,
      type: "box",
      boxpoints: "all",
      jitter: 0.3,
      pointpos: -1.8,
      marker: {
        color: primaryColor,
      },
      line: {
        color: primaryColor,
        width: 3,  // Thicker border for better visibility
      },
      fillcolor: "rgba(10, 133, 55, 0.8)",  // Fill the inside of the box plot with the primary color
      boxmean: true,  // Display the mean
      meanline: {
        color: primaryColor,
        width: 2,
      },
      whiskerwidth: 2,
      hoverinfo: "x",
    },
  ];
  

  return (
    <div className="mx-auto grid max-w-[70rem] flex-1 auto-rows-max gap-8">
      <div className="flex items-center gap-4">
        <Button variant="outline" size="icon" className="h-10 w-10" onClick={() => window.history.back()}>
          <ChevronLeftIcon className="h-4 w-4" />
          <span className="sr-only">Back</span>
        </Button>
        <h1 className="flex-1 shrink-0 whitespace-nowrap text-xl font-semibold tracking-tight sm:grow-0">{examData.exam_title}</h1>
        <div className="flex items-center gap-2 ml-auto">
          <TooltipProvider>
            <Tooltip delayDuration={0}>
              <TooltipTrigger asChild>
                <Button size="sm" variant="outline" className="h-8 gap-1" onClick={exportToCSV}>
                  <FileIcon className="h-4 w-4" />
                  <span className="sr-only sm:not-sr-only sm:whitespace-nowrap">Export</span>
                </Button>
              </TooltipTrigger>
              <TooltipContent>Export results as a CSV file.</TooltipContent>
            </Tooltip>
            <Tooltip delayDuration={0}>
              <TooltipTrigger asChild>
                <Drawer>
                  <DrawerTrigger asChild>
                    <Button size="sm" className="h-8 gap-1 text-white" style={{ backgroundColor: "hsl(var(--primary))" }}>
                      <BarChartIcon className="h-4 w-4" />
                    </Button>
                  </DrawerTrigger>
                  <DrawerContent>
                    <div className="mx-auto w-full max-w-sm">
                      <DrawerHeader>
                        <DrawerTitle>Exam Analysis</DrawerTitle>
                        <DrawerDescription>View detailed analysis of the exam results.</DrawerDescription>
                      </DrawerHeader>
                      <div className="flex justify-center" style={{ overflow: 'visible', padding: '0 20px' }}>
                        <Plot
                          data={data}
                          layout={layout}
                          config={{
                            responsive: true,  // Make the plot responsive
                          }}
                        />
                      </div>
                      <DrawerFooter>
                        <DrawerClose asChild>
                          <Button variant="outline">Close</Button>
                        </DrawerClose>
                      </DrawerFooter>
                    </div>
                  </DrawerContent>
                </Drawer>
              </TooltipTrigger>
              <TooltipContent>View analysis of exam results.</TooltipContent>
            </Tooltip>
          </TooltipProvider>
        </div>
      </div>

      <Card className="bg-white border rounded">
        <CardHeader className="flex justify-between px-6 py-4">
          <div>
            <CardTitle className="mb-2">Student Results</CardTitle>
          </div>
        </CardHeader>
        <CardContent>
          <ScrollArea className="h-80">
            <Table>
              <TableHeader>
                <TableRow>
                  <TableHead>Student ID</TableHead>
                  <TableHead>Student Name</TableHead>
                  <TableHead>Grade</TableHead>
                </TableRow>
              </TableHeader>
              <TableBody>
                {examData.studentResults.map((result) => (
                  <TooltipProvider key={result.student_id}>
                    <Tooltip delayDuration={0}>
                      <TooltipTrigger asChild>
                        <TableRow
                          onClick={() => {
                            navigate(`/ViewExam`, {
                              state: { student_id: result.student_id, exam_id: exam_id },
                            });
                          }}
                          key={result.student_id}
                        >
                          <TableCell>{result.student_id}</TableCell>
                          <TableCell>{result.student_name}</TableCell>
                          <TableCell>{result.grade}</TableCell>
                        </TableRow>
                      </TooltipTrigger>
                      <TooltipContent>
                        <p>Click for details</p>
                      </TooltipContent>
                    </Tooltip>
                  </TooltipProvider>
                ))}
              </TableBody>
            </Table>
          </ScrollArea>
        </CardContent>
      </Card>
    </div>
  );
};

export default ExamDetails;
