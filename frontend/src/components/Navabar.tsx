import { Link, useNavigate } from 'react-router-dom';
import { LogOut, User, Settings, Wrench } from 'lucide-react';
import { useAuth } from '../context/AuthContext';
import { isAdmin } from '../utils/roleUtils';
import ThemeToggle from './ThemeToggle';
import toast from 'react-hot-toast';

const Navbar: React.FC = () => {
  const { user, logout } = useAuth();
  const navigate = useNavigate();

  const handleLogout = async () => {
    try {
      await logout();
      toast.success('Logged out successfully');
      navigate('/login');
    } catch (error) {
      toast.error('Failed to logout');
    }
  };

  return (
    <nav className="bg-white dark:bg-dark-surface shadow-sm border-b border-gray-200 dark:border-dark-border transition-colors duration-300">
      <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8">
        <div className="flex justify-between h-16">
          <div className="flex items-center">
            <Link to="/dashboard" className="flex items-center space-x-2">
              <Wrench className="h-8 w-8 text-primary-600" />
              <span className="text-xl font-bold text-gray-900 dark:text-dark-text">
                Engineering Task Manager
              </span>
            </Link>
          </div>

          {user && (
            <div className="flex items-center space-x-4">
              <span className="text-sm text-gray-700 dark:text-dark-muted">
                Welcome, {user.displayName || user.email}
                {isAdmin(user) && (
                  <span className="ml-2 px-2 py-1 text-xs bg-primary-100 dark:bg-primary-900 text-primary-800 dark:text-primary-200 rounded">
                    Admin
                  </span>
                )}
              </span>

              <div className="flex items-center space-x-2">
                <ThemeToggle />
                
                <Link
                  to="/profile"
                  className="p-2 rounded-md text-gray-600 dark:text-dark-muted hover:text-gray-900 dark:hover:text-dark-text hover:bg-gray-100 dark:hover:bg-dark-card transition-colors"
                >
                  <User className="h-5 w-5" />
                </Link>

                {isAdmin(user) && (
                  <Link
                    to="/admin"
                    className="p-2 rounded-md text-gray-600 dark:text-dark-muted hover:text-gray-900 dark:hover:text-dark-text hover:bg-gray-100 dark:hover:bg-dark-card transition-colors"
                  >
                    <Settings className="h-5 w-5" />
                  </Link>
                )}

                <button
                  onClick={handleLogout}
                  className="p-2 rounded-md text-gray-600 dark:text-dark-muted hover:text-gray-900 dark:hover:text-dark-text hover:bg-gray-100 dark:hover:bg-dark-card transition-colors"
                >
                  <LogOut className="h-5 w-5" />
                </button>
              </div>
            </div>
          )}
        </div>
      </div>
    </nav>
  );
};

export default Navbar;