import express from 'express';
import {
  getUsers,
  updateUserRole,
  deleteUser,
  getDashboardStats,
  getAllTasks,
} from '../controllers/admin.Controller';
import { authMiddleware } from '../middleware/authMiddleware';
import { requireAdmin } from '../middleware/roleMiddleware';

const router = express.Router();

// Apply auth middleware to all routes
router.use(authMiddleware);
router.use(requireAdmin);

// Routes
router.get('/users', getUsers);
router.put('/users/:uid/role', updateUserRole);
router.delete('/users/:uid', deleteUser);
router.get('/stats', getDashboardStats);
router.get('/tasks', getAllTasks);

export default router;