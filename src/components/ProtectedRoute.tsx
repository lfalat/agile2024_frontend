import React, { useState, useEffect } from "react";
import { Navigate } from "react-router-dom";
import { isAuthenticated } from "../services/api/HomeScreenApiService";

const ProtectedRoute: React.FC<{ children: JSX.Element }> = ({ children }) => {
  const [authenticated, setAuthenticated] = useState<boolean | null>(null);

  useEffect(() => {
    const checkAuth = async () => {
      const auth = await isAuthenticated();
      setAuthenticated(auth);
    };

    checkAuth();
  }, []);

  if (!authenticated) {
    return <Navigate to="/login" />;
  }

  return children;
};

export default ProtectedRoute;
