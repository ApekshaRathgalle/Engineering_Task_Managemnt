import React, { useEffect, useState } from 'react';
import { Link } from 'react-router-dom';
import { Calendar, User, AlertCircle, Clock, CheckCircle, Zap, ArrowRight, Plus, TrendingUp, Target, Activity } from 'lucide-react';
import { taskService } from '../services/taskService';
import { useAuth } from '../context/AuthContext';
import { type Task } from '../types';
import toast from 'react-hot-toast';

const Dashboard: React.FC = () => {
  const { user } = useAuth();
  const [tasks, setTasks] = useState<Task[]>([]);
  const [loading, setLoading] = useState(true);
  const [stats, setStats] = useState({
    totalTasks: 0,
    completedTasks: 0,
    inProgressTasks: 0,
    pendingTasks: 0,
    overdueTasksCount: 0
  });

  useEffect(() => {
    fetchUserTasks();
  }, []);

  useEffect(() => {
    calculateStats();
  }, [tasks]);

  const fetchUserTasks = async () => {
    try {
      const data = await taskService.getMyTasks();
      setTasks(data);
    } catch (error) {
      toast.error('Failed to fetch tasks');
      console.error('Error fetching tasks:', error);
    } finally {
      setLoading(false);
    }
  };

  const calculateStats = () => {
    const totalTasks = tasks.length;
    const completedTasks = tasks.filter(task => task.status === 'completed').length;
    const inProgressTasks = tasks.filter(task => task.status === 'in-progress').length;
    const pendingTasks = tasks.filter(task => task.status === 'pending').length;
    const overdueTasksCount = tasks.filter(task => 
      new Date(task.dueDate) < new Date() && task.status !== 'completed'
    ).length;

    setStats({
      totalTasks,
      completedTasks,
      inProgressTasks,
      pendingTasks,
      overdueTasksCount
    });
  };

  const getRecentTasks = () => {
    return tasks
      .sort((a, b) => new Date(b.createdAt).getTime() - new Date(a.createdAt).getTime())
      .slice(0, 6);
  };

  const getStatusConfig = (status: string) => {
    switch (status) {
      case 'completed':
        return {
          icon: CheckCircle,
          color: 'bg-green-100 text-green-700 border-green-200 dark:bg-green-900/50 dark:text-green-300 dark:border-green-800',
          dotColor: 'bg-green-500 dark:bg-green-400'
        };
      case 'in-progress':
        return {
          icon: Zap,
          color: 'bg-blue-100 text-blue-700 border-blue-200 dark:bg-blue-900/50 dark:text-blue-300 dark:border-blue-800',
          dotColor: 'bg-blue-500 dark:bg-blue-400'
        };
      default:
        return {
          icon: Clock,
          color: 'bg-amber-100 text-amber-700 border-amber-200 dark:bg-amber-900/50 dark:text-amber-300 dark:border-amber-800',
          dotColor: 'bg-amber-500 dark:bg-amber-400'
        };
    }
  };

  const getPriorityConfig = (priority: string) => {
    switch (priority) {
      case 'high':
        return {
          icon: AlertCircle,
          color: 'text-red-600 bg-red-50 border-red-200 dark:text-red-400 dark:bg-red-900/50 dark:border-red-800',
          label: 'High Priority'
        };
      case 'medium':
        return {
          icon: Clock,
          color: 'text-orange-600 bg-orange-50 border-orange-200 dark:text-orange-400 dark:bg-orange-900/50 dark:border-orange-800',
          label: 'Medium Priority'
        };
      default:
        return {
          icon: Clock,
          color: 'text-gray-600 bg-gray-50 border-gray-200 dark:text-gray-400 dark:bg-gray-800/50 dark:border-gray-700',
          label: 'Low Priority'
        };
    }
  };

  const formatDate = (dateString: string | number | Date) => {
    return new Date(dateString).toLocaleDateString('en-US', {
      month: 'short',
      day: 'numeric',
      year: 'numeric'
    });
  };

  const getInitials = (name: string) => {
    return name?.split(' ').map(n => n[0]).join('').toUpperCase() || 'UN';
  };

  const TaskCard = ({ task }: { task: Task }) => {
    const statusConfig = getStatusConfig(task.status);
    const priorityConfig = getPriorityConfig(task.priority);
    const StatusIcon = statusConfig.icon;
    const PriorityIcon = priorityConfig.icon;

    return (
      <Link 
        to={`/task/${task._id}`}
        className="group bg-white dark:bg-dark-surface rounded-xl border border-gray-200 dark:border-dark-border hover:border-green-300 dark:hover:border-green-600 shadow-sm hover:shadow-lg transition-all duration-300 overflow-hidden block"
      >
        {/* Header with Status and Priority */}
        <div className="p-6 pb-4">
          <div className="flex items-start justify-between mb-4">
            <div className="flex items-center space-x-2">
              <div className={`inline-flex items-center px-2.5 py-1 rounded-full text-xs font-medium border ${statusConfig.color}`}>
                <div className={`w-2 h-2 rounded-full ${statusConfig.dotColor} mr-1.5`}></div>
                {task.status.replace('-', ' ')}
              </div>
              {task.priority === 'high' && (
                <div className={`inline-flex items-center px-2 py-1 rounded-md text-xs font-medium border ${priorityConfig.color}`}>
                  <PriorityIcon className="w-3 h-3 mr-1" />
                  High
                </div>
              )}
            </div>
            <div className="opacity-0 group-hover:opacity-100 transition-opacity duration-200">
              <ArrowRight className="w-4 h-4 text-gray-400 dark:text-gray-500 group-hover:text-green-600 dark:group-hover:text-green-400 transition-colors duration-200" />
            </div>
          </div>

          {/* Title and Description */}
          <div className="space-y-2">
            <h3 className="text-lg font-semibold text-gray-900 dark:text-dark-text line-clamp-2 group-hover:text-green-700 dark:group-hover:text-green-300 transition-colors duration-200">
              {task.title}
            </h3>
            <p className="text-sm text-gray-600 dark:text-dark-muted line-clamp-2 leading-relaxed">
              {task.description}
            </p>
          </div>
        </div>

        {/* Tags */}
        <div className="px-6 pb-4">
          <div className="flex flex-wrap gap-1.5">
            {task.tags?.slice(0, 4).map((tag, index) => (
              <span
                key={tag}
                className={`inline-flex items-center px-2 py-0.5 rounded-md text-xs font-medium transition-colors duration-200 ${
                  tag === 'urgent' 
                    ? 'bg-red-50 text-red-700 hover:bg-red-100 dark:bg-red-900/50 dark:text-red-300 dark:hover:bg-red-900/70' 
                    : tag === 'hardware'
                    ? 'bg-blue-50 text-blue-700 hover:bg-blue-100 dark:bg-blue-900/50 dark:text-blue-300 dark:hover:bg-blue-900/70'
                    : tag === 'pcb'
                    ? 'bg-purple-50 text-purple-700 hover:bg-purple-100 dark:bg-purple-900/50 dark:text-purple-300 dark:hover:bg-purple-900/70'
                    : tag === 'design'
                    ? 'bg-green-50 text-green-700 hover:bg-green-100 dark:bg-green-900/50 dark:text-green-300 dark:hover:bg-green-900/70'
                    : 'bg-gray-50 text-gray-700 hover:bg-gray-100 dark:bg-gray-800/50 dark:text-gray-300 dark:hover:bg-gray-800/70'
                }`}
              >
                {tag}
              </span>
            ))}
            {task.tags && task.tags.length > 4 && (
              <span className="inline-flex items-center px-2 py-0.5 rounded-md text-xs font-medium bg-gray-100 text-gray-600 dark:bg-gray-800/50 dark:text-gray-400">
                +{task.tags.length - 4}
              </span>
            )}
          </div>
        </div>

        {/* Footer */}
        <div className="px-6 py-4 bg-gray-50 dark:bg-dark-card border-t border-gray-100 dark:border-dark-border">
          <div className="flex items-center justify-between">
            {/* Assignee */}
            <div className="flex items-center space-x-2">
              <div className="w-6 h-6 bg-gradient-to-br from-green-500 to-green-600 dark:from-green-400 dark:to-green-500 rounded-full flex items-center justify-center">
                <span className="text-xs font-semibold text-white">
                  {getInitials(user?.displayName || user?.email || 'User')}
                </span>
              </div>
              <span className="text-sm text-gray-600 dark:text-dark-muted truncate max-w-[120px]">
                {user?.displayName || 'You'}
              </span>
            </div>

            {/* Due Date */}
            <div className="flex items-center space-x-1 text-sm text-gray-500 dark:text-dark-muted">
              <Calendar className="w-4 h-4" />
              <span>{formatDate(task.dueDate)}</span>
            </div>
          </div>
        </div>

        {/* Hover Overlay */}
        <div className="absolute inset-0 bg-gradient-to-t from-green-500/5 to-transparent opacity-0 group-hover:opacity-100 transition-opacity duration-300 pointer-events-none dark:from-green-400/5"></div>
      </Link>
    );
  };

  if (loading) {
    return (
      <div className="flex items-center justify-center min-h-screen bg-gray-50 dark:bg-dark-bg">
        <div className="animate-spin rounded-full h-12 w-12 border-b-2 border-green-600 dark:border-green-400"></div>
      </div>
    );
  }

  return (
    <div className="p-8 bg-gray-50 dark:bg-dark-bg min-h-screen transition-colors duration-300">
      <div className="max-w-7xl mx-auto">
        {/* Welcome Header */}
        <div className="mb-8">
          <h1 className="text-3xl font-bold text-gray-900 dark:text-dark-text mb-2">
            Welcome back, {user?.displayName || user?.email}!
          </h1>
          <p className="text-gray-600 dark:text-dark-muted">Here's what's happening with your engineering tasks today.</p>
        </div>

        {/* Stats Cards */}
        <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-4 gap-6 mb-8">
          <div className="bg-white dark:bg-dark-surface rounded-lg shadow-sm border border-gray-200 dark:border-dark-border p-6 transition-colors duration-300">
            <div className="flex items-center justify-between">
              <div>
                <p className="text-sm font-medium text-gray-600 dark:text-dark-muted">Total Tasks</p>
                <p className="text-3xl font-bold text-gray-900 dark:text-dark-text">{stats.totalTasks}</p>
              </div>
              <div className="bg-gray-100 dark:bg-dark-card rounded-full p-3">
                <Activity className="h-6 w-6 text-gray-600 dark:text-dark-muted" />
              </div>
            </div>
          </div>

          <div className="bg-white dark:bg-dark-surface rounded-lg shadow-sm border border-gray-200 dark:border-dark-border p-6 transition-colors duration-300">
            <div className="flex items-center justify-between">
              <div>
                <p className="text-sm font-medium text-gray-600 dark:text-dark-muted">Completed</p>
                <p className="text-3xl font-bold text-green-600 dark:text-green-400">{stats.completedTasks}</p>
              </div>
              <div className="bg-green-100 dark:bg-green-900/50 rounded-full p-3">
                <Target className="h-6 w-6 text-green-600 dark:text-green-400" />
              </div>
            </div>
          </div>

          <div className="bg-white dark:bg-dark-surface rounded-lg shadow-sm border border-gray-200 dark:border-dark-border p-6 transition-colors duration-300">
            <div className="flex items-center justify-between">
              <div>
                <p className="text-sm font-medium text-gray-600 dark:text-dark-muted">In Progress</p>
                <p className="text-3xl font-bold text-blue-600 dark:text-blue-400">{stats.inProgressTasks}</p>
              </div>
              <div className="bg-blue-100 dark:bg-blue-900/50 rounded-full p-3">
                <TrendingUp className="h-6 w-6 text-blue-600 dark:text-blue-400" />
              </div>
            </div>
          </div>

          <div className="bg-white dark:bg-dark-surface rounded-lg shadow-sm border border-gray-200 dark:border-dark-border p-6 transition-colors duration-300">
            <div className="flex items-center justify-between">
              <div>
                <p className="text-sm font-medium text-gray-600 dark:text-dark-muted">Pending</p>
                <p className="text-3xl font-bold text-amber-600 dark:text-amber-400">{stats.pendingTasks}</p>
                {stats.overdueTasksCount > 0 && (
                  <p className="text-xs text-red-600 dark:text-red-400 mt-1">{stats.overdueTasksCount} overdue</p>
                )}
              </div>
              <div className="bg-amber-100 dark:bg-amber-900/50 rounded-full p-3">
                <Clock className="h-6 w-6 text-amber-600 dark:text-amber-400" />
              </div>
            </div>
          </div>
        </div>

        {/* Quick Actions */}
        <div className="bg-white dark:bg-dark-surface rounded-lg shadow-sm border border-gray-200 dark:border-dark-border p-6 mb-8 transition-colors duration-300">
          <div className="flex items-center justify-between">
            <h2 className="text-lg font-semibold text-gray-900 dark:text-dark-text">Quick Actions</h2>
            <Link
              to="/tasks"
              className="text-sm text-green-600 dark:text-green-400 hover:text-green-700 dark:hover:text-green-300 font-medium"
            >
              View all tasks →
            </Link>
          </div>
          <div className="grid grid-cols-1 md:grid-cols-3 gap-4 mt-4">
            <Link
              to="/task/create"
              className="flex items-center space-x-3 p-4 bg-green-50 dark:bg-green-900/30 rounded-lg hover:bg-green-100 dark:hover:bg-green-900/50 transition-colors group"
            >
              <div className="bg-green-500 dark:bg-green-600 rounded-full p-2 group-hover:scale-110 transition-transform">
                <Plus className="h-5 w-5 text-white" />
              </div>
              <div>
                <h3 className="font-medium text-gray-900 dark:text-dark-text">Create New Task</h3>
                <p className="text-sm text-gray-600 dark:text-dark-muted">Add a new engineering task</p>
              </div>
            </Link>

            <Link
              to="/tasks?status=in-progress"
              className="flex items-center space-x-3 p-4 bg-blue-50 dark:bg-blue-900/30 rounded-lg hover:bg-blue-100 dark:hover:bg-blue-900/50 transition-colors group"
            >
              <div className="bg-blue-500 dark:bg-blue-600 rounded-full p-2 group-hover:scale-110 transition-transform">
                <Zap className="h-5 w-5 text-white" />
              </div>
              <div>
                <h3 className="font-medium text-gray-900 dark:text-dark-text">Continue Work</h3>
                <p className="text-sm text-gray-600 dark:text-dark-muted">Resume in-progress tasks</p>
              </div>
            </Link>

            <Link
              to="/profile"
              className="flex items-center space-x-3 p-4 bg-gray-50 dark:bg-gray-800/30 rounded-lg hover:bg-gray-100 dark:hover:bg-gray-800/50 transition-colors group"
            >
              <div className="bg-gray-500 dark:bg-gray-600 rounded-full p-2 group-hover:scale-110 transition-transform">
                <User className="h-5 w-5 text-white" />
              </div>
              <div>
                <h3 className="font-medium text-gray-900 dark:text-dark-text">Update Profile</h3>
                <p className="text-sm text-gray-600 dark:text-dark-muted">Manage your account</p>
              </div>
            </Link>
          </div>
        </div>

        {/* Recent Tasks */}
        <div className="mb-8">
          <div className="flex items-center justify-between mb-6">
            <h2 className="text-2xl font-bold text-gray-900 dark:text-dark-text flex items-center">
              <svg className="w-7 h-7 text-green-600 dark:text-green-400 mr-3" fill="none" stroke="currentColor" viewBox="0 0 24 24">
                <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M13 7h8m0 0v8m0-8l-8 8-4-4-6 6" />
              </svg>
              Recent Tasks
            </h2>
            <Link
              to="/tasks"
              className="text-green-600 dark:text-green-400 hover:text-green-700 dark:hover:text-green-300 font-medium flex items-center space-x-1"
            >
              <span>View all</span>
              <ArrowRight className="h-4 w-4" />
            </Link>
          </div>
          
          {getRecentTasks().length > 0 ? (
            <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-6">
              {getRecentTasks().map((task) => (
                <TaskCard key={task._id} task={task} />
              ))}
            </div>
          ) : (
            <div className="bg-white dark:bg-dark-surface rounded-lg shadow-sm border border-gray-200 dark:border-dark-border p-12 text-center transition-colors duration-300">
              <div className="max-w-md mx-auto">
                <div className="bg-gray-100 dark:bg-gray-800 rounded-full w-16 h-16 flex items-center justify-center mx-auto mb-4">
                  <Plus className="h-8 w-8 text-gray-400 dark:text-gray-500" />
                </div>
                <h3 className="text-lg font-medium text-gray-900 dark:text-dark-text mb-2">No tasks yet</h3>
                <p className="text-gray-500 dark:text-dark-muted mb-6">Get started by creating your first engineering task.</p>
                <Link
                  to="/task/create"
                  className="inline-flex items-center px-4 py-2 bg-green-600 dark:bg-green-600 text-white rounded-lg hover:bg-green-700 dark:hover:bg-green-700 transition-colors"
                >
                  <Plus className="h-4 w-4 mr-2" />
                  Create Your First Task
                </Link>
              </div>
            </div>
          )}
        </div>
      </div>
    </div>
  );
};

export default Dashboard;