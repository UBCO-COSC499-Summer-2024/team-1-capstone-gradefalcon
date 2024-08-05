import React from 'react';
import { useNavigate } from "react-router-dom";
import { Button } from "../../components/ui/button";
import { Card, CardHeader, CardTitle, CardContent } from "../../components/ui/card";
import { Input } from "../../components/ui/input";
import { Textarea } from "../../components/ui/textarea";
import { ArrowUpRightIcon, ChevronLeftIcon, PaperClipIcon } from "@heroicons/react/24/solid";
import { Badge } from "../../components/ui/badge";
import {Label} from "../../components/ui/label";
import {TooltipProvider, Tooltip, TooltipTrigger, TooltipContent} from "../../components/ui/tooltip";
import {AspectRatio} from "../../components/ui/aspect-ratio"; 

const SubmitReport = () => {
  const navigate = useNavigate();

  return (
      <main className="flex flex-col gap-4 p-2">
        <div className="w-full mx-auto grid flex-1 auto-rows-max gap-8">
          <div className="flex items-center gap-4">
            <Button
              variant="outline"
              size="icon"
              className="h-10 w-10"
              onClick={() => window.history.back()}
            >
              <ChevronLeftIcon className="h-4 w-4" />
              <span className="sr-only">Back</span>
            </Button>
            <h1 className="text-2xl font-semibold">Make a Report</h1>
          </div>
          <div className="grid flex-1 gap-4 overflow-auto p-4 md:grid-cols-2 lg:grid-cols-3">
            <div className="grid gap-8 md:grid-cols-1 lg:grid-cols-1">
              <div className="grid auto-rows-max items-start gap-8">
  
                <Card className="bg-white border rounded-lg p-6">
                  <CardHeader>
                    <CardTitle>Report</CardTitle>
                  </CardHeader>
                  <CardContent>
                    <div className="grid gap-6">
                      <div className="grid gap-3">
                        <Label htmlFor="grade">Grade</Label>
                        <Label id="grade">[Student Grade Here]</Label>
                      </div>
                      <div className="grid gap-3">
                        <Label htmlFor="content">Message</Label>
                        <Textarea id="content" placeholder="Student comments..." className="min-h-[9.5rem]" disabled/>
                        <TooltipProvider>
                    <Tooltip>
                      <TooltipTrigger asChild>
                        <Button variant="ghost" size="icon">
                          <PaperClipIcon className="h-4 w-4" />
                          <span className="sr-only">Attach file</span>
                        </Button>
                      </TooltipTrigger>
                      <TooltipContent side="top">Attach File</TooltipContent>
                    </Tooltip>
                    <Button type="submit" size="sm" className="ml-auto gap-1.5">
                      Submit
                      <ArrowUpRightIcon className="h-3.5 w-3.5" />
                    </Button>
                  </TooltipProvider>
                      </div>
                    </div>
                  </CardContent>
                </Card>
              </div>
            </div>
  
            <div className="relative flex h-full min-h-[50vh] flex-col rounded-xl bg-muted/50 p-4 lg:col-span-2">
              <Badge variant="outline" className="absolute right-3 top-3">
                Exam
              </Badge>
  
              {/* Image Section */}
              {/* Uncomment and update the Image component and aspect ratio if needed */}
              {/* <div className="w-[450px] mb-4">
                <AspectRatio ratio={16 / 9}>
                  <Image src="your-image-url-here" alt="Image" className="rounded-md object-cover" />
                </AspectRatio>
              </div> */}
            </div>
          </div>
        </div>
      </main>
    );
  };

export default SubmitReport;
