import mongoose from 'mongoose';
import dotenv from 'dotenv';
import { connectDB } from '../config/db';
import User from '../models/user';

// Load environment variables
dotenv.config();

async function createAdminUser() {
  try {
    // Connect to MongoDB
    await connectDB();
    console.log('✅ Connected to MongoDB');

    // Check if admin already exists
    const existingAdmin = await User.findOne({ 
      $or: [
        { email: 'thilini@gmail.com' },
        { uid: 'admin-thilini-2024' }
      ]
    });
    
    if (existingAdmin) {
      console.log('❌ Admin user already exists!');
      console.log('📧 Email:', existingAdmin.email);
      console.log('🛡️ Role:', existingAdmin.role);
      console.log('🆔 UID:', existingAdmin.uid);
      console.log('');
      console.log('💡 Admin Credentials for Login:');
      console.log('📧 Email: thilini@gmail.com');
      console.log('🔑 Password: thilini2003');
      process.exit(0);
    }

    // Create admin user
    const adminUser = await User.create({
      uid: 'admin-thilini-2024',
      email: 'thilini@gmail.com',
      displayName: 'Thilini Admin',
      photoURL: null,
      role: 'admin',
    });

    console.log('🎉 Admin user created successfully!');
    console.log('📧 Email: thilini@gmail.com');
    console.log('🔑 Password: thilini2003');
    console.log('👤 Name: Thilini Admin');
    console.log('🛡️ Role: admin');
    console.log('🆔 UID:', adminUser.uid);
    console.log('');
    console.log('📝 To use this admin account:');
    console.log('1. Go to your app: http://localhost:3000/register');
    console.log('2. Register with:');
    console.log('   📧 Email: thilini@gmail.com');
    console.log('   🔑 Password: thilini2003');
    console.log('   👤 Name: Thilini Admin');
    console.log('3. The system will automatically assign admin role');
    console.log('');
    console.log('OR manually add to Firebase Console:');
    console.log('1. Go to Firebase Console: https://console.firebase.google.com');
    console.log('2. Go to Authentication > Users');
    console.log('3. Add user manually with email: thilini@gmail.com');
    console.log('4. Use password: thilini2003');

  } catch (error) {
    console.error('❌ Error creating admin user:', error);
  } finally {
    await mongoose.connection.close();
    console.log('📴 Database connection closed');
    process.exit(0);
  }
}

// Run the script
createAdminUser();