import React, { useState } from 'react';
import { User, Mail, Calendar, Shield } from 'lucide-react';
import { useAuth } from '../context/AuthContext';
import { updateProfile } from 'firebase/auth';
import { auth } from '../firebase/firebase';
import toast from 'react-hot-toast';

const Profile: React.FC = () => {
  const { user, refreshUserRole } = useAuth();
  const [loading, setLoading] = useState(false);
  const [formData, setFormData] = useState({
    displayName: user?.displayName || '',
    email: user?.email || '',
  });

  const handleChange = (e: React.ChangeEvent<HTMLInputElement>) => {
    setFormData(prev => ({
      ...prev,
      [e.target.name]: e.target.value,
    }));
  };

  const handleSubmit = async (e: React.FormEvent) => {
    e.preventDefault();
    if (!auth.currentUser) return;

    setLoading(true);
    try {
      await updateProfile(auth.currentUser, {
        displayName: formData.displayName,
      });
      
      await refreshUserRole();
      toast.success('Profile updated successfully!');
    } catch (error: any) {
      toast.error(error.message || 'Failed to update profile');
    } finally {
      setLoading(false);
    }
  };

  if (!user) {
    return null;
  }

  return (
    <div className="space-y-6">
      <h1 className="text-3xl font-bold text-gray-900 dark:text-dark-text">Profile Settings</h1>

      <div className="bg-white dark:bg-dark-surface rounded-lg shadow-sm border border-gray-200 dark:border-dark-border p-6 transition-colors duration-300">
        <div className="flex items-center space-x-4 mb-8">
          <div className="bg-primary-100 dark:bg-primary-900 rounded-full p-4 transition-colors duration-300">
            <User className="h-12 w-12 text-primary-600 dark:text-primary-400" />
          </div>
          <div>
            <h2 className="text-2xl font-bold text-gray-900 dark:text-dark-text">
              {user.displayName || user.email}
            </h2>
            <div className="flex items-center space-x-2 mt-1">
              <span className={`px-2 py-1 text-xs font-medium rounded-full transition-colors duration-300 ${
                user.role === 'admin' 
                  ? 'bg-purple-100 dark:bg-purple-900 text-purple-800 dark:text-purple-200' 
                  : 'bg-gray-100 dark:bg-gray-700 text-gray-800 dark:text-gray-200'
              }`}>
                <Shield className="h-3 w-3 inline mr-1" />
                {user.role || 'user'}
              </span>
            </div>
          </div>
        </div>

        <form onSubmit={handleSubmit} className="space-y-6">
          <div>
            <label htmlFor="displayName" className="block text-sm font-medium text-gray-700 dark:text-dark-muted mb-2">
              Display Name
            </label>
            <div className="relative">
              <div className="absolute inset-y-0 left-0 pl-3 flex items-center pointer-events-none">
                <User className="h-5 w-5 text-gray-400 dark:text-dark-muted" />
              </div>
              <input
                type="text"
                id="displayName"
                name="displayName"
                className="block w-full pl-10 pr-3 py-2 border border-gray-300 dark:border-dark-border rounded-md bg-white dark:bg-dark-card text-gray-900 dark:text-dark-text focus:ring-primary-500 focus:border-primary-500 transition-colors duration-300"
                value={formData.displayName}
                onChange={handleChange}
              />
            </div>
          </div>

          <div>
            <label htmlFor="email" className="block text-sm font-medium text-gray-700 dark:text-dark-muted mb-2">
              Email Address
            </label>
            <div className="relative">
              <div className="absolute inset-y-0 left-0 pl-3 flex items-center pointer-events-none">
                <Mail className="h-5 w-5 text-gray-400 dark:text-dark-muted" />
              </div>
              <input
                type="email"
                id="email"
                name="email"
                disabled
                className="block w-full pl-10 pr-3 py-2 border border-gray-300 dark:border-dark-border rounded-md bg-gray-50 dark:bg-gray-700 text-gray-500 dark:text-gray-400 transition-colors duration-300"
                value={formData.email}
              />
            </div>
            <p className="text-sm text-gray-500 dark:text-dark-muted mt-1">
              Email address cannot be changed
            </p>
          </div>

          <div className="flex items-center justify-end pt-6">
            <button
              type="submit"
              disabled={loading}
              className="px-6 py-2 bg-primary-600 text-white rounded-md hover:bg-primary-700 disabled:opacity-50 disabled:cursor-not-allowed transition-colors"
            >
              {loading ? 'Updating...' : 'Update Profile'}
            </button>
          </div>
        </form>

        <div className="mt-8 pt-6 border-t border-gray-200 dark:border-dark-border transition-colors duration-300">
          <div className="grid grid-cols-1 md:grid-cols-2 gap-4 text-sm text-gray-600 dark:text-dark-muted">
            <div className="flex items-center space-x-2">
              <Calendar className="h-4 w-4" />
              <span>Member since: {new Date().toLocaleDateString()}</span>
            </div>
            <div className="flex items-center space-x-2">
              <Shield className="h-4 w-4" />
              <span>Role: {user.role || 'user'}</span>
            </div>
          </div>
        </div>
      </div>
    </div>
  );
};

export default Profile;