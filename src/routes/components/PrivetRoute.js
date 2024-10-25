import React from 'react';
import { Navigate, Outlet } from 'react-router-dom';

const RequireAuth = () => {
  const token = localStorage.getItem('token');

  if (!token) {
    return <Navigate to="/login" replace />;
  }

  return <Outlet />;
};

export default RequireAuth;
