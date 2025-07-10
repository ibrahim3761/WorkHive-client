import React from "react";
import { Navigate, useLocation } from "react-router";
import useAuth from "../Hooks/useAuth";
import useUserRole from "../Hooks/useUserRole";

const BuyerRoutes = ({ children }) => {
  const { user, loading } = useAuth();
  const { role, isLoading } = useUserRole();
  const location = useLocation();

  if (loading || isLoading) {
    return (
      <div className="flex justify-center items-center h-screen">
        <span className="loading loading-spinner loading-xl"></span>
      </div>
    );
  }

  if (!user) {
    // No token: force logout client side and send 401 from backend
    return <Navigate to="/login" replace state={{ from: location }} />;
  }

  if (role !== "Buyer") {
    // Role mismatch: send 403 and redirect
    return <Navigate to="/forbidden" replace state={{ from: location }} />;
  }

  return children;
};

export default BuyerRoutes;
