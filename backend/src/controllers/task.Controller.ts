import { Response } from 'express';
import { AuthRequest } from '../middleware/authMiddleware';
import Task from '../models/Task';

export const getTasks = async (req: AuthRequest, res: Response): Promise<void> => {
  try {
    const { status, priority, search, sortBy = 'createdAt', order = 'desc' } = req.query;
    
    let query: any = {};
    
    // If not admin, only show tasks assigned to the user
    if (req.user?.role !== 'admin') {
      query.assignedTo = req.user?.uid;
    }
    
    // Apply filters
    if (status) query.status = status;
    if (priority) query.priority = priority;
    if (search) {
      query.$or = [
        { title: { $regex: search, $options: 'i' } },
        { description: { $regex: search, $options: 'i' } },
      ];
    }
    
    const sortOrder = order === 'desc' ? -1 : 1;
    
    const tasks = await Task.find(query)
      .sort({ [sortBy as string]: sortOrder })
      .limit(100); // Limit for performance
    
    res.status(200).json({
      success: true,
      data: tasks,
      count: tasks.length,
    });
  } catch (error) {
    console.error('Error fetching tasks:', error);
    res.status(500).json({
      success: false,
      message: 'Failed to fetch tasks',
    });
  }
};

export const getTaskById = async (req: AuthRequest, res: Response): Promise<void> => {
  try {
    const task = await Task.findById(req.params.id);
    
    if (!task) {
      res.status(404).json({
        success: false,
        message: 'Task not found',
      });
      return;
    }
    
    // Check if user can access this task
    if (req.user?.role !== 'admin' && task.assignedTo !== req.user?.uid) {
      res.status(403).json({
        success: false,
        message: 'Access denied',
      });
      return;
    }
    
    res.status(200).json({
      success: true,
      data: task,
    });
  } catch (error) {
    console.error('Error fetching task:', error);
    res.status(500).json({
      success: false,
      message: 'Failed to fetch task',
    });
  }
};

export const createTask = async (req: AuthRequest, res: Response): Promise<void> => {
  try {
    const taskData = {
      ...req.body,
      assignedBy: req.user?.uid,
    };
    
    // If no assignedTo is provided, assign to the creator
    if (!taskData.assignedTo) {
      taskData.assignedTo = req.user?.uid;
    }
    
    const task = await Task.create(taskData);
    
    res.status(201).json({
      success: true,
      data: task,
      message: 'Task created successfully',
    });
  } catch (error) {
    console.error('Error creating task:', error);
    res.status(500).json({
      success: false,
      message: 'Failed to create task',
    });
  }
};

export const updateTask = async (req: AuthRequest, res: Response): Promise<void> => {
  try {
    const task = await Task.findById(req.params.id);
    
    if (!task) {
      res.status(404).json({
        success: false,
        message: 'Task not found',
      });
      return;
    }
    
    // Check permissions
    const canEdit = req.user?.role === 'admin' || 
                   task.assignedTo === req.user?.uid || 
                   task.assignedBy === req.user?.uid;
    
    if (!canEdit) {
      res.status(403).json({
        success: false,
        message: 'Access denied',
      });
      return;
    }
    
    const updatedTask = await Task.findByIdAndUpdate(
      req.params.id,
      req.body,
      { new: true, runValidators: true }
    );
    
    res.status(200).json({
      success: true,
      data: updatedTask,
      message: 'Task updated successfully',
    });
  } catch (error) {
    console.error('Error updating task:', error);
    res.status(500).json({
      success: false,
      message: 'Failed to update task',
    });
  }
};

export const deleteTask = async (req: AuthRequest, res: Response): Promise<void> => {
  try {
    const task = await Task.findById(req.params.id);
    
    if (!task) {
      res.status(404).json({
        success: false,
        message: 'Task not found',
      });
      return;
    }
    
    // Check permissions - only admin or task creator can delete
    const canDelete = req.user?.role === 'admin' || task.assignedBy === req.user?.uid;
    
    if (!canDelete) {
      res.status(403).json({
        success: false,
        message: 'Access denied',
      });
      return;
    }
    
    await Task.findByIdAndDelete(req.params.id);
    
    res.status(200).json({
      success: true,
      message: 'Task deleted successfully',
    });
  } catch (error) {
    console.error('Error deleting task:', error);
    res.status(500).json({
      success: false,
      message: 'Failed to delete task',
    });
  }
};

export const getMyTasks = async (req: AuthRequest, res: Response): Promise<void> => {
  try {
    const tasks = await Task.find({ assignedTo: req.user?.uid })
      .sort({ createdAt: -1 });
    
    res.status(200).json({
      success: true,
      data: tasks,
      count: tasks.length,
    });
  } catch (error) {
    console.error('Error fetching user tasks:', error);
    res.status(500).json({
      success: false,
      message: 'Failed to fetch your tasks',
    });
  }
};