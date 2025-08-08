import React from 'react';
import { Routes, Route, Navigate } from 'react-router-dom';
import { useAuth } from '../context/AuthContext';

// Auth Components
import Login from '../pages/Auth/Login';
import Register from '../pages/Auth/Register';
import AdminLogin from '../pages/Auth/AdminLogin';

// Layouts
import MainLayout from '../layouts/MainLayout';
import AdminLayout from '../layouts/AdminLayout';

// User Pages
import Dashboard from '../pages/Dashboard';
import TaskList from '../pages/Task/TaskList';
import TaskDetails from '../pages/Task/TaskDetails';
import CreateTask from '../pages/Task/CreateTask';
import EditTask from '../pages/Task/EditTask';
import Profile from '../pages/Profile';

// Admin Pages
import AdminDashboard from '../pages/Admin/AdminDashboard';
import ManageUsers from '../pages/Admin/ManageUsers';
import ManageTasks from '../pages/Admin/ManageTasks';
import Reports from '../pages/Admin/Reports';
import Settings from '../pages/Admin/Settings';

const PrivateRoute: React.FC<{ children: React.ReactNode }> = ({ children }) => {
  const { user, loading } = useAuth();

  if (loading) {
    return (
      <div className="min-h-screen flex items-center justify-center">
        <div className="animate-spin rounded-full h-12 w-12 border-b-2 border-primary-600"></div>
      </div>
    );
  }

  return user ? <>{children}</> : <Navigate to="/login" replace />;
};

const AppRoutes: React.FC = () => {
  const { user, loading } = useAuth();

  // Show loading spinner while auth is initializing
  if (loading) {
    return (
      <div className="min-h-screen flex items-center justify-center">
        <div className="animate-spin rounded-full h-12 w-12 border-b-2 border-primary-600"></div>
      </div>
    );
  }

  return (
    <Routes>
      {/* Public Routes */}
      <Route path="/login" element={<Login />} />
      <Route path="/register" element={<Register />} />
      <Route path="/admin/login" element={<AdminLogin />} />

      {/* Smart Redirect for Root */}
      <Route path="/" element={
        user ? (
          user.role === 'admin' ? 
          <Navigate to="/admin" replace /> : 
          <Navigate to="/dashboard" replace />
        ) : (
          <Navigate to="/login" replace />
        )
      } />

      {/* Protected User Routes */}
      <Route path="/" element={<PrivateRoute><MainLayout /></PrivateRoute>}>
        <Route path="dashboard" element={<Dashboard />} />
        <Route path="tasks" element={<TaskList />} />
        <Route path="task/:id" element={<TaskDetails />} />
        <Route path="task/create" element={<CreateTask />} />
        <Route path="task/edit/:id" element={<EditTask />} />
        <Route path="profile" element={<Profile />} />
      </Route>

      {/* Protected Admin Routes */}
      <Route path="/admin" element={<PrivateRoute><AdminLayout /></PrivateRoute>}>
        <Route index element={<AdminDashboard />} />
        <Route path="users" element={<ManageUsers />} />
        <Route path="tasks" element={<ManageTasks />} />
        <Route path="reports" element={<Reports />} />
        <Route path="settings" element={<Settings />} />
      </Route>

      {/* Catch all route - smart redirect based on role */}
      <Route path="*" element={
        user ? (
          user.role === 'admin' ? 
          <Navigate to="/admin" replace /> : 
          <Navigate to="/dashboard" replace />
        ) : (
          <Navigate to="/login" replace />
        )
      } />
    </Routes>
  );
};

export default AppRoutes;