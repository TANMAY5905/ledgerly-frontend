import React from 'react';
import { Navigate, Outlet } from 'react-router-dom';

const PublicRoute = () => {
  const token = sessionStorage.getItem('token');

  if (token && token !== 'undefined' && token !== 'null') {
    // Redirect to dashboard if already authenticated
    return <Navigate to="/dashboard" replace />;
  }

  // Render the public content (Login, Register page, etc.)
  return <Outlet />;
};

export default PublicRoute;
