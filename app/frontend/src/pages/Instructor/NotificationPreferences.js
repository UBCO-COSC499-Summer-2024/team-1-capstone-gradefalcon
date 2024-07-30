import React, { useState } from 'react';
import { useNavigate } from 'react-router-dom';
import '../../css/App.css';
import { Button } from "../../components/ui/button";
import { Card, CardHeader, CardTitle, CardContent, CardDescription } from "../../components/ui/card";
import { Table, TableHeader, TableRow, TableBody, TableCell } from "../../components/ui/table";
import { Switch } from "../../components/ui/switch"; // Importing the Shadcn UI Switch component
import { useToast } from "../../components/ui/use-toast"; // Importing the useToast hook
import { Toaster } from "../../components/ui/toaster"; // Importing the Toaster component

const NotificationPreferences = () => {
  const [emailNotifications, setEmailNotifications] = useState(false);
  const [smsNotifications, setSmsNotifications] = useState(false);
  const [pushNotifications, setPushNotifications] = useState(false);
  const navigate = useNavigate();
  const { toast } = useToast(); // Using the toast hook

  const handleToggle = (setter) => {
    setter(prev => !prev);
  };

  const handleSubmit = (event) => {
    event.preventDefault();

    // Handle the form submission logic here
    console.log({
      emailNotifications,
      smsNotifications,
      pushNotifications,
    });

    // Show success toast message
    toast({
      title: "Success",
      description: "Notification preferences have been saved.",
    });
  };

  return (
    <>
      <main className="flex flex-col gap-4 p-8 bg-gradient-to-r from-gradient-start to-gradient-end">
        <div>
          <h1 className="text-3xl font-bold mb-4">Notification Preferences</h1>
          <div className="grid gap-4 lg:grid-cols-1">
            <Card className="bg-white border rounded">
              <CardHeader className="px-6 py-4">
                <CardTitle className="mb-2">Preferences</CardTitle>
                <CardDescription>Manage your notification preferences.</CardDescription>
              </CardHeader>
              <CardContent>
                <form onSubmit={handleSubmit}>
                  <Table>
                    <TableBody>
                      <TableRow>
                        <TableCell>Email Notifications</TableCell>
                        <TableCell>
                          <Switch 
                            id="email-notifications"
                            checked={emailNotifications}
                            onCheckedChange={() => handleToggle(setEmailNotifications)}
                          />
                        </TableCell>
                      </TableRow>
                      <TableRow>
                        <TableCell>SMS Notifications</TableCell>
                        <TableCell>
                          <Switch 
                            id="sms-notifications"
                            checked={smsNotifications}
                            onCheckedChange={() => handleToggle(setSmsNotifications)}
                          />
                        </TableCell>
                      </TableRow>
                      <TableRow>
                        <TableCell>Push Notifications</TableCell>
                        <TableCell>
                          <Switch 
                            id="push-notifications"
                            checked={pushNotifications}
                            onCheckedChange={() => handleToggle(setPushNotifications)}
                          />
                        </TableCell>
                      </TableRow>
                    </TableBody>
                  </Table>
                  <div className="flex justify-between mt-4">
                    <Button size="sm" className="gap-1 green-button" onClick={() => window.history.back()}>
                      Back
                    </Button>
                    <Button type="submit" className="gap-1 green-button" data-testid="save-changes-btn">
                      Save changes
                    </Button>
                  </div>
                </form>
              </CardContent>
            </Card>
          </div>
        </div>
      </main>
      <Toaster /> {/* Adding the Toaster component */}
    </>
  );
};

export default NotificationPreferences;
