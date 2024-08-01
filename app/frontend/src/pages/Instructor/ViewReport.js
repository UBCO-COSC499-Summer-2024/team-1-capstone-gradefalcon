import { Badge } from "../../components/ui/badge";
import { Label } from "../../components/ui/label";
import { Textarea } from "../../components/ui/textarea";
import { TooltipProvider, Tooltip, TooltipTrigger, TooltipContent } from "../../components/ui/tooltip";
import { Button } from "../../components/ui/button";
import { Input } from "../../components/ui/input";
import { PaperClipIcon, ArrowDownLeftIcon, ChevronLeftIcon } from "@heroicons/react/20/solid";
import { Card, CardHeader, CardTitle, CardContent, CardDescription } from "../../components/ui/card";
import { AspectRatio } from "../../components/ui/aspect-ratio";
// import Image from ""; import image

const ViewReport =() => {
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
      <h1 className="text-2xl font-semibold">
        Report
      </h1>
      <div className="hidden items-center gap-2 md:ml-auto md:flex"></div>
    </div>
    <div className="grid flex-1 gap-4 overflow-auto p-4 md:grid-cols-2 lg:grid-cols-3">
      <div className="grid gap-8 md:grid-cols-1 lg:grid-cols-1">
        <div className="grid auto-rows-max items-start gap-8">
          <Card className="bg-white border rounded-lg p-6">
            <CardHeader>
              <CardTitle>Student Details</CardTitle>
            </CardHeader>
            <CardContent>
              <div className="grid gap-6">
                <div className="grid gap-3">
                  <Label htmlFor="student-name">Student Name</Label>
                  <Label id="student-name">[Student Name Here]</Label>
                </div>
                <div className="grid gap-3">
                  <Label htmlFor="student-id">Student ID</Label>
                  <Label id="student-id">[Student ID Here]</Label>
                </div>
              </div>
            </CardContent>
          </Card>

          <Card className="bg-white border rounded-lg p-6">
            <CardHeader>
              <CardTitle>Report</CardTitle>
            </CardHeader>
            <CardContent>
              <div className="grid gap-6">
                <div className="grid gap-3">
                  <Label htmlFor="grade">Grade</Label>
                  <Input id="grade" type="text" placeholder="grade to be edited (remove the placeholder)" />
                </div>
                <div className="grid gap-3">
                  <Label htmlFor="content">Content</Label>
                  <Textarea id="content" placeholder="Student comments..." className="min-h-[9.5rem]" disabled/>
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

          {/* Image Section, change the ratio */}
        {/* <div className="w-[450px] mb-4">
          <AspectRatio ratio={16 / 9}>
            <Image src="your-image-url-here" alt="Image" className="rounded-md object-cover" />
          </AspectRatio>
        </div> */}

        <div className="flex-1" />
        <form className="relative overflow-hidden rounded-lg border bg-background focus-within:ring-1 focus-within:ring-ring">
          <Label htmlFor="message" className="sr-only">
            Message
          </Label>
          <Textarea
            id="message"
            placeholder="Type your message here..."
            className="min-h-12 resize-none border-0 p-3 shadow-none focus-visible:ring-0"
          />
          <div className="flex items-center p-3 pt-0">
            <TooltipProvider>
              <Tooltip>
                <TooltipTrigger asChild>
                  <Button variant="ghost" size="icon">
                    <PaperClipIcon className="size-4" />
                    <span className="sr-only">Attach file</span>
                  </Button>
                </TooltipTrigger>
                <TooltipContent side="top">Attach File</TooltipContent>
              </Tooltip>
              <Button type="submit" size="sm" className="ml-auto gap-1.5">
                Reply
                <ArrowDownLeftIcon className="size-3.5" />
              </Button>
            </TooltipProvider>
          </div>
        </form>
      </div>
    </div>
  </div>
  </main>
)
}
export default ViewReport;