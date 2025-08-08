import { 
  signInWithEmailAndPassword, 
  createUserWithEmailAndPassword, 
  signOut as firebaseSignOut,
  signInWithPopup,
  updateProfile,
  type User,
  type AuthError
} from 'firebase/auth';
import { auth, googleProvider } from '../firebase/firebase';

const API_URL = import.meta.env.VITE_API_URL || 'http://localhost:5000/api';

interface UserRoleResponse {
  role: 'admin' | 'user';
}

// Enhanced error handling for Firebase auth errors
const getFirebaseErrorMessage = (error: AuthError): string => {
  switch (error.code) {
    case 'auth/user-not-found':
      return 'No user found with this email address.';
    case 'auth/wrong-password':
      return 'Incorrect password.';
    case 'auth/email-already-in-use':
      return 'An account with this email already exists.';
    case 'auth/weak-password':
      return 'Password should be at least 6 characters.';
    case 'auth/invalid-email':
      return 'Invalid email address.';
    case 'auth/too-many-requests':
      return 'Too many unsuccessful attempts. Please try again later.';
    case 'auth/popup-closed-by-user':
      return 'Sign-in popup was closed before completion.';
    case 'auth/cancelled-popup-request':
      return 'Sign-in popup was cancelled.';
    case 'auth/configuration-not-found':
      return 'Firebase configuration error. Please contact support.';
    default:
      console.error('Firebase auth error:', error);
      return error.message || 'An authentication error occurred.';
  }
};

// Simple fetch-based API calls to avoid axios version conflicts
const apiCall = async (endpoint: string, options: RequestInit = {}) => {
  try {
    const user = auth.currentUser;
    const token = user ? await user.getIdToken() : null;
    
    console.log(`🌐 API Call: ${endpoint}`, { hasToken: !!token });
    
    const response = await fetch(`${API_URL}${endpoint}`, {
      ...options,
      headers: {
        'Content-Type': 'application/json',
        ...(token && { Authorization: `Bearer ${token}` }),
        ...options.headers,
      },
    });

    if (!response.ok) {
      const errorText = await response.text();
      console.error(`❌ API Error ${response.status}:`, errorText);
      throw new Error(`HTTP error! status: ${response.status} - ${errorText}`);
    }

    return response.json();
  } catch (error) {
    console.error('❌ API call failed:', error);
    throw error;
  }
};

export const authService = {
  async signIn(email: string, password: string) {
    try {
      console.log('🔐 Attempting sign in with email:', email);
      const userCredential = await signInWithEmailAndPassword(auth, email, password);
      console.log('✅ Firebase sign in successful');
      
      await this.syncUserToBackend(userCredential.user);
      return userCredential;
    } catch (error) {
      const errorMessage = getFirebaseErrorMessage(error as AuthError);
      console.error('❌ Sign in failed:', errorMessage);
      throw new Error(errorMessage);
    }
  },

  async signUp(email: string, password: string, displayName: string) {
    try {
      console.log('📝 Attempting sign up with email:', email);
      const userCredential = await createUserWithEmailAndPassword(auth, email, password);
      console.log('✅ Firebase sign up successful');
      
      await updateProfile(userCredential.user, { displayName });
      console.log('✅ Profile updated with display name');
      
      await this.syncUserToBackend(userCredential.user);
      return userCredential;
    } catch (error) {
      const errorMessage = getFirebaseErrorMessage(error as AuthError);
      console.error('❌ Sign up failed:', errorMessage);
      throw new Error(errorMessage);
    }
  },

  async signInWithGoogle() {
    try {
      console.log('🔍 Attempting Google sign in');
      const userCredential = await signInWithPopup(auth, googleProvider);
      console.log('✅ Google sign in successful');
      
      await this.syncUserToBackend(userCredential.user);
      return userCredential;
    } catch (error) {
      const errorMessage = getFirebaseErrorMessage(error as AuthError);
      console.error('❌ Google sign in failed:', errorMessage);
      throw new Error(errorMessage);
    }
  },

  async signOut() {
    try {
      await firebaseSignOut(auth);
      console.log('✅ Sign out successful');
    } catch (error) {
      console.error('❌ Sign out failed:', error);
      throw error;
    }
  },

  async syncUserToBackend(user: User) {
    try {
      console.log('🔄 Syncing user to backend:', user.uid);
      await apiCall('/auth/sync', {
        method: 'POST',
        body: JSON.stringify({
          uid: user.uid,
          email: user.email,
          displayName: user.displayName,
          photoURL: user.photoURL,
        }),
      });
      console.log('✅ User synced to backend successfully');
    } catch (error) {
      console.error('⚠️ Failed to sync user to backend:', error);
      // Don't throw here - auth can work without backend sync
    }
  },

  async getUserRole(uid: string): Promise<'admin' | 'user'> {
    try {
      console.log('👤 Fetching user role for UID:', uid);
      
      // First try to get role by UID
      try {
        const response = await apiCall(`/auth/role/${uid}`) as UserRoleResponse;
        console.log('✅ User role fetched by UID:', response.role);
        return response.role;
      } catch (uidError) {
        console.log('⚠️ UID lookup failed, trying email lookup...');
        
        // If UID lookup fails, try to get role by email
        const currentUser = auth.currentUser;
        if (currentUser?.email) {
          console.log('📧 Trying email lookup for:', currentUser.email);
          const emailResponse = await apiCall(`/auth/role-by-email/${encodeURIComponent(currentUser.email)}`) as UserRoleResponse;
          console.log('✅ User role fetched by email:', emailResponse.role);
          return emailResponse.role;
        }
        
        throw uidError;
      }
    } catch (error) {
      console.error('⚠️ Failed to fetch user role, defaulting to user:', error);
      return 'user';
    }
  },
};