import React, { useState } from 'react';
import { Navigate } from 'react-router-dom';
import { User } from '../../types/user';
import { UserList } from '../../components/settings/users/UserList';
import { UserForm } from '../../components/settings/users/UserForm';
import { useUsers } from '../../hooks/useUsers';
import { useAuth } from '../../hooks/useAuth';

export function UserManagement() {
  const { isAdmin } = useAuth();
  const { users, updateUser, deleteUser, isLoading, error } = useUsers();
  const [editingUser, setEditingUser] = useState<User | null>(null);

  // Redirect non-admin users
  if (!isAdmin) {
    return <Navigate to="/settings/areas" replace />;
  }

  const handleUpdate = async (data: Partial<User>) => {
    if (!editingUser) return;
    try {
      await updateUser(editingUser.id, data);
      setEditingUser(null);
    } catch (err) {
      console.error('Error updating user:', err);
    }
  };

  const handleDelete = async (user: User) => {
    if (!confirm(`Are you sure you want to delete ${user.name}?`)) return;
    try {
      await deleteUser(user.id);
    } catch (err) {
      console.error('Error deleting user:', err);
      alert(err instanceof Error ? err.message : 'Error deleting user');
    }
  };

  if (error) {
    return (
      <div className="bg-white shadow rounded-lg p-6">
        <div className="text-red-600">{error}</div>
      </div>
    );
  }

  return (
    <div className="bg-white shadow rounded-lg p-6">
      <div className="mb-6">
        <h2 className="text-lg font-medium text-gray-900">User Management</h2>
        <p className="mt-1 text-sm text-gray-500">
          Manage user accounts and permissions.
        </p>
      </div>

      {editingUser ? (
        <UserForm
          user={editingUser}
          onSubmit={handleUpdate}
          onCancel={() => setEditingUser(null)}
          isLoading={isLoading}
        />
      ) : (
        <UserList
          users={users}
          onEdit={setEditingUser}
          onDelete={handleDelete}
        />
      )}
    </div>
  );
}