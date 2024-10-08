import React, { useState, useEffect } from 'react';
import { useNavigate } from 'react-router-dom';
import '../../css/App.css';
import { Button } from "../../components/ui/button";
import { Card, CardHeader, CardTitle, CardContent } from "../../components/ui/card";
import { Table, TableBody, TableRow, TableCell } from "../../components/ui/table";
import { Input } from "../../components/ui/input"; // Importing the Shadcn Input component
import { useToast } from "../../components/ui/use-toast"; // Importing the useToast hook
import { Toaster } from "../../components/ui/toaster"; // Importing the Toaster component
import { useAuth0 } from '@auth0/auth0-react';
import axios from 'axios';

const StudentAccountSettings = () => {
  const { user, getAccessTokenSilently } = useAuth0();
  const [username, setUsername] = useState(user.nickname || '');
  const [email, setEmail] = useState(user.email || '');
  const navigate = useNavigate();
  const { toast } = useToast(); // Using the toast hook

  useEffect(() => {
    // Fetch and set additional user details or roles if needed here.
  }, [user.sub]);

  const handleInputChange = (e, setState) => {
    const value = e.target.value;
    const sanitizedValue = value.replace(/[^a-zA-Z0-9\s.,!?-]/g, ''); // restricts string altering characters
    setState(sanitizedValue);
  };

  const handleSubmit = async (event) => {
    event.preventDefault();

    try {
      const token = await getAccessTokenSilently();

      // Update username
      await axios.post('/api/users/update', {
        userId: user.sub,
        username,
      }, {
        headers: {
          Authorization: `Bearer ${token}`
        }
      });

      toast({
        title: "Success",
        description: "Account settings have been saved.",
      });

    } catch (error) {
      toast({
        title: "Error",
        description: "Failed to update account settings.",
        variant: "error"
      });
    }
  };

  const handleResetPassword = async () => {
    try {
      const token = await getAccessTokenSilently();

      // Trigger password reset email
      await axios.post('/api/users/reset-password', {
        email: user.email,
      }, {
        headers: {
          Authorization: `Bearer ${token}`
        }
      });

      toast({
        title: "Success",
        description: "Password reset email sent.",
      });

    } catch (error) {
      toast({
        title: "Error",
        description: "Failed to send password reset email.",
        variant: "error"
      });
    }
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
                      <TableCell>Email</TableCell>
                      <TableCell>{email}</TableCell> {/* Displaying email */}
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
                  </TableBody>
                </Table>
                <div className="flex justify-between mt-4">
                  <Button size="sm" className="gap-1 green-button" onClick={handleResetPassword}>
                    Reset Password
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

export default StudentAccountSettings;
