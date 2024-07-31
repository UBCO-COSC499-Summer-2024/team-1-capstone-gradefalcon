import React from 'react';
import { useAuth0 } from '@auth0/auth0-react';
import logo from '../assets/logo.png';
import { Card, CardHeader, CardContent } from '../components/ui/card';
import { Button } from '../components/ui/button';  

const Home = () => {
    // Redirect authenticated users to the dashboard
  const { loginWithRedirect, isAuthenticated } = useAuth0();

  return (
    <div className="flex justify-center items-center min-h-screen">
      <Card className="w-full md:w-1/2 bg-white border rounded-lg p-6">
        <CardHeader className="flex justify-center">
          <img src={logo} alt="Logo" className="logo" />
        </CardHeader>
        <CardContent className="text-center">
          <div className="copy mb-4">
            <div className="text-wrapper">Log in to your account</div>
          </div>
          <Button
            onClick={() => loginWithRedirect()}
          >
            Log In
          </Button>
        </CardContent>
      </Card>
    </div>
  );
};


export default Home;
