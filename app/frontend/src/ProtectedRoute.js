// src/components/ProtectedRoute.js
import React from "react";
import { useAuth0 } from "@auth0/auth0-react";
import { Navigate } from "react-router-dom";

const ProtectedRoute = ({ children, roles = [] }) => {
  const { isAuthenticated, isLoading, user } = useAuth0();

  if (isLoading) {
    return <div>Loading...</div>;
  }

  if (!isAuthenticated) {
    return <Navigate to="/Login" />;
  }

  // Retrieve the user's roles from the Auth0 token
  const userRoles = user[`${process.env.REACT_APP_AUTH0_MYAPP}/role`] || [];
  console.log(userRoles);

  // Log the user's roles for debugging

  // Check if the user has any of the required roles
  const hasRequiredRole = roles.length === 0 || roles.some((role) => userRoles.includes(role));

  if (!hasRequiredRole) {
    // Redirect the user to an unauthorized page if they do not have the necessary role
    return <Navigate to="/unauthorized" />;
  }

  // Navigate based on roles if there are no specific child components to render
  if (userRoles.includes("Student") && !children) {
    return <Navigate to="/studentDashboard" />;
  } else if (userRoles.includes("Instructor") && !children) {
    return <Navigate to="/dashboard" />;
  }
  return children;
};

export default ProtectedRoute;
