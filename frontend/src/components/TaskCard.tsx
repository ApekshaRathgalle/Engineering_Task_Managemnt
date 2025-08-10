import React from 'react';
import { Link } from 'react-router-dom';
import { Calendar, User, AlertCircle, Clock, CheckCircle, Zap, ArrowRight } from 'lucide-react';
import type { Task } from '../types';
import { useAuth } from '../context/AuthContext';

interface TaskCardProps {
  task: Task;
}

const TaskCard: React.FC<TaskCardProps> = ({ task }) => {
  const { user } = useAuth();

  const getStatusConfig = (status: string) => {
    switch (status) {
      case 'completed':
        return {
          icon: CheckCircle,
          color: 'bg-green-100 text-green-700 border-green-200',
          dotColor: 'bg-green-500'
        };
      case 'in-progress':
        return {
          icon: Zap,
          color: 'bg-blue-100 text-blue-700 border-blue-200',
          dotColor: 'bg-blue-500'
        };
      default:
        return {
          icon: Clock,
          color: 'bg-amber-100 text-amber-700 border-amber-200',
          dotColor: 'bg-amber-500'
        };
    }
  };

  const getPriorityConfig = (priority: string) => {
    switch (priority) {
      case 'high':
        return {
          icon: AlertCircle,
          color: 'text-red-600 bg-red-50 border-red-200',
          label: 'High Priority'
        };
      case 'medium':
        return {
          icon: Clock,
          color: 'text-orange-600 bg-orange-50 border-orange-200',
          label: 'Medium Priority'
        };
      default:
        return {
          icon: Clock,
          color: 'text-gray-600 bg-gray-50 border-gray-200',
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

  const statusConfig = getStatusConfig(task.status);
  const priorityConfig = getPriorityConfig(task.priority);
  const StatusIcon = statusConfig.icon;
  const PriorityIcon = priorityConfig.icon;

  return (
    <Link 
      to={`/task/${task._id}`}
      className="group bg-white dark:bg-dark-surface rounded-xl border border-gray-200 dark:border-dark-border hover:border-green-300 dark:hover:border-green-600 shadow-sm hover:shadow-lg transition-all duration-300 overflow-hidden block relative"
    >
      {/* Header with Status and Priority */}
      <div className="p-6 pb-4">
        <div className="flex items-start justify-between mb-4">
          <div className="flex items-center space-x-2">
            <div className={`inline-flex items-center px-2.5 py-1 rounded-full text-xs font-medium border ${statusConfig.color} dark:bg-opacity-20 dark:border-opacity-30`}>
              <div className={`w-2 h-2 rounded-full ${statusConfig.dotColor} mr-1.5`}></div>
              {task.status.replace('-', ' ')}
            </div>
            {task.priority === 'high' && (
              <div className={`inline-flex items-center px-2 py-1 rounded-md text-xs font-medium border ${priorityConfig.color} dark:bg-opacity-20 dark:border-opacity-30`}>
                <PriorityIcon className="w-3 h-3 mr-1" />
                High
              </div>
            )}
          </div>
          <div className="opacity-0 group-hover:opacity-100 transition-opacity duration-200">
            <ArrowRight className="w-4 h-4 text-gray-400 dark:text-dark-muted group-hover:text-green-600 dark:group-hover:text-green-400 transition-colors duration-200" />
          </div>
        </div>

        {/* Title and Description */}
        <div className="space-y-2">
          <h3 className="text-lg font-semibold text-gray-900 dark:text-dark-text line-clamp-2 group-hover:text-green-700 dark:group-hover:text-green-400 transition-colors duration-200">
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
                  ? 'bg-red-50 dark:bg-red-900/20 text-red-700 dark:text-red-300 hover:bg-red-100 dark:hover:bg-red-900/30' 
                  : tag === 'hardware'
                  ? 'bg-blue-50 dark:bg-blue-900/20 text-blue-700 dark:text-blue-300 hover:bg-blue-100 dark:hover:bg-blue-900/30'
                  : tag === 'pcb'
                  ? 'bg-purple-50 dark:bg-purple-900/20 text-purple-700 dark:text-purple-300 hover:bg-purple-100 dark:hover:bg-purple-900/30'
                  : tag === 'design'
                  ? 'bg-green-50 dark:bg-green-900/20 text-green-700 dark:text-green-300 hover:bg-green-100 dark:hover:bg-green-900/30'
                  : tag === 'backend'
                  ? 'bg-indigo-50 dark:bg-indigo-900/20 text-indigo-700 dark:text-indigo-300 hover:bg-indigo-100 dark:hover:bg-indigo-900/30'
                  : tag === 'security'
                  ? 'bg-red-50 dark:bg-red-900/20 text-red-700 dark:text-red-300 hover:bg-red-100 dark:hover:bg-red-900/30'
                  : tag === 'database'
                  ? 'bg-yellow-50 dark:bg-yellow-900/20 text-yellow-700 dark:text-yellow-300 hover:bg-yellow-100 dark:hover:bg-yellow-900/30'
                  : 'bg-gray-50 dark:bg-gray-800 text-gray-700 dark:text-gray-300 hover:bg-gray-100 dark:hover:bg-gray-700'
              }`}
            >
              {tag}
            </span>
          ))}
          {task.tags && task.tags.length > 4 && (
            <span className="inline-flex items-center px-2 py-0.5 rounded-md text-xs font-medium bg-gray-100 dark:bg-gray-800 text-gray-600 dark:text-gray-300">
              +{task.tags.length - 4}
            </span>
          )}
        </div>
      </div>

      {/* Footer */}
      <div className="px-6 py-4 bg-gray-50 dark:bg-dark-card border-t border-gray-100 dark:border-dark-border transition-colors duration-300">
        <div className="flex items-center justify-between">
          {/* Assignee */}
          <div className="flex items-center space-x-2">
            <div className="w-6 h-6 bg-gradient-to-br from-green-500 to-green-600 rounded-full flex items-center justify-center">
              <span className="text-xs font-semibold text-white">
                {getInitials(user?.displayName || user?.email || 'User')}
              </span>
            </div>
            <span className="text-sm text-gray-600 dark:text-dark-muted truncate max-w-[120px]">
              {task.assignedTo === user?.uid ? 'You' : (user?.displayName || 'Assigned User')}
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
      <div className="absolute inset-0 bg-gradient-to-t from-green-500/5 to-transparent opacity-0 group-hover:opacity-100 transition-opacity duration-300 pointer-events-none"></div>
    </Link>
  );
};

export default TaskCard;