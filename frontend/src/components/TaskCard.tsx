import React from 'react';
import { Link } from 'react-router-dom';
import { Calendar, User, AlertCircle } from 'lucide-react';
import type { Task } from '../types';

interface TaskCardProps {
  task: Task;
}

const TaskCard: React.FC<TaskCardProps> = ({ task }) => {
  const getStatusColor = (status: string) => {
    switch (status) {
      case 'completed':
        return 'bg-green-100 text-green-800';
      case 'in-progress':
        return 'bg-blue-100 text-blue-800';
      default:
        return 'bg-yellow-100 text-yellow-800';
    }
  };

  const getPriorityColor = (priority: string) => {
    switch (priority) {
      case 'high':
        return 'text-red-600';
      case 'medium':
        return 'text-yellow-600';
      default:
        return 'text-green-600';
    }
  };

  return (
    <div className="bg-white rounded-lg shadow-sm border border-gray-200 p-6 hover:shadow-md transition-shadow">
      <div className="flex items-start justify-between mb-4">
        <Link to={`/task/${task._id}`} className="flex-1">
          <h3 className="text-lg font-semibold text-gray-900 hover:text-primary-600 transition-colors">
            {task.title}
          </h3>
        </Link>
        <span className={`px-2 py-1 text-xs font-medium rounded-full ${getStatusColor(task.status)}`}>
          {task.status.replace('-', ' ')}
        </span>
      </div>

      <p className="text-gray-600 text-sm mb-4 line-clamp-2">
        {task.description}
      </p>

      <div className="flex items-center justify-between text-sm text-gray-500">
        <div className="flex items-center space-x-4">
          <div className="flex items-center space-x-1">
            <Calendar className="h-4 w-4" />
            <span>{new Date(task.dueDate).toLocaleDateString()}</span>
          </div>
          <div className="flex items-center space-x-1">
            <User className="h-4 w-4" />
            <span>{task.assignedTo}</span>
          </div>
        </div>
        <div className={`flex items-center space-x-1 ${getPriorityColor(task.priority)}`}>
          <AlertCircle className="h-4 w-4" />
          <span className="capitalize">{task.priority}</span>
        </div>
      </div>

      {task.tags && task.tags.length > 0 && (
        <div className="mt-4 flex flex-wrap gap-2">
          {task.tags.map((tag, index) => (
            <span
              key={index}
              className="px-2 py-1 text-xs bg-gray-100 text-gray-700 rounded"
            >
              {tag}
            </span>
          ))}
        </div>
      )}
    </div>
  );
};

export default TaskCard;