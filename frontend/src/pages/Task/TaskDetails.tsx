import React, { useEffect, useState } from 'react';
import { useParams, useNavigate, Link } from 'react-router-dom';
import { ArrowLeft, Edit3, Trash2, Calendar, User, AlertCircle, Tag } from 'lucide-react';
import { taskService } from '../../services/taskService';
import { useAuth } from '../../context/AuthContext';
import { type Task } from '../../types';
import { canEditTask, canDeleteTask } from '../../utils/roleUtils';
import toast from 'react-hot-toast';

const TaskDetails: React.FC = () => {
  const { id } = useParams<{ id: string }>();
  const navigate = useNavigate();
  const { user } = useAuth();
  const [task, setTask] = useState<Task | null>(null);
  const [loading, setLoading] = useState(true);

  useEffect(() => {
    if (id) {
      fetchTask(id);
    }
  }, [id]);

  const fetchTask = async (taskId: string) => {
    try {
      const data = await taskService.getTaskById(taskId);
      setTask(data);
    } catch (error) {
      toast.error('Failed to fetch task details');
      console.error('Error fetching task:', error);
      navigate('/dashboard');
    } finally {
      setLoading(false);
    }
  };

  const handleStatusUpdate = async (newStatus: Task['status']) => {
    if (!task || !id) return;

    try {
      const updatedTask = await taskService.updateTask(id, { status: newStatus });
      setTask(updatedTask);
      toast.success('Task status updated successfully');
    } catch (error) {
      toast.error('Failed to update task status');
      console.error('Error updating task status:', error);
    }
  };

  const handleDelete = async () => {
    if (!task || !id) return;

    if (window.confirm('Are you sure you want to delete this task?')) {
      try {
        await taskService.deleteTask(id);
        toast.success('Task deleted successfully');
        navigate('/dashboard');
      } catch (error) {
        toast.error('Failed to delete task');
        console.error('Error deleting task:', error);
      }
    }
  };

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

  if (loading) {
    return (
      <div className="flex items-center justify-center min-h-screen">
        <div className="animate-spin rounded-full h-12 w-12 border-b-2 border-primary-600"></div>
      </div>
    );
  }

  if (!task) {
    return (
      <div className="text-center py-12">
        <h2 className="text-xl font-semibold text-gray-900">Task not found</h2>
        <p className="text-gray-600 mt-2">The task you're looking for doesn't exist.</p>
      </div>
    );
  }

  return (
    <div className="space-y-6">
      <div className="flex items-center justify-between">
        <div className="flex items-center space-x-4">
          <button
            onClick={() => navigate(-1)}
            className="p-2 rounded-md text-gray-600 hover:text-gray-900 hover:bg-gray-100 transition-colors"
          >
            <ArrowLeft className="h-5 w-5" />
          </button>
          <h1 className="text-3xl font-bold text-gray-900">Task Details</h1>
        </div>

        <div className="flex items-center space-x-2">
          {canEditTask(user, task.assignedTo) && (
            <Link
              to={`/task/edit/${task._id}`}
              className="px-4 py-2 border border-gray-300 rounded-md text-gray-700 hover:bg-gray-50 transition-colors flex items-center space-x-2"
            >
              <Edit3 className="h-4 w-4" />
              <span>Edit</span>
            </Link>
          )}

          {canDeleteTask(user, task.assignedBy) && (
            <button
              onClick={handleDelete}
              className="px-4 py-2 border border-red-300 rounded-md text-red-600 hover:bg-red-50 transition-colors flex items-center space-x-2"
            >
              <Trash2 className="h-4 w-4" />
              <span>Delete</span>
            </button>
          )}
        </div>
      </div>

      <div className="bg-white rounded-lg shadow-sm border border-gray-200 p-6">
        <div className="flex items-start justify-between mb-6">
          <div className="flex-1">
            <h2 className="text-2xl font-bold text-gray-900 mb-2">{task.title}</h2>
            <div className="flex items-center space-x-4">
              <span className={`px-3 py-1 text-sm font-medium rounded-full ${getStatusColor(task.status)}`}>
                {task.status.replace('-', ' ')}
              </span>
              <div className={`flex items-center space-x-1 ${getPriorityColor(task.priority)}`}>
                <AlertCircle className="h-4 w-4" />
                <span className="capitalize text-sm font-medium">{task.priority} Priority</span>
              </div>
            </div>
          </div>
        </div>

        <div className="grid grid-cols-1 md:grid-cols-3 gap-6 mb-6">
          <div className="bg-gray-50 rounded-lg p-4">
            <div className="flex items-center space-x-2 text-sm text-gray-600 mb-1">
              <Calendar className="h-4 w-4" />
              <span>Due Date</span>
            </div>
            <p className="font-medium">
              {new Date(task.dueDate).toLocaleDateString('en-US', {
                year: 'numeric',
                month: 'long',
                day: 'numeric'
              })}
            </p>
          </div>

          <div className="bg-gray-50 rounded-lg p-4">
            <div className="flex items-center space-x-2 text-sm text-gray-600 mb-1">
              <User className="h-4 w-4" />
              <span>Assigned To</span>
            </div>
            <p className="font-medium">{task.assignedTo}</p>
          </div>

          <div className="bg-gray-50 rounded-lg p-4">
            <div className="flex items-center space-x-2 text-sm text-gray-600 mb-1">
              <User className="h-4 w-4" />
              <span>Created By</span>
            </div>
            <p className="font-medium">{task.assignedBy}</p>
          </div>
        </div>

        <div className="mb-6">
          <h3 className="text-lg font-semibold text-gray-900 mb-3">Description</h3>
          <div className="bg-gray-50 rounded-lg p-4">
            <p className="text-gray-700 whitespace-pre-wrap">{task.description}</p>
          </div>
        </div>

        {task.tags && task.tags.length > 0 && (
          <div className="mb-6">
            <div className="flex items-center space-x-2 text-sm text-gray-600 mb-3">
              <Tag className="h-4 w-4" />
              <span>Tags</span>
            </div>
            <div className="flex flex-wrap gap-2">
              {task.tags.map((tag, index) => (
                <span
                  key={index}
                  className="px-3 py-1 text-sm bg-primary-100 text-primary-800 rounded-full"
                >
                  {tag}
                </span>
              ))}
            </div>
          </div>
        )}

        {canEditTask(user, task.assignedTo) && (
          <div className="pt-6 border-t border-gray-200">
            <h3 className="text-lg font-semibold text-gray-900 mb-4">Update Status</h3>
            <div className="flex flex-wrap gap-2">
              {(['pending', 'in-progress', 'completed'] as const).map((status) => (
                <button
                  key={status}
                  onClick={() => handleStatusUpdate(status)}
                  className={`px-4 py-2 rounded-md text-sm font-medium transition-colors ${
                    task.status === status
                      ? `${getStatusColor(status)} cursor-default`
                      : 'border border-gray-300 text-gray-700 hover:bg-gray-50'
                  }`}
                  disabled={task.status === status}
                >
                  {status.replace('-', ' ')}
                </button>
              ))}
            </div>
          </div>
        )}

        <div className="pt-6 border-t border-gray-200 text-sm text-gray-500">
          <p>Created: {new Date(task.createdAt).toLocaleString()}</p>
          <p>Last updated: {new Date(task.updatedAt).toLocaleString()}</p>
        </div>
      </div>
    </div>
  );
};

export default TaskDetails;