import React, { useState } from 'react';
import { Link, Navigate, useNavigate } from 'react-router-dom';
import { Wrench, Mail, Lock, Eye, EyeOff, Shield, ArrowRight } from 'lucide-react';
import { useAuth } from '../../context/AuthContext';
import toast from 'react-hot-toast';

const Login: React.FC = () => {
  const [email, setEmail] = useState('');
  const [password, setPassword] = useState('');
  const [showPassword, setShowPassword] = useState(false);
  const [loading, setLoading] = useState(false);
  const { user, login, loginWithGoogle } = useAuth();
  const navigate = useNavigate();

  // Admin emails that should be redirected to admin login
  const ADMIN_EMAILS = ['thilini@gmail.com', 'apeksha@admin.com'];

  if (user) {
    return <Navigate to="/dashboard" replace />;
  }

  const handleSubmit = async (e: React.FormEvent) => {
    e.preventDefault();
    if (!email || !password) {
      toast.error('Please fill in all fields');
      return;
    }

    // Check if this is an admin email
    const isAdminEmail = ADMIN_EMAILS.includes(email.toLowerCase());
    if (isAdminEmail) {
      toast('Redirecting to admin login...', { icon: '🔒' });
      navigate('/admin/login');
      return;
    }

    setLoading(true);
    try {
      await login(email, password);
      toast.success('Logged in successfully!');
    } catch (error: any) {
      toast.error(error.message || 'Failed to login');
    } finally {
      setLoading(false);
    }
  };

  const handleGoogleLogin = async () => {
    setLoading(true);
    try {
      await loginWithGoogle();
      toast.success('Logged in successfully!');
    } catch (error: any) {
      toast.error(error.message || 'Failed to login with Google');
    } finally {
      setLoading(false);
    }
  };

  return (
    <div className="min-h-screen flex bg-white relative overflow-hidden">
      {/* Left Side - Green Illustration Area */}
      <div className="hidden lg:block lg:w-3/5 relative">
        {/* Green Background with Gradient */}
        <div className="absolute inset-0 bg-gradient-to-br from-green-100 via-green-200 to-green-300"></div>
        
        {/* Main Content */}
        <div className="absolute inset-0 flex items-center justify-center p-12">
          <div className="text-center relative z-10">
            {/* Main illustration card */}
            <div className="bg-white rounded-2xl p-8 shadow-2xl mx-auto max-w-sm relative">
              {/* Person with laptop */}
              <div className="mb-6 relative">
                <div className="w-24 h-24 mx-auto bg-green-500 rounded-full mb-4 flex items-center justify-center shadow-lg">
                  <div className="w-16 h-16 bg-green-600 rounded-full flex items-center justify-center">
                    <Wrench className="h-8 w-8 text-white" />
                  </div>
                </div>
                {/* Laptop representation */}
                <div className="w-20 h-12 mx-auto bg-gray-800 rounded-t-lg relative shadow-md">
                  <div className="w-18 h-10 bg-gray-100 rounded-sm absolute top-1 left-1 flex items-center justify-center">
                    <div className="w-12 h-6 bg-green-200 rounded"></div>
                  </div>
                </div>
                <div className="w-24 h-2 mx-auto bg-gray-700 rounded-b-lg shadow-md"></div>
              </div>

              {/* Task list representation */}
              <div className="space-y-3">
                <div className="flex items-center space-x-3">
                  <div className="w-4 h-4 bg-green-500 rounded-full flex items-center justify-center">
                    <div className="w-2 h-1 bg-white rounded"></div>
                  </div>
                  <div className="flex-1 h-3 bg-gray-200 rounded-full"></div>
                </div>
                <div className="flex items-center space-x-3">
                  <div className="w-4 h-4 bg-green-500 rounded-full flex items-center justify-center">
                    <div className="w-2 h-1 bg-white rounded"></div>
                  </div>
                  <div className="flex-1 h-3 bg-gray-200 rounded-full"></div>
                </div>
                <div className="flex items-center space-x-3">
                  <div className="w-4 h-4 bg-yellow-400 rounded-full"></div>
                  <div className="flex-1 h-3 bg-gray-200 rounded-full"></div>
                </div>
              </div>

              {/* Floating elements */}
              <div className="absolute -top-4 -right-4 w-8 h-8 bg-green-400 rounded-full opacity-80 shadow-lg"></div>
              <div className="absolute -bottom-4 -left-4 w-6 h-6 bg-green-500 rounded-full opacity-60 shadow-lg"></div>
            </div>

            {/* Additional floating elements */}
            <div className="absolute top-20 left-20 w-16 h-16 bg-white rounded-lg shadow-xl p-3 opacity-90">
              <div className="w-full h-2 bg-green-200 rounded mb-1"></div>
              <div className="w-3/4 h-1 bg-gray-200 rounded mb-1"></div>
              <div className="w-1/2 h-1 bg-gray-200 rounded"></div>
            </div>

            <div className="absolute bottom-20 left-16 w-12 h-12 bg-white rounded-full shadow-xl flex items-center justify-center opacity-80">
              <div className="w-6 h-6 bg-green-500 rounded-full"></div>
            </div>

            <div className="absolute top-32 right-16 w-10 h-10 bg-white rounded-lg shadow-xl flex items-center justify-center opacity-75">
              <div className="w-4 h-4 bg-blue-400 rounded"></div>
            </div>
          </div>
        </div>

        {/* Decorative Background Elements */}
        <div className="absolute top-10 left-10 w-32 h-32 bg-green-300 rounded-full opacity-20"></div>
        <div className="absolute bottom-20 right-20 w-24 h-24 bg-green-400 rounded-full opacity-30"></div>
        <div className="absolute top-1/2 left-5 w-16 h-16 bg-green-500 rounded-full opacity-25"></div>
      </div>

      {/* Thick Curved Divider Line */}
      <div className="absolute left-0 lg:left-3/5 top-0 h-full w-20 lg:w-32 z-20">
        <svg
          viewBox="0 0 150 1000"
          className="w-full h-full"
          preserveAspectRatio="none"
        >
          <path
            d="M 0 0 Q 120 100 40 250 Q 140 400 20 550 Q 130 700 10 850 Q 120 950 0 1000 L 0 1000 L 0 0 Z"
            fill="#10b981"
            className="drop-shadow-2xl"
            stroke="#059669"
            strokeWidth="2"
          />
        </svg>
      </div>

      {/* Right Side - Login Form */}
      <div className="flex-1 lg:w-2/5 flex items-center justify-center px-6 sm:px-8 lg:px-16 bg-gray-50 relative z-10 min-h-screen">
        <div className="max-w-md w-full space-y-8">
          {/* Header */}
          <div className="text-center">
            <div className="flex items-center justify-center mb-6">
              <Wrench className="h-10 w-10 text-blue-600 mr-3" />
              <div className="text-left">
                <div className="text-2xl font-bold text-gray-900">Welcome Back</div>
                <div className="text-sm text-gray-600">Sign in to your Engineering Task Manager account</div>
              </div>
            </div>
          </div>

          {/* Login Form */}
          <div className="bg-white rounded-2xl shadow-xl p-8 border border-gray-100">
            <form className="space-y-6" onSubmit={handleSubmit}>
              {/* Email Field */}
              <div>
                <label htmlFor="email" className="block text-sm font-medium text-gray-700 mb-2">
                  Email Address
                </label>
                <div className="relative">
                  <div className="absolute inset-y-0 left-0 pl-3 flex items-center pointer-events-none">
                    <Mail className="h-5 w-5 text-gray-400" />
                  </div>
                  <input
                    id="email"
                    name="email"
                    type="email"
                    autoComplete="email"
                    required
                    className="block w-full pl-10 pr-3 py-3 border border-gray-300 rounded-xl leading-5 bg-white placeholder-gray-400 focus:outline-none focus:ring-2 focus:ring-blue-500 focus:border-blue-500 transition-all duration-200 text-sm"
                    placeholder="a@gmail.com"
                    value={email}
                    onChange={(e) => setEmail(e.target.value)}
                  />
                </div>
              </div>

              {/* Password Field */}
              <div>
                <label htmlFor="password" className="block text-sm font-medium text-gray-700 mb-2">
                  Password
                </label>
                <div className="relative">
                  <div className="absolute inset-y-0 left-0 pl-3 flex items-center pointer-events-none">
                    <Lock className="h-5 w-5 text-gray-400" />
                  </div>
                  <input
                    id="password"
                    name="password"
                    type={showPassword ? 'text' : 'password'}
                    autoComplete="current-password"
                    required
                    className="block w-full pl-10 pr-10 py-3 border border-gray-300 rounded-xl leading-5 bg-white placeholder-gray-400 focus:outline-none focus:ring-2 focus:ring-blue-500 focus:border-blue-500 transition-all duration-200 text-sm"
                    placeholder="••••••"
                    value={password}
                    onChange={(e) => setPassword(e.target.value)}
                  />
                  <button
                    type="button"
                    className="absolute inset-y-0 right-0 pr-3 flex items-center"
                    onClick={() => setShowPassword(!showPassword)}
                  >
                    {showPassword ? (
                      <EyeOff className="h-5 w-5 text-gray-400 hover:text-gray-600" />
                    ) : (
                      <Eye className="h-5 w-5 text-gray-400 hover:text-gray-600" />
                    )}
                  </button>
                </div>
              </div>

              {/* Sign In Button */}
              <div>
                <button
                  type="submit"
                  disabled={loading}
                  className="group relative w-full flex justify-center items-center py-3 px-4 border border-transparent text-sm font-medium rounded-xl text-white bg-gradient-to-r from-blue-600 to-blue-700 hover:from-blue-700 hover:to-blue-800 focus:outline-none focus:ring-2 focus:ring-offset-2 focus:ring-blue-500 disabled:opacity-50 disabled:cursor-not-allowed transition-all duration-200 shadow-lg"
                >
                  {loading ? (
                    <div className="animate-spin rounded-full h-5 w-5 border-b-2 border-white"></div>
                  ) : (
                    <>
                      <span>Sign In</span>
                      <ArrowRight className="ml-2 h-4 w-4 group-hover:translate-x-1 transition-transform" />
                    </>
                  )}
                </button>
              </div>

              {/* Divider */}
              <div className="relative">
                <div className="absolute inset-0 flex items-center">
                  <div className="w-full border-t border-gray-300" />
                </div>
                <div className="relative flex justify-center text-sm">
                  <span className="px-3 bg-white text-gray-500">Or continue with</span>
                </div>
              </div>

              {/* Google Sign In */}
              <div>
                <button
                  type="button"
                  onClick={handleGoogleLogin}
                  disabled={loading}
                  className="w-full flex justify-center items-center px-4 py-3 border border-gray-300 rounded-xl shadow-sm text-sm font-medium text-gray-700 bg-white hover:bg-gray-50 focus:outline-none focus:ring-2 focus:ring-offset-2 focus:ring-blue-500 disabled:opacity-50 disabled:cursor-not-allowed transition-all duration-200"
                >
                  <svg className="w-5 h-5 mr-3" viewBox="0 0 24 24">
                    <path fill="#4285F4" d="M22.56 12.25c0-.78-.07-1.53-.2-2.25H12v4.26h5.92c-.26 1.37-1.04 2.53-2.21 3.31v2.77h3.57c2.08-1.92 3.28-4.74 3.28-8.09z"/>
                    <path fill="#34A853" d="M12 23c2.97 0 5.46-.98 7.28-2.66l-3.57-2.77c-.98.66-2.23 1.06-3.71 1.06-2.86 0-5.29-1.93-6.16-4.53H2.18v2.84C3.99 20.53 7.7 23 12 23z"/>
                    <path fill="#FBBC05" d="M5.84 14.09c-.22-.66-.35-1.36-.35-2.09s.13-1.43.35-2.09V7.07H2.18C1.43 8.55 1 10.22 1 12s.43 3.45 1.18 4.93l2.85-2.22.81-.62z"/>
                    <path fill="#EA4335" d="M12 5.38c1.62 0 3.06.56 4.21 1.64l3.15-3.15C17.45 2.09 14.97 1 12 1 7.7 1 3.99 3.47 2.18 7.07l3.66 2.84c.87-2.6 3.3-4.53 6.16-4.53z"/>
                  </svg>
                  Continue with Google
                </button>
              </div>
            </form>

            {/* Footer Links */}
            <div className="mt-6 text-center space-y-4">
              <p className="text-sm text-gray-600">
                Don't have an account?{' '}
                <Link to="/register" className="font-medium text-blue-600 hover:text-blue-500 transition-colors">
                  Sign up here
                </Link>
              </p>
              <div className="pt-3 border-t border-gray-200">
                <Link 
                  to="/admin/login" 
                  className="inline-flex items-center text-sm font-medium text-purple-600 hover:text-purple-500 transition-colors"
                >
                  <Shield className="h-4 w-4 mr-1" />
                  Admin Login
                </Link>
              </div>
            </div>
          </div>
        </div>
      </div>
    </div>
  );
};

export default Login;