"use client";
import React, { useState } from "react";
import { Card, CardContent, CardDescription, CardHeader, CardTitle } from "./ui/card";
import { ScrollArea } from "./ui/scroll-area";
import { Table, TableBody, TableCell, TableHead, TableHeader, TableRow } from "./ui/table";
import { MultiSelect } from "./ui/multi-select";
import { Label } from "./ui/label";
import { useEffect } from "react";

export function QuestionsTable({ questionStats }) {
  const [customScheme, setCustomScheme] = useState({
    questions: [],
  });

  const [usedOptions, setUsedOptions] = useState([]);

  const handleSelectChange = (values) => {
    setCustomScheme((prev) => ({
      ...prev,
      questions: values,
    }));
  };

  useEffect(() => {
    // Determine which options (A, B, C, D, E) are actually used across all questions
    const optionsSet = new Set();
    Object.values(questionStats).forEach((responses) => {
      Object.keys(responses).forEach((option) => {
        optionsSet.add(option);
      });
    });
    setUsedOptions(Array.from(optionsSet));
  }, [questionStats]);

  if (!questionStats || Object.keys(questionStats).length === 0) {
    return <div>No data available for the selected exam.</div>;
  }

  const questionsOptions = Object.keys(questionStats).map((question) => ({
    label: question,
    value: question,
  }));

  const filteredData = customScheme.questions.length
    ? Object.keys(questionStats)
        .filter((question) => customScheme.questions.includes(question))
        .map((question) => ({
          question,
          ...questionStats[question],
        }))
    : Object.keys(questionStats).map((question) => ({
        question,
        ...questionStats[question],
      }));

  return (
    <div className="flex-1">
      <Card className="bg-white border rounded h-full">
        <CardContent className="flex-1">
          <div className="mb-4">
            <Label>Questions</Label>
            <MultiSelect
              options={questionsOptions}
              onValueChange={handleSelectChange}
              defaultValue={customScheme.questions}
              placeholder="Select questions..."
              maxCount={10}
            />
          </div>
          <ScrollArea className="h-80">
            <Table>
              <TableHeader>
                <TableRow>
                  <TableHead>Question</TableHead>
                  {usedOptions.map((option) => (
                    <TableHead key={option}>{option} (%)</TableHead>
                  ))}
                </TableRow>
              </TableHeader>
              <TableBody>
                {filteredData.map((row, index) => (
                  <TableRow key={index} className="hover:bg-gray-100">
                    <TableCell>
                      <span className="font-bold">{row.question}</span>
                    </TableCell>
                    {usedOptions.map((option) => (
                      <TableCell key={option}>
                        {row[option] !== undefined ? `${(row[option] || 0).toFixed(2)}%` : "-"}
                      </TableCell>
                    ))}
                  </TableRow>
                ))}
              </TableBody>
            </Table>
          </ScrollArea>
        </CardContent>
      </Card>
    </div>
  );
}

export default QuestionsTable;