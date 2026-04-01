import { useState, useEffect } from 'react';
import { User } from '../types/user';
import { getUsers } from '../lib/users';

export function useUsers() {
  const [users, setUsers] = useState<User[]>([]);
  const [loading, setLoading] = useState(true);
  const [error, setError] = useState<string | null>(null);

  useEffect(() => {
    async function loadUsers() {
      try {
        const data = await getUsers();
        setUsers(data);
        setError(null);
      } catch (err) {
        setError(err instanceof Error ? err.message : 'Error loading users');
      } finally {
        setLoading(false);
      }
    }
    loadUsers();
  }, []);

  return { users, loading, error };
}