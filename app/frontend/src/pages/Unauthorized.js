// src/pages/Unauthorized.js
import React, { useEffect } from 'react';
import { useAuth0 } from '@auth0/auth0-react';

const Unauthorized = () => {
  const { logout } = useAuth0();

  useEffect(() => {
    const timer = setTimeout(() => {
      // Logout the user after 5 seconds
      logout({ returnTo: window.location.origin });
    }, 5000); // 5000 ms = 5 seconds

    return () => clearTimeout(timer); // Clear the timer when the component unmounts
  }, [logout]);

  return (
    <div>
      <h1>Unauthorized Access</h1>
      <p>You do not have permission to view this page. You will be logged out shortly.</p>
    </div>
  );
};

export default Unauthorized;
