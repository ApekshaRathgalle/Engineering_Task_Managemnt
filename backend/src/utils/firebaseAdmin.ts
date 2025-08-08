import admin from 'firebase-admin';
import dotenv from 'dotenv';

// Load environment variables first
dotenv.config();

// Validate required environment variables
if (!process.env.FIREBASE_PROJECT_ID || !process.env.FIREBASE_CLIENT_EMAIL || !process.env.FIREBASE_PRIVATE_KEY) {
  throw new Error('Missing required Firebase environment variables');
}

// Initialize Firebase Admin SDK
const serviceAccount = {
  project_id: process.env.FIREBASE_PROJECT_ID,
  client_email: process.env.FIREBASE_CLIENT_EMAIL,
  private_key: process.env.FIREBASE_PRIVATE_KEY.replace(/\\n/g, '\n'),
};

if (!admin.apps.length) {
  admin.initializeApp({
    credential: admin.credential.cert(serviceAccount as admin.ServiceAccount),
    projectId: process.env.FIREBASE_PROJECT_ID,
  });
}

export const verifyFirebaseToken = async (idToken: string) => {
  try {
    const decodedToken = await admin.auth().verifyIdToken(idToken);
    return decodedToken;
  } catch (error) {
    throw new Error('Invalid Firebase token');
  }
};

export const setUserRole = async (uid: string, role: 'admin' | 'user') => {
  try {
    await admin.auth().setCustomUserClaims(uid, { role });
    return true;
  } catch (error) {
    console.error('Error setting user role:', error);
    throw new Error('Failed to set user role');
  }
};

export const getUserRole = async (uid: string): Promise<'admin' | 'user'> => {
  try {
    const user = await admin.auth().getUser(uid);
    return user.customClaims?.role || 'user';
  } catch (error) {
    console.error('Error getting user role:', error);
    return 'user';
  }
};

export default admin;