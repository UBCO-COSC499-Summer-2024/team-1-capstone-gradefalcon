"use client";
import React from "react";
import { Bar, BarChart, CartesianGrid, XAxis, YAxis, Tooltip, Label } from "recharts";
import { Card, CardContent, CardHeader, CardTitle, CardDescription, CardFooter } from "../components/ui/card";
import { ChartContainer, ChartTooltip, ChartTooltipContent } from "../components/ui/chart";
import { ScrollArea, ScrollBar } from "../components/ui/scroll-area";

const chartConfig = {
  A: {
    label: "A",
    color: "hsl(var(--chart-1))",
  },
  B: {
    label: "B",
    color: "hsl(var(--chart-2))",
  },
  C: {
    label: "C",
    color: "hsl(var(--chart-3))",
  },
  D: {
    label: "D",
    color: "hsl(var(--chart-4))",
  },
};

export function QuestionsBarChart({ questionStats }) {
  // Log questionStats to the console
  console.log("Question Stats:", questionStats);

  if (!questionStats || Object.keys(questionStats).length === 0) {
    return <div>No data available for the selected exam.</div>;
  }

  const data = Object.keys(questionStats).map((question) => {
    const responses = questionStats[question];
    return {
      question,
      A: responses["A"] || 0,
      B: responses["B"] || 0,
      C: responses["C"] || 0,
      D: responses["D"] || 0,
    };
  });

  const numQuestionsVisible = 20; // Number of questions to show at a time
  const barWidth = 50; // Width of each bar
  const chartWidth = numQuestionsVisible * barWidth; // Calculate the width for the visible questions

  return (
    <Card>
      <CardHeader>
        <CardTitle>Question Responses Breakdown</CardTitle>
        <CardDescription>Distribution of responses per question</CardDescription>
      </CardHeader>
      <CardContent>
        <ScrollArea className="w-full overflow-x-auto">
          <div style={{ width: data.length * barWidth, height:300 }}> {/* Make the container wide enough for all questions */}
            <ChartContainer config={chartConfig}>
              <BarChart width={chartWidth} height={300} data={data}> {/* Adjust height as needed */}
                <CartesianGrid vertical={false} />
                <XAxis
                  dataKey="question"
                  tickLine={false}
                  tickMargin={10}
                  axisLine={false}
                  interval={0}  // Ensure all questions are shown
                  padding={{ left: 30, right: 30 }}  // Add more padding to separate the questions
                />
                <YAxis>
                  <Label value="Percentage (%)" angle={-90} position="insideLeft" style={{ textAnchor: "middle" }} />
                </YAxis>
                <Tooltip />
                <Bar dataKey="A" fill="var(--color-A)" radius={4} />
                <Bar dataKey="B" fill="var(--color-B)" radius={4} />
                <Bar dataKey="C" fill="var(--color-C)" radius={4} />
                <Bar dataKey="D" fill="var(--color-D)" radius={4} />
              </BarChart>
            </ChartContainer>
          </div>
          <ScrollBar orientation="horizontal" />
        </ScrollArea>
      </CardContent>
      <CardFooter className="flex-col items-start gap-2 text-sm">
        <div className="flex gap-2 font-medium leading-none">
          View the response distribution across all questions
        </div>
        <div className="leading-none text-muted-foreground">
          Showing percentage distribution of answers for each question.
        </div>
      </CardFooter>
    </Card>
  );
}

export default QuestionsBarChart;
