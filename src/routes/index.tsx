import React from 'react';
import { Routes, Route, Navigate } from 'react-router-dom';
import { useAuth } from '../components/AuthProvider';
import Dashboard from '../pages/Dashboard';
import Products from '../pages/Products';
import Orders from '../pages/Orders';
import Auth from '../pages/Auth';
import AuthCallback from '../pages/AuthCallback';

const PrivateRoute = ({ children }: { children: React.ReactNode }) => {
  const { isAuthenticated } = useAuth();
  return isAuthenticated ? <>{children}</> : <Navigate to="/auth" />;
};

export function AppRoutes() {
  return (
    <Routes>
      <Route path="/auth" element={<Auth />} />
      <Route path="/auth/callback" element={<AuthCallback />} />
      <Route path="/" element={<PrivateRoute><Dashboard /></PrivateRoute>} />
      <Route path="/products" element={<PrivateRoute><Products /></PrivateRoute>} />
      <Route path="/orders" element={<PrivateRoute><Orders /></PrivateRoute>} />
    </Routes>
  );
}