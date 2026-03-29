import React from 'react';
import { Navigate, Outlet } from 'react-router-dom';

const ProtectedRoute = () => {
  const token = sessionStorage.getItem('token');

  if (!token || token === 'undefined' || token === 'null') {
    // Redirect to login if not authenticated
    return <Navigate to="/login" replace />;
  }

  // Render the protected content (Layout + children)
  return <Outlet />;
};

export default ProtectedRoute;
