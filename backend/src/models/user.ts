import mongoose, { Document, Schema } from 'mongoose';

export interface IUser extends Document {
  uid: string;
  email: string;
  displayName: string;
  role: 'admin' | 'user';
  photoURL?: string;
  createdAt: Date;
  updatedAt: Date;
}

const UserSchema: Schema = new Schema({
  uid: {
    type: String,
    required: true,
    unique: true,
  },
  email: {
    type: String,
    required: true,
    unique: true,
    lowercase: true,
  },
  displayName: {
    type: String,
    required: true,
  },
  role: {
    type: String,
    enum: ['admin', 'user'],
    default: 'user',
  },
  photoURL: {
    type: String,
    default: null,
  },
}, {
  timestamps: true,
});


UserSchema.index({ role: 1 }); 
export default mongoose.model<IUser>('User', UserSchema);