import React from 'react';
import { User } from '../../types/user';

interface UserCardProps {
  user: User;
}

export function UserCard({ user }: UserCardProps) {
  return (
    <div className="p-4 bg-white rounded-lg shadow">
      <div className="font-medium">{user.name}</div>
      <div className="text-sm text-gray-500">
        Created: {new Date(user.created_at).toLocaleDateString()}
      </div>
    </div>
  );
}