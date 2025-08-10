import React, { useState, useEffect } from 'react';
import { Link, Navigate } from 'react-router-dom';
import { Mail, Lock, User, Eye, EyeOff, Shield, ChevronRight } from 'lucide-react';
import { useAuth } from '../../context/AuthContext';
import registerImage from '../../assets/login.jpg';
import toast from 'react-hot-toast';

const Register: React.FC = () => {
  const [formData, setFormData] = useState({
    displayName: '',
    email: '',
    password: '',
    confirmPassword: '',
  });
  const [showPassword, setShowPassword] = useState(false);
  const [loading, setLoading] = useState(false);
  const [displayNameFocused, setDisplayNameFocused] = useState(false);
  const [emailFocused, setEmailFocused] = useState(false);
  const [passwordFocused, setPasswordFocused] = useState(false);
  const [confirmPasswordFocused, setConfirmPasswordFocused] = useState(false);
  const [mounted, setMounted] = useState(false);
  
  const { user, register, loginWithGoogle } = useAuth();

  useEffect(() => {
    const timer = setTimeout(() => setMounted(true), 100);
    return () => clearTimeout(timer);
  }, []);

  if (user) {
    return <Navigate to="/dashboard" replace />;
  }

  const handleChange = (e: React.ChangeEvent<HTMLInputElement>) => {
    setFormData(prev => ({
      ...prev,
      [e.target.name]: e.target.value,
    }));
  };

  const handleSubmit = async (e: React.FormEvent) => {
    e.preventDefault();
    const { displayName, email, password, confirmPassword } = formData;

    if (!displayName || !email || !password || !confirmPassword) {
      toast.error('Please fill in all fields');
      return;
    }

    if (password !== confirmPassword) {
      toast.error('Passwords do not match');
      return;
    }

    if (password.length < 6) {
      toast.error('Password must be at least 6 characters');
      return;
    }

    setLoading(true);
    try {
      await register(email, password, displayName);
      toast.success('Account created successfully!');
    } catch (error: any) {
      toast.error(error.message || 'Failed to create account');
    } finally {
      setLoading(false);
    }
  };

  const handleGoogleSignUp = async () => {
    setLoading(true);
    try {
      await loginWithGoogle();
      toast.success('Account created successfully!');
    } catch (error: any) {
      toast.error(error.message || 'Failed to sign up with Google');
    } finally {
      setLoading(false);
    }
  };

  return (
    <div className="min-h-screen flex bg-white">
      <style>{`
        @keyframes fadeInUp {
          from { opacity: 0; transform: translateY(30px);}
          to { opacity: 1; transform: translateY(0);}
        }
        @keyframes slideInRight {
          from { opacity: 0; transform: translateX(40px);}
          to { opacity: 1; transform: translateX(0);}
        }
        @keyframes float {
          0%, 100% { transform: translateY(0px); }
          50% { transform: translateY(-8px); }
        }
        .animate-fade-in-up { animation: fadeInUp 1s ease-out; }
        .animate-slide-in-right { animation: slideInRight 1s ease-out; }
        .animate-float { animation: float 3s ease-in-out infinite; }
        .glass-effect {
          background: rgba(255,255,255,0.98);
          border-radius: 1.5rem;
          box-shadow: 0 20px 25px -5px rgba(0, 0, 0, 0.1), 0 10px 10px -5px rgba(0, 0, 0, 0.04);
          border: 1px solid rgba(34,197,94,0.1);
        }
        .gradient-btn {
          background: linear-gradient(90deg,#059669 0%,#22c55e 100%);
        }
        .input-focus {
          border-color: #22c55e;
          box-shadow: 0 0 0 3px rgba(34, 197, 94, 0.1);
        }
        .google-btn {
          transition: all 0.3s ease;
          box-shadow: 0 1px 2px 0 rgba(0, 0, 0, 0.1);
        }
        .google-btn:hover {
          box-shadow: 0 4px 6px -1px rgba(0, 0, 0, 0.1), 0 2px 4px -1px rgba(0, 0, 0, 0.06);
          transform: translateY(-1px);
        }
        .forgot-password {
          transition: all 0.2s ease;
        }
        .forgot-password:hover {
          color: #059669;
          transform: translateX(2px);
        }
        /* Force the layout with inline styles */
        .image-section {
          width: 60% !important;
          flex-shrink: 0 !important;
          min-height: 100vh !important;
        }
        .form-section {
          width: 40% !important;
          flex-shrink: 0 !important;
          min-height: 100vh !important;
        }
      `}</style>
      
      {/* Left Side - Image (60% width) */}
      <div className="image-section relative overflow-hidden bg-gradient-to-br from-green-50 to-emerald-50">
        <div className="absolute inset-0 bg-gradient-to-t from-black/20 to-black/5 z-10"></div>
        <img
          src={registerImage}
          alt="Engineering Workspace"
          className="w-full h-full object-cover"
          style={{ filter: 'brightness(1.05) contrast(1.05)' }}
        />
        
        {/* Floating elements */}
        {mounted && (
          <>
            <div className="absolute top-24 left-24 w-3 h-3 bg-white/40 rounded-full animate-float" style={{animationDelay: '0s'}}></div>
            <div className="absolute top-1/3 right-24 w-2 h-2 bg-white/50 rounded-full animate-float" style={{animationDelay: '1s'}}></div>
            <div className="absolute bottom-32 left-20 w-4 h-4 bg-white/35 rounded-full animate-float" style={{animationDelay: '2s'}}></div>
            <div className="absolute bottom-24 right-32 w-2 h-2 bg-white/45 rounded-full animate-float" style={{animationDelay: '1.5s'}}></div>
          </>
        )}

        {/* Overlay text */}
        <div className="absolute bottom-10 left-10 z-20 text-white">
          <h2 className="text-3xl font-bold mb-2">Build Something Amazing</h2>
          <p className="text-lg opacity-90 max-w-md">Join our community of engineers and bring your ideas to life</p>
        </div>
      </div>
      
      {/* Right Side - Register Form (40% width) */}
      <div className="form-section flex items-center justify-center px-6 lg:px-8 xl:px-12 bg-white min-h-screen">
        <div className={`w-full max-w-md space-y-8 ${mounted ? 'animate-slide-in-right' : 'opacity-0'}`}>
          {/* Welcome Text */}
          <div className="text-center">
            <div className="flex items-center justify-center mb-2">
              <div className="w-12 h-12 rounded-full bg-green-100 flex items-center justify-center">
                <svg className="w-6 h-6 text-green-600" fill="none" stroke="currentColor" viewBox="0 0 24 24">
                  <path strokeLinecap="round" strokeLinejoin="round" strokeWidth="2" d="M12 11c0 3.517-1.009 6.799-2.753 9.571m-3.44-2.04l.054-.09A13.916 13.916 0 008 11a4 4 0 118 0c0 1.017-.07 2.019-.203 3m-2.118 6.844A21.88 21.88 0 0015.171 17m3.839 1.132c.645-2.266.99-4.659.99-7.132A8 8 0 008 4.07M3 15.364c.64-1.319 1-2.8 1-4.364 0-1.457.39-2.823 1.07-4"></path>
                </svg>
              </div>
            </div>
            <h1 className="text-4xl font-bold text-gray-900 mb-2">Get Started</h1>
            <p className="text-gray-600">Create your account to begin your journey</p>
          </div>
          
          {/* Register Form */}
          <div className="glass-effect p-8 sm:p-10">
            <form className="space-y-6" onSubmit={handleSubmit}>
              {/* Display Name Field */}
              <div className="space-y-1">
                <label htmlFor="displayName" className="block text-sm font-medium text-gray-700">
                  Full Name
                </label>
                <div className="relative">
                  <div className={`absolute inset-y-0 left-0 pl-3 flex items-center pointer-events-none transition-colors duration-300 ${displayNameFocused ? 'text-green-500' : 'text-gray-400'}`}>
                    <User className="h-5 w-5" />
                  </div>
                  <input
                    id="displayName"
                    name="displayName"
                    type="text"
                    required
                    className={`block w-full pl-10 pr-3 py-3 border rounded-lg bg-white placeholder-gray-400 text-base focus:outline-none transition-all duration-300 ${
                      displayNameFocused ? 'input-focus' : 'border-gray-300 hover:border-green-400'
                    }`}
                    placeholder="John Doe"
                    value={formData.displayName}
                    onChange={handleChange}
                    onFocus={() => setDisplayNameFocused(true)}
                    onBlur={() => setDisplayNameFocused(false)}
                  />
                </div>
              </div>

              {/* Email Field */}
              <div className="space-y-1">
                <label htmlFor="email" className="block text-sm font-medium text-gray-700">
                  Email Address
                </label>
                <div className="relative">
                  <div className={`absolute inset-y-0 left-0 pl-3 flex items-center pointer-events-none transition-colors duration-300 ${emailFocused ? 'text-green-500' : 'text-gray-400'}`}>
                    <Mail className="h-5 w-5" />
                  </div>
                  <input
                    id="email"
                    name="email"
                    type="email"
                    autoComplete="email"
                    required
                    className={`block w-full pl-10 pr-3 py-3 border rounded-lg bg-white placeholder-gray-400 text-base focus:outline-none transition-all duration-300 ${
                      emailFocused ? 'input-focus' : 'border-gray-300 hover:border-green-400'
                    }`}
                    placeholder="your@email.com"
                    value={formData.email}
                    onChange={handleChange}
                    onFocus={() => setEmailFocused(true)}
                    onBlur={() => setEmailFocused(false)}
                  />
                </div>
              </div>
              
              {/* Password Field */}
              <div className="space-y-1">
                <label htmlFor="password" className="block text-sm font-medium text-gray-700">
                  Password
                </label>
                <div className="relative">
                  <div className={`absolute inset-y-0 left-0 pl-3 flex items-center pointer-events-none transition-colors duration-300 ${passwordFocused ? 'text-green-500' : 'text-gray-400'}`}>
                    <Lock className="h-5 w-5" />
                  </div>
                  <input
                    id="password"
                    name="password"
                    type={showPassword ? 'text' : 'password'}
                    required
                    className={`block w-full pl-10 pr-12 py-3 border rounded-lg bg-white placeholder-gray-400 text-base focus:outline-none transition-all duration-300 ${
                      passwordFocused ? 'input-focus' : 'border-gray-300 hover:border-green-400'
                    }`}
                    placeholder="••••••••"
                    value={formData.password}
                    onChange={handleChange}
                    onFocus={() => setPasswordFocused(true)}
                    onBlur={() => setPasswordFocused(false)}
                  />
                  <button
                    type="button"
                    className="absolute inset-y-0 right-0 pr-3 flex items-center transition-all duration-200 hover:scale-110"
                    onClick={() => setShowPassword(!showPassword)}
                  >
                    {showPassword ? (
                      <EyeOff className="h-5 w-5 text-gray-400 hover:text-green-600" />
                    ) : (
                      <Eye className="h-5 w-5 text-gray-400 hover:text-green-600" />
                    )}
                  </button>
                </div>
              </div>

              {/* Confirm Password Field */}
              <div className="space-y-1">
                <label htmlFor="confirmPassword" className="block text-sm font-medium text-gray-700">
                  Confirm Password
                </label>
                <div className="relative">
                  <div className={`absolute inset-y-0 left-0 pl-3 flex items-center pointer-events-none transition-colors duration-300 ${confirmPasswordFocused ? 'text-green-500' : 'text-gray-400'}`}>
                    <Lock className="h-5 w-5" />
                  </div>
                  <input
                    id="confirmPassword"
                    name="confirmPassword"
                    type="password"
                    required
                    className={`block w-full pl-10 pr-3 py-3 border rounded-lg bg-white placeholder-gray-400 text-base focus:outline-none transition-all duration-300 ${
                      confirmPasswordFocused ? 'input-focus' : 'border-gray-300 hover:border-green-400'
                    }`}
                    placeholder="••••••••"
                    value={formData.confirmPassword}
                    onChange={handleChange}
                    onFocus={() => setConfirmPasswordFocused(true)}
                    onBlur={() => setConfirmPasswordFocused(false)}
                  />
                </div>
              </div>
              
              {/* Create Account Button */}
              <div className="pt-2">
                <button
                  type="submit"
                  disabled={loading}
                  className="w-full py-3.5 rounded-lg font-semibold text-white gradient-btn shadow-md hover:shadow-lg transition-all duration-300 transform hover:scale-[1.02] active:scale-[0.98] text-base flex items-center justify-center"
                >
                  {loading ? (
                    <>
                      <div className="animate-spin rounded-full h-5 w-5 border-b-2 border-white mr-2"></div>
                      <span>Creating Account...</span>
                    </>
                  ) : (
                    <>
                      <span>Create Account</span>
                      <ChevronRight className="h-5 w-5 ml-2" />
                    </>
                  )}
                </button>
              </div>
              
              {/* Divider */}
              <div className="relative my-6">
                <div className="absolute inset-0 flex items-center">
                  <div className="w-full border-t border-gray-300"></div>
                </div>
                <div className="relative flex justify-center text-sm">
                  <span className="px-2 bg-white text-gray-500">Or continue with</span>
                </div>
              </div>
              
              {/* Google Sign Up */}
              <div>
                <button
                  type="button"
                  onClick={handleGoogleSignUp}
                  disabled={loading}
                  className="w-full flex items-center justify-center px-4 py-3.5 border border-gray-300 rounded-lg google-btn text-base font-medium text-gray-700 bg-white hover:bg-gray-50 focus:outline-none focus:ring-3 focus:ring-green-500/20 disabled:opacity-50 disabled:cursor-not-allowed"
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
            <div className="mt-8 pt-6 border-t border-gray-200 text-center space-y-4">
              <p className="text-sm text-gray-600">
                Already have an account?{' '}
                <Link to="/login" className="font-medium text-green-600 hover:text-green-500 transition-colors hover:underline flex items-center justify-center">
                  Sign in here <ChevronRight className="h-4 w-4 ml-1" />
                </Link>
              </p>
              <div>
                <Link 
                  to="/admin/login" 
                  className="inline-flex items-center text-sm font-medium text-blue-600 hover:text-blue-500 transition-all duration-200 hover:scale-105 group"
                >
                  <Shield className="h-4 w-4 mr-1.5 group-hover:rotate-12 transition-transform" />
                  Admin Login
                  <ChevronRight className="h-4 w-4 ml-1 group-hover:translate-x-1 transition-transform" />
                </Link>
              </div>
            </div>
          </div>
        </div>
      </div>
    </div>
  );
};

export default Register;