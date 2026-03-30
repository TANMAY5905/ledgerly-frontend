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
const Landing = React.lazy(() => import('./pages/Landing/Landing'));
const About = React.lazy(() => import('./pages/About/About'));
const PrivacyPolicy = React.lazy(() => import('./pages/PrivacyPolicy/PrivacyPolicy'));

const TermsOfService = React.lazy(() => import('./pages/TermsOfService/TermsOfService'));
const Contact = React.lazy(() => import('./pages/Contact/Contact'));


function App() {
  return (
    <BrowserRouter>
      <Suspense fallback={<FullPageLoader text="Loading amazing things..." />}>
        <Routes>
          <Route path="/" element={<Landing />} />

          
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
              <Route path="/about" element={<About />} />
              <Route path="/privacy-policy" element={<PrivacyPolicy />} />
              <Route path="/terms-of-service" element={<TermsOfService />} />
              <Route path="/contact" element={<Contact />} />
            </Route>

          </Route>
          
          {/* Catch all fallback */}
          <Route path="*" element={<Navigate to="/" replace />} />

        </Routes>
      </Suspense>
    </BrowserRouter>
  );
}

export default App;
