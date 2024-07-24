import React, { useState } from 'react';
import { useNavigate } from 'react-router-dom';
import '../../css/App.css';
import { Button } from "../../components/ui/button";
import { Card, CardHeader, CardTitle, CardContent } from "../../components/ui/card";
import { Table, TableBody, TableRow, TableCell } from "../../components/ui/table";
import { Input } from "../../components/ui/input"; // Importing the Shadcn Input component
import { useToast } from "../../components/ui/use-toast"; // Importing the useToast hook
import { Toaster } from "../../components/ui/toaster"; // Importing the Toaster component

const AccountSettings = () => {
  const [username, setUsername] = useState('Dr. Pepper');
  const [oldPassword, setOldPassword] = useState('');
  const [newPassword, setNewPassword] = useState('');
  const [confirmPassword, setConfirmPassword] = useState('');
  const navigate = useNavigate();
  const { toast } = useToast(); // Using the toast hook

  const handleInputChange = (e, setState) => {
    const value = e.target.value;
    const sanitizedValue = value.replace(/[^a-zA-Z0-9\s.,!?-]/g, ''); // restricts string altering characters
    setState(sanitizedValue);
  };

  const handleSubmit = (event) => {
    event.preventDefault();
    if (newPassword !== confirmPassword) {
      toast({
        title: "Error",
        description: "New passwords do not match.",
        variant: "error"
      });
      return;
    }

    // Backend call for saving changes
    // Implement the backend API call here
    toast({
      title: "Success",
      description: "Account settings have been saved.",
    });
  };
  
  return (
    <>
      <div className="main-content flex-1 p-8 bg-gradient-to-r from-gradient-start to-gradient-end">
        <main className="flex flex-col gap-4">
          <Card className="bg-white border rounded">
            <CardHeader className="flex justify-between px-6 py-4">
              <CardTitle className="text-3xl font-bold mb-4">Account Settings</CardTitle>
            </CardHeader>
            <CardContent>
              <form onSubmit={handleSubmit}>
                <Table>
                  <TableBody>
                    <TableRow>
                      <TableCell>User ID</TableCell>
                      <TableCell>75826488</TableCell> {/* dummy input, will be retrieved with SQL query when implemented */}
                    </TableRow>
                    <TableRow>
                      <TableCell>Username</TableCell>
                      <TableCell>
                        <Input
                          type="text"
                          id="username"
                          value={username}
                          onChange={(e) => handleInputChange(e, setUsername)}
                          className="w-full"
                          data-testid="username-input"
                        />
                      </TableCell>
                    </TableRow>
                    <TableRow>
                      <TableCell>Old Password</TableCell>
                      <TableCell>
                        <Input
                          type="password"
                          id="old-password"
                          placeholder="Old Password"
                          value={oldPassword}
                          onChange={(e) => handleInputChange(e, setOldPassword)}
                          className="w-full"
                          data-testid="old-password-input"
                        />
                      </TableCell>
                    </TableRow>
                    <TableRow>
                      <TableCell>New Password</TableCell>
                      <TableCell>
                        <Input
                          type="password"
                          id="new-password"
                          placeholder="New Password"
                          value={newPassword}
                          onChange={(e) => handleInputChange(e, setNewPassword)}
                          className="w-full"
                          data-testid="new-password-input"
                        />
                      </TableCell>
                    </TableRow>
                    <TableRow>
                      <TableCell>Confirm New Password</TableCell>
                      <TableCell>
                        <Input
                          type="password"
                          id="confirm-password"
                          placeholder="Confirm New Password"
                          value={confirmPassword}
                          onChange={(e) => handleInputChange(e, setConfirmPassword)}
                          className="w-full"
                          data-testid="confirm-password-input"
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
        </main>
      </div>
      <Toaster /> {/* Adding the Toaster component */}
    </>
  );
};

export default AccountSettings;
