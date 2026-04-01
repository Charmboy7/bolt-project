import React from 'react';
import { Pencil, Trash2 } from 'lucide-react';
import { User } from '../../../types/user';

interface UserListItemProps {
  user: User;
  onEdit: () => void;
  onDelete: () => void;
}

export function UserListItem({ user, onEdit, onDelete }: UserListItemProps) {
  return (
    <tr>
      <td className="whitespace-nowrap py-4 pl-4 pr-3 text-sm font-medium text-gray-900">
        {user.name}
      </td>
      <td className="whitespace-nowrap px-3 py-4 text-sm text-gray-500">{user.email}</td>
      <td className="whitespace-nowrap px-3 py-4 text-sm text-gray-500">
        <span className={`inline-flex rounded-full px-2 text-xs font-semibold leading-5 ${
          user.role === 'admin' 
            ? 'bg-purple-100 text-purple-800' 
            : 'bg-green-100 text-green-800'
        }`}>
          {user.role}
        </span>
      </td>
      <td className="whitespace-nowrap px-3 py-4 text-sm text-gray-500">
        {user.last_sign_in 
          ? new Date(user.last_sign_in).toLocaleDateString()
          : 'Never'
        }
      </td>
      <td className="relative whitespace-nowrap py-4 pl-3 pr-4 text-right text-sm font-medium">
        <div className="flex justify-end space-x-2">
          <button
            onClick={onEdit}
            className="text-gray-400 hover:text-gray-600"
            title="Edit User"
          >
            <Pencil size={16} />
          </button>
          <button
            onClick={onDelete}
            className="text-gray-400 hover:text-red-600"
            title="Delete User"
          >
            <Trash2 size={16} />
          </button>
        </div>
      </td>
    </tr>
  );
}