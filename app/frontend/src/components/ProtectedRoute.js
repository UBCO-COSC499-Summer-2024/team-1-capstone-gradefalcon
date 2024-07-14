import React from "react";
import { useAuth0, withAuthenticationRequired } from "@auth0/auth0-react";
import { Navigate } from "react-router-dom";
import useRoles from "./hooks/useRoles";

const ProtectedRoute = ({ component, roles }) => {
  const { isAuthenticated, isLoading } = useAuth0();
  const userRoles = useRoles();

  if (isLoading) {
    return <div>Loading...</div>;
  }

  if (!isAuthenticated) {
    return <Navigate to="/login" />;
  }

  const hasRequiredRole = roles.some(role => userRoles.includes(role));

  if (!hasRequiredRole) {
    return <Navigate to="/unauthorized" />;
  }

  const Component = withAuthenticationRequired(component);
  return <Component />;
};

export default ProtectedRoute;