import { useContext, useEffect } from "react";
import { UserContext } from "../context/userContext";
import { Navigate, Outlet, useLocation } from "react-router-dom";
import React from "react";

const ProtectedRoutes = () => {

  const { user, loading, checkAuth } = useContext(UserContext);
  const location = useLocation();

  useEffect(() => {
    checkAuth();
  }, [location.pathname]);

  if (loading) {
    return (
      <div className="flex items-center justify-center min-h-screen">
        <div className="animate-spin rounded-full h-12 w-12 border-t-2 border-b-2 border-slate-700"></div>
      </div>
    );
  }

  // Redirect to login if no user
  return user ? <Outlet /> : <Navigate to="/auth/login" />;

}

export default ProtectedRoutes;
