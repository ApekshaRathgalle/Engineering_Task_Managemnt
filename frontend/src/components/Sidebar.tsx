import React, { useEffect, useState } from 'react';
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
import { useTheme } from '../context/ThemeContext';
import { isAdmin } from '../utils/roleUtils';
import { taskService } from '../services/taskService';

const Sidebar: React.FC = () => {
  const { user } = useAuth();
  const { theme } = useTheme();
  const location = useLocation();
  const [stats, setStats] = useState({
    activeTasks: 0,
    completedTasks: 0,
    overdueTasks: 0,
    loading: true
  });

  const isActive = (path: string) => location.pathname === path;

  // Fetch real task stats
  useEffect(() => {
    if (user) {
      fetchTaskStats();
    }
  }, [user]);

  const fetchTaskStats = async () => {
    try {
      const tasks = await taskService.getMyTasks();
      const now = new Date();
      
      const activeTasks = tasks.filter(task => 
        task.status === 'pending' || task.status === 'in-progress'
      ).length;
      
      const completedTasks = tasks.filter(task => 
        task.status === 'completed'
      ).length;
      
      const overdueTasks = tasks.filter(task => 
        new Date(task.dueDate) < now && task.status !== 'completed'
      ).length;

      setStats({
        activeTasks,
        completedTasks,
        overdueTasks,
        loading: false
      });
    } catch (error) {
      console.error('Error fetching task stats:', error);
      setStats(prev => ({ ...prev, loading: false }));
    }
  };

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
    <div className="bg-white dark:bg-black w-64 min-h-screen border-r border-gray-200 dark:border-dark-border transition-colors duration-300 shadow-sm">
      <div className="p-6">
        {/* Logo/Brand Section */}
        <div className="mb-8">
          <div className="flex items-center space-x-3">
            <div className="w-8 h-8 bg-blue-500 rounded-lg flex items-center justify-center shadow-md">
              <LayoutDashboard className="h-5 w-5 text-white" />
            </div>
            <div>
              <h1 className="text-gray-900 dark:text-white font-bold text-lg transition-colors">
                Task Manager
              </h1>
              <p className="text-gray-500 dark:text-gray-400 text-xs transition-colors">
                Engineering Tools
              </p>
            </div>
          </div>
        </div>

        {/* Navigation */}
        <nav className="space-y-2">
          {menuItems.map((item) => {
            const Icon = item.icon;
            const active = isActive(item.path);
            
            return (
              <Link
                key={item.path}
                to={item.path}
                className={`group flex items-center space-x-3 px-4 py-3 rounded-lg text-sm font-medium transition-all duration-200 ${
                  active
                    ? 'bg-blue-500 text-white shadow-lg shadow-blue-500/25'
                    : 'text-gray-600 dark:text-gray-300 hover:bg-gray-100 dark:hover:bg-dark-surface hover:text-gray-900 dark:hover:text-white'
                }`}
              >
                <Icon className={`h-5 w-5 transition-colors ${
                  active 
                    ? 'text-white' 
                    : 'text-gray-500 dark:text-gray-400 group-hover:text-gray-700 dark:group-hover:text-white'
                }`} />
                <span className={`transition-colors ${
                  active 
                    ? 'text-white font-semibold' 
                    : 'text-gray-700 dark:text-gray-300 group-hover:text-gray-900 dark:group-hover:text-white'
                }`}>
                  {item.label}
                </span>
                
                {/* Active indicator */}
                {active && (
                  <div className="ml-auto w-2 h-2 bg-white rounded-full"></div>
                )}
              </Link>
            );
          })}
        </nav>

        {/* User Info Section - Clickable to Profile */}
        {user && (
          <div className="mt-8 pt-6 border-t border-gray-200 dark:border-dark-border transition-colors">
            <Link 
              to="/profile"
              className="flex items-center space-x-3 px-4 py-3 rounded-lg hover:bg-gray-100 dark:hover:bg-dark-surface transition-colors duration-200 group"
            >
              <div className="w-8 h-8 bg-blue-500 rounded-full flex items-center justify-center group-hover:scale-110 transition-transform shadow-md">
                <span className="text-white text-sm font-semibold">
                  {user.displayName?.charAt(0).toUpperCase() || user.email?.charAt(0).toUpperCase() || 'U'}
                </span>
              </div>
              <div className="flex-1 min-w-0">
                <p className="text-gray-900 dark:text-white text-sm font-medium truncate group-hover:text-blue-600 dark:group-hover:text-blue-300 transition-colors">
                  {user.displayName || 'User'}
                </p>
                <p className="text-gray-500 dark:text-gray-400 text-xs truncate group-hover:text-gray-600 dark:group-hover:text-gray-300 transition-colors">
                  {user.email}
                </p>
                {isAdmin(user) && (
                  <span className="inline-flex items-center px-2 py-0.5 rounded text-xs font-medium bg-blue-500 text-white mt-1 shadow-sm">
                    Admin
                  </span>
                )}
              </div>
              <div className="opacity-0 group-hover:opacity-100 transition-opacity">
                <User className="h-4 w-4 text-gray-400 dark:text-gray-500 group-hover:text-blue-500 dark:group-hover:text-blue-400" />
              </div>
            </Link>
          </div>
        )}

        {/* Quick Stats - Real Data */}
        <div className="mt-6 px-4">
          <div className="bg-gray-50 dark:bg-dark-surface rounded-lg p-4 border border-gray-200 dark:border-dark-border transition-colors shadow-sm">
            <h3 className="text-gray-600 dark:text-gray-300 text-xs font-medium uppercase tracking-wide mb-3 transition-colors">
              Quick Stats
            </h3>
            {stats.loading ? (
              <div className="flex items-center justify-center py-4">
                <div className="animate-spin rounded-full h-6 w-6 border-b-2 border-blue-500"></div>
              </div>
            ) : (
              <div className="space-y-3">
                <Link 
                  to="/tasks?status=active"
                  className="flex items-center justify-between hover:bg-gray-100 dark:hover:bg-dark-card rounded px-2 py-1 transition-colors group"
                >
                  <span className="text-gray-600 dark:text-gray-400 text-sm group-hover:text-gray-700 dark:group-hover:text-gray-300 transition-colors">
                    Active Tasks
                  </span>
                  <span className={`text-sm font-semibold transition-colors ${
                    stats.activeTasks > 0 
                      ? 'text-blue-600 dark:text-blue-400 group-hover:text-blue-700 dark:group-hover:text-blue-300' 
                      : 'text-gray-500 dark:text-gray-600'
                  }`}>
                    {stats.activeTasks}
                  </span>
                </Link>
                
                <Link 
                  to="/tasks?status=completed"
                  className="flex items-center justify-between hover:bg-gray-100 dark:hover:bg-dark-card rounded px-2 py-1 transition-colors group"
                >
                  <span className="text-gray-600 dark:text-gray-400 text-sm group-hover:text-gray-700 dark:group-hover:text-gray-300 transition-colors">
                    Completed
                  </span>
                  <span className={`text-sm font-semibold transition-colors ${
                    stats.completedTasks > 0 
                      ? 'text-green-600 dark:text-green-400 group-hover:text-green-700 dark:group-hover:text-green-300' 
                      : 'text-gray-500 dark:text-gray-600'
                  }`}>
                    {stats.completedTasks}
                  </span>
                </Link>
                
                <Link 
                  to="/tasks?status=overdue"
                  className="flex items-center justify-between hover:bg-gray-100 dark:hover:bg-dark-card rounded px-2 py-1 transition-colors group"
                >
                  <span className="text-gray-600 dark:text-gray-400 text-sm group-hover:text-gray-700 dark:group-hover:text-gray-300 transition-colors">
                    Overdue
                  </span>
                  <span className={`text-sm font-semibold transition-colors ${
                    stats.overdueTasks > 0 
                      ? 'text-red-600 dark:text-red-400 group-hover:text-red-700 dark:group-hover:text-red-300' 
                      : 'text-gray-500 dark:text-gray-600'
                  }`}>
                    {stats.overdueTasks}
                  </span>
                </Link>
              </div>
            )}
          </div>
        </div>

        {/* Help Section */}
        <div className="mt-6 px-4">
          <div className="bg-gradient-to-r from-blue-500 to-blue-600 rounded-lg p-4 shadow-lg">
            <div className="flex items-center space-x-3">
              <div className="w-8 h-8 bg-white/20 rounded-full flex items-center justify-center">
                <Settings className="h-4 w-4 text-white" />
              </div>
              <div>
                <p className="text-white text-sm font-medium">Need Help?</p>
                <p className="text-blue-100 text-xs">Check our documentation</p>
              </div>
            </div>
          </div>
        </div>
      </div>
    </div>
  );
};

export default Sidebar;