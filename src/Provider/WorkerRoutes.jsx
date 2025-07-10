import React from "react";
import useAuth from "../Hooks/useAuth";
import useUserRole from "../Hooks/useUserRole";
import { Navigate } from "react-router";

const WorkerRoutes = ({children}) => {
  const { user, loading } = useAuth();

  const { role, isLoading } = useUserRole();

  console.log(role)
  if (loading || isLoading) {
    return (
      <div className="flex justify-center items-center h-screen">
        <span className="loading loading-spinner loading-xl"></span>
      </div>
    );
  }
  if(!user || role !== "Worker"){
    return <Navigate to="/forbidden" state={location.pathname}></Navigate>;
  }

  return children;
};

export default WorkerRoutes;