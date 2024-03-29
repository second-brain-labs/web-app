// PrivateRoute.tsx

import React from "react";
import { Navigate } from "react-router-dom";
import { useAuth } from "./util/redux/hooks/useAuth";
import { useUser } from "./util/redux/hooks/useUser";

interface PrivateRouteProps {
  children: React.ReactNode;
}

const PrivateRoute: React.FC<PrivateRouteProps> = ({ children }) => {
  const { isAuthenticated, login } = useAuth();
  const { username, userID } = useUser();

  const userExists = username !== null && userID !== null;
  if (userExists) {
    login();
  }

  return isAuthenticated || userExists ? (
    <>{children}</>
  ) : (
    <Navigate to="/" replace />
  );
};

export default PrivateRoute;
