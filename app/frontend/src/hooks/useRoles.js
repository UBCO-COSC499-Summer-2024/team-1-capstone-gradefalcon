import { useAuth0 } from "@auth0/auth0-react";

const useRoles = () => {
  const { user } = useAuth0();
  const roles = user && user["http://your-app.com/roles"] ? user["http://your-app.com/roles"] : [];//modify
  return roles;
};

export default useRoles;
