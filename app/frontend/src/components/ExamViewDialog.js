import React, { useState } from "react";
import { Dialog, DialogTrigger, DialogContent } from "../components/ui/dialog";
import { Card, CardContent } from "../components/ui/card";
import { Button } from "../components/ui/button";

const ExamViewDialog = ({ frontSrc, backSrc, buttonText }) => {
  const [isBackImageLoaded, setIsBackImageLoaded] = useState(true);

  return (
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
                {backSrc && isBackImageLoaded ? (
                  <img
                    src={backSrc}
                    alt=""
                    onError={() => setIsBackImageLoaded(false)}
                    style={{
                      maxWidth: "50%",
                      height: "auto",
                    }}
                  />
                ) : null}
              </div>
            </CardContent>
          </Card>
        </div>
      </DialogContent>
    </Dialog>
  );
};

export default ExamViewDialog;
