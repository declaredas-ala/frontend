import React from "react";
import { Navigate, Outlet } from "react-router-dom";
import { useSelector } from "react-redux";

const AdminRoute = () => {
  const { userInfo } = useSelector((state) => state.auth);

  // Check if userInfo exists and if userInfo.role is "admin"
  const isAdmin = userInfo && userInfo.role === "admin";

  return isAdmin ? <Outlet /> : <Navigate to="/" replace />;
};

export default AdminRoute;
