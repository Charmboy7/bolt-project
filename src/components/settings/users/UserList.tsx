import React from 'react';
import { User } from '../../../types/user';
import { UserListItem } from './UserListItem';

interface UserListProps {
  users: User[];
  onEdit: (user: User) => void;
  onDelete: (user: User) => void;
}

export function UserList({ users, onEdit, onDelete }: UserListProps) {
  return (
    <div className="overflow-hidden shadow ring-1 ring-black ring-opacity-5 rounded-lg">
      <table className="min-w-full divide-y divide-gray-300">
        <thead className="bg-gray-50">
          <tr>
            <th className="py-3.5 pl-4 pr-3 text-left text-sm font-semibold text-gray-900">Name</th>
            <th className="px-3 py-3.5 text-left text-sm font-semibold text-gray-900">Email</th>
            <th className="px-3 py-3.5 text-left text-sm font-semibold text-gray-900">Role</th>
            <th className="px-3 py-3.5 text-left text-sm font-semibold text-gray-900">Last Sign In</th>
            <th className="relative py-3.5 pl-3 pr-4">
              <span className="sr-only">Actions</span>
            </th>
          </tr>
        </thead>
        <tbody className="divide-y divide-gray-200 bg-white">
          {users.map((user) => (
            <UserListItem
              key={user.id}
              user={user}
              onEdit={() => onEdit(user)}
              onDelete={() => onDelete(user)}
            />
          ))}
        </tbody>
      </table>
    </div>
  );
}