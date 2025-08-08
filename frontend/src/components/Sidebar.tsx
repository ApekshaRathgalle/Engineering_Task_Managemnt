import React from 'react';
import { Link, useLocation } from 'react-router-dom';
import { 
  LayoutDashboard, 
  CheckSquare, 
  Plus, 
  User,
  Users,
  BarChart3,
  Settings,
  ClipboardList
} from 'lucide-react';
import { useAuth } from '../context/AuthContext';
import { isAdmin } from '../utils/roleUtils';

const Sidebar: React.FC = () => {
  const { user } = useAuth();
  const location = useLocation();

  const isActive = (path: string) => location.pathname === path;

  const userMenuItems = [
    { path: '/dashboard', icon: LayoutDashboard, label: 'Dashboard' },
    { path: '/tasks', icon: ClipboardList, label: 'My Tasks' },
    { path: '/task/create', icon: Plus, label: 'Create Task' },
    { path: '/profile', icon: User, label: 'Profile' },
  ];

  const adminMenuItems = [
    { path: '/admin', icon: BarChart3, label: 'Admin Dashboard' },
    { path: '/admin/users', icon: Users, label: 'Manage Users' },
    { path: '/admin/tasks', icon: CheckSquare, label: 'All Tasks' },
    { path: '/admin/reports', icon: BarChart3, label: 'Reports' },
    { path: '/admin/settings', icon: Settings, label: 'Settings' },
  ];

  const menuItems = isAdmin(user) 
    ? [...userMenuItems.slice(0, -1), ...adminMenuItems, userMenuItems[userMenuItems.length - 1]]
    : userMenuItems;

  return (
    <div className="bg-gray-50 w-64 min-h-screen border-r border-gray-200">
      <div className="p-6">
        <nav className="space-y-2">
          {menuItems.map((item) => {
            const Icon = item.icon;
            return (
              <Link
                key={item.path}
                to={item.path}
                className={`flex items-center space-x-3 px-3 py-2 rounded-md text-sm font-medium transition-colors ${
                  isActive(item.path)
                    ? 'bg-primary-100 text-primary-700'
                    : 'text-gray-700 hover:bg-gray-100 hover:text-gray-900'
                }`}
              >
                <Icon className="h-5 w-5" />
                <span>{item.label}</span>
              </Link>
            );
          })}
        </nav>
      </div>
    </div>
  );
};

export default Sidebar;