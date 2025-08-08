import express from 'express';
import {
  syncUser,
  getUserRoleEndpoint,
  getUserRoleByEmail,
  updateProfile,
  getProfile,
  checkAdminEmail,
} from '../controllers/user.Controller';
import { authMiddleware } from '../middleware/authMiddleware';

const router = express.Router();

// Public routes (no auth required)
router.get('/role/:uid', getUserRoleEndpoint);
router.get('/role-by-email/:email', getUserRoleByEmail);
router.get('/check-admin/:email', checkAdminEmail);

// Semi-protected route - sync happens during auth, so we need special handling
router.post('/sync', authMiddleware, syncUser);

// Fully protected routes
router.use(authMiddleware);
router.get('/profile', getProfile);
router.put('/profile', updateProfile);

export default router;