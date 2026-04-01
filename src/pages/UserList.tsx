import React from 'react';
import { UserCard } from '../components/users/UserCard';
import { LoadingSpinner } from '../components/common/LoadingSpinner';
import { useUsers } from '../hooks/useUsers';

export function UserList() {
  const { users, loading, error } = useUsers();

  if (loading) {
    return <LoadingSpinner />;
  }

  if (error) {
    return (
      <div className="p-4 text-red-600">
        Error: {error}
      </div>
    );
  }

  return (
    <div className="p-4">
      <h2 className="text-xl font-semibold mb-4">Users</h2>
      <div className="space-y-2">
        {users.map((user) => (
          <UserCard key={user.id} user={user} />
        ))}
      </div>
    </div>
  );
}