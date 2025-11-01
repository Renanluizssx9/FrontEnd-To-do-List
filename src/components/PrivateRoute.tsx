import { Navigate } from "react-router-dom";
import { useAuth } from "./AuthContext";
import React from "react";

function PrivateRoute({ children }: { children: JSX.Element }) {
  const { isAuthenticated, loading } = useAuth();

  if (loading) return null;

  return isAuthenticated ? children : <Navigate to="/login" />;
}

export default PrivateRoute;
