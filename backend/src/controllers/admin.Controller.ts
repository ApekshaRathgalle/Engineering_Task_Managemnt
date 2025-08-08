import { Response } from 'express';
import { AuthRequest } from '../middleware/authMiddleware';
import User from '../models/user';
import Task from '../models/Task';
import { setUserRole, getUserRole } from '../utils/firebaseAdmin';

export const getUsers = async (req: AuthRequest, res: Response): Promise<void> => {
  try {
    const { role, search, sortBy = 'createdAt', order = 'desc' } = req.query;
    
    let query: any = {};
    
    if (role && role !== 'all') query.role = role;
    if (search) {
      query.$or = [
        { email: { $regex: search, $options: 'i' } },
        { displayName: { $regex: search, $options: 'i' } },
      ];
    }
    
    const sortOrder = order === 'desc' ? -1 : 1;
    
    const users = await User.find(query)
      .sort({ [sortBy as string]: sortOrder })
      .select('-__v');
    
    res.status(200).json({
      success: true,
      data: users,
      count: users.length,
    });
  } catch (error) {
    console.error('Error fetching users:', error);
    res.status(500).json({
      success: false,
      message: 'Failed to fetch users',
    });
  }
};

export const updateUserRole = async (req: AuthRequest, res: Response): Promise<void> => {
  try {
    const { uid } = req.params;
    const { role } = req.body;
    
    if (!['admin', 'user'].includes(role)) {
      res.status(400).json({
        success: false,
        message: 'Invalid role specified',
      });
      return;
    }
    
    // Update Firebase custom claims
    await setUserRole(uid, role);
    
    // Update database
    const user = await User.findOneAndUpdate(
      { uid },
      { role },
      { new: true, runValidators: true }
    );
    
    if (!user) {
      res.status(404).json({
        success: false,
        message: 'User not found',
      });
      return;
    }
    
    res.status(200).json({
      success: true,
      data: user,
      message: `User role updated to ${role}`,
    });
  } catch (error) {
    console.error('Error updating user role:', error);
    res.status(500).json({
      success: false,
      message: 'Failed to update user role',
    });
  }
};

export const deleteUser = async (req: AuthRequest, res: Response): Promise<void> => {
  try {
    const { uid } = req.params;
    
    // Don't allow deleting yourself
    if (uid === req.user?.uid) {
      res.status(400).json({
        success: false,
        message: 'Cannot delete your own account',
      });
      return;
    }
    
    // Delete user from database
    const user = await User.findOneAndDelete({ uid });
    
    if (!user) {
      res.status(404).json({
        success: false,
        message: 'User not found',
      });
      return;
    }
    
    // Also delete all tasks created by this user
    await Task.deleteMany({ assignedBy: uid });
    
    // Update tasks assigned to this user (reassign to admin or mark as unassigned)
    await Task.updateMany(
      { assignedTo: uid },
      { assignedTo: req.user?.uid } // Reassign to current admin
    );
    
    res.status(200).json({
      success: true,
      message: 'User deleted successfully',
    });
  } catch (error) {
    console.error('Error deleting user:', error);
    res.status(500).json({
      success: false,
      message: 'Failed to delete user',
    });
  }
};

export const getDashboardStats = async (req: AuthRequest, res: Response): Promise<void> => {
  try {
    // Get counts
    const totalUsers = await User.countDocuments();
    const totalTasks = await Task.countDocuments();
    const completedTasks = await Task.countDocuments({ status: 'completed' });
    const inProgressTasks = await Task.countDocuments({ status: 'in-progress' });
    const pendingTasks = await Task.countDocuments({ status: 'pending' });
    
    const stats = {
      totalUsers,
      totalTasks,
      completedTasks,
      inProgressTasks,
      pendingTasks,
    };
    
    res.status(200).json({
      success: true,
      data: stats,
    });
  } catch (error) {
    console.error('Error fetching dashboard stats:', error);
    res.status(500).json({
      success: false,
      message: 'Failed to fetch dashboard statistics',
    });
  }
};

export const getAllTasks = async (req: AuthRequest, res: Response): Promise<void> => {
  try {
    const { status, priority, search, sortBy = 'createdAt', order = 'desc' } = req.query;
    
    let query: any = {};
    
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
    console.error('Error fetching all tasks:', error);
    res.status(500).json({
      success: false,
      message: 'Failed to fetch tasks',
    });
  }
};