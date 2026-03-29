import React, { Suspense } from 'react';
import { BrowserRouter, Routes, Route, Navigate } from 'react-router-dom';
import { FullPageLoader } from './components/Loader/CoinLoader';
import ProtectedRoute from './components/ProtectedRoute/ProtectedRoute';
import PublicRoute from './components/ProtectedRoute/PublicRoute';
import './App.css';

// Lazy loaded pages
const Login = React.lazy(() => import('./pages/Login/Login'));
const Dashboard = React.lazy(() => import('./pages/Dashboard/Dashboard'));
const Layout = React.lazy(() => import('./components/Layout/Layout'));
const LogTransaction = React.lazy(() => import('./pages/LogTransaction/LogTransaction'));
const UpdateTransaction = React.lazy(() => import('./pages/UpdateTransaction/UpdateTransaction'));
const TransactionHistory = React.lazy(() => import('./pages/TransactionHistory/TransactionHistory'));
const Groups = React.lazy(() => import('./pages/Groups/Groups'));
const ResetPassword = React.lazy(() => import('./pages/ResetPassword/ResetPassword'));

function App() {
  return (
    <BrowserRouter>
      <Suspense fallback={<FullPageLoader text="Loading amazing things..." />}>
        <Routes>
          <Route path="/" element={<Navigate to="/login" replace />} />
          
          {/* Public Routes */}
          <Route element={<PublicRoute />}>
            <Route path="/login" element={<Login />} />
            <Route path="/reset-password" element={<ResetPassword />} />
          </Route>
          
          {/* Main App Layout Routes (Protected) */}
          <Route element={<ProtectedRoute />}>
            <Route element={<Layout />}>
              <Route path="/dashboard" element={<Dashboard />} />
              <Route path="/log-transaction" element={<LogTransaction />} />
              <Route path="/update-transaction/:id" element={<UpdateTransaction />} />
              <Route path="/transaction-history" element={<TransactionHistory />} />
              <Route path="/groups" element={<Groups />} />
            </Route>
          </Route>
          
          {/* Catch all fallback */}
          <Route path="*" element={<Navigate to="/login" replace />} />
        </Routes>
      </Suspense>
    </BrowserRouter>
  );
}

export default App;
