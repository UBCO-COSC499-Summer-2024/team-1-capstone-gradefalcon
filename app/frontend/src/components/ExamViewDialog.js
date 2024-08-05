import React from "react";
import { Dialog, DialogTrigger, DialogContent } from "../components/ui/dialog";
import { Card, CardContent } from "../components/ui/card";
import { Button } from "../components/ui/button";

const ExamViewDialog = ({ frontSrc, backSrc, buttonText }) => (
  <Dialog>
    <DialogTrigger asChild>
      <Button variant="outline">{buttonText}</Button>
    </DialogTrigger>
    <DialogContent style={{ width: "70%", maxWidth: "none" }}>
      <div>
        <Card className="bg-white border rounded">
          <CardContent>
            <div className="flex space-x-4">
              {frontSrc ? (
                <img
                  src={frontSrc}
                  alt="Student ID"
                  style={{
                    maxWidth: "50%",
                    height: "auto",
                  }}
                />
              ) : (
                <p>Loading image...</p>
              )}
              {backSrc ? (
                <img
                  src={backSrc}
                  alt="Student Answers"
                  style={{
                    maxWidth: "50%",
                    height: "auto",
                  }}
                />
              ) : (
                <p>Loading image...</p>
              )}
            </div>
          </CardContent>
        </Card>
      </div>
    </DialogContent>
  </Dialog>
);

export default ExamViewDialog;
