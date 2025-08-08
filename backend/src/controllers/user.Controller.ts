import { Response } from 'express';
import { AuthRequest } from '../middleware/authMiddleware';
import User from '../models/user';
import { getUserRole } from '../utils/firebaseAdmin';

export const syncUser = async (req: AuthRequest, res: Response): Promise<void> => {
  try {
    const { uid, email, displayName, photoURL } = req.body;
    
    let user = await User.findOne({ uid });
    
    if (user) {
      // Update existing user
      user = await User.findOneAndUpdate(
        { uid },
        { email, displayName, photoURL },
        { new: true, runValidators: true }
      );
    } else {
      // Check if user exists by email (for admin users with custom UIDs)
      const existingUserByEmail = await User.findOne({ email: email.toLowerCase() });
      
      if (existingUserByEmail) {
        // Update the existing user's UID to match Firebase UID
        console.log('📧 Found existing user by email, updating UID from', existingUserByEmail.uid, 'to', uid);
        user = await User.findOneAndUpdate(
          { email: email.toLowerCase() },
          { uid, displayName, photoURL },
          { new: true, runValidators: true }
        );
      } else {
        // Create new user
        user = await User.create({
          uid,
          email,
          displayName,
          photoURL,
          role: 'user', // Default role
        });
      }
    }
    
    res.status(200).json({
      success: true,
      data: user,
      message: 'User synchronized successfully',
    });
  } catch (error) {
    console.error('Error syncing user:', error);
    res.status(500).json({
      success: false,
      message: 'Failed to sync user',
    });
  }
};

export const getUserRoleEndpoint = async (req: AuthRequest, res: Response): Promise<void> => {
  try {
    const { uid } = req.params;
    
    // Get role from our MongoDB database first by UID
    let user = await User.findOne({ uid });
    
    if (user) {
      console.log('✅ User found by UID:', uid, 'Role:', user.role);
      res.status(200).json({
        success: true,
        role: user.role,
      });
    } else {
      console.log('⚠️ User not found in database for UID:', uid);
      res.status(200).json({
        success: true,
        role: 'user',
      });
    }
  } catch (error) {
    console.error('Error fetching user role:', error);
    res.status(500).json({
      success: false,
      message: 'Failed to fetch user role',
      role: 'user', // Default fallback
    });
  }
};

export const getUserRoleByEmail = async (req: AuthRequest, res: Response): Promise<void> => {
  try {
    const { email } = req.params;
    
    // Get role from our MongoDB database by email
    const user = await User.findOne({ email: email.toLowerCase() });
    
    if (user) {
      console.log('✅ User found by email:', email, 'Role:', user.role);
      res.status(200).json({
        success: true,
        role: user.role,
        uid: user.uid,
      });
    } else {
      console.log('⚠️ User not found in database for email:', email);
      res.status(200).json({
        success: true,
        role: 'user',
      });
    }
  } catch (error) {
    console.error('Error fetching user role by email:', error);
    res.status(500).json({
      success: false,
      message: 'Failed to fetch user role',
      role: 'user', // Default fallback
    });
  }
};

export const updateProfile = async (req: AuthRequest, res: Response): Promise<void> => {
  try {
    const { displayName } = req.body;
    
    const user = await User.findOneAndUpdate(
      { uid: req.user?.uid },
      { displayName },
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
      message: 'Profile updated successfully',
    });
  } catch (error) {
    console.error('Error updating profile:', error);
    res.status(500).json({
      success: false,
      message: 'Failed to update profile',
    });
  }
};

export const getProfile = async (req: AuthRequest, res: Response): Promise<void> => {
  try {
    const user = await User.findOne({ uid: req.user?.uid });
    
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
    });
  } catch (error) {
    console.error('Error fetching profile:', error);
    res.status(500).json({
      success: false,
      message: 'Failed to fetch profile',
    });
  }
};

export const checkAdminEmail = async (req: AuthRequest, res: Response): Promise<void> => {
  try {
    const { email } = req.params;
    
    // Check if email exists in database with admin role
    const user = await User.findOne({ 
      email: email.toLowerCase(),
      role: 'admin'
    });
    
    res.status(200).json({
      success: true,
      isAdmin: !!user,
      message: user ? 'Admin email found' : 'Not an admin email',
    });
  } catch (error) {
    console.error('Error checking admin email:', error);
    res.status(500).json({
      success: false,
      isAdmin: false,
      message: 'Failed to check admin email',
    });
  }
};