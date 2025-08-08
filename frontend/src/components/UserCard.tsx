import { User, Shield, Mail } from 'lucide-react';
import { type User as UserType } from '../types';

interface UserCardProps {
  user: UserType;
  onRoleChange: (uid: string, role: 'admin' | 'user') => void;
  onDelete: (uid: string) => void;
}

const UserCard = ({ user, onRoleChange, onDelete }: UserCardProps) => {
  return (
    <div className="bg-white rounded-lg shadow-sm border border-gray-200 p-6">
      <div className="flex items-start justify-between mb-4">
        <div className="flex items-center space-x-3">
          <div className="bg-gray-100 rounded-full p-2">
            <User className="h-6 w-6 text-gray-600" />
          </div>
          <div>
            <h3 className="text-lg font-semibold text-gray-900">
              {user.displayName}
            </h3>
            <div className="flex items-center space-x-1 text-sm text-gray-500">
              <Mail className="h-4 w-4" />
              <span>{user.email}</span>
            </div>
          </div>
        </div>
        <span className={`px-2 py-1 text-xs font-medium rounded-full flex items-center space-x-1 ${
          user.role === 'admin' 
            ? 'bg-purple-100 text-purple-800' 
            : 'bg-gray-100 text-gray-800'
        }`}>
          <Shield className="h-3 w-3" />
          <span className="capitalize">{user.role}</span>
        </span>
      </div>

      <div className="text-sm text-gray-500 mb-4">
        <p>Joined: {new Date(user.createdAt).toLocaleDateString()}</p>
      </div>

      <div className="flex items-center justify-between">
        <select
          value={user.role}
          onChange={(e) => onRoleChange(user.uid, e.target.value as 'admin' | 'user')}
          className="px-3 py-2 border border-gray-300 rounded-md text-sm focus:ring-primary-500 focus:border-primary-500"
        >
          <option value="user">User</option>
          <option value="admin">Admin</option>
        </select>

        <button
          onClick={() => onDelete(user.uid)}
          className="px-3 py-2 text-sm text-red-600 border border-red-300 rounded-md hover:bg-red-50 transition-colors"
        >
          Delete User
        </button>
      </div>
    </div>
  );
};

export default UserCard;